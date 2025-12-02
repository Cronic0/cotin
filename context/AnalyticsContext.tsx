import { trackEvent } from '@/lib/supabase-helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ProductAnalytics {
    viewCount: number;
    totalTimeSpent: number; // in seconds
}

interface AnalyticsData {
    sessionCount: number;
    webAccessCount: number; // sessions from web/desktop
    productAnalytics: Record<string, ProductAnalytics>;
    favoriteAdditions: Record<string, number>; // productId -> count
    monthlyViews: Record<string, number>; // 'YYYY-MM' -> count
    languageUsage: Record<string, number>; // 'es' | 'en' | 'fr' | 'de' -> count
    lastSessionTime: number;
}

interface AnalyticsContextType {
    data: AnalyticsData;
    trackSessionStart: () => void;
    trackProductView: (productId: string) => void;
    trackTimeSpent: (productId: string, duration: number) => void;
    trackFavoriteAdded: (productId: string) => void;
    trackLanguage: (lang: string) => void;
    resetAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const STORAGE_KEY = '@analytics_data';

const initialData: AnalyticsData = {
    sessionCount: 0,
    webAccessCount: 0,
    productAnalytics: {},
    favoriteAdditions: {},
    monthlyViews: {},
    languageUsage: {},
    lastSessionTime: Date.now(),
};

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AnalyticsData>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from storage on mount
    useEffect(() => {
        loadData();
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        if (isLoaded) {
            saveData();
        }
    }, [data, isLoaded]);

    const loadData = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const loadedData = JSON.parse(stored);
                // Merge with initialData to ensure all properties exist
                setData({
                    ...initialData,
                    ...loadedData,
                    favoriteAdditions: loadedData.favoriteAdditions || {},
                    monthlyViews: loadedData.monthlyViews || {},
                    webAccessCount: loadedData.webAccessCount || 0,
                    languageUsage: loadedData.languageUsage || {},
                });
            }
        } catch (error) {
            console.error('Failed to load analytics data:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save analytics data:', error);
        }
    };

    const trackSessionStart = () => {
        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
        const currentDay = now.toISOString().slice(0, 10);  // 'YYYY-MM-DD'
        // Detect if web/desktop by checking window.innerWidth
        const isWeb = typeof window !== 'undefined' && window.innerWidth > 768;

        // Track in Supabase
        trackEvent('session_start', undefined, {
            date: currentDay,
            isWeb,
            timestamp: now.toISOString()
        }).catch(console.error);

        // Keep local tracking for backward compatibility
        setData(prev => ({
            ...prev,
            sessionCount: prev.sessionCount + 1,
            webAccessCount: isWeb ? prev.webAccessCount + 1 : prev.webAccessCount,
            monthlyViews: {
                ...prev.monthlyViews,
                [currentMonth]: (prev.monthlyViews[currentMonth] || 0) + 1,
                [currentDay]: (prev.monthlyViews[currentDay] || 0) + 1, // Track daily too
            },
            lastSessionTime: Date.now(),
        }));
    };

    const trackProductView = (productId: string) => {
        // Track in Supabase
        trackEvent('product_view', productId).catch(console.error);

        setData(prev => {
            const productStats = prev.productAnalytics[productId] || { viewCount: 0, totalTimeSpent: 0 };
            return {
                ...prev,
                productAnalytics: {
                    ...prev.productAnalytics,
                    [productId]: {
                        ...productStats,
                        viewCount: productStats.viewCount + 1,
                    },
                },
            };
        });
    };

    const trackTimeSpent = (productId: string, duration: number) => {
        // Optional: Track time spent in Supabase if needed, but maybe too many requests
        // For now, we'll just keep it local or send it on unmount

        setData(prev => {
            const productStats = prev.productAnalytics[productId] || { viewCount: 0, totalTimeSpent: 0 };
            return {
                ...prev,
                productAnalytics: {
                    ...prev.productAnalytics,
                    [productId]: {
                        ...productStats,
                        totalTimeSpent: productStats.totalTimeSpent + duration,
                    },
                },
            };
        });
    };

    const trackFavoriteAdded = (productId: string) => {
        // Track in Supabase
        trackEvent('add_to_favorites', productId).catch(console.error);

        setData(prev => ({
            ...prev,
            favoriteAdditions: {
                ...prev.favoriteAdditions,
                [productId]: (prev.favoriteAdditions[productId] || 0) + 1,
            },
        }));
    };

    const trackLanguage = (lang: string) => {
        // Track in Supabase
        trackEvent('language_change', undefined, { language: lang }).catch(console.error);

        setData(prev => ({
            ...prev,
            languageUsage: {
                ...prev.languageUsage,
                [lang]: (prev.languageUsage[lang] || 0) + 1,
            },
        }));
    };

    const resetAnalytics = async () => {
        setData(initialData);
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to reset analytics:', error);
        }
    };

    return (
        <AnalyticsContext.Provider
            value={{
                data,
                trackSessionStart,
                trackProductView,
                trackTimeSpent,
                trackFavoriteAdded,
                trackLanguage,
                resetAnalytics,
            }}
        >
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within AnalyticsProvider');
    }
    return context;
}

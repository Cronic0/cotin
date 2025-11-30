import { MENU_ITEMS } from '@/data/menuData';
import { translateToAllLanguages } from '@/utils/translation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string; // base64 string
    category: string;
    allergens: string[];
    pairing?: string;
    pairingDescription?: string;
    available?: boolean;
    isNew?: boolean;
    isRecommendation?: boolean;
    isOffMenu?: boolean;
    isBanner?: boolean;
    isOffer?: boolean;
    offerText?: string;
    // Translations
    translations?: {
        en?: { title: string; description: string };
        fr?: { title: string; description: string };
        de?: { title: string; description: string };
    };
}

export interface Subscriber {
    email: string;
    date: string;
}

export interface BannerConfig {
    title: string;
    subtitle: string;
    imageUrl: string;
    linkPath: string;
}

export interface DaySchedule {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}

export interface Schedule {
    [key: string]: DaySchedule;
}

export interface EventConfig {
    title: string;
    subtitle: string;
    date: string;
    imageUrl: string;
    linkPath?: string;
}

interface AdminContextType {
    isAuthenticated: boolean;
    products: Product[];
    subscribers: Subscriber[];
    bannerConfig: BannerConfig;
    schedule: Schedule;
    isLoading: boolean;
    showRecommendations: boolean;
    showOffMenu: boolean;
    showTunaWeek: boolean;
    showBannerCarousel: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    resetProducts: () => Promise<void>;
    addSubscriber: (email: string) => Promise<void>;
    toggleRecommendations: () => Promise<void>;
    toggleOffMenu: () => Promise<void>;
    toggleTunaWeek: () => Promise<void>;
    toggleBannerCarousel: () => Promise<void>;
    updateBannerConfig: (config: BannerConfig) => Promise<void>;
    updateSchedule: (schedule: Schedule) => Promise<void>;
    eventConfig: EventConfig;
    showEvent: boolean;
    toggleEvent: () => Promise<void>;
    updateEventConfig: (config: EventConfig) => Promise<void>;
    // Dynamic Ordering
    sectionOrder: string[];
    moveSection: (id: string, direction: 'up' | 'down') => Promise<void>;
    reorderSections: (newOrder: string[]) => Promise<void>;
    showAllergens: boolean;
    toggleAllergens: () => Promise<void>;
    translateAllProducts: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = '@admin_auth';
const STORAGE_KEY_PRODUCTS = '@products';
const STORAGE_KEY_SUBSCRIBERS = '@subscribers';
const STORAGE_KEY_SETTINGS = '@section_settings';
const STORAGE_KEY_BANNER = '@banner_config';
const STORAGE_KEY_EVENT = '@event_config';
const STORAGE_KEY_SCHEDULE = '@schedule';
const STORAGE_KEY_ORDER = '@section_order';

export const DEFAULT_SECTION_ORDER = [
    'banner',       // Tuna Week / Banner
    'event',        // Special Event
    'allergens',    // Allergen Filter
    'recommendations', // Chef Recommendations
    'offmenu',      // Off Menu
];
const ADMIN_PASSWORD = '1234'; // Simple password for demo

const DEFAULT_SCHEDULE: Schedule = {
    monday: { day: 'monday', isOpen: false, openTime: '13:00', closeTime: '23:30' },
    tuesday: { day: 'tuesday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
    wednesday: { day: 'wednesday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
    thursday: { day: 'thursday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
    friday: { day: 'friday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
    saturday: { day: 'saturday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
    sunday: { day: 'sunday', isOpen: true, openTime: '13:00', closeTime: '23:30' },
};

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showRecommendations, setShowRecommendations] = useState(true);
    const [showOffMenu, setShowOffMenu] = useState(true);
    const [showTunaWeek, setShowTunaWeek] = useState(true);
    const [showBannerCarousel, setShowBannerCarousel] = useState(true);
    const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
        title: 'Semana del Atún',
        subtitle: 'Descubre nuestros platos especiales',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&q=80',
        linkPath: '/semana-del-atun',
    });
    const [showEvent, setShowEvent] = useState(false);
    const [eventConfig, setEventConfig] = useState<EventConfig>({
        title: 'Concierto Kase.O',
        subtitle: 'Música en vivo',
        date: 'Mañana a las 22:00',
        imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1000&q=80',
    });
    const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE);
    const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_ORDER);
    const [showAllergens, setShowAllergens] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log('=== Loading data from AsyncStorage ===');

            // Load auth
            const authState = await AsyncStorage.getItem(STORAGE_KEY_AUTH);
            if (authState === 'true') {
                setIsAuthenticated(true);
            }

            // Load products
            const productsJson = await AsyncStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (productsJson) {
                const loadedProducts = JSON.parse(productsJson);
                console.log('=== Loaded products from storage:', loadedProducts.length);
                setProducts(loadedProducts);
            } else {
                // Initialize with default data
                console.log('=== No products found, initializing with MENU_ITEMS ===');
                const uniqueItems = Array.from(new Map(MENU_ITEMS.map(item => [item.id, item])).values());
                setProducts(uniqueItems);
                await AsyncStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(uniqueItems));
            }

            // Load subscribers
            const subscribersJson = await AsyncStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
            if (subscribersJson) {
                const loadedSubscribers = JSON.parse(subscribersJson);
                setSubscribers(loadedSubscribers);
            }

            // Load settings
            const settingsJson = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
            if (settingsJson) {
                const settings = JSON.parse(settingsJson);
                setShowRecommendations(settings.showRecommendations ?? true);
                setShowOffMenu(settings.showOffMenu ?? true);
                setShowTunaWeek(settings.showTunaWeek ?? true);
                setShowBannerCarousel(settings.showBannerCarousel ?? true);
                setShowEvent(settings.showEvent ?? false);
                setShowAllergens(settings.showAllergens ?? true);
            }

            // Load section order
            const orderJson = await AsyncStorage.getItem(STORAGE_KEY_ORDER);
            if (orderJson) {
                const loadedOrder = JSON.parse(orderJson);
                // Ensure all default sections are present (migration safety)
                const mergedOrder = [...new Set([...loadedOrder, ...DEFAULT_SECTION_ORDER])];
                setSectionOrder(mergedOrder);
            }

            // Load event config
            const eventJson = await AsyncStorage.getItem(STORAGE_KEY_EVENT);
            if (eventJson) {
                const loadedEvent = JSON.parse(eventJson);
                setEventConfig(loadedEvent);
            }

            // Load banner config
            const bannerJson = await AsyncStorage.getItem(STORAGE_KEY_BANNER);
            if (bannerJson) {
                const loadedBanner = JSON.parse(bannerJson);
                setBannerConfig(loadedBanner);
            }

            // Load schedule
            const scheduleJson = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
            if (scheduleJson) {
                const loadedSchedule = JSON.parse(scheduleJson);
                setSchedule(loadedSchedule);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setIsLoading(false);
        }
    };

    const saveProducts = async (newProducts: Product[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(newProducts));
            setProducts(newProducts);
        } catch (error) {
            console.error('Error saving products:', error);
            throw error;
        }
    };

    const saveSubscribers = async (newSubscribers: Subscriber[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(newSubscribers));
            setSubscribers(newSubscribers);
        } catch (error) {
            console.error('Error saving subscribers:', error);
            throw error;
        }
    };

    const login = (password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            AsyncStorage.setItem(STORAGE_KEY_AUTH, 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        AsyncStorage.removeItem(STORAGE_KEY_AUTH);
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            console.log('=== updateProduct called ===', id, updates);
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                throw new Error('Product not found');
            }

            const updatedProducts = [...products];
            updatedProducts[productIndex] = { ...updatedProducts[productIndex], ...updates };

            await saveProducts(updatedProducts);
            console.log('=== Product updated successfully ===');
        } catch (error) {
            console.error("Error updating product: ", error);
            throw error;
        }
    };

    const createProduct = async (product: Omit<Product, 'id'>) => {
        try {
            console.log('=== createProduct called ===', product);
            const newId = `custom_${Date.now()}`;
            const newProduct: Product = {
                ...product,
                id: newId,
            };

            const updatedProducts = [...products, newProduct];
            await saveProducts(updatedProducts);
            console.log('=== Product created successfully ===');
        } catch (error) {
            console.error("Error creating product: ", error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            console.log('=== deleteProduct called ===', id);
            const updatedProducts = products.filter(p => p.id !== id);
            await saveProducts(updatedProducts);
            console.log('=== Product deleted successfully ===');
        } catch (error) {
            console.error("Error deleting product: ", error);
            throw error;
        }
    };

    const resetProducts = async () => {
        try {
            console.log('=== resetProducts called ===');
            const uniqueItems = Array.from(new Map(MENU_ITEMS.map(item => [item.id, item])).values());
            await saveProducts(uniqueItems);
            console.log('=== Products reset successfully ===');
        } catch (error) {
            console.error("Error resetting products: ", error);
            throw error;
        }
    };

    const addSubscriber = async (email: string) => {
        try {
            // Check if already exists
            if (subscribers.some(s => s.email === email)) return;

            const newSubscriber: Subscriber = {
                email,
                date: new Date().toISOString()
            };

            const updatedSubscribers = [newSubscriber, ...subscribers];
            await saveSubscribers(updatedSubscribers);
        } catch (error) {
            console.error("Error adding subscriber: ", error);
            throw error;
        }
    };

    const toggleRecommendations = async () => {
        try {
            const newValue = !showRecommendations;
            setShowRecommendations(newValue);
            const settings = { showRecommendations: newValue, showOffMenu, showTunaWeek, showBannerCarousel, showEvent, showAllergens };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling recommendations: ", error);
            throw error;
        }
    };

    const toggleOffMenu = async () => {
        try {
            const newValue = !showOffMenu;
            setShowOffMenu(newValue);
            const settings = { showRecommendations, showOffMenu: newValue, showTunaWeek, showBannerCarousel, showEvent, showAllergens };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling off menu: ", error);
            throw error;
        }
    };

    const toggleTunaWeek = async () => {
        try {
            const newValue = !showTunaWeek;
            setShowTunaWeek(newValue);
            const settings = { showRecommendations, showOffMenu, showTunaWeek: newValue, showBannerCarousel, showEvent, showAllergens };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling tuna week: ", error);
            throw error;
        }
    };

    const toggleBannerCarousel = async () => {
        try {
            const newValue = !showBannerCarousel;
            setShowBannerCarousel(newValue);
            const settings = { showRecommendations, showOffMenu, showTunaWeek, showBannerCarousel: newValue, showEvent, showAllergens };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling banner carousel: ", error);
            throw error;
        }
    };

    const updateBannerConfig = async (config: BannerConfig) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_BANNER, JSON.stringify(config));
            setBannerConfig(config);
        } catch (error) {
            console.error("Error updating banner config: ", error);
            throw error;
        }
    };

    const updateSchedule = async (newSchedule: Schedule) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newSchedule));
            setSchedule(newSchedule);
        } catch (error) {
            console.error("Error updating schedule: ", error);
            throw error;
        }
    };

    const toggleEvent = async () => {
        try {
            const newValue = !showEvent;
            setShowEvent(newValue);
            const settings = { showRecommendations, showOffMenu, showTunaWeek, showBannerCarousel, showEvent: newValue, showAllergens };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling event: ", error);
            throw error;
        }
    };

    const updateEventConfig = async (config: EventConfig) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_EVENT, JSON.stringify(config));
            setEventConfig(config);
        } catch (error) {
            console.error("Error updating event config: ", error);
            throw error;
        }
    };

    const toggleAllergens = async () => {
        try {
            const newValue = !showAllergens;
            setShowAllergens(newValue);
            const settings = { showRecommendations, showOffMenu, showTunaWeek, showBannerCarousel, showEvent, showAllergens: newValue };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error("Error toggling allergens: ", error);
            throw error;
        }
    };

    const moveSection = async (id: string, direction: 'up' | 'down') => {
        try {
            const currentIndex = sectionOrder.indexOf(id);
            if (currentIndex === -1) return;

            const newOrder = [...sectionOrder];
            if (direction === 'up') {
                if (currentIndex === 0) return; // Already at top
                [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
            } else {
                if (currentIndex === newOrder.length - 1) return; // Already at bottom
                [newOrder[currentIndex + 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex + 1]];
            }

            setSectionOrder(newOrder);
            await AsyncStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(newOrder));
        } catch (error) {
            console.error("Error moving section: ", error);
            throw error;
        }
    };

    const reorderSections = async (newOrder: string[]) => {
        try {
            setSectionOrder(newOrder);
            await AsyncStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(newOrder));
        } catch (error) {
            console.error("Error reordering sections: ", error);
            throw error;
        }
    };

    const translateAllProducts = async () => {
        try {
            console.log('=== translateAllProducts called ===');
            const updatedProducts = [];
            let count = 0;

            for (const product of products) {
                count++;
                console.log(`Translating product ${count}/${products.length}: ${product.title}`);

                // Add delay to avoid rate limiting (500ms)
                if (count > 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const translations = await translateToAllLanguages({ title: product.title, description: product.description });
                updatedProducts.push({
                    ...product,
                    translations
                });
            }

            await saveProducts(updatedProducts);
            console.log('=== All products translated successfully ===');
        } catch (error) {
            console.error("Error translating all products: ", error);
            throw error;
        }
    };

    return (
        <AdminContext.Provider
            value={{
                isAuthenticated,
                products,
                subscribers,
                isLoading,
                showRecommendations,
                showOffMenu,
                showTunaWeek,
                showBannerCarousel,
                bannerConfig,
                schedule,
                login,
                logout,
                updateProduct,
                createProduct,
                deleteProduct,
                resetProducts,
                addSubscriber,
                toggleRecommendations,
                toggleOffMenu,
                toggleTunaWeek,
                toggleBannerCarousel,
                updateBannerConfig,
                updateSchedule,
                eventConfig,
                showEvent,
                toggleEvent,
                updateEventConfig,
                sectionOrder,
                moveSection,
                reorderSections,
                showAllergens,
                toggleAllergens,
                translateAllProducts,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
}

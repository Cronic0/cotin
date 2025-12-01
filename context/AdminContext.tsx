import { MENU_ITEMS } from '@/data/menuData';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import {
    DbSchedule,
    getSession,
    onAuthStateChange,
    signIn,
    signOut,
    addSubscriber as supabaseAddSubscriber,
    fetchSchedule as supabaseFetchSchedule,
    getSubscribers as supabaseGetSubscribers,
    saveSchedule as supabaseSaveSchedule
} from '@/lib/supabase-helpers';
import { translateToAllLanguages } from '@/utils/translation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
    // Use Supabase for products
    const {
        products: supabaseProducts,
        loading: productsLoading,
        createProduct: supabaseCreateProduct,
        updateProduct: supabaseUpdateProduct,
        deleteProduct: supabaseDeleteProduct,
    } = useSupabaseProducts();

    // Map Supabase products (snake_case) to App products (camelCase)
    const products: Product[] = supabaseProducts.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        allergens: p.allergens,
        pairing: p.pairing,
        pairingDescription: p.pairing_description,
        available: p.available,
        isNew: p.is_new,
        isRecommendation: p.is_recommendation,
        isOffMenu: p.is_off_menu,
        isBanner: p.is_banner,
        isOffer: p.is_offer,
        offerText: p.offer_text,
        translations: p.translations,
    }));

    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
            console.log('=== Loading data from Supabase & AsyncStorage ===');

            // Load auth
            const { session } = await getSession();
            if (session) {
                setIsAuthenticated(true);
            }

            // Listen for auth changes
            onAuthStateChange((session) => {
                setIsAuthenticated(!!session);
            });

            // Load subscribers from Supabase
            try {
                const subs = await supabaseGetSubscribers();
                // Map Supabase subscribers to Context subscribers if needed, or ensure types match
                const mappedSubs: Subscriber[] = subs.map(s => ({
                    email: s.email,
                    date: s.created_at || new Date().toISOString() // Fallback if date is missing
                }));
                setSubscribers(mappedSubs);
            } catch (error) {
                console.error('Error loading subscribers from Supabase:', error);
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
            // Load schedule from Supabase
            try {
                const dbSchedules = await supabaseFetchSchedule();
                if (dbSchedules && dbSchedules.length > 0) {
                    const newSchedule: Schedule = { ...DEFAULT_SCHEDULE };
                    dbSchedules.forEach(s => {
                        if (newSchedule[s.day]) {
                            newSchedule[s.day] = {
                                day: s.day,
                                isOpen: s.is_open,
                                openTime: s.open_time,
                                closeTime: s.close_time
                            };
                        }
                    });
                    setSchedule(newSchedule);
                    // Also update local storage as backup
                    await AsyncStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newSchedule));
                } else {
                    // Fallback to local storage if DB is empty
                    const scheduleJson = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
                    if (scheduleJson) {
                        const loadedSchedule = JSON.parse(scheduleJson);
                        setSchedule(loadedSchedule);
                    }
                }
            } catch (error) {
                console.error('Error loading schedule from Supabase:', error);
                // Fallback to local storage on error
                const scheduleJson = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
                if (scheduleJson) {
                    const loadedSchedule = JSON.parse(scheduleJson);
                    setSchedule(loadedSchedule);
                }
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await signIn(email, password);
            if (error) {
                console.error('Login error:', error);
                return { success: false, error: error.message };
            }
            return { success: !!data?.session };
        } catch (e: any) {
            console.error('Login exception:', e);
            return { success: false, error: e.message || 'An unexpected error occurred' };
        }
    };

    const logout = async () => {
        await signOut();
        setIsAuthenticated(false);
    };

    const createProduct = async (product: Omit<Product, 'id'>) => {
        try {
            console.log('=== createProduct called (Supabase) ===', product);
            // Map camelCase to snake_case for Supabase
            const supabaseProduct = {
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
                allergens: product.allergens,
                pairing: product.pairing,
                pairing_description: product.pairingDescription,
                available: product.available ?? true,
                is_new: product.isNew ?? false,
                is_recommendation: product.isRecommendation ?? false,
                is_off_menu: product.isOffMenu ?? false,
                is_banner: product.isBanner ?? false,
                is_offer: product.isOffer ?? false,
                offer_text: product.offerText,
                translations: product.translations,
            };

            await supabaseCreateProduct(supabaseProduct as any);
            console.log('=== Product created successfully in Supabase ===');
        } catch (error) {
            console.error("Error creating product in Supabase: ", error);
            throw error;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            console.log('=== updateProduct called (Supabase) ===', id, updates);
            // Map camelCase to snake_case for Supabase
            const supabaseUpdates: any = { ...updates };

            if (updates.isNew !== undefined) { supabaseUpdates.is_new = updates.isNew; delete supabaseUpdates.isNew; }
            if (updates.isRecommendation !== undefined) { supabaseUpdates.is_recommendation = updates.isRecommendation; delete supabaseUpdates.isRecommendation; }
            if (updates.isOffMenu !== undefined) { supabaseUpdates.is_off_menu = updates.isOffMenu; delete supabaseUpdates.isOffMenu; }
            if (updates.isBanner !== undefined) { supabaseUpdates.is_banner = updates.isBanner; delete supabaseUpdates.isBanner; }
            if (updates.isOffer !== undefined) { supabaseUpdates.is_offer = updates.isOffer; delete supabaseUpdates.isOffer; }
            if (updates.offerText !== undefined) { supabaseUpdates.offer_text = updates.offerText; delete supabaseUpdates.offerText; }
            if (updates.pairingDescription !== undefined) { supabaseUpdates.pairing_description = updates.pairingDescription; delete supabaseUpdates.pairingDescription; }

            await supabaseUpdateProduct(id, supabaseUpdates);
            console.log('=== Product updated successfully in Supabase ===');
        } catch (error) {
            console.error("Error updating product in Supabase: ", error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            console.log('=== deleteProduct called (Supabase) ===', id);
            await supabaseDeleteProduct(id);
            console.log('=== Product deleted successfully from Supabase ===');
        } catch (error) {
            console.error("Error deleting product from Supabase: ", error);
            throw error;
        }
    };

    const resetProducts = async () => {
        try {
            console.log('=== resetProducts called (Supabase) ===');
            // Delete all existing products first
            for (const product of products) {
                await supabaseDeleteProduct(product.id);
            }
            // Then create new ones from MENU_ITEMS
            const uniqueItems = Array.from(new Map(MENU_ITEMS.map(item => [item.id, item])).values());
            for (const item of uniqueItems) {
                // Map item to snake_case
                const supabaseItem = {
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    allergens: item.allergens,
                    pairing: item.pairing,
                    available: true,
                    is_new: false,
                    is_recommendation: false,
                    is_off_menu: false,
                    is_banner: false,
                    is_offer: false,
                    translations: item.translations,
                };
                await supabaseCreateProduct(supabaseItem as any);
            }
            console.log('=== Products reset successfully in Supabase ===');
        } catch (error) {
            console.error("Error resetting products in Supabase: ", error);
            throw error;
        }
    };

    const addSubscriber = async (email: string) => {
        try {
            // Check if already exists
            if (subscribers.some(s => s.email === email)) return;

            const newSubscriber = await supabaseAddSubscriber(email);
            setSubscribers([newSubscriber, ...subscribers]);
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
            // 1. Update local state immediately for UI responsiveness
            setSchedule(newSchedule);

            // 2. Save to AsyncStorage (backup/offline)
            await AsyncStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newSchedule));

            // 3. Save to Supabase
            const dbSchedules: DbSchedule[] = Object.values(newSchedule).map(day => ({
                day: day.day,
                is_open: day.isOpen,
                open_time: day.openTime,
                close_time: day.closeTime
            }));

            await supabaseSaveSchedule(dbSchedules);
            console.log('Schedule synced to Supabase');
        } catch (error) {
            console.error("Error updating schedule:", error);
            // Revert local state if needed, or show error toast
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
            console.log('=== translateAllProducts called (Supabase) ===');

            for (const product of products) {
                console.log(`Translating product: ${product.title}`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Delay to avoid rate limits

                const translations = await translateToAllLanguages({ title: product.title, description: product.description });

                // Update product in Supabase with translations
                await supabaseUpdateProduct(product.id, { translations });
            }

            console.log('=== All products translated successfully in Supabase ===');
        } catch (error) {
            console.error("Error translating all products in Supabase: ", error);
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

import { AnalyticsEvent, Product, Subscriber, supabase } from './supabase';

// =====================================================
// PRODUCTS
// =====================================================

/**
 * Get all products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data;
}

/**
 * Create a new product
 */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw error;
    }

    return data;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    console.log('=== updateProduct in supabase-helpers ===');
    console.log('ID:', id);
    console.log('Updates:', updates);

    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    console.log('Update result - data:', data);
    console.log('Update result - error:', error);

    if (error) {
        console.error('Error updating product:', error);
        throw error;
    }

    return data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

/**
 * Subscribe to realtime product changes
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
    // Initial fetch
    getProducts().then(callback);

    // Subscribe to changes
    const subscription = supabase
        .channel('products_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            async () => {
                // Refetch all products when any change occurs
                const products = await getProducts();
                callback(products);
            }
        )
        .subscribe();

    // Return unsubscribe function
    return () => {
        subscription.unsubscribe();
    };
}

// =====================================================
// SUBSCRIBERS
// =====================================================

/**
 * Get all subscribers (admin only)
 */
export async function getSubscribers(): Promise<Subscriber[]> {
    const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching subscribers:', error);
        throw error;
    }

    return data || [];
}

/**
 * Add a new subscriber
 */
export async function addSubscriber(email: string): Promise<Subscriber> {
    const { data, error } = await supabase
        .from('subscribers')
        .insert({ email })
        .select()
        .single();

    if (error) {
        console.error('Error adding subscriber:', error);
        throw error;
    }

    return data;
}

/**
 * Delete a subscriber
 */
export async function deleteSubscriber(id: string): Promise<void> {
    const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting subscriber:', error);
        throw error;
    }
}

// =====================================================
// ANALYTICS
// =====================================================

/**
 * Track an analytics event
 */
export async function trackEvent(
    eventType: string,
    productId?: string,
    metadata?: Record<string, any>
): Promise<void> {
    const { error } = await supabase
        .from('analytics')
        .insert({
            event_type: eventType,
            product_id: productId,
            metadata: metadata || {},
        });

    if (error) {
        console.error('Error tracking event:', error);
        // Don't throw - analytics errors shouldn't break the app
    }
}

/**
 * Get analytics events (admin only)
 */
export async function getAnalyticsEvents(limit = 100): Promise<AnalyticsEvent[]> {
    const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get product view counts
 */
export async function getProductStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from('analytics')
        .select('product_id')
        .eq('event_type', 'product_view')
        .not('product_id', 'is', null);

    if (error) {
        console.error('Error fetching product stats:', error);
        return {};
    }

    // Count views per product
    const stats: Record<string, number> = {};
    data.forEach((event) => {
        if (event.product_id) {
            stats[event.product_id] = (stats[event.product_id] || 0) + 1;
        }
    });

    return stats;
}

/**
 * Get favorite counts from analytics
 */
export async function getFavoriteStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from('analytics')
        .select('product_id')
        .eq('event_type', 'add_to_favorites')
        .not('product_id', 'is', null);

    if (error) {
        console.error('Error fetching favorite stats:', error);
        return {};
    }

    // Count favorites per product
    const stats: Record<string, number> = {};
    data.forEach((event) => {
        if (event.product_id) {
            stats[event.product_id] = (stats[event.product_id] || 0) + 1;
        }
    });

    return stats;
}

/**
 * Get all analytics data for dashboard
 */
export async function getDashboardAnalytics() {
    try {
        const [productViews, favorites, dailyVisits, totalSessions] = await Promise.all([
            getProductStats(),
            getFavoriteStats(),
            getDailyVisits(30),
            getTotalSessions(),
        ]);

        return {
            productViews,
            favorites,
            dailyVisits,
            totalSessions,
        };
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        return {
            productViews: {},
            favorites: {},
            dailyVisits: {},
            totalSessions: 0,
        };
    }
}

/**
 * Get daily visit counts for the last N days
 */
export async function getDailyVisits(days: number = 30): Promise<Record<string, number>> {
    const { data, error } = await supabase
        .from('analytics')
        .select('created_at, metadata')
        .eq('event_type', 'session_start')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
        console.error('Error fetching daily visits:', error);
        return {};
    }

    // Group by date
    const visitsByDate: Record<string, number> = {};
    data.forEach((event) => {
        const date = new Date(event.created_at).toISOString().slice(0, 10);
        visitsByDate[date] = (visitsByDate[date] || 0) + 1;
    });

    return visitsByDate;
}

/**
 * Get total session count
 */
export async function getTotalSessions(): Promise<number> {
    const { count, error } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'session_start');

    if (error) {
        console.error('Error fetching session count:', error);
        return 0;
    }

    return count || 0;
}

// =====================================================
// SCHEDULE
// =====================================================

export interface DbSchedule {
    day: string;
    is_open: boolean;
    open_time: string;
    close_time: string;
}

/**
 * Fetch schedule from Supabase
 */
export async function fetchSchedule(): Promise<DbSchedule[]> {
    const { data, error } = await supabase
        .from('schedules')
        .select('*');

    if (error) {
        console.error('Error fetching schedule:', error);
        throw error;
    }

    return data || [];
}

/**
 * Save schedule to Supabase (upsert)
 */
export async function saveSchedule(schedules: DbSchedule[]): Promise<void> {
    const { error } = await supabase
        .from('schedules')
        .upsert(schedules, { onConflict: 'day' });

    if (error) {
        console.error('Error saving schedule:', error);
        throw error;
    }
}

// =====================================================
// SETTINGS
// =====================================================

/**
 * Get the singleton settings row ID
 */
async function getSettingsId(): Promise<number | string | null> {
    const { data, error } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .single();

    if (error || !data) return null;
    return data.id;
}

/**
 * Fetch a setting by key from Supabase
 * Adapts to the single-row structure with specific columns
 */
export async function fetchSetting(key: string): Promise<any | null> {
    // Map legacy keys to actual columns
    const columnMap: Record<string, string> = {
        'global_settings': 'general_settings',
        'event_config': 'event_config',
        'banner_config': 'banner_config',
        'section_order': 'general_settings' // Store inside general_settings
    };

    const columnName = columnMap[key] || key;

    const { data, error } = await supabase
        .from('settings')
        .select(columnName)
        .limit(1)
        .single();

    if (error) {
        console.error(`Error fetching setting ${key} (col: ${columnName}):`, error);
        return null;
    }

    if (!data) return null;

    // Handle nested keys in general_settings
    if (columnName === 'general_settings' && key === 'section_order') {
        return data.general_settings?.section_order || null;
    }

    return data[columnName as keyof typeof data] || null;
}

/**
 * Save a setting to Supabase
 * Adapts to the single-row structure with specific columns
 */
export async function saveSetting(key: string, value: any): Promise<void> {
    // Map legacy keys to actual columns
    const columnMap: Record<string, string> = {
        'global_settings': 'general_settings',
        'event_config': 'event_config',
        'banner_config': 'banner_config',
        'section_order': 'general_settings' // Store inside general_settings
    };

    const columnName = columnMap[key] || key;
    let updateData: any = {};

    // Get existing ID
    let id = await getSettingsId();

    // Special handling for nested data in general_settings
    if (columnName === 'general_settings' && key === 'section_order') {
        // We need to fetch existing general_settings first to merge
        const { data } = await supabase.from('settings').select('general_settings').limit(1).single();
        const currentSettings = data?.general_settings || {};
        updateData = {
            general_settings: {
                ...currentSettings,
                section_order: value
            },
            updated_at: new Date().toISOString()
        };
    } else {
        // Direct column update
        updateData = {
            [columnName]: value,
            updated_at: new Date().toISOString()
        };
    }

    let error;

    if (id) {
        // Update existing row
        const result = await supabase
            .from('settings')
            .update(updateData)
            .eq('id', id);
        error = result.error;
    } else {
        // Insert new row (should rarely happen if initialized)
        const result = await supabase
            .from('settings')
            .insert(updateData);
        error = result.error;
    }

    if (error) {
        console.error(`Error saving setting ${key}:`, error);
        throw error;
    }
}

// =====================================================
// AUTH HELPERS
// =====================================================

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

/**
 * Sign out current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Get current user session
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });

    // Return unsubscribe function
    return data.subscription.unsubscribe;
}

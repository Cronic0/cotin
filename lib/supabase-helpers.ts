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
        const [productViews, favorites] = await Promise.all([
            getProductStats(),
            getFavoriteStats(),
        ]);

        return {
            productViews,
            favorites,
        };
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        return {
            productViews: {},
            favorites: {},
        };
    }
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
 * Fetch a setting by key from Supabase
 */
export async function fetchSetting(key: string): Promise<any | null> {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned, setting doesn't exist yet
            return null;
        }
        console.error('Error fetching setting:', error);
        throw error;
    }

    return data?.value || null;
}

/**
 * Save a setting to Supabase (upsert)
 */
export async function saveSetting(key: string, value: any): Promise<void> {
    const { error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
        console.error('Error saving setting:', error);
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

import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://htmiqjncprqczgqwrdpb.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWlxam5jcHJxY3pncXdyZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTEwMzksImV4cCI6MjA4MDA4NzAzOX0.LXk0iFzSNbxO4mccUb1vTlimVnMRtklQDVtikWNhNjQ';

// Crear cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Types para TypeScript
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    allergens: string[];
    pairing?: string;
    available: boolean;
    is_new: boolean;
    is_recommendation: boolean;
    is_off_menu: boolean;
    is_banner: boolean;
    is_offer: boolean;
    translations?: {
        en?: { title: string; description: string };
        fr?: { title: string; description: string };
        de?: { title: string; description: string };
    };
    created_at: string;
    updated_at: string;
}

export interface Subscriber {
    id: string;
    email: string;
    created_at: string;
}

export interface AnalyticsEvent {
    id: string;
    event_type: string;
    product_id?: string;
    metadata: Record<string, any>;
    created_at: string;
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://htmiqjncprqczgqwrdpb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWlxam5jcHJxY3pncXdyZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTEwMzksImV4cCI6MjA4MDA4NzAzOX0.LXk0iFzSNbxO4mccUb1vTlimVnMRtklQDVtikWNhNjQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Product count:', data); // data is null for head: true, count is in count property but select returns object with count
            // Actually select count returns { count: number, data: [] } structure in response object
        }

        // Try a simple select to be sure
        const { data: products, error: prodError } = await supabase.from('products').select('*').limit(1);
        if (prodError) {
            console.error('Error fetching products:', prodError.message);
        } else {
            console.log('Successfully fetched products. Count:', products.length);
            if (products.length > 0) {
                console.log('First product:', products[0].title);
            }
        }

    } catch (e) {
        console.error('Exception:', e);
    }
}

testConnection();

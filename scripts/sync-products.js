const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    console.error('URL:', supabaseUrl ? 'Present' : 'MISSING');
    console.error('Key:', supabaseKey ? 'Present' : 'MISSING');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetProducts() {
    try {
        console.log('🔄 Starting product reset...\n');

        // 1. Get all existing products
        const { data: existingProducts, error: fetchError } = await supabase
            .from('products')
            .select('id');

        if (fetchError) {
            console.error('Error fetching products:', fetchError);
            throw fetchError;
        }

        console.log(`Found ${existingProducts?.length || 0} existing products in database`);

        // 2. Delete all existing products
        if (existingProducts && existingProducts.length > 0) {
            console.log('Deleting existing products...');
            for (const product of existingProducts) {
                const { error: deleteError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', product.id);

                if (deleteError) {
                    console.error(`Error deleting product ${product.id}:`, deleteError);
                }
            }
            console.log('✅ All existing products deleted\n');
        }

        // 3. Load products from menuData.ts using dynamic import
        console.log('Loading products from menuData.ts...');
        const menuData = await import('../data/menuData.ts');
        const MENU_ITEMS = menuData.MENU_ITEMS;

        console.log(`Inserting ${MENU_ITEMS.length} products...`);

        let successCount = 0;
        let errorCount = 0;

        for (const item of MENU_ITEMS) {
            const supabaseProduct = {
                id: item.id,
                title: item.title,
                description: item.description,
                price: item.price,
                image: item.image,
                category: item.category,
                allergens: item.allergens,
                pairing: item.pairing || null,
                pairing_description: null,
                available: true,
                is_new: false,
                is_recommendation: false,
                is_off_menu: false,
                is_banner: false,
                is_offer: false,
                offer_text: null,
                translations: item.translations || null,
            };

            const { error: insertError } = await supabase
                .from('products')
                .insert(supabaseProduct);

            if (insertError) {
                console.error(`❌ Error inserting ${item.title}:`, insertError.message);
                errorCount++;
            } else {
                console.log(`✅ Inserted: ${item.title} (${item.category})`);
                successCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successfully inserted: ${successCount}`);
        console.log(`   ❌ Failed: ${errorCount}`);
        console.log(`\n🎉 Product reset complete!`);

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

resetProducts();

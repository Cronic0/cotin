import { Product } from '@/lib/supabase';
import {
    getProducts,
    subscribeToProducts,
    createProduct as supabaseCreateProduct,
    deleteProduct as supabaseDeleteProduct,
    updateProduct as supabaseUpdateProduct
} from '@/lib/supabase-helpers';
import { useEffect, useState } from 'react';

/**
 * Hook para manejar productos con Supabase
 * Uso: const { products, loading, createProduct, updateProduct, deleteProduct } = useSupabaseProducts();
 */
export function useSupabaseProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load products on mount
    useEffect(() => {
        loadProducts();
    }, []);

    // Subscribe to realtime changes
    useEffect(() => {
        const unsubscribe = subscribeToProducts((updatedProducts) => {
            setProducts(updatedProducts);
        });

        return () => unsubscribe();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setError(null);
            await supabaseCreateProduct(product);
            // Products will update via realtime subscription
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Error al crear producto');
            throw err;
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            setError(null);
            await supabaseUpdateProduct(id, updates);
            // Products will update via realtime subscription
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Error al actualizar producto');
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            setError(null);
            await supabaseDeleteProduct(id);
            // Products will update via realtime subscription
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Error al eliminar producto');
            throw err;
        }
    };

    return {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        refresh: loadProducts,
    };
}

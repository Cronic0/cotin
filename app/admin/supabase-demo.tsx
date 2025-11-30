import { Colors, Spacing } from '@/constants/Theme';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export default function SupabaseDemoScreen() {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useSupabaseProducts();
    const router = useRouter();
    const [testTitle, setTestTitle] = useState('');

    const handleCreateTest = async () => {
        if (!testTitle.trim()) {
            Alert.alert('Error', 'Escribe un título');
            return;
        }

        try {
            await createProduct({
                title: testTitle,
                description: 'Producto de prueba desde Supabase',
                price: 9.99,
                category: 'entrantes',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                allergens: [],
                available: true,
                is_new: false,
                is_recommendation: false,
                is_off_menu: false,
                is_banner: false,
                is_offer: false,
            });
            setTestTitle('');
            Alert.alert('¡Éxito!', 'Producto creado en Supabase');
        } catch (err) {
            Alert.alert('Error', 'No se pudo crear el producto');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        Alert.alert(
            'Confirmar',
            `¿Eliminar "${title}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(id);
                            Alert.alert('¡Éxito!', 'Producto eliminado');
                        } catch (err) {
                            Alert.alert('Error', 'No se pudo eliminar');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen
                options={{
                    title: 'Supabase Demo',
                    headerStyle: { backgroundColor: Colors.background },
                    headerTintColor: '#FFF',
                }}
            />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Supabase Test</Text>
                    <Text style={styles.headerSubtitle}>
                        {products.length} productos en la base de datos
                    </Text>
                </View>

                {/* Create Product Test */}
                <View style={styles.createSection}>
                    <Text style={styles.sectionTitle}>Crear Producto de Prueba</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Título del producto..."
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={testTitle}
                            onChangeText={setTestTitle}
                        />
                        <Pressable
                            style={styles.createButton}
                            onPress={handleCreateTest}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                        </Pressable>
                    </View>
                </View>

                {/* Products List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Cargando desde Supabase...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.productCard}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productTitle}>{item.title}</Text>
                                    <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
                                    <Text style={styles.productCategory}>{item.category}</Text>
                                </View>
                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(item.id, item.title)}
                                >
                                    <MaterialCommunityIcons name="delete" size={20} color="#ef4444" />
                                </Pressable>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="database-off" size={64} color="rgba(255,255,255,0.3)" />
                                <Text style={styles.emptyText}>No hay productos</Text>
                                <Text style={styles.emptySubtext}>Crea uno para probar</Text>
                            </View>
                        }
                    />
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    gradient: {
        flex: 1,
    },
    header: {
        padding: Spacing.l,
        paddingTop: Spacing.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    createSection: {
        padding: Spacing.l,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        margin: Spacing.l,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: Spacing.m,
    },
    inputRow: {
        flexDirection: 'row',
        gap: Spacing.s,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: Spacing.m,
        color: '#FFF',
        fontSize: 16,
    },
    createButton: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.m,
    },
    loadingText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.m,
        padding: Spacing.xl,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        padding: Spacing.l,
        paddingTop: 0,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: Colors.primary,
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'capitalize',
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginTop: Spacing.m,
    },
    emptySubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
});

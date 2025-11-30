import { Colors, LightColors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CATEGORIES as SHARED_CATEGORIES } from '@/data/menuData';

const FILTER_CATEGORIES = [
    { id: 'all', title: 'Todos', icon: 'view-grid' },
    ...SHARED_CATEGORIES.filter(c => c.id !== 'el-trebol')
];

export default function ProductsListScreen() {
    const { isAuthenticated, products } = useAdmin();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    if (!isAuthenticated) {
        router.replace('/admin/login');
        return null;
    }

    const params = useLocalSearchParams();
    const showUnavailableOnly = params.filter === 'unavailable';

    const filteredProducts = products.filter(product => {
        // If filtering by unavailable, ignore other filters
        if (showUnavailableOnly) {
            return product.available === false;
        }

        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.push('/admin/edit')} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>
                        {showUnavailableOnly ? 'No Disponibles' : 'Editar Carta'}
                    </Text>
                </View>

                {!showUnavailableOnly && (
                    <View style={styles.searchContainer}>
                        <MaterialCommunityIcons name="magnify" size={20} color={LightColors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar platos..."
                            placeholderTextColor={LightColors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                )}

                {/* Category Filter - Hide if showing unavailable only */}
                {!showUnavailableOnly && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScroll}
                        contentContainerStyle={styles.categoryScrollContent}
                    >
                        {FILTER_CATEGORIES.map(cat => {
                            const isActive = selectedCategory === cat.id;
                            return (
                                <Pressable
                                    key={cat.id}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                    onPress={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.icon && (
                                        <MaterialCommunityIcons
                                            name={cat.icon as any}
                                            size={18}
                                            color={isActive ? '#FFFFFF' : Colors.primary}
                                            style={{ marginRight: 6 }}
                                        />
                                    )}
                                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                                        {cat.title}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                )}

                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [
                                styles.productCard,
                                pressed && styles.productCardPressed
                            ]}
                            onPress={() => router.push(`/admin/products/${item.id}` as any)}
                        >
                            <MaterialCommunityIcons name="food-variant" size={80} color="rgba(255, 255, 255, 0.03)" style={styles.watermarkIcon} />
                            <Image
                                source={{ uri: item.image }}
                                style={[
                                    styles.productImage,
                                    item.available === false && styles.productImageUnavailable
                                ]}
                            />
                            {item.available === false && (
                                <View style={styles.unavailableOverlay} />
                            )}
                            {item.available === false && (
                                <View style={styles.unavailableBadge}>
                                    <Text style={styles.unavailableBadgeText}>No disponible</Text>
                                </View>
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text style={styles.productPrice}>{item.price.toFixed(2)}€</Text>
                            </View>
                        </Pressable>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                />

                {/* Floating Action Button */}
                <Pressable
                    style={styles.fab}
                    onPress={() => router.push('/admin/products/new' as any)}
                >
                    <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
                </Pressable>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.m,
        gap: Spacing.m,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        marginHorizontal: Spacing.l,
        marginBottom: Spacing.m,
        borderRadius: 16,
        paddingHorizontal: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 56,
    },
    searchIcon: {
        marginRight: Spacing.s,
        opacity: 0.7,
    },
    searchInput: {
        flex: 1,
        paddingVertical: Spacing.m,
        color: '#FFF',
        fontSize: 16,
    },
    categoryScroll: {
        flexGrow: 0,
        marginBottom: Spacing.m,
    },
    categoryScrollContent: {
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.s,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginRight: Spacing.s,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        flexShrink: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.4,
    },
    categoryChipText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryChipTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    listContent: {
        paddingTop: Spacing.s,
        paddingBottom: 100,
        paddingHorizontal: Spacing.s,
    },
    columnWrapper: {
        paddingHorizontal: Spacing.s,
    },
    productCard: {
        flex: 1,
        marginHorizontal: Spacing.s,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        marginBottom: Spacing.m,
        position: 'relative',
        minHeight: 200,
    },
    productCardPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.98 }],
    },
    watermarkIcon: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        transform: [{ rotate: '-15deg' }],
        zIndex: 0,
    },
    productImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    productImageUnavailable: {
        opacity: 0.8,
    },
    unavailableOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(16, 185, 129, 0.4)', // Green tint
        zIndex: 1,
        height: 140, // Match image height
    },
    productInfo: {
        padding: Spacing.m,
        zIndex: 1,
    },
    productTitle: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
        height: 40,
        letterSpacing: 0.3,
    },
    productPrice: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    unavailableBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    unavailableBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});

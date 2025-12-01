import { Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminEditScreen() {
    const { isAuthenticated, logout, products, updateProduct, resetProducts } = useAdmin();
    const router = useRouter();
    const [unavailableExpanded, setUnavailableExpanded] = useState(false);

    const unavailableProducts = products.filter(p => p.available === false);
    const unavailableCount = unavailableProducts.length;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            // Small delay to ensure navigation is ready
            const timer = setTimeout(() => {
                router.replace('/admin/login');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, isMounted]);

    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.replace('/admin/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Pressable
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.push('/admin');
                                }
                            }}
                            style={styles.backButton}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                        </Pressable>
                        <Pressable onPress={handleLogout} style={styles.logoutButton}>
                            <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
                        </Pressable>
                    </View>
                    <Text style={styles.headerTitle}>Editar Contenido</Text>
                    <Text style={styles.headerSubtitle}>Gestionar carta y suscriptores</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        {/* Manage Menu */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.actionButtonMenu,
                                pressed && styles.actionButtonPressed
                            ]}
                            onPress={() => router.push('/admin/products')}
                        >
                            <MaterialCommunityIcons name="food" size={80} color="rgba(16, 185, 129, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.actionIconContainer, styles.iconContainerMenu]}>
                                <MaterialCommunityIcons name="food" size={24} color="#10b981" />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>Gestionar Carta</Text>
                                <Text style={styles.actionSubtitle}>Crear, editar y eliminar platos</Text>
                            </View>
                            <View style={[styles.arrowContainer, styles.arrowMenu]}>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#10b981" />
                            </View>
                        </Pressable>

                        {/* Manage Subscribers */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.actionButtonSubs,
                                pressed && styles.actionButtonPressed
                            ]}
                            onPress={() => router.push('/admin/subscribers')}
                        >
                            <MaterialCommunityIcons name="email-multiple" size={80} color="rgba(59, 130, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.actionIconContainer, styles.iconContainerSubs]}>
                                <MaterialCommunityIcons name="email-multiple" size={24} color="#3b82f6" />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>Gestionar Suscriptores</Text>
                                <Text style={styles.actionSubtitle}>Ver lista de emails capturados</Text>
                            </View>
                            <View style={[styles.arrowContainer, styles.arrowSubs]}>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#3b82f6" />
                            </View>
                        </Pressable>

                        {/* Manage Schedule */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.actionButtonSettings,
                                pressed && styles.actionButtonPressed
                            ]}
                            onPress={() => router.push('/admin/schedule')}
                        >
                            <MaterialCommunityIcons name="clock-outline" size={80} color="rgba(139, 92, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.actionIconContainer, styles.iconContainerSettings]}>
                                <MaterialCommunityIcons name="clock-outline" size={24} color="#8b5cf6" />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>Gestionar Horarios</Text>
                                <Text style={styles.actionSubtitle}>Configurar apertura y cierre</Text>
                            </View>
                            <View style={[styles.arrowContainer, styles.arrowSettings]}>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#8b5cf6" />
                            </View>
                        </Pressable>

                        {/* Reset Products */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.actionButtonReset,
                                pressed && styles.actionButtonPressed
                            ]}
                            onPress={async () => {
                                if (confirm('¿Resetear todos los productos? Esto cargará los 35 productos desde menuData.ts')) {
                                    try {
                                        await resetProducts();
                                        alert('✅ Productos reseteados correctamente');
                                    } catch (error) {
                                        alert('❌ Error al resetear productos');
                                    }
                                }
                            }}
                        >
                            <MaterialCommunityIcons name="database-refresh" size={80} color="rgba(139, 92, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.actionIconContainer, styles.iconContainerReset]}>
                                <MaterialCommunityIcons name="database-refresh" size={24} color="#8b5cf6" />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>Resetear Productos</Text>
                                <Text style={styles.actionSubtitle}>Cargar todos los productos desde menuData.ts</Text>
                            </View>
                            <View style={[styles.arrowContainer, styles.arrowReset]}>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#8b5cf6" />
                            </View>
                        </Pressable>

                        {/* Manage Unavailable */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionButton,
                                styles.actionButtonUnavailable,
                                pressed && styles.actionButtonPressed
                            ]}
                            onPress={() => {
                                if (unavailableCount > 0) {
                                    setUnavailableExpanded(!unavailableExpanded);
                                } else {
                                    router.push({ pathname: '/admin/products', params: { filter: 'unavailable' } });
                                }
                            }}
                        >
                            <MaterialCommunityIcons name="eye-off" size={80} color="rgba(244, 63, 94, 0.05)" style={styles.watermarkIcon} />

                            {unavailableCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unavailableCount}</Text>
                                </View>
                            )}

                            <View style={[styles.actionIconContainer, styles.iconContainerUnavailable]}>
                                <MaterialCommunityIcons name="eye-off" size={24} color="#f43f5e" />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle}>Gestionar Disponible</Text>
                                <Text style={styles.actionSubtitle}>
                                    {unavailableCount > 0
                                        ? `${unavailableCount} productos no disponibles`
                                        : 'Todos los productos disponibles'}
                                </Text>
                            </View>
                            <View style={[styles.arrowContainer, styles.arrowUnavailable]}>
                                <MaterialCommunityIcons
                                    name={unavailableExpanded ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#f43f5e"
                                />
                            </View>
                        </Pressable>

                        {/* Quick Access Unavailable List */}
                        {unavailableExpanded && unavailableCount > 0 && (
                            <View style={styles.unavailableListContainer}>
                                <Text style={styles.sectionTitle}>Productos No Disponibles</Text>
                                {unavailableProducts.map((product) => (
                                    <View key={product.id} style={styles.unavailableItem}>
                                        <Image source={{ uri: product.image }} style={styles.unavailableImage} />
                                        <View style={styles.unavailableInfo}>
                                            <Text style={styles.unavailableTitle} numberOfLines={1}>{product.title}</Text>
                                            <Text style={styles.unavailablePrice}>{product.price.toFixed(2)}€</Text>
                                        </View>
                                        <Pressable
                                            style={({ pressed }) => [
                                                styles.quickEnableButton,
                                                pressed && { opacity: 0.8 }
                                            ]}
                                            onPress={() => updateProduct(product.id, { available: true })}
                                        >
                                            <MaterialCommunityIcons name="eye" size={20} color="#FFF" />
                                            <Text style={styles.quickEnableText}>Habilitar</Text>
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient >
        </View >
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
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.l,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.m,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.8,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.l,
    },
    section: {
        marginBottom: Spacing.xl,
        gap: Spacing.m,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.l,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 100,
    },
    actionButtonPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
    actionButtonMenu: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    actionButtonSubs: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    actionButtonSettings: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        transform: [{ rotate: '-15deg' }],
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
        borderWidth: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    iconContainerMenu: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    iconContainerSubs: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    iconContainerSettings: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    actionInfo: {
        flex: 1,
        zIndex: 1,
    },
    actionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    actionSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '500',
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        zIndex: 1,
    },
    arrowMenu: {
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    arrowSubs: {
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    arrowSettings: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    actionButtonUnavailable: {
        borderColor: 'rgba(244, 63, 94, 0.3)',
    },
    iconContainerUnavailable: {
        borderColor: 'rgba(244, 63, 94, 0.3)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
    },
    arrowUnavailable: {
        borderColor: 'rgba(244, 63, 94, 0.2)',
    },
    actionButtonReset: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    iconContainerReset: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    arrowReset: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    unavailableListContainer: {
        marginTop: Spacing.m,
        gap: Spacing.s,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.s,
        marginLeft: Spacing.s,
    },
    unavailableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        padding: Spacing.s,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(244, 63, 94, 0.2)',
    },
    unavailableImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        marginRight: Spacing.m,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    unavailableInfo: {
        flex: 1,
    },
    unavailableTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    unavailablePrice: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    quickEnableButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    quickEnableText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#f43f5e',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        zIndex: 10,
        borderWidth: 2,
        borderColor: 'rgba(30, 41, 59, 1)',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

import { TranslateAllProductsButton } from '@/components/TranslateAllProductsButton';
import { LightColors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminLandingScreen() {
    const { isAuthenticated, logout } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/admin/login');
        }
    }, [isAuthenticated]);

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
                        <Pressable onPress={() => router.push('/menu')} style={styles.backButton}>
                            <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#FFF" />
                        </Pressable>
                        <Pressable onPress={handleLogout} style={styles.logoutButton}>
                            <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
                            <Text style={styles.logoutText}>Salir</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.headerTitle}>Panel de Control</Text>
                    <Text style={styles.headerSubtitle}>Selecciona una opción</Text>
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {/* Statistics Card */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.card,
                            styles.cardStats,
                            pressed && styles.cardPressed
                        ]}
                        onPress={() => router.push('/admin/dashboard')}
                    >
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.02)']}
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={140} color="rgba(16, 185, 129, 0.05)" style={styles.watermarkIcon} />

                            <View style={styles.cardContent}>
                                <View style={[styles.iconContainer, styles.iconContainerStats]}>
                                    <MaterialCommunityIcons name="chart-bar" size={32} color="#10b981" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <Text style={styles.cardLabel}>DASHBOARD</Text>
                                    <Text style={styles.cardTitle}>Estadísticas</Text>
                                    <Text style={styles.cardSubtitle}>Visitas, favoritos y métricas</Text>
                                </View>
                                <View style={[styles.arrowContainer, styles.arrowStats]}>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#10b981" />
                                </View>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    {/* Edit Card */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.card,
                            styles.cardEdit,
                            pressed && styles.cardPressed
                        ]}
                        onPress={() => router.push('/admin/edit')}
                    >
                        <LinearGradient
                            colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.02)']}
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialCommunityIcons name="file-document-edit-outline" size={140} color="rgba(59, 130, 246, 0.05)" style={styles.watermarkIcon} />

                            <View style={styles.cardContent}>
                                <View style={[styles.iconContainer, styles.iconContainerEdit]}>
                                    <MaterialCommunityIcons name="pencil" size={32} color="#3b82f6" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <Text style={styles.cardLabel}>GESTIÓN</Text>
                                    <Text style={styles.cardTitle}>Editar Menú</Text>
                                    <Text style={styles.cardSubtitle}>Productos, precios y fotos</Text>
                                </View>
                                <View style={[styles.arrowContainer, styles.arrowEdit]}>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#3b82f6" />
                                </View>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    {/* Settings Card */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.card,
                            styles.cardSettings,
                            pressed && styles.cardPressed
                        ]}
                        onPress={() => router.push('/admin/settings')}
                    >
                        <LinearGradient
                            colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.02)']}
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialCommunityIcons name="cog-outline" size={140} color="rgba(139, 92, 246, 0.05)" style={styles.watermarkIcon} />

                            <View style={styles.cardContent}>
                                <View style={[styles.iconContainer, styles.iconContainerSettings]}>
                                    <MaterialCommunityIcons name="tune" size={32} color="#8b5cf6" />
                                </View>
                                <View style={styles.cardTextContainer}>
                                    <Text style={styles.cardLabel}>CONFIGURACIÓN</Text>
                                    <Text style={styles.cardTitle}>Editar App</Text>
                                    <Text style={styles.cardSubtitle}>Inicio, secciones y visibilidad</Text>
                                </View>
                                <View style={[styles.arrowContainer, styles.arrowSettings]}>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#8b5cf6" />
                                </View>
                            </View>
                        </LinearGradient>
                    </Pressable>

                    {/* Translation Tool */}
                    <TranslateAllProductsButton />
                </ScrollView>
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
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.xl,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.l,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logoutButton: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logoutText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
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
        color: LightColors.textSecondary,
        opacity: 0.8,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.l,
    },
    contentContainer: {
        gap: Spacing.l,
        paddingBottom: Spacing.xl,
    },
    card: {
        flex: 1,
        minHeight: 160,
        maxHeight: 180,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.6)', // Slate 800 with opacity
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardStats: {
        borderColor: 'rgba(16, 185, 129, 0.3)', // Emerald border
    },
    cardEdit: {
        borderColor: 'rgba(59, 130, 246, 0.3)', // Blue border
    },
    cardSettings: {
        borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border
    },
    cardPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
    cardGradient: {
        flex: 1,
        padding: Spacing.l,
        justifyContent: 'center',
        position: 'relative',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.5,
        transform: [{ rotate: '-15deg' }],
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
        zIndex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Darker background for icon
    },
    iconContainerStats: {
        borderColor: 'rgba(16, 185, 129, 0.3)',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    iconContainerEdit: {
        borderColor: 'rgba(59, 130, 246, 0.3)',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    iconContainerSettings: {
        borderColor: 'rgba(139, 92, 246, 0.3)',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 4,
        opacity: 0.8,
        color: LightColors.textSecondary,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: LightColors.textSecondary,
        opacity: 0.7,
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
    },
    arrowStats: {
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    arrowEdit: {
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    arrowSettings: {
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
});

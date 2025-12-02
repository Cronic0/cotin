import { Colors, LightColors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { useAnalytics } from '@/context/AnalyticsContext';
import { getDashboardAnalytics } from '@/lib/supabase-helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Simple Bar Chart Component
const SimpleBarChart = ({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) => {
    return (
        <View style={styles.chartContainer}>
            {data.map((item, index) => {
                const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <View key={index} style={styles.chartBar}>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: `${Math.max(heightPercent, 2)}%` }]}>
                                {item.value > 0 && (
                                    <Text style={styles.barValue}>{item.value}</Text>
                                )}
                            </View>
                        </View>
                        <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const CATEGORIES = [
    { id: 'all', label: 'Todas', icon: 'all-inclusive' },
    { id: 'entrantes', label: 'Entrantes', icon: 'food-variant' },
    { id: 'principales', label: 'Principales', icon: 'silverware-fork-knife' },
    { id: 'postres', label: 'Postres', icon: 'cupcake' },
    { id: 'bebidas', label: 'Bebidas', icon: 'cup' },
    { id: 'vinos', label: 'Vinos', icon: 'glass-wine' },
];

export default function AdminDashboard() {
    const { isAuthenticated, logout, products } = useAdmin();
    const { data } = useAnalytics();
    const [supabaseAnalytics, setSupabaseAnalytics] = useState<{
        productViews: Record<string, number>;
        favorites: Record<string, number>;
        dailyVisits: Record<string, number>;
        totalSessions: number;
    }>({
        productViews: {},
        favorites: {},
        dailyVisits: {},
        totalSessions: 0
    });
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showTopProducts, setShowTopProducts] = useState(false);
    const [showLanguageStats, setShowLanguageStats] = useState(false);
    const [showLeastViewed, setShowLeastViewed] = useState(false);
    const [showDailyVisits, setShowDailyVisits] = useState(false);
    const [topProductsCategory, setTopProductsCategory] = useState('all');
    const [leastViewedCategory, setLeastViewedCategory] = useState('all');
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/admin/login');
        }
    }, [isAuthenticated]);

    // Load analytics from Supabase
    useEffect(() => {
        if (isAuthenticated) {
            loadAnalytics();
        }
    }, [isAuthenticated]);

    const loadAnalytics = async () => {
        setIsLoadingAnalytics(true);
        try {
            const analytics = await getDashboardAnalytics();
            setSupabaseAnalytics(analytics);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setIsLoadingAnalytics(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    // Calculate analytics (from Supabase)
    const totalViews = Object.values(supabaseAnalytics.productViews).reduce(
        (sum, count) => sum + count,
        0
    );

    // Note: avgTimePerView is not available from Supabase analytics (only stored locally)
    // We keep the local calculation for now, but it won't be global
    const avgTimePerView = totalViews > 0
        ? Object.values(data.productAnalytics).reduce(
            (sum, item) => sum + item.totalTimeSpent,
            0
        ) / totalViews
        : 0;

    // Get top 15 most viewed products (from Supabase)
    const topProducts = Object.entries(supabaseAnalytics.productViews)
        .map(([id, viewCount]) => ({
            id,
            viewCount,
            product: products.find(p => p.id === id),
        }))
        .filter(item => item.product && (topProductsCategory === 'all' || item.product.category === topProductsCategory))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 15);

    // Get most favorited products (up to 15) (from Supabase)
    const topFavorites = Object.entries(supabaseAnalytics.favorites)
        .map(([id, count]) => ({
            id,
            count,
            product: products.find(p => p.id === id),
        }))
        .filter(item => item.product)
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    // Get least viewed products (up to 15) (from Supabase)
    const leastViewedProducts = products
        .map(product => {
            const viewCount = supabaseAnalytics.productViews[product.id] || 0;
            return {
                id: product.id,
                viewCount,
                product,
            };
        })
        .filter(item => (leastViewedCategory === 'all' || item.product.category === leastViewedCategory))
        .sort((a, b) => a.viewCount - b.viewCount)
        .slice(0, 15);

    // Prepare monthly data for chart - current year from January to current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11 (0=January, 11=December)

    // Prepare daily visits data for last 30 days
    const dailyVisitsData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().slice(0, 10);
        const dayLabel = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

        dailyVisitsData.push({
            label: dayLabel.replace('.', ''),
            value: supabaseAnalytics.dailyVisits[dateKey] || 0,
        });
    }

    const maxDailyVisits = Math.max(...dailyVisitsData.map(d => d.value), 1);
    const avgDailyVisits = dailyVisitsData.reduce((sum, d) => sum + d.value, 0) / dailyVisitsData.length;

    const monthlyData = [];

    // Generate data from January (month 0) to current month
    for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(currentYear, i, 1);
        const monthKey = date.toISOString().slice(0, 7); // Format: 'YYYY-MM'
        const monthLabel = date.toLocaleDateString('es-ES', { month: 'short' });

        // Get total visits for this month from monthlyViews
        const monthViews = data.monthlyViews?.[monthKey] || 0;

        monthlyData.push({
            label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1, 3),
            value: monthViews,
        });
    }

    const maxMonthlyValue = Math.max(...monthlyData.map(d => d.value), 1);

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
                                    router.replace('/admin');
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
                    <Text style={styles.headerTitle}>Estadísticas</Text>
                    <Text style={styles.headerSubtitle}>Métricas y Análisis</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Stats Grid - Row 1: Total Sessions, Avg Daily, Total Views */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="qrcode-scan" size={80} color="rgba(16, 185, 129, 0.05)" style={styles.watermarkIcon} />
                            <View style={styles.statIconContainer}>
                                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#10b981" />
                            </View>
                            <Text style={styles.statValue}>{supabaseAnalytics.totalSessions}</Text>
                            <Text style={styles.statLabel}>TOTAL SESIONES</Text>
                        </View>

                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="monitor" size={80} color="rgba(59, 130, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                <MaterialCommunityIcons name="monitor" size={24} color="#3b82f6" />
                            </View>
                            <Text style={styles.statValue}>{data.webAccessCount}</Text>
                            <Text style={styles.statLabel}>WEB</Text>
                        </View>

                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="chart-line" size={80} color="rgba(245, 158, 11, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                <MaterialCommunityIcons name="chart-line" size={24} color="#f59e0b" />
                            </View>
                            <Text style={styles.statValue}>{avgDailyVisits.toFixed(1)}</Text>
                            <Text style={styles.statLabel}>PROMEDIO DIARIO</Text>
                        </View>
                    </View>

                    {/* Stats Grid - Row 2: Views and Time */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="eye" size={80} color="rgba(139, 92, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                                <MaterialCommunityIcons name="eye" size={24} color="#8b5cf6" />
                            </View>
                            <Text style={styles.statValue}>{totalViews}</Text>
                            <Text style={styles.statLabel}>PLATOS VISTOS</Text>
                        </View>

                        <View style={styles.statCard}>
                            <MaterialCommunityIcons name="clock-outline" size={80} color="rgba(236, 72, 153, 0.05)" style={styles.watermarkIcon} />
                            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
                                <MaterialCommunityIcons name="clock-outline" size={24} color="#ec4899" />
                            </View>
                            <Text style={styles.statValue}>{avgTimePerView.toFixed(0)}s</Text>
                            <Text style={styles.statLabel}>TIEMPO PROMEDIO</Text>
                        </View>
                    </View>

                    {/* Daily Visits Expandable Section */}
                    <View style={styles.section}>
                        <Pressable
                            style={styles.sectionHeader}
                            onPress={() => setShowDailyVisits(!showDailyVisits)}
                        >
                            <View style={styles.sectionHeaderLeft}>
                                <MaterialCommunityIcons
                                    name="calendar-today"
                                    size={24}
                                    color="#10b981"
                                    style={styles.sectionIcon}
                                />
                                <View>
                                    <Text style={styles.sectionTitle}>Visitas Diarias Detalladas</Text>
                                    <Text style={styles.sectionSubtitle}>
                                        Últimos 30 días • {dailyVisitsData.reduce((sum, d) => sum + d.value, 0)} visitas totales
                                    </Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons
                                name={showDailyVisits ? 'chevron-up' : 'chevron-down'}
                                size={24}
                                color="rgba(255,255,255,0.5)"
                            />
                        </Pressable>

                        {showDailyVisits && (
                            <View style={styles.expandableContent}>
                                <View style={styles.chartCard}>
                                    <SimpleBarChart data={dailyVisitsData} maxValue={maxDailyVisits} />
                                </View>
                                <View style={styles.statsRow}>
                                    <View style={styles.miniStatCard}>
                                        <Text style={styles.miniStatValue}>{maxDailyVisits}</Text>
                                        <Text style={styles.miniStatLabel}>Máximo</Text>
                                    </View>
                                    <View style={styles.miniStatCard}>
                                        <Text style={styles.miniStatValue}>{avgDailyVisits.toFixed(1)}</Text>
                                        <Text style={styles.miniStatLabel}>Promedio</Text>
                                    </View>
                                    <View style={styles.miniStatCard}>
                                        <Text style={styles.miniStatValue}>
                                            {dailyVisitsData[dailyVisitsData.length - 1]?.value || 0}
                                        </Text>
                                        <Text style={styles.miniStatLabel}>Hoy</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Monthly Chart */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Visitas Mensuales</Text>
                        <View style={styles.chartCard}>
                            <SimpleBarChart data={monthlyData} maxValue={maxMonthlyValue} />
                        </View>
                    </View>

                    {/* Language Stats */}
                    <View style={styles.section}>
                        <Pressable
                            style={styles.sectionHeader}
                            onPress={() => setShowLanguageStats(!showLanguageStats)}
                        >
                            <View style={styles.sectionHeaderLeft}>
                                <MaterialCommunityIcons name="translate" size={20} color={Colors.primary} />
                                <Text style={styles.sectionHeaderText}>Procedencia de Clientes</Text>
                            </View>
                            <MaterialCommunityIcons
                                name={showLanguageStats ? "chevron-up" : "chevron-down"}
                                size={24}
                                color="#FFF"
                            />
                        </Pressable>

                        {showLanguageStats && (
                            <View style={styles.chartCard}>
                                {Object.entries(data.languageUsage || {}).length > 0 ? (
                                    Object.entries(data.languageUsage)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([lang, count], index) => {
                                            const total = Object.values(data.languageUsage).reduce((a, b) => a + b, 0);
                                            const percentage = total > 0 ? (count / total) * 100 : 0;
                                            const langNames: Record<string, string> = { es: 'Español', en: 'Inglés', fr: 'Francés', de: 'Alemán' };

                                            return (
                                                <View key={lang} style={{ marginBottom: 12 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <Text style={{ color: '#FFF', fontWeight: '600' }}>{langNames[lang] || lang.toUpperCase()}</Text>
                                                        <Text style={{ color: Colors.textSecondary }}>{count} ({percentage.toFixed(0)}%)</Text>
                                                    </View>
                                                    <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                                        <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: Colors.primary, borderRadius: 4 }} />
                                                    </View>
                                                </View>
                                            );
                                        })
                                ) : (
                                    <Text style={styles.emptyText}>No hay datos de idioma aún</Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Top Favorites */}
                    {topFavorites.length > 0 && (
                        <View style={styles.section}>
                            <Pressable
                                style={styles.sectionHeader}
                                onPress={() => setShowFavorites(!showFavorites)}
                            >
                                <View style={styles.sectionHeaderLeft}>
                                    <MaterialCommunityIcons name="heart" size={20} color={Colors.primary} />
                                    <Text style={styles.sectionHeaderText}>Más Añadidos a Favoritos ({topFavorites.length})</Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={showFavorites ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#FFF"
                                />
                            </Pressable>
                            {showFavorites && topFavorites.map((item, index) => (
                                <Link key={item.id} href={`/admin/products/${item.id}` as any} asChild>
                                    <Pressable style={styles.productItem}>
                                        <View style={styles.productRank}>
                                            <Text style={styles.productRankText}>#{index + 1}</Text>
                                        </View>
                                        <Image
                                            source={{ uri: item.product!.image }}
                                            style={styles.productImage}
                                        />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.product!.title}</Text>
                                            <Text style={styles.productStats}>
                                                {item.count} {item.count === 1 ? 'vez' : 'veces'} añadido
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={LightColors.textSecondary} />
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}

                    {/* Top Viewed Products */}
                    <View style={styles.section}>
                        <Pressable
                            style={styles.sectionHeader}
                            onPress={() => setShowTopProducts(!showTopProducts)}
                        >
                            <View style={styles.sectionHeaderLeft}>
                                <MaterialCommunityIcons name="eye" size={20} color={Colors.primary} />
                                <Text style={styles.sectionHeaderText}>Platos Más Vistos ({topProducts.length})</Text>
                            </View>
                            <MaterialCommunityIcons
                                name={showTopProducts ? "chevron-up" : "chevron-down"}
                                size={24}
                                color="#FFF"
                            />
                        </Pressable>

                        {/* Category Filter Pills */}
                        {showTopProducts && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: Spacing.m }}
                                contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                            >
                                {CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat.id}
                                        style={[
                                            styles.categoryPill,
                                            topProductsCategory === cat.id && styles.categoryPillActive
                                        ]}
                                        onPress={() => setTopProductsCategory(cat.id)}
                                    >
                                        <MaterialCommunityIcons
                                            name={cat.icon as any}
                                            size={16}
                                            color={topProductsCategory === cat.id ? '#FFF' : Colors.primary}
                                        />
                                        <Text style={[
                                            styles.categoryPillText,
                                            topProductsCategory === cat.id && styles.categoryPillTextActive
                                        ]}>
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}

                        {topProducts.length > 0 ? (
                            showTopProducts && topProducts.map((item, index) => (
                                <Link key={item.id} href={`/admin/products/${item.id}` as any} asChild>
                                    <Pressable style={styles.productItem}>
                                        <View style={styles.productRank}>
                                            <Text style={styles.productRankText}>#{index + 1}</Text>
                                        </View>
                                        <Image
                                            source={{ uri: item.product!.image }}
                                            style={styles.productImage}
                                        />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.product!.title}</Text>
                                            <Text style={styles.productStats}>
                                                {item.viewCount} vistas · {item.viewCount > 0 ? (item.totalTimeSpent / item.viewCount).toFixed(0) : '0'}s promedio
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={LightColors.textSecondary} />
                                    </Pressable>
                                </Link>
                            ))
                        ) : (
                            !showTopProducts && <Text style={styles.emptyText}>Pulsa para ver los platos más vistos</Text>
                        )}
                    </View>

                    {/* Least Viewed Products */}
                    {leastViewedProducts.length > 0 && (
                        <View style={styles.section}>
                            <Pressable
                                style={styles.sectionHeader}
                                onPress={() => setShowLeastViewed(!showLeastViewed)}
                            >
                                <View style={styles.sectionHeaderLeft}>
                                    <MaterialCommunityIcons name="eye-off" size={20} color={Colors.primary} />
                                    <Text style={styles.sectionHeaderText}>Platos Menos Vistos ({leastViewedProducts.length})</Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={showLeastViewed ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#FFF"
                                />
                            </Pressable>

                            {/* Category Filter Pills */}
                            {showLeastViewed && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginBottom: Spacing.m }}
                                    contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat.id}
                                            style={[
                                                styles.categoryPill,
                                                leastViewedCategory === cat.id && styles.categoryPillActive
                                            ]}
                                            onPress={() => setLeastViewedCategory(cat.id)}
                                        >
                                            <MaterialCommunityIcons
                                                name={cat.icon as any}
                                                size={16}
                                                color={leastViewedCategory === cat.id ? '#FFF' : Colors.primary}
                                            />
                                            <Text style={[
                                                styles.categoryPillText,
                                                leastViewedCategory === cat.id && styles.categoryPillTextActive
                                            ]}>
                                                {cat.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            )}

                            {showLeastViewed && leastViewedProducts.map((item, index) => (
                                <Link key={item.id} href={`/admin/products/${item.id}` as any} asChild>
                                    <Pressable style={styles.productItem}>
                                        <View style={[styles.productRank, { backgroundColor: '#ef4444' }]}>
                                            <Text style={styles.productRankText}>#{index + 1}</Text>
                                        </View>
                                        <Image
                                            source={{ uri: item.product!.image }}
                                            style={styles.productImage}
                                        />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.product!.title}</Text>
                                            <Text style={styles.productStats}>
                                                {item.viewCount} vistas · {item.viewCount > 0 ? (item.totalTimeSpent / item.viewCount).toFixed(0) : '0'}s promedio
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={LightColors.textSecondary} />
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}

                    <View style={styles.footerSpacer} />
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
    statsGrid: {
        flexDirection: 'row',
        gap: Spacing.m,
        marginBottom: Spacing.l,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        transform: [{ rotate: '-15deg' }],
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.s,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.m,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: Spacing.s,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.m,
        letterSpacing: 0.5,
    },
    chartCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.l,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        gap: 4,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    barContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        backgroundColor: '#10b981',
        borderRadius: 4,
        minHeight: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 4,
    },
    barValue: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    barLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        marginBottom: Spacing.s,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    productRank: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: Spacing.m,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    productRankText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productStats: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        paddingVertical: Spacing.xl,
    },
    footerSpacer: {
        height: 40,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    categoryPillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryPillText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    categoryPillTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    sectionIcon: {
        marginRight: Spacing.m,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    expandableContent: {
        marginTop: Spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.m,
        marginTop: Spacing.m,
    },
    miniStatCard: {
        flex: 1,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    miniStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    miniStatLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Helper to map allergens to icons
const getAllergenIcon = (allergen: string) => {
    const map: Record<string, string> = {
        'Gluten': 'barley',
        'Lácteos': 'cheese',
        'Huevos': 'egg',
        'Pescado': 'fish',
        'Moluscos': 'jellyfish', // Closest match
        'Soja': 'soy-sauce',
        'Frutos secos': 'peanut',
        'Sulfitos': 'bottle-wine',
        'Mostaza': 'food-variant',
        'Sésamo': 'seed',
    };
    return map[allergen] || 'alert-circle-outline';
};

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { products } = useAdmin();
    const item = products.find((i) => i.id === id);
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { t } = useLanguage();
    const isFav = item ? isFavorite(item.id) : false;
    const { trackProductView, trackTimeSpent, trackFavoriteAdded } = useAnalytics();
    const startTimeRef = useRef<number>(Date.now());

    // Animation values
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Favorites Animation
    const flyAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const flyOpacity = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Track product view and time spent
    useEffect(() => {
        if (item) {
            trackProductView(item.id);
            startTimeRef.current = Date.now();
        }

        return () => {
            if (item) {
                const timeSpent = (Date.now() - startTimeRef.current) / 1000; // in seconds
                trackTimeSpent(item.id, timeSpent);
            }
        };
    }, [item?.id]);

    const triggerFlyAnimation = () => {
        // Reset values
        flyAnim.setValue({ x: 0, y: 0 });
        flyOpacity.setValue(1);

        Animated.parallel([
            Animated.timing(flyAnim, {
                toValue: { x: 150, y: -500 }, // Approximate coordinates to top-right
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(flyOpacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.delay(400),
                Animated.timing(flyOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(600),
                Animated.spring(scaleAnim, {
                    toValue: 1.5,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    };

    const toggleFavorite = () => {
        if (!item) return;
        if (isFav) {
            removeFavorite(item.id);
        } else {
            addFavorite(item.id);
            trackFavoriteAdded(item.id);
            triggerFlyAnimation();
        }
    };

    if (!item) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{t('productNotFound')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Hero Image Background */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={[
                        styles.image,
                        item.available === false && styles.imageUnavailable
                    ]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.1)']}
                    style={styles.gradientOverlay}
                />

                {/* Unavailable Overlay */}
                {item.available === false && (
                    <View style={styles.unavailableOverlay} />
                )}

                {/* Unavailable Badge */}
                {item.available === false && (
                    <View style={styles.unavailableProductBadge}>
                        <Text style={styles.unavailableProductBadgeText}>No disponible</Text>
                    </View>
                )}

                {/* New Badge */}
                {item.isNew && (
                    <LinearGradient
                        colors={['#F59E0B', '#D97706']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.newBadge}
                    >
                        <Text style={styles.newBadgeText}>NUEVO</Text>
                    </LinearGradient>
                )}

                {/* Off Menu Badge */}
                {item.isOffMenu && (
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.offMenuBadge}
                    >
                        <Text style={styles.offMenuBadgeText}>Fuera de Carta</Text>
                    </LinearGradient>
                )}

                {/* Floating Back Button */}
                <Pressable style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.push('/menu')}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                </Pressable>

                {/* Header Favorites Icon */}
                {/* Header Favorites Icon */}
                <Link href="/favorites" asChild>
                    <Pressable style={styles.headerFavIcon}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <MaterialCommunityIcons
                                name={isFav ? "heart" : "heart-outline"}
                                size={28}
                                color={isFav ? Colors.primary : "#FFF"}
                            />
                        </Animated.View>
                    </Pressable>
                </Link>
            </View>

            {/* Content Sheet */}
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        transform: [{ translateY: slideAnim }],
                        opacity: fadeAnim,
                    }
                ]}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerBar}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.categoryTag}>{t(`cat_${item.category}` as any).toUpperCase()}</Text>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                        <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>{item.description}</Text>

                    {/* Allergens Section */}
                    {item.allergens && item.allergens.length > 0 && (
                        <View style={styles.allergensSection}>
                            <Text style={styles.sectionTitle}>{t('allergensTitle')}</Text>
                            <View style={styles.allergensGrid}>
                                {item.allergens.map((allergen, index) => (
                                    <View key={index} style={styles.allergenItem}>
                                        <View style={styles.allergenIconBox}>
                                            <MaterialCommunityIcons
                                                name={getAllergenIcon(allergen) as any}
                                                size={24}
                                                color={Colors.primary}
                                            />
                                        </View>
                                        <Text style={styles.allergenText}>{allergen}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Pairing Section */}
                    {item.pairing && (() => {
                        const pairedItem = products.find(p => p.id === item.pairing);
                        if (!pairedItem) return null;
                        return (
                            <View style={styles.pairingSection}>
                                <Text style={styles.sectionTitle}>{t('pairingTitle')}</Text>
                                <Text style={styles.pairingDescription}>
                                    {item.pairingDescription || t(`pairing_desc_${item.id}` as any)}
                                </Text>
                                <Link href={`/menu/${pairedItem.id}` as any} asChild>
                                    <Pressable style={styles.pairingCard}>
                                        <Image source={{ uri: pairedItem.image }} style={styles.pairingImage} />
                                        <View style={styles.pairingContent}>
                                            <Text style={styles.pairingTitle}>{pairedItem.title}</Text>
                                            <Text style={styles.pairingPrice}>{pairedItem.price.toFixed(2)}€</Text>
                                            <View style={styles.pairingBadge}>
                                                <MaterialCommunityIcons name="glass-wine" size={16} color="#FFF" />
                                                <Text style={styles.pairingBadgeText}>Perfect Match</Text>
                                            </View>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.primary} />
                                    </Pressable>
                                </Link>
                            </View>
                        );
                    })()}

                    {/* Action Button */}
                    <Pressable
                        style={[styles.actionButton, isFav && styles.actionButtonActive]}
                        onPress={toggleFavorite}
                    >
                        <MaterialCommunityIcons
                            name={isFav ? "heart" : "heart-outline"}
                            size={24}
                            color={isFav ? Colors.primary : "#FFF"}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.actionButtonText, isFav && styles.actionButtonTextActive]}>
                            {isFav ? t('removeFromFavorites') : t('addToFavorites')}
                        </Text>

                        {/* Flying Heart */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                transform: [
                                    { translateX: flyAnim.x },
                                    { translateY: flyAnim.y }
                                ],
                                opacity: flyOpacity,
                                zIndex: 100
                            }}
                        >
                            <MaterialCommunityIcons name="heart" size={30} color={Colors.primary} />
                        </Animated.View>
                    </Pressable>
                </ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark bg behind image
    },
    imageContainer: {
        height: '45%',
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    headerFavIcon: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        marginTop: -40, // Overlap image
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingBottom: 40,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.m,
    },
    titleContainer: {
        flex: 1,
        paddingRight: Spacing.m,
    },
    categoryTag: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    title: {
        ...Typography.h1,
        fontSize: 26,
        color: Colors.text,
        lineHeight: 32,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: Spacing.m,
        opacity: 0.5,
    },
    description: {
        ...Typography.body,
        fontSize: 16,
        lineHeight: 26,
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 18,
        marginBottom: Spacing.m,
        color: Colors.text,
    },
    allergensSection: {
        marginBottom: Spacing.xl,
    },
    allergensGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.m,
    },
    allergenItem: {
        alignItems: 'center',
        width: 70,
    },
    allergenIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    allergenText: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButtonActive: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    actionButtonTextActive: {
        color: Colors.primary,
    },
    errorText: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 50,
    },
    pairingSection: {
        marginBottom: Spacing.xl,
    },
    pairingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    pairingImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: Spacing.m,
    },
    pairingContent: {
        flex: 1,
    },
    pairingTitle: {
        ...Typography.h3,
        fontSize: 16,
        color: Colors.text,
        marginBottom: 4,
    },
    pairingPrice: {
        ...Typography.price,
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    pairingBadge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        display: 'none', // Hidden for now, maybe too cluttered
    },
    pairingBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    pairingDescription: {
        ...Typography.body,
        fontSize: 14,
        fontStyle: 'italic',
        color: Colors.textSecondary,
        marginBottom: Spacing.m,
        paddingHorizontal: Spacing.s,
        lineHeight: 20,
    },
    imageUnavailable: {
        opacity: 0.8,
    },
    unavailableOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(16, 185, 129, 0.4)', // Green tint
        zIndex: 1,
    },
    unavailableProductBadge: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        right: 70, // Offset from fav icon, same as offMenu
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    unavailableProductBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    newBadge: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        left: 70, // Offset from back button
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    offMenuBadge: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 50,
        right: 70, // Offset from fav icon
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    offMenuBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

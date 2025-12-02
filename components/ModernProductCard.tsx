import { Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/data/menuData';
import { getTranslatedProduct } from '@/utils/productTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Platform.select({
    web: '100%',
    default: width - Spacing.l * 2
}) as any;
const CARD_HEIGHT = 280;

interface ModernProductCardProps {
    item: any;
    index: number;
}

export const ModernProductCard = ({ item, index }: ModernProductCardProps) => {
    const scale = useSharedValue(1);
    const { language } = useLanguage();
    const translated = getTranslatedProduct(item, language);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.98);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    const categoryTitle = CATEGORIES.find(c => c.id === item.category)?.title || '';

    if (!item || !item.id) return null;

    return (
        <Link href={`/menu/${item.id}` as any} asChild>
            <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
                <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                    <Animated.View style={[styles.card, animatedStyle]}>
                        {/* Image Section */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={[
                                    styles.image,
                                    item.available === false && styles.imageUnavailable
                                ]}
                                resizeMode="cover"
                            />

                            {/* Unavailable Overlay */}
                            {item.available === false && (
                                <View style={styles.unavailableOverlay} />
                            )}

                            {/* Badges */}
                            {item.isNew && (
                                <LinearGradient
                                    colors={[Colors.secondary, '#B45309']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.badgeNew}
                                >
                                    <Text style={styles.badgeText}>NUEVO</Text>
                                </LinearGradient>
                            )}

                            {item.available === false && (
                                <View style={styles.badgeUnavailable}>
                                    <Text style={styles.badgeText}>AGOTADO</Text>
                                </View>
                            )}

                            {/* Offer Badge */}
                            {item.isOffer && (
                                <View style={styles.badgeOffer}>
                                    <Text style={styles.badgeText}>{item.offerText || 'OFERTA'}</Text>
                                </View>
                            )}
                        </View>

                        {/* Content Section */}
                        <View style={styles.contentContainer}>
                            <View style={styles.headerBar}>
                                <View style={styles.textContainer}>
                                    {categoryTitle ? (
                                        <Text style={styles.categoryTag}>{categoryTitle.toUpperCase()}</Text>
                                    ) : null}
                                    <Text style={styles.title} numberOfLines={1}>{translated.title}</Text>
                                </View>
                                <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
                            </View>

                            <Text style={styles.description} numberOfLines={2}>{translated.description}</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Pressable>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 300, // Increased height for better layout
        borderRadius: 24,
        marginBottom: Spacing.l,
        backgroundColor: Colors.surface, // White background
        ...Shadows.medium,
        overflow: 'hidden',
        alignSelf: 'center',
        ...Platform.select({
            web: {
                maxWidth: 800,
                cursor: 'pointer',
            },
            default: {},
        }),
    },
    imageContainer: {
        height: Platform.select({
            web: 240,
            default: 200
        }),
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        ...Platform.select({
            web: {
                objectFit: 'cover' as any,
            },
            default: {},
        }),
    },
    imageUnavailable: {
        opacity: 0.5,
        backgroundColor: '#000',
    },
    unavailableOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: Colors.surface,
        marginTop: -30, // Overlap effect
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: Spacing.m,
        paddingTop: Spacing.l,
    },
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    textContainer: {
        flex: 1,
        paddingRight: Spacing.s,
    },
    categoryTag: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 2,
    },
    title: {
        ...Typography.h3,
        color: Colors.text, // Dark text
        fontSize: 18,
        lineHeight: 22,
    },
    description: {
        ...Typography.caption,
        color: Colors.textSecondary, // Gray text
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },
    price: {
        ...Typography.price,
        color: Colors.primary, // Teal price
        fontSize: 18,
        fontWeight: 'bold',
    },
    badgeNew: {
        position: 'absolute',
        top: 16,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        ...Shadows.small,
        zIndex: 10,
    },
    badgeUnavailable: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        zIndex: 10,
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    badgeOffer: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#EF4444', // Red
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        ...Shadows.small,
        zIndex: 10,
    }
});

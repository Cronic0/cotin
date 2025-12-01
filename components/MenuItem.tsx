import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { MenuItem as MenuItemType } from '@/data/menuData';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

interface Props {
    item: MenuItemType;
}

export const MenuItem = ({ item }: Props) => {
    const { t, language } = useLanguage();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current; // Aumentado de 20 a 40
    const scaleAnim = useRef(new Animated.Value(0.95)).current; // Empieza más pequeño

    // Obtener título y descripción traducidos según el idioma actual
    const getTranslatedText = () => {
        if (language === 'es' || !item.translations) {
            return { title: item.title, description: item.description };
        }

        const translation = item.translations[language as 'en' | 'fr' | 'de'];
        return {
            title: translation?.title || item.title,
            description: translation?.description || item.description,
        };
    };

    const { title, description } = getTranslatedText();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500, // Más lento para ser más visible
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8, // Más bounce
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92, // Más reducción (era 0.97)
            friction: 5,
            tension: 200,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Link href={`/menu/${item.id}` as any} asChild>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ],
                        }
                    ]}
                >
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
                        </View>
                        <Text style={styles.description} numberOfLines={2}>
                            {description}
                        </Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginBottom: Spacing.m,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 2,
        ...Platform.select({
            web: {
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                maxWidth: 800,
                alignSelf: 'center',
                width: '100%',
            },
            default: {},
        }),
    },
    imageContainer: {
        height: Platform.select({
            web: 220,
            default: 200
        }),
        width: '100%',
        backgroundColor: '#F5F5F5',
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
    contentContainer: {
        padding: Spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.s,
    },
    title: {
        ...Typography.h3,
        flex: 1,
        marginRight: Spacing.s,
        color: Colors.text,
    },
    price: {
        ...Typography.price,
        color: Colors.primary,
        fontSize: 18,
    },
    description: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});

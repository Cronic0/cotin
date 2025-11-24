import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { MenuItem as MenuItemType } from '@/data/menuData';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

interface Props {
    item: MenuItemType;
}

export const MenuItem = ({ item }: Props) => {
    const { t } = useLanguage();
    return (
        <Link href={`/menu/${item.id}` as any} asChild>
            <Pressable style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
                    </View>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
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
            },
            default: {},
        }),
    },
    imageContainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#F5F5F5',
    },
    image: {
        width: '100%',
        height: '100%',
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

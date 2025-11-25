import { ModernProductCard } from '@/components/ModernProductCard';
import { Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MENU_ITEMS } from '@/data/menuData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HeaderRight } from '@/components/HeaderRight';

import { useLanguage } from '@/context/LanguageContext';

const ALLERGEN_KEYS = [
    'gluten', 'lacteos', 'huevos', 'sulfitos',
    'pescado', 'moluscos', 'soja', 'sesamo',
    'frutos_secos', 'mostaza'
];

const ALLERGEN_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    'gluten': 'barley',
    'lacteos': 'cheese',
    'huevos': 'egg',
    'sulfitos': 'bottle-wine',
    'pescado': 'fish',
    'moluscos': 'jellyfish',
    'soja': 'soy-sauce',
    'sesamo': 'seed',
    'frutos_secos': 'peanut',
    'mostaza': 'food-variant'
};

export default function AllergensScreen() {
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const { t } = useLanguage();

    const toggleAllergen = (allergenKey: string) => {
        setSelectedAllergens(prev =>
            prev.includes(allergenKey)
                ? prev.filter(a => a !== allergenKey)
                : [...prev, allergenKey]
        );
    };

    // Filter items: Exclude items that contain ANY of the selected allergens
    const filteredItems = MENU_ITEMS.filter(item => {
        if (selectedAllergens.length === 0) return true;

        const keyToSpanish: Record<string, string> = {
            'gluten': 'Gluten',
            'lacteos': 'Lácteos',
            'huevos': 'Huevos',
            'sulfitos': 'Sulfitos',
            'pescado': 'Pescado',
            'moluscos': 'Moluscos',
            'soja': 'Soja',
            'sesamo': 'Sésamo',
            'frutos_secos': 'Frutos secos',
            'mostaza': 'Mostaza'
        };

        const selectedSpanishAllergens = selectedAllergens.map(key => keyToSpanish[key]);

        const hasAllergen = item.allergens.some(allergen => selectedSpanishAllergens.includes(allergen));
        return !hasAllergen;
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: t('allergenFilterTitle'),
                headerBackTitle: t('back'),
                headerRight: () => <HeaderRight />,
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: '#FFF',
            }} />

            <View style={styles.header}>
                <Text style={styles.title}>{t('allergenFilterBanner')}</Text>
                <Text style={styles.subtitle}>{t('allergenFilterSub')}</Text>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.allergensRow}>
                    {ALLERGEN_KEYS.map(allergenKey => {
                        const isSelected = selectedAllergens.includes(allergenKey);
                        const iconName = ALLERGEN_ICONS[allergenKey] || 'alert-circle-outline';

                        return (
                            <Pressable
                                key={allergenKey}
                                onPress={() => toggleAllergen(allergenKey)}
                            >
                                <LinearGradient
                                    colors={isSelected ? [Colors.primary, Colors.primaryDark] : [Colors.surface, Colors.surface]}
                                    style={[styles.allergenChip, isSelected && styles.allergenChipSelected]}
                                >
                                    <MaterialCommunityIcons
                                        name={iconName}
                                        size={20}
                                        color={isSelected ? "#FFF" : Colors.textSecondary}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text style={[styles.allergenText, isSelected && styles.allergenTextSelected]}>
                                        {t(`allergen_${allergenKey}` as any)}
                                    </Text>
                                </LinearGradient>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                    {selectedAllergens.length > 0
                        ? t('showingDishes')
                        : t('menuTitle')}
                </Text>
                <Text style={styles.resultsCount}>{filteredItems.length} resultados</Text>
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <ModernProductCard item={item} index={index} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="food-off" size={64} color={Colors.textSecondary} style={{ opacity: 0.5 }} />
                        <Text style={styles.emptyText}>{t('noSafeDishes')}</Text>
                        <Text style={styles.emptySubText}>Intenta deseleccionar algunos alérgenos</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.m,
        paddingTop: Spacing.l,
        backgroundColor: Colors.background,
    },
    title: {
        ...Typography.h2,
        color: '#FFFFFF',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    filterContainer: {
        paddingVertical: Spacing.m,
        backgroundColor: Colors.background,
    },
    allergensRow: {
        paddingHorizontal: Spacing.m,
        gap: Spacing.s,
    },
    allergenChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        ...Shadows.small,
    },
    allergenChipSelected: {
        borderColor: Colors.primary,
        ...Shadows.medium,
    },
    allergenText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    allergenTextSelected: {
        color: '#FFFFFF',
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.m,
    },
    resultsTitle: {
        ...Typography.h3,
        fontSize: 18,
        color: '#FFFFFF',
        flex: 1,
    },
    resultsCount: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '700',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    listContent: {
        padding: Spacing.m,
        paddingTop: 0,
        paddingBottom: 40,
    },
    emptyContainer: {
        padding: Spacing.xl,
        alignItems: 'center',
        marginTop: Spacing.xl * 2,
    },
    emptyText: {
        ...Typography.h3,
        color: '#FFFFFF',
        marginTop: Spacing.m,
        textAlign: 'center',
    },
    emptySubText: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
});

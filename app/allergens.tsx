import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList, SafeAreaView } from 'react-native';
import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { MENU_ITEMS } from '@/data/menuData';
import { MenuItem } from '@/components/MenuItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

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

        // We need to map the selected allergen keys back to the Spanish names stored in menuData
        // OR better, update the logic to match based on keys if possible.
        // Since menuData has Spanish strings like 'Gluten', 'Lácteos', we need a mapping.
        // Let's create a simple mapping for now or assume the keys in Translations match the data if we normalized them.
        // Given menuData is hardcoded Spanish, let's map keys to Spanish values for filtering.

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
                headerRight: () => <HeaderRight />
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
                                style={[styles.allergenChip, isSelected && styles.allergenChipSelected]}
                                onPress={() => toggleAllergen(allergenKey)}
                            >
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={20}
                                    color={isSelected ? "#FFF" : Colors.primary}
                                    style={{ marginRight: 8 }}
                                />
                                {isSelected && <MaterialCommunityIcons name="close-circle" size={16} color="#FFF" style={{ marginRight: 4, display: 'none' }} />}
                                <Text style={[styles.allergenText, isSelected && styles.allergenTextSelected]}>
                                    {t(`allergen_${allergenKey}` as any)}
                                </Text>
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
                renderItem={({ item }) => <MenuItem item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="food-off" size={48} color={Colors.textSecondary} />
                        <Text style={styles.emptyText}>{t('noSafeDishes')}</Text>
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
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        ...Typography.h2,
        color: Colors.text,
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    allergenChipSelected: {
        backgroundColor: '#EF4444', // Red for "danger/excluded"
        borderColor: '#EF4444',
    },
    allergenText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
    },
    allergenTextSelected: {
        color: '#FFFFFF',
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.s,
    },
    resultsTitle: {
        ...Typography.h3,
        fontSize: 16,
        color: Colors.text,
        flex: 1,
    },
    resultsCount: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    listContent: {
        padding: Spacing.m,
        paddingTop: 0,
    },
    emptyContainer: {
        padding: Spacing.xl,
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: Spacing.m,
        textAlign: 'center',
    },
});

import { ModernProductCard } from '@/components/ModernProductCard';
import { Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MENU_ITEMS } from '@/data/menuData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


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
                headerShown: false,
            }} />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <View style={styles.heroContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="shield-check" size={56} color={Colors.primary} />
                        </View>
                        <Text style={styles.heroTitle}>Filtrar por Alérgenos</Text>
                        <Text style={styles.heroSubtitle}>Selecciona los alérgenos que deseas evitar</Text>
                    </View>
                </View>

                {/* Allergen Filter Pills */}
                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.allergensRow}
                    >
                        {ALLERGEN_KEYS.map(allergenKey => {
                            const isSelected = selectedAllergens.includes(allergenKey);
                            const iconName = ALLERGEN_ICONS[allergenKey] || 'alert-circle-outline';

                            return (
                                <Pressable
                                    key={allergenKey}
                                    onPress={() => toggleAllergen(allergenKey)}
                                    style={({ pressed }) => [
                                        styles.allergenChip,
                                        isSelected && styles.allergenChipSelected,
                                        pressed && { opacity: 0.7 }
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name={iconName}
                                        size={22}
                                        color={isSelected ? "#FFF" : Colors.textSecondary}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text style={[styles.allergenText, isSelected && styles.allergenTextSelected]}>
                                        {t(`allergen_${allergenKey}` as any)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Results Header */}
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsCount}>{filteredItems.length} resultados</Text>
                </View>

                {/* Products List */}
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
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    gradient: {
        flex: 1,
    },
    heroContainer: {
        paddingTop: 60,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.l,
    },
    heroContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.l,
        borderWidth: 3,
        borderColor: 'rgba(45, 212, 191, 0.3)',
        ...Shadows.large,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: Spacing.s,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: 24,
    },
    filterContainer: {
        paddingVertical: Spacing.l,
        backgroundColor: 'transparent',
    },
    allergensRow: {
        paddingHorizontal: Spacing.m,
        gap: Spacing.m,
    },
    allergenChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        ...Shadows.medium,
    },
    allergenChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        ...Shadows.large,
    },
    allergenText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    allergenTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    resultsHeader: {
        paddingHorizontal: Spacing.l,
        paddingBottom: Spacing.m,
        alignItems: 'center',
    },
    resultsCount: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '700',
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.3)',
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

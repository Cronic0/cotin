import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, LightColors } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HeaderRight = () => {
    const router = useRouter();
    const { favorites } = useFavorites();
    const { setLanguage, language } = useLanguage();

    const languages = [
        { code: 'es', label: 'ES' },
        { code: 'en', label: 'EN' },
        { code: 'fr', label: 'FR' },
        { code: 'de', label: 'DE' },
    ];

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 8 }}>
            {/* Language Switcher */}
            <View style={{ flexDirection: 'row', gap: 6, marginRight: 8 }}>
                {languages.map((item) => (
                    <Pressable
                        key={item.code}
                        onPress={() => setLanguage(item.code as any)}
                        style={[
                            styles.langButton,
                            language === item.code && styles.langButtonActive
                        ]}
                    >
                        <Text style={[
                            styles.langText,
                            language === item.code && styles.langTextActive
                        ]}>
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Favorites Icon */}
            <Pressable
                onPress={() => router.push('/favorites')}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
                <MaterialCommunityIcons
                    name={favorites.length > 0 ? "heart" : "heart-outline"}
                    size={28}
                    color={favorites.length > 0 ? Colors.primary : LightColors.primary}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    langButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    langButtonActive: {
        backgroundColor: Colors.primary,
    },
    langText: {
        fontSize: 12,
        fontWeight: '600',
        color: LightColors.textSecondary,
        letterSpacing: 0.5,
    },
    langTextActive: {
        color: '#FFFFFF',
    },
});

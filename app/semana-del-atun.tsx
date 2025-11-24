import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { Language, Translations } from '@/constants/Translations';
import { MENU_ITEMS } from '@/data/menuData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Mock language state
const CURRENT_LANGUAGE: Language = 'es';

export default function SemanaAtunPage() {
    const router = useRouter();
    const [language, setLanguage] = useState<Language>('es');
    const t = Translations[language];

    const tunaDishes = MENU_ITEMS.filter(item => item.category === 'semana-atun');

    return (
        <View style={styles.container}>
            {/* Hero Image Background */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&q=80' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.1)']}
                    style={styles.gradientOverlay}
                />

                {/* Floating Back Button */}
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>
            </View>

            {/* Content Sheet */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerBar}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.categoryTag}>{t.semanaAtunSubtitle.toUpperCase()}</Text>
                            <Text style={styles.title}>{t.semanaAtunTitle}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>
                        {t.semanaAtunDesc}
                    </Text>

                    {/* Products Carousel */}
                    <View style={styles.productsContainer}>
                        <Text style={styles.sectionTitle}>Platos de la Semana</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.carouselContent}
                            snapToInterval={280}
                            decelerationRate="fast"
                        >
                            {tunaDishes.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.carouselCard}
                                    onPress={() => router.push(`/menu/${item.id}`)}
                                >
                                    <Image source={{ uri: item.image }} style={styles.carouselImage} />
                                    <View style={styles.carouselInfo}>
                                        <Text style={styles.carouselTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.carouselPrice}>{item.price.toFixed(2)}€</Text>
                                        <Text style={styles.carouselDescription} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
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
    productsContainer: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 18,
        marginBottom: Spacing.m,
        color: Colors.text,
    },
    carouselContent: {
        paddingRight: Spacing.m,
        gap: Spacing.m,
    },
    carouselCard: {
        width: 260,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    carouselImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    carouselInfo: {
        padding: Spacing.m,
    },
    carouselTitle: {
        ...Typography.h3,
        color: Colors.text,
        marginBottom: 4,
    },
    carouselPrice: {
        ...Typography.h3,
        color: Colors.primary,
        marginBottom: 8,
    },
    carouselDescription: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontSize: 14,
    },
});

import { Colors, LightColors, Spacing } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// GastroCode brand colors (original teal/green theme)
const GASTROCODE_PRIMARY = '#2DD4BF'; // Teal
const GASTROCODE_SECONDARY = '#10B981'; // Green

export default function GastroCodeScreen() {
    const router = useRouter();

    // Animation values
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(20);

    useEffect(() => {
        titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
        titleTranslateY.value = withDelay(300, withSpring(0));
    }, []);

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }]
    }));

    const handleContact = () => {
        Linking.openURL('mailto:contacto@gastrocode.com');
    };

    // Carousel state
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const { width } = Dimensions.get('window');

    const showcaseItems = [
        {
            title: 'Analítica Avanzada',
            description: 'Conoce a tus clientes, sus preferencias y optimiza tu menú basándote en datos reales.',
            image: require('@/assets/images/analytics_dashboard.png'),
        },
        {
            title: 'Experiencia Móvil',
            description: 'Tus clientes acceden a tu carta desde cualquier dispositivo, sin apps ni descargas.',
            image: require('@/assets/images/customer_phone.png'),
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <ImageBackground
                source={require('@/assets/images/gastrocode_office.png')}
                style={styles.background}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                    style={styles.overlay}
                >
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <Animated.View style={[styles.heroSection, titleStyle]}>
                            <View style={styles.logoContainer}>
                                <MaterialCommunityIcons name="code-braces" size={48} color={GASTROCODE_PRIMARY} />
                            </View>
                            <Text style={styles.brandName}>GastroCode</Text>
                            <Text style={styles.tagline}>Cartas digitales que enamoran</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.featuresContainer}>
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="palette" size={32} color={GASTROCODE_PRIMARY} />
                                <Text style={styles.featureTitle}>Diseño Premium</Text>
                                <Text style={styles.featureText}>Interfaces visuales impactantes diseñadas para cautivar a tus clientes desde el primer segundo.</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="cellphone-link" size={32} color={GASTROCODE_PRIMARY} />
                                <Text style={styles.featureTitle}>100% Adaptable</Text>
                                <Text style={styles.featureText}>Nos adaptamos a tus necesidades específicas. Tu marca, tu estilo, tus reglas.</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="rocket-launch" size={32} color={GASTROCODE_PRIMARY} />
                                <Text style={styles.featureTitle}>Tecnología Punta</Text>
                                <Text style={styles.featureText}>Desarrollado con las últimas tecnologías para garantizar velocidad y fluidez.</Text>
                            </View>
                        </Animated.View>

                        {/* Showcase Carousel */}
                        <Animated.View entering={FadeInDown.delay(1400).duration(800)} style={styles.showcaseSection}>
                            <Text style={styles.showcaseSectionTitle}>Características que Destacan</Text>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={(e) => {
                                    const offset = e.nativeEvent.contentOffset.x;
                                    const index = Math.round(offset / (width - Spacing.xl * 2));
                                    setActiveIndex(index);
                                }}
                                scrollEventThrottle={16}
                            >
                                {showcaseItems.map((item, index) => (
                                    <View key={index} style={[styles.showcaseCard, { width: width - Spacing.xl * 2 }]}>
                                        <Image source={item.image} style={styles.showcaseImage} />
                                        <View style={styles.showcaseContent}>
                                            <Text style={styles.showcaseTitle}>{item.title}</Text>
                                            <Text style={styles.showcaseDescription}>{item.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Carousel indicators */}
                            <View style={styles.carouselIndicators}>
                                {showcaseItems.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.indicator,
                                            index === activeIndex && styles.indicatorActive
                                        ]}
                                    />
                                ))}
                            </View>
                        </Animated.View>

                        {/* Why GastroCode Section */}
                        <Animated.View entering={FadeInDown.delay(1600).duration(800)} style={styles.whySection}>
                            <Text style={styles.whySectionTitle}>¿Por qué GastroCode?</Text>

                            <View style={styles.benefitRow}>
                                <View style={styles.benefitIconContainer}>
                                    <MaterialCommunityIcons name="chart-line" size={28} color={GASTROCODE_PRIMARY} />
                                </View>
                                <View style={styles.benefitTextContainer}>
                                    <Text style={styles.benefitTitle}>Aumenta tus Ventas</Text>
                                    <Text style={styles.benefitText}>Menús visuales atractivos que impulsan el ticket medio hasta un 30%</Text>
                                </View>
                            </View>

                            <View style={styles.benefitRow}>
                                <View style={styles.benefitIconContainer}>
                                    <MaterialCommunityIcons name="clock-fast" size={28} color={GASTROCODE_PRIMARY} />
                                </View>
                                <View style={styles.benefitTextContainer}>
                                    <Text style={styles.benefitTitle}>Actualizaciones Instantáneas</Text>
                                    <Text style={styles.benefitText}>Modifica precios y productos en tiempo real desde cualquier lugar</Text>
                                </View>
                            </View>

                            <View style={styles.benefitRow}>
                                <View style={styles.benefitIconContainer}>
                                    <MaterialCommunityIcons name="earth" size={28} color={GASTROCODE_PRIMARY} />
                                </View>
                                <View style={styles.benefitTextContainer}>
                                    <Text style={styles.benefitTitle}>Multiidioma Automático</Text>
                                    <Text style={styles.benefitText}>Tu carta disponible en varios idiomas para turistas internacionales</Text>
                                </View>
                            </View>
                        </Animated.View>

                        {/* CTA Section at bottom */}
                        <Animated.View entering={FadeInDown.delay(1800).duration(800)} style={styles.ctaContainer}>
                            <Text style={styles.ctaText}>¿Listo para digitalizar tu restaurante?</Text>
                            <Pressable style={styles.ctaButton} onPress={handleContact}>
                                <Text style={styles.ctaButtonText}>Contactar Ahora</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
                            </Pressable>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(2000).duration(800)}>
                            <Pressable style={styles.adminButton} onPress={() => router.push('/admin/login' as any)}>
                                <MaterialCommunityIcons name="shield-account" size={20} color={GASTROCODE_PRIMARY} />
                                <Text style={styles.adminButtonText}>Acceso Clientes</Text>
                            </Pressable>
                        </Animated.View>

                        {/* Footer */}
                        <Animated.View entering={FadeInDown.delay(2200).duration(800)} style={styles.footer}>
                            <Pressable onPress={() => router.push('/admin/login' as any)}>
                                <Text style={styles.footerText}>Powered by GastroCode</Text>
                            </Pressable>
                        </Animated.View>

                        <View style={styles.footerSpacer} />
                    </ScrollView>
                </LinearGradient >
            </ImageBackground >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: Spacing.l,
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
    content: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl * 2,
        marginTop: Spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    brandName: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.s,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 18,
        color: GASTROCODE_SECONDARY,
        textAlign: 'center',
        letterSpacing: 0.5,
        opacity: 0.9,
    },
    featuresContainer: {
        gap: Spacing.xl,
        marginBottom: Spacing.xl * 2,
    },
    featureItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: Spacing.l,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: Spacing.m,
        marginBottom: Spacing.s,
    },
    featureText: {
        fontSize: 16,
        color: LightColors.textSecondary,
        lineHeight: 24,
    },
    ctaContainer: {
        alignItems: 'center',
        marginTop: Spacing.m,
    },
    ctaText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.l,
        textAlign: 'center',
    },
    ctaButton: {
        backgroundColor: GASTROCODE_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 8,
        shadowColor: GASTROCODE_PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    ctaButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    adminButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        gap: 8,
        borderWidth: 1,
        borderColor: GASTROCODE_PRIMARY,
        marginTop: Spacing.m,
    },
    adminButtonText: {
        color: GASTROCODE_PRIMARY,
        fontSize: 16,
        fontWeight: 'bold',
    },
    showcaseSection: {
        marginBottom: Spacing.xl * 2,
    },
    showcaseSectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.l,
        textAlign: 'center',
    },
    showcaseCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        marginRight: Spacing.m,
    },
    showcaseImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    showcaseContent: {
        padding: Spacing.l,
    },
    showcaseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.s,
    },
    showcaseDescription: {
        fontSize: 15,
        color: LightColors.textSecondary,
        lineHeight: 22,
    },
    carouselIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.m,
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    indicatorActive: {
        backgroundColor: GASTROCODE_PRIMARY,
        width: 24,
    },
    whySection: {
        marginBottom: Spacing.xl,
    },
    whySectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    benefitRow: {
        flexDirection: 'row',
        marginBottom: Spacing.l,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    benefitIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    benefitTextContainer: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    benefitText: {
        fontSize: 14,
        color: LightColors.textSecondary,
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
        marginTop: Spacing.xl * 2,
        paddingTop: Spacing.l,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    footerText: {
        fontSize: 14,
        color: LightColors.textSecondary,
        opacity: 0.7,
    },
    footerSpacer: {
        height: 50,
    }
});

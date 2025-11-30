
import { GastroCodeLogo } from '@/components/GastroCodeLogo';
import { Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { Language } from '@/constants/Translations';
import { useAnalytics } from '@/context/AnalyticsContext';
import { useLanguage } from '@/context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const { trackLanguage } = useAnalytics();
    const languages: Language[] = ['es', 'en', 'fr', 'de'];

    // Animation values
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(50);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        titleOpacity.value = withDelay(300, withTiming(1, { duration: 1000 }));
        titleTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));
        contentOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    }, []);

    const handleViewMenu = () => {
        trackLanguage(language);
        router.push('/menu');
    };

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/andalusian_patio.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.7)']} // Darker overlay for better text contrast
                    style={styles.overlay}
                >
                    <View style={styles.safeArea}>

                        {/* Header / Logo Area */}
                        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.headerTop}>
                            <GastroCodeLogo variant="light" size={24} style={{ opacity: 0.9 }} />
                        </Animated.View>

                        {/* Main Content */}
                        <View style={styles.mainContent}>
                            <Animated.View style={[styles.titleContainer, titleStyle]}>

                                <Text style={styles.welcomeText}>{t('welcome')}</Text>
                                <Text style={styles.mainTitle}>Venta</Text>
                                <Text style={styles.mainTitleAccent}>el Cotin</Text>
                                <View style={styles.separator} />
                                <Text style={styles.tagline}>Tradición que se come con el alma</Text>
                            </Animated.View>

                            <Animated.View style={[styles.actionContainer, contentStyle]}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.primaryButton,
                                        pressed && styles.primaryButtonPressed
                                    ]}
                                    onPress={handleViewMenu}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary, Colors.primaryDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.gradientButton}
                                    >
                                        <Text style={styles.primaryButtonText}>{t('viewMenu')}</Text>
                                    </LinearGradient>
                                </Pressable>

                                {/* Language Selector */}
                                <View style={styles.languageWrapper}>
                                    <View style={styles.languageContainer}>
                                        {languages.map((lang, index) => (
                                            <Pressable
                                                key={lang}
                                                onPress={() => setLanguage(lang)}
                                                style={[
                                                    styles.langButton,
                                                    language === lang && styles.langButtonActive
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.langText,
                                                    language === lang && styles.langTextActive
                                                ]}>
                                                    {lang.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            </Animated.View>
                        </View>

                        {/* Footer */}
                        <Animated.View entering={FadeIn.delay(1200)} style={styles.footer}>
                            <Link href="/admin/login" asChild>
                                <Pressable>
                                    <Text style={styles.footerText}>POWERED BY GASTROCODE</Text>
                                </Pressable>
                            </Link>
                        </Animated.View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: Spacing.l,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    headerTop: {
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.xl,
    },
    titleContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        ...Typography.caption,
        color: Colors.secondary,
        fontSize: 14,
        letterSpacing: 3,
        marginBottom: Spacing.s,
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    mainTitle: {
        ...Typography.h1,
        fontFamily: 'serif',
        color: '#FFFFFF',
        fontSize: 72, // Larger for impact
        lineHeight: 78,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 15,
        marginBottom: -12, // Tighten spacing
    },
    mainTitleAccent: {
        ...Typography.h1,
        fontFamily: 'serif',
        fontSize: 52,
        lineHeight: 60,
        textAlign: 'center',
        color: '#FFD700', // Warmer Gold
        fontStyle: 'italic',
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 15,
    },
    separator: {
        width: 80,
        height: 3,
        backgroundColor: '#FFD700',
        marginVertical: Spacing.l,
        borderRadius: 2,
        opacity: 0.8,
    },
    tagline: {
        ...Typography.body,
        color: '#E2E8F0',
        fontSize: 18,
        textAlign: 'center',
        maxWidth: 300,
        opacity: 0.9,
    },
    heroLogo: {
        width: 120,
        height: 120,
        marginBottom: Spacing.m,
        tintColor: '#D4A574', // Optional: tint to match gold accent if desired, or remove for full color
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        gap: Spacing.l,
        marginTop: Spacing.xl,
    },
    primaryButton: {
        width: '100%',
        maxWidth: 320,
        height: 56,
        borderRadius: 28,
        ...Shadows.large,
        overflow: 'hidden',
        alignSelf: 'center', // Ensure it centers itself if needed
    },
    primaryButtonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    gradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        ...Typography.button,
        color: '#FFFFFF',
        fontSize: 16,
    },
    languageWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    languageContainer: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: 'rgba(0,0,0,0.4)', // Replaced BlurView with semi-transparent background
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    langButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    langButtonActive: {
        backgroundColor: Colors.surface,
    },
    langText: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    langTextActive: {
        color: Colors.text, // Dark text on white surface
        fontWeight: '800',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        letterSpacing: 2,
    }
});

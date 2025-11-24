import { Colors, LightColors, Spacing } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

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

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop' }}
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
                                <MaterialCommunityIcons name="code-braces" size={48} color={Colors.primary} />
                            </View>
                            <Text style={styles.brandName}>GastroCode</Text>
                            <Text style={styles.tagline}>Cartas digitales que enamoran</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.featuresContainer}>
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="palette" size={32} color={Colors.primary} />
                                <Text style={styles.featureTitle}>Diseño Premium</Text>
                                <Text style={styles.featureText}>Interfaces visuales impactantes diseñadas para cautivar a tus clientes desde el primer segundo.</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="cellphone-link" size={32} color={Colors.primary} />
                                <Text style={styles.featureTitle}>100% Adaptable</Text>
                                <Text style={styles.featureText}>Nos adaptamos a tus necesidades específicas. Tu marca, tu estilo, tus reglas.</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="rocket-launch" size={32} color={Colors.primary} />
                                <Text style={styles.featureTitle}>Tecnología Punta</Text>
                                <Text style={styles.featureText}>Desarrollado con las últimas tecnologías para garantizar velocidad y fluidez.</Text>
                            </View>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(1000).duration(800)} style={styles.ctaContainer}>
                            <Text style={styles.ctaText}>¿Listo para digitalizar tu restaurante?</Text>
                            <Pressable style={styles.ctaButton} onPress={handleContact}>
                                <Text style={styles.ctaButtonText}>Contactar Ahora</Text>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
                            </Pressable>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(1200).duration(800)}>
                            <Pressable style={styles.adminButton} onPress={() => router.push('/admin/login' as any)}>
                                <MaterialCommunityIcons name="shield-account" size={20} color={Colors.primary} />
                                <Text style={styles.adminButtonText}>Acceso Clientes</Text>
                            </Pressable>
                        </Animated.View>

                        <View style={styles.footerSpacer} />
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </View>
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
        color: Colors.secondary,
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
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 8,
        shadowColor: Colors.primary,
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
        borderColor: Colors.primary,
        marginTop: Spacing.m,
    },
    adminButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerSpacer: {
        height: 50,
    }
});

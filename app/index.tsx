import { Colors, Spacing, Typography } from '@/constants/Theme';
import { Language } from '@/constants/Translations';
import { useLanguage } from '@/context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LandingPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const languages: Language[] = ['es', 'en', 'fr', 'de'];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)']}
                    style={styles.overlay}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.subtitle}>{t('welcome')}</Text>
                                <Text style={styles.title}>EL TRÉBOL</Text>
                                <View style={styles.separator} />
                                <Text style={styles.tagline}>{t('experienceTagline')}</Text>
                            </View>

                            <View style={styles.actions}>
                                <Link href="/menu" asChild>
                                    <Pressable style={styles.button}>
                                        <Text style={styles.buttonText}>{t('viewMenu')}</Text>
                                    </Pressable>
                                </Link>

                                <View style={styles.languageContainer}>
                                    {languages.map((lang, index) => (
                                        <View key={lang} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Pressable onPress={() => setLanguage(lang)} style={styles.languageButton}>
                                                <Text style={[
                                                    styles.languageText,
                                                    language === lang && styles.languageTextActive
                                                ]}>
                                                    {lang.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                            {index < languages.length - 1 && (
                                                <Text style={styles.languageSeparator}>|</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.xl,
        paddingTop: 160, // Push header down a bit more
        paddingBottom: 80, // Push buttons up from bottom
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
        flex: 1,
        justifyContent: 'space-between', // Distribute space
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    subtitle: {
        ...Typography.h3,
        color: Colors.secondary,
        marginBottom: Spacing.s,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    title: {
        ...Typography.h1,
        fontSize: 56,
        color: Colors.text,
        marginBottom: Spacing.m,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    separator: {
        width: 60,
        height: 4,
        backgroundColor: Colors.primary,
        marginBottom: Spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    tagline: {
        ...Typography.body,
        fontSize: 18,
        color: '#FFFFFF', // Changed to white
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    actions: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.xl,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        ...Typography.h3,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    languageButton: {
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    languageText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
    },
    languageTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(16, 185, 129, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    languageSeparator: {
        color: 'rgba(255,255,255,0.2)',
        marginHorizontal: 4,
        fontSize: 14,
    },
});

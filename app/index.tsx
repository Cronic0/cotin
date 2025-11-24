import { View, Text, StyleSheet, ImageBackground, Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors, Spacing, Typography } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LandingPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={styles.overlay}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.subtitle}>Bienvenido a</Text>
                                <Text style={styles.title}>EL TRÉBOL</Text>
                                <View style={styles.separator} />
                                <Text style={styles.tagline}>Experiencia Gastronómica</Text>
                            </View>

                            <Link href="/menu" asChild>
                                <Pressable style={styles.button}>
                                    <Text style={styles.buttonText}>Ver Carta</Text>
                                </Pressable>
                            </Link>


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
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl * 2,
    },
    subtitle: {
        ...Typography.h3,
        color: Colors.secondary,
        marginBottom: Spacing.s,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 16,
    },
    title: {
        ...Typography.h1,
        fontSize: 56,
        color: Colors.text,
        marginBottom: Spacing.m,
        textAlign: 'center',
        // Font family would go here
    },
    separator: {
        width: 60,
        height: 4,
        backgroundColor: Colors.primary,
        marginBottom: Spacing.m,
    },
    tagline: {
        ...Typography.body,
        fontSize: 18,
        color: Colors.textSecondary,
        letterSpacing: 1,
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
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginTop: Spacing.m,
    },
    secondaryButtonText: {
        color: '#FFFFFF',
    },
});

import { LightColors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Utilidad ONE-TIME para traducir todos los productos existentes
 */
export function TranslateAllProductsButton() {
    const { translateAllProducts, products } = useAdmin();
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [progress, setProgress] = React.useState('');

    const handleTranslate = async () => {
        console.log('Button pressed: Starting translation process...');
        try {
            setIsTranslating(true);
            setProgress('Iniciando traducción...');
            console.log('Calling translateAllProducts from context...');

            await translateAllProducts();

            console.log('translateAllProducts completed successfully.');
            setProgress('¡Traducción completada!');
            Alert.alert('Éxito', 'Todos los productos han sido traducidos. Por favor recarga la aplicación si no ves los cambios.');
        } catch (error) {
            console.error('Error in button onPress:', error);
            setProgress('Error: ' + error);
            Alert.alert('Error', 'Hubo un problema al traducir los productos: ' + error);
        } finally {
            setIsTranslating(false);
            console.log('Translation process finished (finally block).');
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                styles.cardTranslate,
                pressed && styles.cardPressed
            ]}
            onPress={isTranslating ? undefined : handleTranslate}
        >
            <LinearGradient
                colors={['rgba(244, 63, 94, 0.15)', 'rgba(244, 63, 94, 0.02)']} // Rose-500
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <MaterialCommunityIcons name="translate" size={140} color="rgba(244, 63, 94, 0.05)" style={styles.watermarkIcon} />

                <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, styles.iconContainerTranslate]}>
                        {isTranslating ? (
                            <ActivityIndicator size="small" color="#f43f5e" />
                        ) : (
                            <MaterialCommunityIcons name="translate" size={32} color="#f43f5e" />
                        )}
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardLabel}>HERRAMIENTAS</Text>
                        <Text style={styles.cardTitle}>{isTranslating ? 'Traduciendo...' : 'Traducir Todo'}</Text>
                        <Text style={styles.cardSubtitle}>
                            {progress ? progress : 'Generar traducciones faltantes'}
                        </Text>
                    </View>
                    <View style={[styles.arrowContainer, styles.arrowTranslate]}>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#f43f5e" />
                    </View>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 160,
        maxHeight: 180,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.6)', // Slate 800 with opacity
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: Spacing.l,
    },
    cardTranslate: {
        borderColor: 'rgba(244, 63, 94, 0.3)', // Rose border
    },
    cardPressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
    cardGradient: {
        flex: 1,
        padding: Spacing.l,
        justifyContent: 'center',
        position: 'relative',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.5,
        transform: [{ rotate: '-15deg' }],
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
        zIndex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Darker background for icon
    },
    iconContainerTranslate: {
        borderColor: 'rgba(244, 63, 94, 0.3)',
        shadowColor: '#f43f5e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 4,
        opacity: 0.8,
        color: LightColors.textSecondary,
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: LightColors.textSecondary,
        opacity: 0.7,
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
    },
    arrowTranslate: {
        borderColor: 'rgba(244, 63, 94, 0.2)',
    },
});

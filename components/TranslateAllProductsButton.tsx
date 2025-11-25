import { useAdmin } from '@/context/AdminContext';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

/**
 * Utilidad ONE-TIME para traducir todos los productos existentes
 * 
 * INSTRUCCIONES:
 * 1. Importa este componente en app/admin/index.tsx
 * 2. Añádelo al final de la página de admin
 * 3. Presiona el botón "Traducir Todos los Productos"
 * 4. Espera a que termine (puede tardar 1-2 minutos)
 * 5. Una vez completado, ELIMINA este componente
 */
export function TranslateAllProductsButton() {
    const { translateAllProducts, products } = useAdmin();
    const [isTranslating, setIsTranslating] = React.useState(false);

    const handleTranslate = async () => {
        Alert.alert(
            'Confirmar Traducción',
            `¿Traducir ${products.length} productos a inglés, francés y alemán?\n\nEsto puede tardar 1-2 minutos.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Traducir',
                    onPress: async () => {
                        try {
                            setIsTranslating(true);
                            await translateAllProducts();
                            Alert.alert('Éxito', 'Todos los productos han sido traducidos');
                        } catch (error) {
                            Alert.alert('Error', 'Hubo un problema al traducir los productos');
                        } finally {
                            setIsTranslating(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌐 Traducción Masiva</Text>
            <Text style={styles.subtitle}>
                Traduce todos los productos existentes a inglés, francés y alemán
            </Text>
            <Button
                title={isTranslating ? 'Traduciendo...' : 'Traducir Todos los Productos'}
                onPress={handleTranslate}
                disabled={isTranslating}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
});

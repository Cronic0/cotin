import { Colors, LightColors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AdminLoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdmin();
    const router = useRouter();

    const handleLogin = async () => {
        console.log('Login button pressed');
        console.log('Email:', email);
        console.log('Password length:', password.length);

        if (!email || !password) {
            console.log('Missing credentials');
            Alert.alert('Error', 'Por favor ingrese email y contraseña');
            return;
        }

        setLoading(true);
        try {
            console.log('Calling login function...');
            const { success, error } = await login(email, password);
            console.log('Login result:', { success, error });

            if (success) {
                console.log('Login successful, redirecting...');
                router.replace('/admin');
            } else {
                console.log('Login failed:', error);
                Alert.alert('Error', error || 'Credenciales incorrectas');
                // Only clear password if it's a credential error, but for now keep behavior simple
                if (error?.includes('Invalid login credentials')) {
                    setPassword('');
                }
            }
        } catch (error) {
            console.error('Login exception in component:', error);
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                <View style={styles.backButtonContainer}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="shield-lock" size={64} color={Colors.primary} />
                    </View>

                    <Text style={styles.title}>Panel de Administración</Text>
                    <Text style={styles.subtitle}>Acceso para Clientes GastroCode</Text>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email" size={20} color={LightColors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={LightColors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock" size={20} color={LightColors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor={LightColors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <Pressable
                        style={[styles.loginButton, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Text>
                        {!loading && <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />}
                    </Pressable>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    backButtonContainer: {
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        marginTop: -100,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.l,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.s,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: LightColors.textSecondary,
        marginBottom: Spacing.xl * 2,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: Spacing.m,
        marginBottom: Spacing.l,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inputIcon: {
        marginRight: Spacing.s,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.m,
        color: '#FFF',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.xl,
        borderRadius: 12,
        width: '100%',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hint: {
        marginTop: Spacing.xl,
        color: LightColors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
});

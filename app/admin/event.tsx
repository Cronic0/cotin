import { Colors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function EventEditScreen() {
    const { eventConfig, updateEventConfig, showEvent, toggleEvent } = useAdmin();
    const router = useRouter();

    const [title, setTitle] = useState(eventConfig.title);
    const [subtitle, setSubtitle] = useState(eventConfig.subtitle);
    const [date, setDate] = useState(eventConfig.date);
    const [image, setImage] = useState(eventConfig.imageUrl);
    const [linkPath, setLinkPath] = useState(eventConfig.linkPath || '');
    const [isSaving, setIsSaving] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            const sizeInBytes = result.assets[0].base64.length * 0.75;
            if (sizeInBytes > 1000000) {
                Alert.alert('Error', 'La imagen es demasiado grande. Por favor elige una más pequeña.');
                return;
            }
            setImage(base64Image);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            window.alert('Error: El título es obligatorio');
            return;
        }
        if (!image) {
            window.alert('Error: La imagen es obligatoria');
            return;
        }

        setIsSaving(true);

        try {
            await updateEventConfig({
                title: title.trim(),
                subtitle: subtitle.trim(),
                date: date.trim(),
                imageUrl: image,
                linkPath: linkPath.trim(),
            });

            setIsSaving(false);
            window.alert('✅ Evento actualizado correctamente');
            setTimeout(() => {
                router.back();
            }, 100);
        } catch (error) {
            console.error('Error saving event:', error);
            setIsSaving(false);
            window.alert(`Error: Hubo un problema al guardar: ${error}`);
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
                <View style={styles.header}>
                    <Pressable
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/admin');
                            }
                        }}
                        style={styles.backButton}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Editar Evento</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título del Evento *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Concierto Kase.O"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    </View>

                    {/* Subtitle Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Subtítulo / Descripción Corta</Text>
                        <TextInput
                            style={styles.input}
                            value={subtitle}
                            onChangeText={setSubtitle}
                            placeholder="Música en vivo"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    </View>

                    {/* Date Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fecha y Hora</Text>
                        <TextInput
                            style={styles.input}
                            value={date}
                            onChangeText={setDate}
                            placeholder="Mañana a las 22:00"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    </View>

                    {/* Image Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Imagen del Evento *</Text>
                        <Pressable style={styles.imagePickerButton} onPress={pickImage}>
                            <MaterialCommunityIcons name="image-plus" size={24} color="#FFF" />
                            <Text style={styles.imagePickerText}>
                                {image ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                            </Text>
                        </Pressable>
                        {image && (
                            <View style={styles.imagePreview}>
                                <Text style={styles.previewLabel}>Vista previa:</Text>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </View>

                    {/* Link Path Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Enlace (Opcional)</Text>
                        <Text style={styles.helpText}>
                            Enlace externo o interno para más info
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={linkPath}
                            onChangeText={setLinkPath}
                            placeholder="https://..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    </View>

                    {/* Visibility Toggle */}
                    <View style={styles.toggleSection}>
                        <View style={styles.toggleInfo}>
                            <MaterialCommunityIcons
                                name="calendar-star"
                                size={24}
                                color={showEvent ? Colors.primary : 'rgba(255,255,255,0.5)'}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.toggleTitle}>Mostrar Evento</Text>
                                <Text style={styles.toggleSubtitle}>
                                    {showEvent ? '✓ Visible en el menú' : '✕ Oculto'}
                                </Text>
                            </View>
                        </View>
                        <Pressable
                            style={[styles.toggleButton, showEvent && styles.toggleButtonActive]}
                            onPress={() => {
                                console.log('Toggling event visibility, current:', showEvent);
                                toggleEvent();
                            }}
                        >
                            <View style={[styles.toggleThumb, showEvent && styles.toggleThumbActive]} />
                        </Pressable>
                    </View>

                    {/* Save Button */}
                    <Pressable
                        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <ActivityIndicator color="#FFF" size="small" />
                                <Text style={styles.saveButtonText}>Guardando...</Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons name="content-save" size={20} color="#FFF" />
                                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                            </>
                        )}
                    </Pressable>
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.m,
        gap: Spacing.m,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.l,
    },
    inputGroup: {
        marginBottom: Spacing.l,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: Spacing.s,
    },
    helpText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: Spacing.s,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: Spacing.m,
        color: '#FFF',
        fontSize: 16,
    },
    imagePreview: {
        marginTop: Spacing.m,
    },
    previewLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: Spacing.s,
    },
    previewImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    imagePickerButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 12,
        padding: Spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.s,
    },
    imagePickerText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    toggleSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: Spacing.m,
        borderRadius: 12,
        marginBottom: Spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.m,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 2,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    toggleButton: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    toggleButtonActive: {
        backgroundColor: Colors.primary,
        alignItems: 'flex-end',
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleThumbActive: {
        // Position handled by parent alignItems
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        padding: Spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.s,
        marginTop: Spacing.m,
        marginBottom: Spacing.xl * 2,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

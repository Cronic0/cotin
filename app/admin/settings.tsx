import { Spacing } from '@/constants/Theme';
import { Schedule, useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AdminSettingsScreen() {
    const { showRecommendations, showOffMenu, showTunaWeek, toggleRecommendations, toggleOffMenu, toggleTunaWeek, isAuthenticated, schedule, updateSchedule } = useAdmin();
    const router = useRouter();
    const [localSchedule, setLocalSchedule] = useState<Schedule>(schedule);
    const [hasChanges, setHasChanges] = useState(false);
    const [showScheduleEditor, setShowScheduleEditor] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/admin/login');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setLocalSchedule(schedule);
    }, [schedule]);

    if (!isAuthenticated) {
        return null;
    }

    const handleToggleRecommendations = async () => {
        console.log('Toggle Recommendations clicked, current value:', showRecommendations);
        await toggleRecommendations();
        console.log('Toggle completed, new value should be:', !showRecommendations);
    };

    const handleToggleOffMenu = async () => {
        console.log('Toggle Off Menu clicked, current value:', showOffMenu);
        await toggleOffMenu();
        console.log('Toggle completed, new value should be:', !showOffMenu);
    };

    const handleToggleBanner = async () => {
        console.log('Toggle Banner clicked, current value:', showTunaWeek);
        await toggleTunaWeek();
        console.log('Toggle completed, new value should be:', !showTunaWeek);
    };

    const toggleDayOpen = (day: string) => {
        setLocalSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], isOpen: !prev[day].isOpen }
        }));
        setHasChanges(true);
    };

    const updateDayTime = (day: string, field: 'openTime' | 'closeTime', value: string) => {
        setLocalSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
        setHasChanges(true);
    };

    const saveSchedule = async () => {
        try {
            await updateSchedule(localSchedule);
            setHasChanges(false);
            Alert.alert('Éxito', 'Horario actualizado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el horario');
        }
    };

    const resetSchedule = () => {
        setLocalSchedule(schedule);
        setHasChanges(false);
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
                                router.push('/admin/edit');
                            }
                        }}
                        style={styles.backButton}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Gestión Página de Inicio</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Secciones del Menú</Text>
                        <Text style={styles.sectionDescription}>
                            Activa o desactiva las secciones especiales en la página principal
                        </Text>

                        {/* Recommendations Toggle */}
                        <Pressable
                            style={styles.settingRow}
                            onPress={handleToggleRecommendations}
                        >
                            <MaterialCommunityIcons name="star" size={60} color="rgba(16, 185, 129, 0.05)" style={styles.watermarkIcon} />
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                                    <MaterialCommunityIcons
                                        name="star"
                                        size={24}
                                        color="#10b981"
                                    />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={styles.settingTitle}>Recomendaciones del Chef</Text>
                                    <Text style={styles.settingSubtitle}>
                                        {showRecommendations ? '✓ Visible en el menú' : '✕ Oculta'}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                style={[styles.toggleButton, showRecommendations && styles.toggleButtonActive]}
                                onPress={handleToggleRecommendations}
                            >
                                <View style={[styles.toggleThumb, showRecommendations && styles.toggleThumbActive]} />
                            </Pressable>
                        </Pressable>

                        {/* Off Menu Toggle */}
                        <Pressable
                            style={styles.settingRow}
                            onPress={handleToggleOffMenu}
                        >
                            <MaterialCommunityIcons name="silverware-variant" size={60} color="rgba(59, 130, 246, 0.05)" style={styles.watermarkIcon} />
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                                    <MaterialCommunityIcons
                                        name="silverware-variant"
                                        size={24}
                                        color="#3b82f6"
                                    />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={styles.settingTitle}>Fuera de Carta</Text>
                                    <Text style={styles.settingSubtitle}>
                                        {showOffMenu ? '✓ Visible en el menú' : '✕ Oculta'}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                style={[styles.toggleButton, showOffMenu && styles.toggleButtonActive]}
                                onPress={handleToggleOffMenu}
                            >
                                <View style={[styles.toggleThumb, showOffMenu && styles.toggleThumbActive]} />
                            </Pressable>
                        </Pressable>

                        {/* Banner Toggle */}
                        <Pressable
                            style={styles.settingRow}
                            onPress={handleToggleBanner}
                        >
                            <MaterialCommunityIcons name="image-area" size={60} color="rgba(245, 158, 11, 0.05)" style={styles.watermarkIcon} />
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                                    <MaterialCommunityIcons
                                        name="image-area"
                                        size={24}
                                        color="#f59e0b"
                                    />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={styles.settingTitle}>Banner</Text>
                                    <Text style={styles.settingSubtitle}>
                                        {showTunaWeek ? '✓ Visible en el menú' : '✕ Oculto'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.settingActions}>
                                <Pressable
                                    style={styles.editButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        router.push('/admin/banner');
                                    }}
                                >
                                    <MaterialCommunityIcons name="pencil" size={18} color="#f59e0b" />
                                </Pressable>
                                <Pressable
                                    style={[styles.toggleButton, showTunaWeek && styles.toggleButtonActive]}
                                    onPress={handleToggleBanner}
                                >
                                    <View style={[styles.toggleThumb, showTunaWeek && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>
                        </Pressable>
                    </View>

                    {/* Schedule Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Horario del Restaurante</Text>
                        <Text style={styles.sectionDescription}>
                            Configura los horarios de apertura y cierre para cada día
                        </Text>

                        {/* Collapsible Button */}
                        <Pressable
                            style={styles.scheduleHeaderButton}
                            onPress={() => setShowScheduleEditor(!showScheduleEditor)}
                        >
                            <View style={styles.scheduleHeaderContent}>
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }]}>
                                    <MaterialCommunityIcons
                                        name="clock-edit-outline"
                                        size={24}
                                        color="#8b5cf6"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.scheduleHeaderTitle}>Editar Horarios</Text>
                                    <Text style={styles.scheduleHeaderSubtitle}>
                                        {showScheduleEditor ? 'Ocultar editor' : 'Mostrar editor de horarios'}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={showScheduleEditor ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#8b5cf6"
                                />
                            </View>
                        </Pressable>

                        {showScheduleEditor && (
                            <View>
                                {Object.keys(localSchedule).map((dayKey) => {
                                    const day = localSchedule[dayKey];
                                    const dayNames: { [key: string]: string } = {
                                        monday: 'Lunes',
                                        tuesday: 'Martes',
                                        wednesday: 'Miércoles',
                                        thursday: 'Jueves',
                                        friday: 'Viernes',
                                        saturday: 'Sábado',
                                        sunday: 'Domingo'
                                    };

                                    return (
                                        <View key={dayKey} style={styles.scheduleRow}>
                                            <MaterialCommunityIcons name="calendar" size={60} color="rgba(139, 92, 246, 0.05)" style={styles.watermarkIcon} />

                                            <View style={styles.scheduleInfo}>
                                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }]}>
                                                    <MaterialCommunityIcons
                                                        name="clock-outline"
                                                        size={24}
                                                        color="#8b5cf6"
                                                    />
                                                </View>
                                                <View style={styles.scheduleText}>
                                                    <Text style={styles.scheduleDay}>{dayNames[dayKey]}</Text>
                                                    {day.isOpen ? (
                                                        <View style={styles.timeInputs}>
                                                            <TextInput
                                                                style={styles.timeInput}
                                                                value={day.openTime}
                                                                onChangeText={(value) => updateDayTime(dayKey, 'openTime', value)}
                                                                placeholder="13:00"
                                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                            />
                                                            <Text style={styles.timeSeparator}>-</Text>
                                                            <TextInput
                                                                style={styles.timeInput}
                                                                value={day.closeTime}
                                                                onChangeText={(value) => updateDayTime(dayKey, 'closeTime', value)}
                                                                placeholder="23:30"
                                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                            />
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.closedText}>Cerrado</Text>
                                                    )}
                                                </View>
                                            </View>

                                            <Pressable
                                                style={[styles.toggleButton, day.isOpen && styles.toggleButtonActive]}
                                                onPress={() => toggleDayOpen(dayKey)}
                                            >
                                                <View style={[styles.toggleThumb, day.isOpen && styles.toggleThumbActive]} />
                                            </Pressable>
                                        </View>
                                    );
                                })}

                                {hasChanges && (
                                    <View style={styles.scheduleActions}>
                                        <Pressable style={styles.resetButton} onPress={resetSchedule}>
                                            <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
                                            <Text style={styles.resetButtonText}>Cancelar</Text>
                                        </Pressable>
                                        <Pressable style={styles.saveButton} onPress={saveSchedule}>
                                            <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                                            <Text style={styles.saveButtonText}>Guardar Horario</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.l,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.s,
        letterSpacing: 0.5,
    },
    sectionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: Spacing.m,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        transform: [{ rotate: '-15deg' }],
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.m,
        zIndex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    toggleButton: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    toggleButtonActive: {
        backgroundColor: '#10b981',
        alignItems: 'flex-end',
        borderColor: '#10b981',
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
        // No extra styles needed, position handled by parent alignItems
    },
    settingActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        zIndex: 1,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    // Schedule Styles
    scheduleHeaderButton: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    scheduleHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
    },
    scheduleHeaderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    scheduleHeaderSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    scheduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    },
    scheduleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.m,
        zIndex: 1,
    },
    scheduleText: {
        flex: 1,
    },
    scheduleDay: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    timeInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timeInput: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        minWidth: 60,
        textAlign: 'center',
    },
    timeSeparator: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closedText: {
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '600',
    },
    scheduleActions: {
        flexDirection: 'row',
        gap: Spacing.m,
        marginTop: Spacing.l,
    },
    resetButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    resetButtonText: {
        color: '#EF4444',
        fontWeight: 'bold',
        fontSize: 14,
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#8b5cf6',
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

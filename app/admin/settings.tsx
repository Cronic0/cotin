import { Spacing } from '@/constants/Theme';
import { Schedule, useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';

export default function AdminSettingsScreen() {
    const {
        showRecommendations, toggleRecommendations,
        showOffMenu, toggleOffMenu,
        showTunaWeek, toggleTunaWeek,
        showEvent, toggleEvent,
        showAllergens, toggleAllergens,
        sectionOrder, reorderSections,
        isAuthenticated, schedule, updateSchedule
    } = useAdmin();
    const router = useRouter();
    const [localSchedule, setLocalSchedule] = useState<Schedule>(schedule);
    const [hasChanges, setHasChanges] = useState(false);

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
        await toggleRecommendations();
    };

    const handleToggleOffMenu = async () => {
        await toggleOffMenu();
    };

    const handleToggleBanner = async () => {
        await toggleTunaWeek();
    };

    const handleToggleEvent = async () => {
        await toggleEvent();
    };

    const handleToggleAllergens = async () => {
        await toggleAllergens();
    };

    const renderItem = ({ item: sectionId, drag, isActive }: RenderItemParams<string>) => {
        let config = {
            title: '',
            subtitle: '',
            icon: '',
            color: '',
            isVisible: false,
            onToggle: async () => { },
            hasEdit: false,
            editPath: ''
        };

        switch (sectionId) {
            case 'recommendations':
                config = {
                    title: 'Recomendaciones del Chef',
                    subtitle: showRecommendations ? '✓ Visible en el menú' : '✕ Oculta',
                    icon: 'star',
                    color: '#10b981',
                    isVisible: showRecommendations,
                    onToggle: handleToggleRecommendations,
                    hasEdit: false,
                    editPath: ''
                };
                break;
            case 'offmenu':
                config = {
                    title: 'Fuera de Carta',
                    subtitle: showOffMenu ? '✓ Visible en el menú' : '✕ Oculta',
                    icon: 'silverware-variant',
                    color: '#3b82f6',
                    isVisible: showOffMenu,
                    onToggle: handleToggleOffMenu,
                    hasEdit: false,
                    editPath: ''
                };
                break;
            case 'banner':
                config = {
                    title: 'Banner',
                    subtitle: showTunaWeek ? '✓ Visible en el menú' : '✕ Oculto',
                    icon: 'image-area',
                    color: '#f59e0b',
                    isVisible: showTunaWeek,
                    onToggle: handleToggleBanner,
                    hasEdit: true,
                    editPath: '/admin/banner'
                };
                break;
            case 'event':
                config = {
                    title: 'Evento Especial',
                    subtitle: showEvent ? '✓ Visible en el menú' : '✕ Oculto',
                    icon: 'calendar-star',
                    color: '#ec4899',
                    isVisible: showEvent,
                    onToggle: handleToggleEvent,
                    hasEdit: true,
                    editPath: '/admin/event'
                };
                break;
            case 'allergens':
                config = {
                    title: 'Filtro de Alérgenos',
                    subtitle: showAllergens ? '✓ Visible en el menú' : '✕ Oculto',
                    icon: 'alert-circle-outline',
                    color: '#8b5cf6',
                    isVisible: showAllergens,
                    onToggle: handleToggleAllergens,
                    hasEdit: false,
                    editPath: ''
                };
                break;
            default:
                return null;
        }

        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.settingRow,
                        isActive && { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#FFF' }
                    ]}
                >
                    <MaterialCommunityIcons name={config.icon as any} size={60} color={`${config.color}10`} style={styles.watermarkIcon} />

                    {/* Drag Handle */}
                    <View style={styles.dragHandle}>
                        <MaterialCommunityIcons name="drag" size={24} color="rgba(255,255,255,0.5)" />
                    </View>

                    <View style={styles.settingInfo}>
                        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20`, borderColor: `${config.color}50` }]}>
                            <MaterialCommunityIcons
                                name={config.icon as any}
                                size={24}
                                color={config.color}
                            />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>{config.title}</Text>
                            <Text style={styles.settingSubtitle}>{config.subtitle}</Text>
                        </View>
                    </View>

                    <View style={styles.settingActions}>
                        {config.hasEdit && (
                            <Pressable
                                style={[styles.editButton, { backgroundColor: `${config.color}20`, borderColor: `${config.color}50` }]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    router.push(config.editPath as any);
                                }}
                            >
                                <MaterialCommunityIcons name="pencil" size={18} color={config.color} />
                            </Pressable>
                        )}
                        <Pressable
                            style={[styles.toggleButton, config.isVisible && { backgroundColor: config.color, borderColor: config.color }]}
                            onPress={config.onToggle}
                        >
                            <View style={[styles.toggleThumb, config.isVisible && styles.toggleThumbActive]} />
                        </Pressable>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
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

                <DraggableFlatList
                    data={sectionOrder}
                    onDragEnd={({ data }) => reorderSections(data)}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                    contentContainerStyle={styles.content}
                    ListHeaderComponent={
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Secciones del Menú</Text>
                            <Text style={styles.sectionDescription}>
                                Mantén pulsado y arrastra para reordenar las secciones.
                            </Text>
                        </View>
                    }
                    ListFooterComponent={null}
                />
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
        paddingHorizontal: Spacing.l,
        paddingBottom: 40,
    },
    section: {
        marginBottom: Spacing.m,
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
    dragHandle: {
        marginRight: Spacing.m,
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

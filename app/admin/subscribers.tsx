import { Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SubscribersScreen() {
    const { subscribers } = useAdmin();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Suscriptores</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.statsCard}>
                        <MaterialCommunityIcons name="account-group" size={100} color="rgba(16, 185, 129, 0.05)" style={styles.watermarkIcon} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{subscribers.length}</Text>
                            <Text style={styles.statLabel}>TOTAL SUSCRIPTORES</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Lista de Emails</Text>

                    {subscribers.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="email-off-outline" size={48} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyText}>No hay suscriptores todavía</Text>
                        </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {subscribers.map((sub, index) => (
                                <View key={index} style={styles.subscriberCard}>
                                    <View style={styles.iconBox}>
                                        <MaterialCommunityIcons name="email" size={20} color="#3b82f6" />
                                    </View>
                                    <View style={styles.subscriberInfo}>
                                        <Text style={styles.emailText}>{sub.email}</Text>
                                        <Text style={styles.dateText}>
                                            {new Date(sub.date).toLocaleDateString()} - {new Date(sub.date).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
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
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.m,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
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
        padding: Spacing.l,
    },
    statsCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.l,
        borderRadius: 20,
        marginBottom: Spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        position: 'relative',
        overflow: 'hidden',
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        transform: [{ rotate: '-15deg' }],
    },
    statItem: {
        alignItems: 'center',
        zIndex: 1,
    },
    statValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: Spacing.m,
        marginLeft: Spacing.s,
        letterSpacing: 0.5,
    },
    listContainer: {
        gap: Spacing.m,
    },
    subscriberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    subscriberInfo: {
        flex: 1,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        marginTop: Spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    emptyText: {
        marginTop: Spacing.m,
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        fontStyle: 'italic',
    },
});

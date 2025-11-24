import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { useFavorites } from '@/context/FavoritesContext';
import { MENU_ITEMS } from '@/data/menuData';
import { LightColors as Colors, Spacing, Typography } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';

export default function FavoritesScreen() {
    const { favorites, removeFavorite } = useFavorites();
    const router = useRouter();
    const { t } = useLanguage();

    const favoriteItems = MENU_ITEMS.filter(item => favorites.includes(item.id));

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Link href={`/menu/${item.id}`} asChild>
                <Pressable style={styles.cardContent}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.info}>
                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
                    </View>
                </Pressable>
            </Link>
            <Pressable
                style={styles.removeButton}
                onPress={() => removeFavorite(item.id)}
            >
                <MaterialCommunityIcons name="heart-broken" size={20} color={Colors.error} />
            </Pressable>
        </View>
    );

    if (favoriteItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="heart-outline" size={64} color={Colors.textSecondary} style={{ opacity: 0.5 }} />
                <Text style={styles.emptyTitle}>{t('emptyFavorites')}</Text>
                <Text style={styles.emptySubtitle}>{t('emptyFavoritesSub')}</Text>
                <Pressable style={styles.exploreButton} onPress={() => router.back()}>
                    <Text style={styles.exploreButtonText}>{t('exploreMenu')}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: Spacing.m,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        marginBottom: Spacing.m,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        paddingRight: Spacing.m,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
    },
    info: {
        flex: 1,
        padding: Spacing.m,
    },
    title: {
        ...Typography.h3,
        fontSize: 16,
        marginBottom: 4,
        color: Colors.text,
    },
    price: {
        ...Typography.price,
        fontSize: 16,
        color: Colors.primary,
    },
    removeButton: {
        padding: Spacing.s,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: Spacing.xl,
    },
    emptyTitle: {
        ...Typography.h2,
        marginTop: Spacing.l,
        marginBottom: Spacing.s,
        color: Colors.text,
    },
    emptySubtitle: {
        ...Typography.body,
        textAlign: 'center',
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
    },
    exploreButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    exploreButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

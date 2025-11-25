import { ModernProductCard } from '@/components/ModernProductCard';
import { Colors, LightColors, Spacing, Typography } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/data/menuData';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Modal, Pressable, FlatList as RNFlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

const RecommendationCard = ({ item, index = 0 }: { item: any, index?: number }) => {
    const { t } = useLanguage();
    return (
        <Link href={`/menu/${item.id}` as any} asChild>
            <Pressable>
                <Animated.View
                    entering={FadeInRight.delay(index * 100).springify()}
                    style={styles.recommendationCard}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={[
                            styles.recommendationImage,
                            item.available === false && styles.imageUnavailable
                        ]}
                    />
                    {/* Unavailable Overlay */}
                    {item.available === false && (
                        <View style={styles.unavailableOverlay} />
                    )}
                    {item.isNew && (
                        <LinearGradient
                            colors={[Colors.secondary, Colors.secondaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.newBadge}
                        >
                            <Text style={styles.newBadgeText}>NUEVO</Text>
                        </LinearGradient>
                    )}
                    {item.available === false && (
                        <View style={styles.unavailableBadge}>
                            <Text style={styles.unavailableBadgeText}>No disponible</Text>
                        </View>
                    )}
                    {item.isOffMenu && (
                        <LinearGradient
                            colors={[Colors.primary, Colors.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.offMenuBadge}
                        >
                            <Text style={styles.offMenuBadgeText}>Fuera de Carta</Text>
                        </LinearGradient>
                    )}
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.recommendationPrice}>{item.price.toFixed(2)}€</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Link>
    );
};

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { addSubscriber } = useAdmin();
    const { t } = useLanguage();

    const handleSubscribe = () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Por favor introduce un email válido');
            return;
        }
        if (!accepted) {
            Alert.alert('Error', 'Debes aceptar las condiciones');
            return;
        }

        addSubscriber(email);
        setIsSubmitted(true);
        setEmail('');
        setAccepted(false);

        // Reset after 5 seconds so they can see the form again if needed
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <View style={styles.newsletterContainer}>
            <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.newsletterGradient}
            >
                {isSubmitted ? (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconCircle}>
                            <MaterialCommunityIcons name="check" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.successTitle}>¡Gracias por suscribirte!</Text>
                        <Text style={styles.successSubtitle}>
                            Te hemos añadido a nuestra lista. Pronto recibirás noticias nuestras.
                        </Text>
                    </View>
                ) : (
                    <>
                        <MaterialCommunityIcons name="email-newsletter" size={40} color={Colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={styles.newsletterTitle}>¡Únete a nuestra comunidad!</Text>
                        <Text style={styles.newsletterSubtitle}>
                            Recibe nuestras novedades, eventos especiales y promociones exclusivas directamente en tu email.
                        </Text>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Tu correo electrónico"
                                placeholderTextColor={Colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <Pressable style={styles.checkboxContainer} onPress={() => setAccepted(!accepted)}>
                            <MaterialCommunityIcons
                                name={accepted ? "checkbox-marked" : "checkbox-blank-outline"}
                                size={24}
                                color={accepted ? Colors.primary : Colors.textSecondary}
                            />
                            <Text style={styles.checkboxText}>
                                He leído y acepto la política de privacidad y condiciones de uso.
                            </Text>
                        </Pressable>

                        <Pressable style={styles.subscribeButton} onPress={handleSubscribe}>
                            <Text style={styles.subscribeButtonText}>Suscribirme</Text>
                        </Pressable>
                    </>
                )}
            </LinearGradient>
        </View>
    );
};

const ScheduleModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const { t } = useLanguage();
    const { schedule } = useAdmin();

    const jsDayToKey = [
        'sunday',    // 0
        'monday',    // 1
        'tuesday',   // 2
        'wednesday', // 3
        'thursday',  // 4
        'friday',    // 5
        'saturday'   // 6
    ];

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
                    <View style={styles.modalHeader}>
                        <MaterialCommunityIcons name="clock-outline" size={28} color={Colors.primary} />
                        <Text style={styles.modalTitle}>{t('scheduleTitle')}</Text>
                    </View>

                    <View style={styles.scheduleList}>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((dayKey) => {
                            const daySchedule = schedule[dayKey];
                            const hours = daySchedule?.isOpen
                                ? `${daySchedule.openTime} - ${daySchedule.closeTime}`
                                : t('closed');

                            // Check if it is today
                            const currentJsDay = new Date().getDay();
                            const todayKey = jsDayToKey[currentJsDay];
                            const isToday = dayKey === todayKey;
                            const isClosed = !daySchedule?.isOpen;

                            return (
                                <View key={dayKey} style={[styles.scheduleRow, isToday && styles.scheduleRowToday]}>
                                    <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                                        {t(dayKey as any)}
                                    </Text>
                                    <Text style={[styles.hoursText, isToday && styles.hoursTextToday, isClosed && styles.closedText]}>
                                        {hours}
                                    </Text>
                                    {isToday && (
                                        <View style={styles.todayBadge}>
                                            <Text style={styles.todayBadgeText}>{t('today')}</Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>{t('back')}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const StoryView = () => {
    const { t } = useLanguage();
    const { products, showRecommendations, showOffMenu, showTunaWeek, showBannerCarousel, bannerConfig, showEvent, eventConfig, schedule, sectionOrder, showAllergens } = useAdmin();
    const bannerItems = products.filter(item => item.isBanner);
    const recommendations = products.filter(item => item.isRecommendation);
    const offMenuItems = products.filter(item => item.isOffMenu);
    const [showSchedule, setShowSchedule] = useState(false);

    const getTodayHours = () => {
        const day = new Date().getDay(); // 0=Sun, 1=Mon...
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = days[day];

        const todaySchedule = schedule[dayKey];
        if (!todaySchedule || !todaySchedule.isOpen) {
            return `${t('today')}: ${t('closed')}`;
        }
        return `${t('today')}: ${todaySchedule.openTime} - ${todaySchedule.closeTime}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.storyContainer} showsVerticalScrollIndicator={false}>
            <ImageBackground
                source={require('@/assets/images/hero_restaurant.png')}
                style={styles.heroContainer}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.heroGradient}
                >
                    <View style={styles.heroContent}>
                        <MaterialCommunityIcons name="clover" size={64} color="#FFF" style={styles.heroIcon} />
                        <Text style={styles.heroTitle}>{t('storyHeroTitle')}</Text>
                        <Text style={styles.heroSubtitle}>{t('storyHeroSubtitle')}</Text>
                    </View>
                </LinearGradient>
            </ImageBackground>

            <View style={styles.storySheet}>
                <View style={[styles.sectionContainer, { marginTop: Spacing.l }]}>
                    <Text style={styles.storyText}>
                        {t('storyText')}
                    </Text>
                </View>

                {/* Dynamic Sections */}
                {sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                        case 'banner':
                            return showTunaWeek && bannerItems.length > 0 ? (
                                <View key={sectionId} style={styles.sectionContainer}>
                                    <Link href={bannerConfig.linkPath as any} asChild>
                                        <Pressable>
                                            <ImageBackground
                                                source={{ uri: bannerConfig.imageUrl }}
                                                style={styles.tunaBanner}
                                                imageStyle={{ borderRadius: 16 }}
                                            >
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                                    style={styles.tunaBannerOverlay}
                                                >
                                                    <Text style={styles.tunaBannerTitle}>{bannerConfig.title}</Text>
                                                    <Text style={styles.tunaBannerSubtitle}>{bannerConfig.subtitle}</Text>
                                                </LinearGradient>
                                            </ImageBackground>
                                        </Pressable>
                                    </Link>

                                    {/* Banner Carousel */}
                                    {showBannerCarousel && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={[styles.recommendationsList, { marginTop: Spacing.m }]}
                                            snapToInterval={220}
                                            decelerationRate="fast"
                                        >
                                            {bannerItems.map((item) => (
                                                <RecommendationCard key={item.id} item={item} />
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            ) : null;

                        case 'event':
                            return showEvent ? (
                                <View key={sectionId} style={styles.sectionContainer}>
                                    <Link href={eventConfig.linkPath as any || '/menu'} asChild>
                                        <Pressable>
                                            <ImageBackground
                                                source={{ uri: eventConfig.imageUrl }}
                                                style={styles.tunaBanner}
                                                imageStyle={{ borderRadius: 16 }}
                                            >
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                                    style={styles.tunaBannerOverlay}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                        <MaterialCommunityIcons name="calendar-star" size={20} color={Colors.secondary} />
                                                        <Text style={[styles.tunaBannerSubtitle, { color: Colors.secondary, fontWeight: 'bold' }]}>
                                                            {eventConfig.date}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.tunaBannerTitle}>{eventConfig.title}</Text>
                                                    <Text style={styles.tunaBannerSubtitle}>{eventConfig.subtitle}</Text>
                                                </LinearGradient>
                                            </ImageBackground>
                                        </Pressable>
                                    </Link>
                                </View>
                            ) : null;

                        case 'allergens':
                            return showAllergens ? (
                                <View key={sectionId} style={styles.sectionContainer}>
                                    <Text style={styles.allergenInfoText}>
                                        {t('allergenInfoText')}
                                    </Text>
                                    <Link href="/allergens" asChild>
                                        <Pressable style={styles.allergenBanner}>
                                            <View style={styles.allergenBannerContent}>
                                                <MaterialCommunityIcons name="shield-check-outline" size={24} color={Colors.primary} />
                                                <View style={{ marginLeft: 12 }}>
                                                    <Text style={styles.allergenBannerTitle}>{t('allergenFilterTitle')}</Text>
                                                    <Text style={styles.allergenBannerSubtitle}>{t('allergenFilterSub')}</Text>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textSecondary} />
                                        </Pressable>
                                    </Link>
                                </View>
                            ) : null;

                        case 'recommendations':
                            return showRecommendations && recommendations.length > 0 ? (
                                <View key={sectionId} style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>{t('chefRecommendations')}</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.recommendationsList}
                                        snapToInterval={220}
                                        decelerationRate="fast"
                                        pagingEnabled={false}
                                    >
                                        {recommendations.map((item) => (
                                            <RecommendationCard key={item.id} item={item} />
                                        ))}
                                    </ScrollView>
                                </View>
                            ) : null;

                        case 'offmenu':
                            return showOffMenu && offMenuItems.length > 0 ? (
                                <View key={sectionId} style={styles.sectionContainer}>
                                    <Text style={styles.sectionTitle}>Fuera de Carta</Text>
                                    <Text style={styles.offMenuIntro}>
                                        Platos especiales que no encontrarás en nuestra carta habitual. Creaciones únicas del chef disponibles por tiempo limitado.
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.recommendationsList}
                                        snapToInterval={220}
                                        decelerationRate="fast"
                                        pagingEnabled={false}
                                    >
                                        {offMenuItems.map((item) => (
                                            <RecommendationCard key={item.id} item={item} />
                                        ))}
                                    </ScrollView>
                                </View>
                            ) : null;

                        default:
                            return null;
                    }
                })}

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>{t('infoTitle')}</Text>

                    <View style={styles.widgetsGrid}>
                        {/* Map Widget */}
                        <View style={styles.mapWidget}>
                            <Image
                                source={require('@/assets/images/location_map.png')}
                                style={styles.mapImage}
                            />
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapContent}>
                                    <MaterialCommunityIcons name="map-marker" size={24} color={Colors.primary} />
                                    <Text style={styles.mapAddress}>{t('location')}</Text>
                                </View>
                                <Pressable
                                    style={styles.mapButton}
                                    onPress={() => {
                                        const query = encodeURIComponent("Puesto Cruz Roja, Playa de la Barrosa, Chiclana de la Frontera");
                                        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
                                        import('react-native').then(({ Linking }) => Linking.openURL(url));
                                    }}
                                >
                                    <Text style={styles.mapButtonText}>{t('navigate' as any)}</Text>
                                    <MaterialCommunityIcons name="arrow-right" size={16} color="#FFF" />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.rowWidgets}>
                            {/* Hours Widget */}
                            <Pressable style={styles.infoWidget} onPress={() => setShowSchedule(true)}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons name="clock-outline" size={24} color={Colors.primary} />
                                </View>
                                <View style={{ alignItems: 'center', gap: 4 }}>
                                    <Text style={styles.widgetLabel}>{t('scheduleTitle')}</Text>
                                    <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: '600' }}>
                                        {getTodayHours()}
                                    </Text>
                                </View>
                            </Pressable>

                            {/* Contact Widget */}
                            <Pressable style={styles.infoWidget}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons name="phone" size={24} color={Colors.primary} />
                                </View>
                                <View style={{ alignItems: 'center', gap: 4 }}>
                                    <Text style={styles.widgetLabel}>{t('reservations')}</Text>
                                    <Text style={{ fontSize: 11, color: Colors.textSecondary, fontWeight: '500' }}>
                                        info@eltrebol.com
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <NewsletterSection />

                <View style={styles.signatureContainer}>
                    <Text style={styles.signature}>{t('familySignature')}</Text>
                </View>

                <View style={styles.footerContainer}>
                    <Link href="/gastrocode" asChild>
                        <Pressable>
                            <Text style={styles.footerText}>App creada por GastroCode</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
            <ScheduleModal visible={showSchedule} onClose={() => setShowSchedule(false)} />
        </ScrollView >
    );
};

// Helper function to get category background image
const getCategoryImage = (categoryId: string): string => {
    const categoryImages: { [key: string]: string } = {
        'entrantes': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
        'principales': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop',
        'postres': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000&auto=format&fit=crop',
        'vinos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop',
        'bebidas': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop',
        'semana-atun': 'https://images.unsplash.com/photo-1611250188496-e966043a0629?q=80&w=1000&auto=format&fit=crop',
    };
    return categoryImages[categoryId] || categoryImages['principales'];
};

export default function MenuScreen() {
    const [activeCategory, setActiveCategory] = useState('el-trebol');
    const navigation = useNavigation();
    const { t, language } = useLanguage();
    const { products, isLoading } = useAdmin();
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        navigation.setOptions({ title: t('menuTitle') });
    }, [t, navigation]);

    // Auto-scroll to active category
    useEffect(() => {
        const index = CATEGORIES.findIndex((cat) => cat.id === activeCategory);
        if (index !== -1 && scrollViewRef.current) {
            // Scroll to position: each tab is ~80px wide
            scrollViewRef.current.scrollTo({ x: index * 80, animated: true });
        }
    }, [activeCategory]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 16, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' }}>
                    Cargando carta...
                </Text>
            </View>
        );
    }

    const filteredItems = products.filter(
        (item) => item.category === activeCategory
    );

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <ModernProductCard item={item} index={index} />
    );

    return (
        <View style={styles.container}>
            {activeCategory === 'el-trebol' ? (
                <StoryView key={language} />
            ) : (
                <>
                    {/* Immersive Category Hero (Fixed Background) */}
                    <View style={styles.immersiveHeader}>
                        <ImageBackground
                            source={{ uri: getCategoryImage(activeCategory) }}
                            style={styles.immersiveHeroImage}
                            resizeMode="cover"
                        >
                            <LinearGradient
                                colors={['rgba(0,0,0,0.3)', 'rgba(15, 23, 42, 0.8)']}
                                style={styles.immersiveGradient}
                            />
                            <View style={styles.immersiveTitleContainer}>
                                <Text style={styles.immersiveTitle}>
                                    {CATEGORIES.find(cat => cat.id === activeCategory)?.title}
                                </Text>
                                <Text style={styles.immersiveSubtitle}>
                                    Explora nuestra selección
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* Sheet Container (Scrollable) */}
                    <View style={styles.sheetContainer}>
                        <RNFlatList
                            key={activeCategory}
                            data={filteredItems}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </>
            )}

            {/* Floating Category Selector */}
            <View style={styles.floatingSelectorContainer}>
                <View style={styles.floatingSelectorGlass}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.floatingSelectorContent}
                    >
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;

                            return (
                                <Pressable
                                    key={cat.id}
                                    style={[
                                        styles.pill,
                                        isActive && styles.pillActive
                                    ]}
                                    onPress={() => setActiveCategory(cat.id)}
                                >
                                    <Text style={[
                                        styles.pillText,
                                        isActive && styles.pillTextActive
                                    ]}>
                                        {cat.title}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightColors.background,
    },
    listContent: {
        padding: Spacing.m,
        paddingBottom: 100, // Space for bottom bar
    },
    minimalCard: {
        backgroundColor: LightColors.surface,
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.s,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    minimalCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.m,
    },
    textContainer: {
        flex: 1,
        paddingRight: Spacing.s,
    },
    minimalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: LightColors.text,
        marginBottom: 4,
    },
    // Category Hero Styles
    categoryHero: {
        width: '100%',
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    categoryTitleBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    categoryHeroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        letterSpacing: 1,
    },
    minimalDescription: {
        fontSize: 14,
        color: LightColors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
    },
    minimalPrice: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
    minimalImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: LightColors.background,
    },
    imageUnavailable: {
        opacity: 0.4,
    },
    unavailableOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 8,
    },
    unavailableText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    separator: {
        height: 1,
        backgroundColor: LightColors.border,
        opacity: 0.5,
        marginHorizontal: Spacing.s,
    },
    // Recommendation Card Styles
    recommendationCard: {
        width: 200,
        backgroundColor: LightColors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: Spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: LightColors.border,
    },
    recommendationImage: {
        width: '100%',
        height: 120,
    },
    recommendationContent: {
        padding: Spacing.m,
    },
    recommendationTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: LightColors.text,
        fontSize: 14,
    },
    recommendationPrice: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    // Story View Styles
    storyContainer: {
        paddingBottom: 0,
    },
    storySheet: {
        backgroundColor: LightColors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -40,
        paddingBottom: 100,
        overflow: 'hidden',
    },
    heroContainer: {
        height: 300,
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'center',
        padding: Spacing.l,
    },
    heroContent: {
        alignItems: 'center',
    },
    heroIcon: {
        marginBottom: Spacing.s,
    },
    heroTitle: {
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        fontSize: 42,
        fontWeight: 'bold',
    },
    heroSubtitle: {
        color: Colors.secondary,
        fontWeight: '400',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 18,
    },
    sectionContainer: {
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.xl,
    },
    storyText: {
        color: LightColors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontSize: 14,
    },
    sectionTitle: {
        color: LightColors.text,
        marginBottom: Spacing.m,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
    },
    recommendationsList: {
        paddingRight: Spacing.l,
        gap: Spacing.m,
    },
    // Allergen Banner
    allergenBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        padding: Spacing.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    allergenBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    allergenBannerTitle: {
        fontWeight: 'bold',
        color: Colors.primary,
        fontSize: 14,
    },
    allergenBannerSubtitle: {
        fontSize: 12,
        color: LightColors.textSecondary,
    },
    allergenInfoText: {
        color: LightColors.textSecondary,
        marginTop: Spacing.m,
        marginBottom: Spacing.m,
        textAlign: 'center',
        paddingHorizontal: Spacing.s,
        fontStyle: 'italic',
        fontSize: 14,
    },
    offMenuIntro: {
        color: LightColors.textSecondary,
        marginBottom: Spacing.m,
        textAlign: 'center',
        paddingHorizontal: Spacing.s,
        fontStyle: 'italic',
        lineHeight: 22,
        fontSize: 14,
    },
    // Tuna Banner
    tunaBanner: {
        width: '100%',
        height: 160,
        marginBottom: Spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 16,
    },
    tunaBannerOverlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: Spacing.m,
    },
    tunaBannerTitle: {
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        fontSize: 24,
    },
    tunaBannerSubtitle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: 1,
        fontSize: 14,
    },
    // Info Section
    infoContainer: {
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.xl,
    },
    infoTitle: {
        color: LightColors.text,
        marginBottom: Spacing.m,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
    },
    widgetsGrid: {
        gap: Spacing.m,
    },
    mapWidget: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: LightColors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: Spacing.m,
        justifyContent: 'space-between',
    },
    mapContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mapAddress: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    mapButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
    },
    mapButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rowWidgets: {
        flexDirection: 'row',
        gap: Spacing.m,
    },
    infoWidget: {
        flex: 1,
        backgroundColor: LightColors.surface,
        padding: Spacing.m,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        gap: 8,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    widgetLabel: {
        fontSize: 13,
        color: LightColors.textSecondary,
        textAlign: 'center',
    },

    signatureContainer: {
        alignItems: 'center',
        marginTop: Spacing.m,
        marginBottom: Spacing.xl,
    },
    signature: {
        fontFamily: 'serif',
        fontSize: 24,
        color: Colors.primary,
        fontStyle: 'italic',
    },
    // Bottom Dock Styles
    bottomDockContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: Spacing.m,
    },
    dockGlass: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 32,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    dockContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dockTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        gap: 8,
    },
    dockTabActive: {
        backgroundColor: Colors.primary,
    },
    dockTabSpecial: {
        paddingHorizontal: 8,
    },
    dockIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dockIconContainerActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dockIconContainerSpecial: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    // New Badge Styles
    newBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    newBadgeMinimal: {
        position: 'absolute',
        top: -6,
        left: -6,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        zIndex: 10,
    },
    newBadgeTextMinimal: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    dockLabel: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl * 3,
        opacity: 0.6,
    },
    footerText: {
        color: LightColors.textSecondary,
        fontSize: 12,
        letterSpacing: 1,
    },
    // Newsletter Styles
    newsletterContainer: {
        marginHorizontal: Spacing.l,
        marginBottom: Spacing.xl,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    newsletterGradient: {
        padding: Spacing.l,
        alignItems: 'center',
    },
    newsletterTitle: {
        color: Colors.primary,
        marginBottom: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    newsletterSubtitle: {
        color: LightColors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.l,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LightColors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.m,
        marginBottom: Spacing.m,
        width: '100%',
        height: 50,
    },
    inputIcon: {
        marginRight: Spacing.s,
    },
    input: {
        flex: 1,
        height: '100%',
        color: LightColors.text,
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.l,
        width: '100%',
    },
    checkboxText: {
        color: LightColors.textSecondary,
        marginLeft: Spacing.s,
        flex: 1,
        fontSize: 12,
    },
    subscribeButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    subscribeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Success State Styles
    successContainer: {
        alignItems: 'center',
        padding: Spacing.m,
        width: '100%',
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.m,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    successTitle: {
        color: Colors.primary,
        marginBottom: 8,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    successSubtitle: {
        color: LightColors.textSecondary,
        textAlign: 'center',
        fontSize: 16,
    },
    // Badge Styles
    offMenuBadge: {
        position: 'absolute',
        top: 85,
        left: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        zIndex: 10,
    },
    offMenuBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    offMenuBadgeMinimal: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 10,
    },
    offMenuBadgeTextMinimal: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    // Unavailable Styles
    unavailableBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        zIndex: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    unavailableBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    unavailableBadgeMinimal: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 10,
    },
    unavailableBadgeTextMinimal: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Schedule Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.l,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: Spacing.l,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.s,
        marginBottom: Spacing.l,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    scheduleList: {
        gap: Spacing.m,
        marginBottom: Spacing.l,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
    },
    scheduleRowToday: {
        backgroundColor: '#ECFDF5', // Light emerald background
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: 12,
        marginHorizontal: -Spacing.m,
    },
    dayName: {
        fontSize: 16,
        color: Colors.primary,
        textTransform: 'capitalize',
        fontWeight: '500',
    },
    dayNameToday: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    hoursText: {
        fontSize: 16,
        color: Colors.primary,
        opacity: 0.8,
    },
    hoursTextToday: {
        fontWeight: 'bold',
        color: Colors.primary,
        opacity: 1,
    },
    closedText: {
        color: '#EF4444',
    },
    todayBadge: {
        position: 'absolute',
        left: -60,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    todayBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#F0FDF4',
        paddingVertical: Spacing.m,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    closeButtonText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    // Immersive Header
    immersiveHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220, // Reduced from 320
        zIndex: 0,
    },
    immersiveHeroImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    immersiveGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    immersiveTitleContainer: {
        padding: Spacing.l,
        paddingBottom: 50, // Adjusted for shorter header
        alignItems: 'center',
    },
    immersiveTitle: {
        ...Typography.h1,
        color: '#FFFFFF',
        fontSize: 36, // Slightly smaller font for shorter header
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    immersiveSubtitle: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 4,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    // Sheet Container
    sheetContainer: {
        flex: 1,
        marginTop: 180, // Overlap with header (220 - 40)
        backgroundColor: LightColors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        zIndex: 1,
    },

    // Floating Category Selector
    floatingSelectorContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    floatingSelectorGlass: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderRadius: 40,
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        maxWidth: '95%',
    },
    floatingSelectorContent: {
        paddingHorizontal: 4,
    },
    pill: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginHorizontal: 4,
    },
    pillActive: {
        backgroundColor: Colors.primary,
    },
    pillText: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        fontSize: 14,
    },
    pillTextActive: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

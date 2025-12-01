import { Colors, Spacing } from '@/constants/Theme';
import { useAdmin } from '@/context/AdminContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const ALLERGEN_LIST = [
    { key: 'Gluten', label: 'Gluten', icon: 'barley' },
    { key: 'Lácteos', label: 'Lácteos', icon: 'cheese' },
    { key: 'Huevos', label: 'Huevos', icon: 'egg' },
    { key: 'Pescado', label: 'Pescado', icon: 'fish' },
    { key: 'Moluscos', label: 'Moluscos', icon: 'jellyfish' },
    { key: 'Soja', label: 'Soja', icon: 'soy-sauce' },
    { key: 'Frutos secos', label: 'Frutos secos', icon: 'peanut' },
    { key: 'Sulfitos', label: 'Sulfitos', icon: 'bottle-wine' },
    { key: 'Mostaza', label: 'Mostaza', icon: 'food-variant' },
    { key: 'Sésamo', label: 'Sésamo', icon: 'seed' },
];

const CATEGORIES = [
    { id: 'entrantes', label: 'Entrantes', icon: 'food-variant' },
    { id: 'principales', label: 'Principales', icon: 'silverware-fork-knife' },
    { id: 'postres', label: 'Postres', icon: 'cupcake' },
    { id: 'bebidas', label: 'Bebidas', icon: 'cup' },
    { id: 'vinos', label: 'Vinos', icon: 'glass-wine' },
];

export default function ProductCreateEditScreen() {
    const { id } = useLocalSearchParams();
    const productId = Array.isArray(id) ? id[0] : id;
    const { isAuthenticated, products, updateProduct, createProduct, deleteProduct, isLoading } = useAdmin();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const isEditMode = !!productId && productId !== 'new';
    const existingProduct = products.find(p => p.id === productId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('principales');
    const [allergens, setAllergens] = useState<string[]>([]);
    const [pairing, setPairing] = useState('');
    const [pairingDescription, setPairingDescription] = useState('');
    const [showPairing, setShowPairing] = useState(false);
    const [available, setAvailable] = useState(true);
    const [isRecommendation, setIsRecommendation] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isOffMenu, setIsOffMenu] = useState(false);
    const [isBanner, setIsBanner] = useState(false);
    const [isOffer, setIsOffer] = useState(false);
    const [offerText, setOfferText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingProduct) {
            setTitle(existingProduct.title);
            setDescription(existingProduct.description);
            setPrice(existingProduct.price.toString());
            setImage(existingProduct.image);
            setCategory(existingProduct.category);
            setAllergens(existingProduct.allergens || []);
            setPairing(existingProduct.pairing || '');
            setPairingDescription(existingProduct.pairingDescription || '');
            setAvailable(existingProduct.available !== false);
            setIsRecommendation(existingProduct.isRecommendation || false);
            setIsNew(existingProduct.isNew || false);
            setIsOffMenu(existingProduct.isOffMenu || false);
            setIsBanner(existingProduct.isBanner || false);
            setIsOffer(existingProduct.isOffer || false);
            setOfferText(existingProduct.offerText || '');
        }
    }, [existingProduct]);

    const wines = products.filter(p => p.category === 'vinos');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isLoading && !isAuthenticated) {
            const timer = setTimeout(() => {
                router.replace('/admin/login');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isMounted, isLoading, isAuthenticated]);

    if (!isMounted || isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5, // Reduced quality to avoid Firestore 1MB limit
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            // Check approximate size (Base64 length * 0.75 = bytes)
            const sizeInBytes = result.assets[0].base64.length * 0.75;
            if (sizeInBytes > 1000000) {
                Alert.alert('Error', 'La imagen es demasiado grande. Por favor elige una más pequeña.');
                return;
            }
            setImage(base64Image);
        }
    };

    const toggleAllergen = (allergen: string) => {
        setAllergens(prev =>
            prev.includes(allergen)
                ? prev.filter(a => a !== allergen)
                : [...prev, allergen]
        );
    };

    const handleSave = async () => {
        console.log('=== handleSave called ===');

        // All validations BEFORE setting isSaving
        if (!title.trim()) {
            window.alert('Error: El nombre es obligatorio');
            return;
        }

        // Handle comma in price
        const normalizedPrice = price.replace(',', '.');
        const priceNum = parseFloat(normalizedPrice);

        if (isNaN(priceNum) || priceNum < 0) {
            window.alert('Error: El precio debe ser un número válido');
            return;
        }

        if (!image) {
            window.alert('Error: La imagen es obligatoria');
            return;
        }

        // Now that all validations passed, set saving state
        console.log('=== Setting isSaving to TRUE ===');
        setIsSaving(true);

        const productData = {
            title: title.trim(),
            description: description.trim(),
            price: priceNum,
            image,
            category,
            allergens,
            pairing,
            pairingDescription,
            available,
            isRecommendation,
            isNew,
            isOffMenu,
            isBanner,
            isOffer,
            offerText,
        };

        console.log('Product Data to save:', productData);

        try {
            if (isEditMode) {
                console.log('Updating existing product...', existingProduct?.id);
                if (!existingProduct) {
                    console.log('=== ERROR: No existing product, setting isSaving to FALSE ===');
                    setIsSaving(false);
                    window.alert('Error: No se encontró el producto original. Intenta recargar.');
                    return;
                }
                console.log('=== Calling updateProduct ===');
                await updateProduct(existingProduct.id, productData);
                console.log('=== Update successful, setting isSaving to FALSE ===');
                setIsSaving(false);
                window.alert('✅ Producto actualizado correctamente');
                // Navigate back after user dismisses alert
                setTimeout(() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/admin/products');
                    }
                }, 100);
            } else {
                console.log('Creating new product...');
                console.log('=== Calling createProduct ===');
                await createProduct(productData);
                console.log('=== Creation successful, setting isSaving to FALSE ===');
                setIsSaving(false);
                window.alert('✅ Producto creado correctamente');
                // Navigate back after user dismisses alert
                setTimeout(() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/admin/products');
                    }
                }, 100);
            }
        } catch (error: any) {
            console.error('=== ERROR in handleSave, setting isSaving to FALSE ===', error);
            setIsSaving(false);
            const errorMessage = error?.message || JSON.stringify(error);
            window.alert(`Error: Hubo un problema al guardar: ${errorMessage}`);
        }
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
            if (typeof productId === 'string') {
                deleteProduct(productId);
                router.back();
            }
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
                    <View style={styles.headerTop}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                        </Pressable>
                    </View>
                    <Text style={styles.headerTitle}>
                        {isEditMode ? 'Editar Producto' : 'Crear Producto'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {isEditMode ? 'Modifica los detalles del plato' : 'Añade un nuevo plato a la carta'}
                    </Text>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={120} color="rgba(255,255,255,0.03)" style={styles.watermarkIcon} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.form}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Imagen *</Text>
                            <Pressable style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <>
                                        <Image
                                            source={{ uri: image }}
                                            style={[
                                                styles.imagePreview,
                                                available === false && styles.imagePreviewUnavailable
                                            ]}
                                        />
                                        {available === false && (
                                            <View style={styles.unavailableImageBadge}>
                                                <Text style={styles.unavailableImageBadgeText}>No disponible</Text>
                                            </View>
                                        )}
                                        <View style={styles.editImageOverlay}>
                                            <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
                                            <Text style={styles.editImageText}>Cambiar</Text>
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <MaterialCommunityIcons name="camera-plus" size={48} color={Colors.primary} />
                                        <Text style={styles.imagePlaceholderText}>Tocar para seleccionar</Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Nombre *</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Nombre del plato"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Descripción del plato"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Categoría</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.map(cat => {
                                    const isSelected = category === cat.id;
                                    return (
                                        <Pressable
                                            key={cat.id}
                                            style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                                            onPress={() => setCategory(cat.id)}
                                        >
                                            <MaterialCommunityIcons
                                                name={cat.icon as any}
                                                size={20}
                                                color={isSelected ? '#FFF' : Colors.primary}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                                                {cat.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Precio (€) *</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                placeholder="0.00"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Alérgenos</Text>
                            <View style={styles.allergensGrid}>
                                {ALLERGEN_LIST.map(allergen => {
                                    const isSelected = allergens.includes(allergen.key);
                                    return (
                                        <Pressable
                                            key={allergen.key}
                                            style={[styles.allergenChip, isSelected && styles.allergenChipSelected]}
                                            onPress={() => toggleAllergen(allergen.key)}
                                        >
                                            <MaterialCommunityIcons
                                                name={allergen.icon as any}
                                                size={20}
                                                color={isSelected ? '#FFF' : Colors.primary}
                                            />
                                            <Text style={[styles.allergenText, isSelected && styles.allergenTextSelected]}>
                                                {allergen.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Pressable
                                style={[styles.pairingButton, showPairing && styles.pairingButtonActive]}
                                onPress={() => setShowPairing(!showPairing)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="glass-wine" size={24} color={Colors.primary} />
                                    <Text style={styles.pairingButtonText}>Maridaje</Text>
                                </View>
                                <MaterialCommunityIcons
                                    name={showPairing ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#FFF"
                                />
                            </Pressable>

                            {showPairing && (
                                <View style={styles.pairingContainer}>
                                    <Text style={styles.label}>Seleccionar Vino</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.wineScroll}>
                                        {wines.map(wine => (
                                            <Pressable
                                                key={wine.id}
                                                style={[
                                                    styles.wineChip,
                                                    pairing === wine.id && styles.wineChipActive
                                                ]}
                                                onPress={() => setPairing(pairing === wine.id ? '' : wine.id)}
                                            >
                                                <Image source={{ uri: wine.image }} style={styles.wineImage} />
                                                <View style={styles.wineInfo}>
                                                    <Text style={[
                                                        styles.wineName,
                                                        pairing === wine.id && styles.wineNameActive
                                                    ]} numberOfLines={2}>
                                                        {wine.title}
                                                    </Text>
                                                    <Text style={styles.winePrice}>{wine.price.toFixed(2)}€</Text>
                                                </View>
                                                {pairing === wine.id && (
                                                    <View style={styles.checkIcon}>
                                                        <MaterialCommunityIcons name="check-circle" size={20} color={Colors.primary} />
                                                    </View>
                                                )}
                                            </Pressable>
                                        ))}
                                    </ScrollView>

                                    <Text style={[styles.label, { marginTop: Spacing.m }]}>Descripción del Maridaje</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={pairingDescription}
                                        onChangeText={setPairingDescription}
                                        placeholder="Describe por qué este vino marida bien con el plato..."
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.field}>
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Recomendación de la Casa</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {isRecommendation ? 'Producto destacado en la sección de recomendaciones' : 'Producto estándar'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, isRecommendation && styles.toggleButtonActive]}
                                    onPress={() => setIsRecommendation(!isRecommendation)}
                                >
                                    <View style={[styles.toggleThumb, isRecommendation && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {/* Novedad Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Novedad</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {isNew ? 'Producto marcado como novedad' : 'Sin etiqueta de novedad'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, isNew && styles.toggleButtonActive]}
                                    onPress={() => setIsNew(!isNew)}
                                >
                                    <View style={[styles.toggleThumb, isNew && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {/* Fuera de Carta Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Fuera de Carta</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {isOffMenu ? 'Producto mostrado en sección especial' : 'Producto estándar'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, isOffMenu && styles.toggleButtonActive]}
                                    onPress={() => setIsOffMenu(!isOffMenu)}
                                >
                                    <View style={[styles.toggleThumb, isOffMenu && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {/* Banner Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Mostrar en Banner</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {isBanner ? 'Aparece en el carrusel del banner principal' : 'No aparece en banner'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, isBanner && styles.toggleButtonActive]}
                                    onPress={() => setIsBanner(!isBanner)}
                                >
                                    <View style={[styles.toggleThumb, isBanner && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {/* Disponibilidad Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Disponibilidad</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {available ? 'Producto visible en el menú' : 'Producto oculto con etiqueta'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, available && styles.toggleButtonActive]}
                                    onPress={() => setAvailable(!available)}
                                >
                                    <View style={[styles.toggleThumb, available && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {/* Offer Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Oferta Especial</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {isOffer ? 'Producto marcado con etiqueta de oferta' : 'Sin etiqueta de oferta'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, isOffer && styles.toggleButtonActive]}
                                    onPress={() => setIsOffer(!isOffer)}
                                >
                                    <View style={[styles.toggleThumb, isOffer && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>

                            {isOffer && (
                                <View style={styles.field}>
                                    <Text style={styles.label}>Texto de la Oferta</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={offerText}
                                        onChangeText={setOfferText}
                                        placeholder="Ej: 50%, 2x1, -20%"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                    />
                                </View>
                            )}

                            {/* Disponibilidad Toggle */}
                            <View style={styles.availabilityRow}>
                                <View style={styles.availabilityInfo}>
                                    <Text style={styles.label}>Disponibilidad</Text>
                                    <Text style={styles.availabilityDescription}>
                                        {available ? 'Producto visible en el menú' : 'Producto oculto con etiqueta'}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.toggleButton, available && styles.toggleButtonActive]}
                                    onPress={() => setAvailable(!available)}
                                >
                                    <View style={[styles.toggleThumb, available && styles.toggleThumbActive]} />
                                </Pressable>
                            </View>
                        </View>

                        <Pressable
                            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <MaterialCommunityIcons name="content-save" size={20} color="#FFF" />
                            )}
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Producto')}
                            </Text>
                        </Pressable>

                        {isEditMode && (
                            <Pressable style={styles.deleteButton} onPress={handleDelete}>
                                <MaterialCommunityIcons name="trash-can" size={20} color="#FFF" />
                                <Text style={styles.deleteButtonText}>Eliminar Producto</Text>
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.footerSpacer} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.l,
        paddingTop: 60,
        paddingBottom: Spacing.l,
        position: 'relative',
        overflow: 'hidden',
    },
    headerTop: {
        marginBottom: Spacing.m,
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.8,
    },
    watermarkIcon: {
        position: 'absolute',
        right: -20,
        top: 40,
        transform: [{ rotate: '-15deg' }],
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.l,
    },
    form: {
        gap: Spacing.l,
    },
    field: {
        gap: Spacing.s,
    },
    label: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 16,
        padding: Spacing.m,
        color: '#FFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    imagePicker: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 220,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: Spacing.s,
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.s,
        gap: 8,
    },
    editImageText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.s,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryChipText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
    categoryChipTextActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    allergensGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.s,
    },
    allergenChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    allergenChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    allergenText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    },
    allergenTextSelected: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.l,
        borderRadius: 16,
        gap: 8,
        marginTop: Spacing.l,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerSpacer: {
        height: 40,
    },
    pairingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'space-between',
    },
    pairingButtonActive: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderColor: Colors.primary,
    },
    pairingButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: Spacing.m,
    },
    pairingContainer: {
        marginTop: Spacing.s,
        gap: Spacing.s,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    wineScroll: {
        flexGrow: 0,
        marginBottom: Spacing.s,
    },
    wineChip: {
        width: 140,
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: 12,
        marginRight: Spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    wineChipActive: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
    },
    wineImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    wineInfo: {
        padding: Spacing.s,
    },
    wineName: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
        height: 32,
    },
    wineNameActive: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    winePrice: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFF',
        borderRadius: 10,
    },
    availabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        padding: Spacing.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: Spacing.s,
    },
    availabilityInfo: {
        flex: 1,
    },
    availabilityDescription: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 4,
    },
    toggleButton: {
        width: 52,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 2,
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: Colors.primary,
    },
    toggleThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFF',
        alignSelf: 'flex-start',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
    imagePreviewUnavailable: {
        opacity: 0.4,
    },
    unavailableImageBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    unavailableImageBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.l,
        borderRadius: 16,
        gap: 8,
        marginTop: Spacing.s,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
});

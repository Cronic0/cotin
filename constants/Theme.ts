import { Platform, TextStyle } from 'react-native';

export const Colors = {
    // Andalusian Palette
    background: '#FFFFFF', // White washed walls
    surface: '#FDFBF7', // Warm off-white
    primary: '#007A33', // Andalusian Green
    primaryDark: '#005522',
    secondary: '#F7B500', // Albero Yellow
    secondaryDark: '#C49000',
    accent: '#AC162C', // Almagra Red
    text: '#2D1A13', // Dark Wood for text
    textSecondary: '#5D4037',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    overlay: 'rgba(0, 51, 0, 0.6)', // Dark green overlay
};

export const LightColors = {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#007A33',
    primaryDark: '#005522',
    secondary: '#F7B500',
    secondaryDark: '#C49000',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#DC2626',
    success: '#059669',
    cardShadow: 'rgba(148, 163, 184, 0.1)',
    overlay: 'rgba(255, 255, 255, 0.9)',
};

export const Spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const Shadows = {
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    large: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
};

interface TypographyStyles {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    price: TextStyle;
    button: TextStyle;
}

const fontPrimary = Platform.select({ ios: 'System', android: 'Roboto', web: 'Inter, sans-serif' });
const fontDisplay = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Playfair Display, serif' }); // Elegant Serif for headers

export const Typography: TypographyStyles = {
    h1: {
        fontFamily: fontDisplay,
        fontSize: 48, // Increased size for impact
        fontWeight: '700',
        letterSpacing: -0.5,
        color: Colors.text,
    },
    h2: {
        fontFamily: fontDisplay,
        fontSize: 32,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: Colors.text,
    },
    h3: {
        fontFamily: fontDisplay,
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 0.25,
        color: Colors.text,
    },
    body: {
        fontFamily: fontPrimary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        color: Colors.textSecondary,
    },
    caption: {
        fontFamily: fontPrimary,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.5,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    price: {
        fontFamily: fontDisplay, // Serif for prices looks premium
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: Colors.primary,
    },
    button: {
        fontFamily: fontPrimary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
};

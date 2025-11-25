import { Platform, TextStyle } from 'react-native';

export const Colors = {
    background: '#0F172A', // Deep Navy/Slate (Night mode)
    surface: '#1E293B', // Lighter Slate
    primary: '#2DD4BF', // Teal/Turquoise (Vibrant)
    primaryDark: '#0F766E',
    secondary: '#FBBF24', // Warm Gold
    secondaryDark: '#B45309',
    text: '#F8FAFC', // Off-white
    textSecondary: '#94A3B8', // Muted Blue-Grey
    border: 'rgba(255,255,255,0.1)',
    error: '#EF4444',
    success: '#10B981',
    overlay: 'rgba(15, 23, 42, 0.8)',
};

export const LightColors = {
    background: '#F8FAFC', // Very light slate
    surface: '#FFFFFF',
    primary: '#0D9488', // Teal (Darker for light mode contrast)
    primaryDark: '#115E59',
    secondary: '#D97706', // Amber/Gold
    secondaryDark: '#92400E',
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
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
const fontDisplay = Platform.select({ ios: 'Georgia', android: 'serif', web: 'Playfair Display, serif' }); // More elegant for headers

export const Typography: TypographyStyles = {
    h1: {
        fontFamily: fontDisplay,
        fontSize: 42,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    h2: {
        fontFamily: fontPrimary,
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    h3: {
        fontFamily: fontPrimary,
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.25,
    },
    body: {
        fontFamily: fontPrimary,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    caption: {
        fontFamily: fontPrimary,
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    price: {
        fontFamily: fontPrimary,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    button: {
        fontFamily: fontPrimary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1.25,
        textTransform: 'uppercase',
    },
};

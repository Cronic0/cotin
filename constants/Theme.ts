import { TextStyle } from 'react-native';

export const Colors = {
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Slightly lighter for cards
    primary: '#10B981', // Emerald Green
    secondary: '#FFD700', // Gold
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#333333',
    error: '#CF6679',
};

export const LightColors = {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#10B981', // Keep brand color
    secondary: '#D4AF37', // Slightly darker gold for white bg
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E5E5E5',
    error: '#DC2626',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
};

export const Spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
};

interface TypographyStyles {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    price: TextStyle;
}

export const Typography: TypographyStyles = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 24,
        fontWeight: '600',
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
    },
    caption: {
        fontSize: 14,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
};

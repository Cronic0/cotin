import { Colors, LightColors } from '@/constants/Theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface GastroCodeLogoProps {
    variant?: 'light' | 'dark';
    size?: number;
    style?: ViewStyle;
}

export const GastroCodeLogo = ({ variant = 'light', size = 32, style }: GastroCodeLogoProps) => {
    const textColor = variant === 'light' ? '#FFFFFF' : LightColors.text;
    const codeColor = Colors.primary; // Turquoise

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, { fontSize: size, color: textColor }]}>
                GASTRO
                <Text style={{ color: codeColor, fontWeight: '900' }}>CODE</Text>
            </Text>
            <View style={[styles.dot, { backgroundColor: codeColor, width: size / 4, height: size / 4 }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    text: {
        fontWeight: '300',
        letterSpacing: 1,
        fontFamily: 'System', // Use system font for now, or custom if available
    },
    dot: {
        borderRadius: 50,
        marginLeft: 4,
    }
});

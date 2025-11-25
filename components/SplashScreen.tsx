import { Colors, LightColors } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const progress = useSharedValue(0);
    const opacity = useSharedValue(1);
    const [displayPercentage, setDisplayPercentage] = useState(0);

    useEffect(() => {
        // Update display percentage
        // Target: 100% in 1400ms
        // 1400ms / 20 steps = 70ms per step
        // 100% / 20 steps = 5% per step
        const interval = setInterval(() => {
            setDisplayPercentage((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return Math.min(prev + 5, 100);
            });
        }, 70);

        // Animate progress from 0 to 100
        progress.value = withTiming(100, {
            duration: 1400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        // After loading completes, wait a bit then fade out
        const timer = setTimeout(() => {
            opacity.value = withTiming(0, {
                duration: 400
            }, (finished) => {
                if (finished) {
                    runOnJS(onFinish)();
                }
            });
        }, 1600);

        // Failsafe: Ensure onFinish is called even if animation callback fails
        const failsafeTimer = setTimeout(() => {
            runOnJS(onFinish)();
        }, 2400);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
            clearTimeout(failsafeTimer);
        };
    }, []);

    const fillStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const textStyle = useAnimatedStyle(() => {
        return {
            opacity: Math.min(progress.value / 30, 1),
        };
    });

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <View style={styles.content}>
                {/* Logo Container with Fill Effect */}
                <View style={styles.logoContainer}>
                    {/* Background Logo (Light Gray) */}
                    <MaterialCommunityIcons
                        name="clover"
                        size={140}
                        color="rgba(16, 185, 129, 0.15)"
                        style={styles.logoBackground}
                    />

                    {/* Filled Logo (Green) with mask */}
                    <View style={styles.logoFillContainer}>
                        <Animated.View style={[styles.logoFill, fillStyle]}>
                            <MaterialCommunityIcons
                                name="clover"
                                size={140}
                                color={Colors.primary}
                            />
                        </Animated.View>
                    </View>
                </View>

                {/* Restaurant Name */}
                <Animated.View style={textStyle}>
                    <Text style={styles.restaurantName}>El Trébol</Text>
                    <Text style={styles.slogan}>Sabores que conquistan</Text>
                </Animated.View>

                {/* Loading Text */}
                <Animated.View style={textStyle}>
                    <Text style={styles.loadingText}>Cargando</Text>
                    <Text style={styles.percentage}>{displayPercentage}%</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 32,
    },
    logoContainer: {
        width: 140,
        height: 140,
        position: 'relative',
        marginBottom: 8,
    },
    logoBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    logoFillContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 140,
        height: 140,
        overflow: 'hidden',
    },
    logoFill: {
        height: '100%',
        overflow: 'hidden',
        alignItems: 'flex-start',
    },
    restaurantName: {
        fontSize: 32,
        color: LightColors.text,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
    },
    slogan: {
        fontSize: 16,
        color: LightColors.textSecondary,
        fontWeight: '400',
        letterSpacing: 1,
        textAlign: 'center',
        marginTop: 4,
        fontStyle: 'italic',
    },
    loadingText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        letterSpacing: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
        marginTop: 16,
    },
    percentage: {
        fontSize: 28,
        color: Colors.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 6,
    },
});

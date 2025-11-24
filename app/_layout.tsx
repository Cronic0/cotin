import { HeaderRight } from '@/components/HeaderRight';
import CustomSplashScreen from '@/components/SplashScreen';
import { LightColors } from '@/constants/Theme';
import { AdminProvider } from '@/context/AdminContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Load icon fonts explicitly
    MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <AdminProvider>
        <AnalyticsProvider>
          <FavoritesProvider>
            <View style={{ flex: 1, backgroundColor: LightColors.background }}>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: LightColors.background,
                  },
                  headerTintColor: LightColors.text,
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  contentStyle: {
                    backgroundColor: LightColors.background,
                  },
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="menu/index"
                  options={{
                    title: '',
                    headerBackTitle: 'Volver',
                    headerRight: () => <HeaderRight />
                  }}
                />
                <Stack.Screen
                  name="allergens"
                />
                <Stack.Screen
                  name="favorites"
                  options={{
                    presentation: 'modal',
                    title: 'Mis Favoritos',
                    headerLeft: () => (
                      <Pressable
                        onPress={() => router.navigate('/')}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 8, marginLeft: -8 })}
                      >
                        <MaterialCommunityIcons name="close" size={24} color={LightColors.text} />
                      </Pressable>
                    )
                  }}
                />
              </Stack>

              {/* Custom Splash Screen with Progressive Logo Fill */}
              {showCustomSplash && (
                <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />
              )}
            </View>
          </FavoritesProvider>
        </AnalyticsProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}

import { Language, Translations } from '@/constants/Translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof Translations.es) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('es');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved language on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('app_language');
                // Solo cargar si existe Y es válido, sino mantener español
                if (savedLanguage && ['es', 'en', 'fr', 'de'].includes(savedLanguage)) {
                    setLanguageState(savedLanguage as Language);
                } else {
                    // Asegurar que empiece en español  
                    await AsyncStorage.setItem('app_language', 'es');
                }
            } catch (error) {
                console.warn('Failed to load language:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadLanguage();
    }, []);

    // Save language when it changes
    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem('app_language', lang);
            setLanguageState(lang);
        } catch (error) {
            console.warn('Failed to save language:', error);
            setLanguageState(lang); // Still update state even if save fails
        }
    };

    const t = (key: keyof typeof Translations.es) => {
        const langTranslations = Translations[language] as typeof Translations.es;
        return langTranslations[key] ?? Translations['es'][key] ?? key;
    };

    if (isLoading) {
        return null; // or a loading screen
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

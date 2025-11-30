import { Language } from '@/constants/Translations';
import { Product } from '@/context/AdminContext';

/**
 * Returns the translated title and description for a product based on the current language
 * Falls back to original Spanish content if translation is not available
 */
export function getTranslatedProduct(product: Product, language: Language): { title: string; description: string } {
    // If language is Spanish or no translations exist, return original
    if (language === 'es' || !product.translations) {
        return {
            title: product.title,
            description: product.description
        };
    }

    // Get translation for the current language
    const translation = product.translations[language];

    if (translation) {
        return {
            title: translation.title || product.title,
            description: translation.description || product.description
        };
    }

    // Fallback to original Spanish if translation doesn't exist
    return {
        title: product.title,
        description: product.description
    };
}

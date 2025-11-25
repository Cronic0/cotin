/**
 * Utilidad de traducción automática usando LibreTranslate API
 * API gratuita sin necesidad de API key
 */

const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

export type SupportedLanguage = 'en' | 'fr' | 'de';

interface TranslationResponse {
    translatedText: string;
}

/**
 * Traduce un texto del español a otro idioma
 * @param text - Texto en español a traducir
 * @param targetLang - Idioma destino ('en', 'fr', 'de')
 * @returns Texto traducido
 */
export async function translateText(
    text: string,
    targetLang: SupportedLanguage
): Promise<string> {
    try {
        const response = await fetch(LIBRETRANSLATE_API, {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'es',
                target: targetLang,
                format: 'text',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data: TranslationResponse = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        // Retornar el texto original si falla la traducción
        return text;
    }
}

/**
 * Traduce un producto completo (título y descripción)
 * @param product - Producto con título y descripción en español
 * @param targetLang - Idioma destino
 * @returns Producto traducido
 */
export async function translateProduct(
    product: { title: string; description: string },
    targetLang: SupportedLanguage
): Promise<{ title: string; description: string }> {
    try {
        // Traducir título y descripción en paralelo
        const [translatedTitle, translatedDescription] = await Promise.all([
            translateText(product.title, targetLang),
            translateText(product.description, targetLang),
        ]);

        return {
            title: translatedTitle,
            description: translatedDescription,
        };
    } catch (error) {
        console.error(`Error translating product to ${targetLang}:`, error);
        // Retornar el producto original si falla
        return product;
    }
}

/**
 * Traduce un producto a todos los idiomas soportados
 * @param product - Producto en español
 * @returns Objeto con todas las traducciones
 */
export async function translateToAllLanguages(
    product: { title: string; description: string }
): Promise<{
    en: { title: string; description: string };
    fr: { title: string; description: string };
    de: { title: string; description: string };
}> {
    const [en, fr, de] = await Promise.all([
        translateProduct(product, 'en'),
        translateProduct(product, 'fr'),
        translateProduct(product, 'de'),
    ]);

    return { en, fr, de };
}

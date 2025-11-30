/**
 * Utilidad de traducción automática usando LibreTranslate API
 * API gratuita sin necesidad de API key
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export type SupportedLanguage = 'en' | 'fr' | 'de';

export async function translateText(
    text: string,
    targetLang: SupportedLanguage
): Promise<string> {
    try {
        const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`;
        console.log(`Translating "${text.substring(0, 20)}..." to ${targetLang} via ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            console.error(`MyMemory Error: ${data.responseDetails}`);
            throw new Error(data.responseDetails || 'Translation error');
        }

        return data.responseData.translatedText;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
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

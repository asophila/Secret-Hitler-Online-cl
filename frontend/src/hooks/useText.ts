import translations from '../translations/es.json';

/**
 * Hook for accessing translated text strings.
 * Usage: const { t } = useText();
 * Example: t('voting.header') => "VOTACIÓN"
 * Example with params: t('investigation.resultText', { target: 'Alice', party: 'Liberal' })
 */
export function useText() {
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key; // fallback to key if not found
      }
    }

    // Replace {placeholders} with provided params
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  };

  /**
   * Get array of translations (useful for alt text arrays)
   */
  const tArray = (key: string): string[] => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return [];
      }
    }

    return Array.isArray(value) ? value : [value];
  };

  return { t, tArray };
}

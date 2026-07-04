const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  es: () => import('../../dictionaries/es.json').then((module) => module.default),
};

export type Locale = 'es' | 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale === 'es' || locale === 'en';

export const getDictionary = async (locale: Locale) => {
  if (locale === 'en') {
    return dictionaries.en();
  }
  return dictionaries.es();
};

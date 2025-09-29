export const locales = ['en', 'fr', 'es', 'ar'];
export const defaultLocale = 'en';

export const localeLabels = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ar: 'العربية'
};

export const localeFlagMap = {
  en: 'gb',
  fr: 'fr',
  es: 'es',
  ar: 'ma'
};

export const rtlLocales = new Set(['ar']);

export function isRtlLocale(locale) {
  return rtlLocales.has(locale);
}


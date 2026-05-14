export const locales = ["en", "fr", "es", "ar"];
export const defaultLocale = "en";

export const localeLabels = {
  en: "English",
  fr: "French",
  es: "Spanish",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
};

export const localeFlagMap = {
  en: "gb",
  fr: "fr",
  es: "es",
  ar: "ma",
};

export const rtlLocales = new Set(["ar"]);

export function normalizeLocale(locale) {
  if (!locale || typeof locale !== "string") {
    return defaultLocale;
  }
  const normalized = locale.toLowerCase();
  const [base] = normalized.split(/[-_]/);
  return base || defaultLocale;
}

export function isRtlLocale(locale) {
  return rtlLocales.has(normalizeLocale(locale));
}

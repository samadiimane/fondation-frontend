import {defaultLocale, locales} from "@/i18n/config";
import {Locale} from "@/types/i18n";

import arCommon from "./ar/common.json";
import enCommon from "./en/common.json";
import esCommon from "./es/common.json";
import frCommon from "./fr/common.json";

import arFoundationIntro from "./ar/foundation-intro.json";
import enFoundationIntro from "./en/foundation-intro.json";
import esFoundationIntro from "./es/foundation-intro.json";
import frFoundationIntro from "./fr/foundation-intro.json";

import arServices from "./ar/services.json";
import enServices from "./en/services.json";
import esServices from "./es/services.json";
import frServices from "./fr/services.json";

import arCounter from "./ar/counter.json";
import enCounter from "./en/counter.json";
import esCounter from "./es/counter.json";
import frCounter from "./fr/counter.json";

const COMMON: Record<Locale, Record<string, unknown>> = {
  ar: arCommon,
  en: enCommon,
  es: esCommon,
  fr: frCommon
};

const FOUNDATION_INTRO: Record<Locale, Record<string, unknown>> = {
  ar: arFoundationIntro,
  en: enFoundationIntro,
  es: esFoundationIntro,
  fr: frFoundationIntro
};

const SERVICES: Record<Locale, Record<string, unknown>> = {
  ar: arServices,
  en: enServices,
  es: esServices,
  fr: frServices
};

const COUNTER: Record<Locale, Record<string, unknown>> = {
  ar: arCounter,
  en: enCounter,
  es: esCounter,
  fr: frCounter
};

const localeSet = new Set(locales as Locale[]);

export function getMessagesForLocale(localeInput: string) {
  const resolvedLocale: Locale = localeSet.has(localeInput as Locale)
    ? (localeInput as Locale)
    : (defaultLocale as Locale);
  return {
    ...COMMON[resolvedLocale],
    "foundation-intro": FOUNDATION_INTRO[resolvedLocale],
    services: SERVICES[resolvedLocale],
    counter: COUNTER[resolvedLocale]
  };
}

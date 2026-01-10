import {defaultLocale, locales} from "@/i18n/config";
import {Locale} from "@/types/i18n";

const localeSet = new Set(locales as Locale[]);
const shouldCache = process.env.NODE_ENV === "production";
const messagesCache = new Map<Locale, Record<string, unknown>>();

const wrapKey =
  (key: string) =>
  (module: {default: Record<string, unknown>}) => ({
    [key]: module.default,
  });

const LOCALE_LOADERS: Record<Locale, () => Promise<Array<Record<string, unknown>>>> = {
  ar: () =>
    Promise.all([
      import("./ar/common.json").then((module) => module.default),
      import("./ar/admin.json").then((module) => module.default),
      import("./ar/auth.json").then((module) => module.default),
      import("./ar/library.json").then((module) => module.default),
      import("./ar/library-research-themes.json").then((module) => module.default),
      import("./ar/library-historical-sites.json").then((module) => module.default),
      import("./ar/events.json").then((module) => module.default),
      import("./ar/support.json").then((module) => module.default),
      import("./ar/shared.json").then((module) => module.default),
      import("./ar/services.json").then(wrapKey("services")),
      import("./ar/foundation-intro.json").then(wrapKey("foundation-intro")),
      import("./ar/counter.json").then(wrapKey("counter")),
    ]),
  en: () =>
    Promise.all([
      import("./en/common.json").then((module) => module.default),
      import("./en/admin.json").then((module) => module.default),
      import("./en/auth.json").then((module) => module.default),
      import("./en/library.json").then((module) => module.default),
      import("./en/library-research-themes.json").then((module) => module.default),
      import("./en/library-historical-sites.json").then((module) => module.default),
      import("./en/events.json").then((module) => module.default),
      import("./en/support.json").then((module) => module.default),
      import("./en/shared.json").then((module) => module.default),
      import("./en/services.json").then(wrapKey("services")),
      import("./en/foundation-intro.json").then(wrapKey("foundation-intro")),
      import("./en/counter.json").then(wrapKey("counter")),
    ]),
  es: () =>
    Promise.all([
      import("./es/common.json").then((module) => module.default),
      import("./es/admin.json").then((module) => module.default),
      import("./es/auth.json").then((module) => module.default),
      import("./es/library.json").then((module) => module.default),
      import("./es/library-research-themes.json").then((module) => module.default),
      import("./es/library-historical-sites.json").then((module) => module.default),
      import("./es/events.json").then((module) => module.default),
      import("./es/support.json").then((module) => module.default),
      import("./es/shared.json").then((module) => module.default),
      import("./es/services.json").then(wrapKey("services")),
      import("./es/foundation-intro.json").then(wrapKey("foundation-intro")),
      import("./es/counter.json").then(wrapKey("counter")),
    ]),
  fr: () =>
    Promise.all([
      import("./fr/common.json").then((module) => module.default),
      import("./fr/admin.json").then((module) => module.default),
      import("./fr/auth.json").then((module) => module.default),
      import("./fr/library.json").then((module) => module.default),
      import("./fr/library-research-themes.json").then((module) => module.default),
      import("./fr/library-historical-sites.json").then((module) => module.default),
      import("./fr/events.json").then((module) => module.default),
      import("./fr/support.json").then((module) => module.default),
      import("./fr/shared.json").then((module) => module.default),
      import("./fr/services.json").then(wrapKey("services")),
      import("./fr/foundation-intro.json").then(wrapKey("foundation-intro")),
      import("./fr/counter.json").then(wrapKey("counter")),
    ]),
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const mergeDeep = (target: Record<string, unknown>, source: Record<string, unknown>) => {
  const output = {...target};
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(output[key])) {
      output[key] = mergeDeep(output[key] as Record<string, unknown>, value);
    } else {
      output[key] = value;
    }
  }
  return output;
};

export async function getMessagesForLocale(localeInput: string) {
  const resolvedLocale: Locale = localeSet.has(localeInput as Locale)
    ? (localeInput as Locale)
    : (defaultLocale as Locale);
  if (shouldCache) {
    const cached = messagesCache.get(resolvedLocale);
    if (cached) return cached;
  }
  const loader = LOCALE_LOADERS[resolvedLocale] ?? LOCALE_LOADERS[defaultLocale as Locale];
  const parts = await loader();
  const merged = parts.reduce((acc, part) => mergeDeep(acc, part), {});
  if (shouldCache) {
    messagesCache.set(resolvedLocale, merged);
  }
  return merged;
}

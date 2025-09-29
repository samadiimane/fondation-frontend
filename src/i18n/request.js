import {notFound} from "next/navigation";
import {getRequestConfig} from "next-intl/server";
import {defaultLocale, locales} from "./config";

export default getRequestConfig(async ({locale, requestLocale}) => {
  const segmentLocale = await requestLocale;
  const resolvedLocale = locales.includes(locale ?? segmentLocale)
    ? (locale ?? segmentLocale)
    : defaultLocale;

  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});


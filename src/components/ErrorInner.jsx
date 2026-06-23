"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

import {getNotFoundCopy} from "@/content/notFoundCopy";
import {defaultLocale, isRtlLocale, locales, normalizeLocale} from "@/i18n/config";

const getLocaleFromPathname = (pathname) => {
  const [firstSegment] = String(pathname || "").split("/").filter(Boolean);
  return locales.includes(firstSegment) ? firstSegment : defaultLocale;
};

const ErrorInner = ({locale: localeInput}) => {
  const pathname = usePathname();
  const locale = normalizeLocale(localeInput || getLocaleFromPathname(pathname));
  const copy = getNotFoundCopy(locale);
  const isRtl = isRtlLocale(locale);
  const homeHref = `/${locale}`;

  return (
    <section className="error" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <div className="error__content">
        <div className="error__panel">
          <h1 className="title-animation_inner">{copy.title}</h1>
          <p className="error__message">{copy.message}</p>
          <Link href={homeHref} className="error__home-link">
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorInner;

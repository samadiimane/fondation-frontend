"use client";

import {useMemo} from "react";
import {useLocale, useTranslations} from "next-intl";

import {SERVICE_SLUGS, getServiceContent} from "@/content/services";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const truncateText = (text = "", length = 250) => {
  if (text.length <= length) return text;
  const sliced = text.slice(0, length);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 80 ? lastSpace : length)}…`;
};

const ServicesHome = () => {
  const locale = useLocale();
  const t = useTranslations("services");
  const isRtl = isRtlLocale(locale);

  const slides = useMemo(
    () =>
      SERVICE_SLUGS.map((slug) => {
        const content = getServiceContent(locale, slug);
        if (!content) return null;
        const title = content.title || slug;
        const intro = truncateText(content.intro || "");
        return {slug, title, intro};
      }).filter(Boolean),
    [locale]
  );

  const arrowIconClass = `fa-solid ${isRtl ? "fa-circle-arrow-left" : "fa-circle-arrow-right"}`;

  const renderServiceCard = (slide) => (
    <li className='difference__item' key={slide.slug}>
      <article className='difference__single'>
        <div className='difference__single-content'>
          <h3>
            <Link href={`/services/${slide.slug}`}>{slide.title}</Link>
          </h3>
          <p>{slide.intro || t("fallback")}</p>
          <div className='readmore'>
            <Link
              href={`/services/${slide.slug}`}
              aria-label={t("aria.readMore", {title: slide.title})}
              title={t("aria.readMore", {title: slide.title})}
            >
              {t("readMore")}
              <span className='visually-hidden'>: {slide.title}</span>
              <i className={arrowIconClass} aria-hidden='true' />
            </Link>
          </div>
        </div>
      </article>
    </li>
  );

  return (
    <section className='difference' id='services' dir={isRtl ? "rtl" : "ltr"}>
      <div className='container'>
        <div className='row justify-content-center p-2'>
          <div className='col-12'>
            <div className='section__header text-center'>
              <h2 className='title-animation_inner'>{t("sectionTitle")}</h2>
              <p>{t("sectionIntro")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='difference__inner'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <ul className='difference__grid' aria-label={t("sectionTitle")}>
                {slides.map(renderServiceCard)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHome;

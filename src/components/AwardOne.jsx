import Image from "next/image";
import {getTranslations} from "next-intl/server";

import {defaultLocale, isRtlLocale, normalizeLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const GALLERY_ITEMS = [
  {
    key: "anniversary",
    className: "col-12 col-lg-8",
    src: "/assets/images/award/fondation.jpg",
    width: 888,
    height: 393,
    sizes: "(min-width: 992px) 66vw, 100vw",
    quality: 72
  },
  {
    key: "symposium",
    className: "col-12 col-lg-4",
    src: "/assets/images/award/2.jpg",
    width: 1600,
    height: 1200,
    sizes: "(min-width: 992px) 33vw, 100vw",
    quality: 68,
    delay: 200
  },
  {
    key: "research",
    className: "col-12 col-lg-5",
    src: "/assets/images/award/7.jpg",
    width: 1600,
    height: 1200,
    sizes: "(min-width: 992px) 42vw, 100vw",
    quality: 68,
    delay: 100
  },
  {
    key: "heritage",
    className: "col-12 col-lg-7",
    src: "/assets/images/award/4.jpg",
    width: 888,
    height: 393,
    sizes: "(min-width: 992px) 58vw, 100vw",
    quality: 72,
    delay: 300
  }
];

const AwardOne = async ({locale: localeInput = defaultLocale}) => {
  const locale = normalizeLocale(localeInput);
  const t = await getTranslations({locale, namespace: "home.gallery"});
  const isRtl = isRtlLocale(locale);
  const iconClass = `fa-solid ${isRtl ? "fa-arrow-left" : "fa-arrow-right"}`;

  return (
    <section className='award' dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <h2 className='title-animation_inner'>
                {t("title")} <span>{t("titleAccent")}</span>
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-24'>
          {GALLERY_ITEMS.map((item) => {
            const title = t(`items.${item.key}.title`);
            const meta = t(`items.${item.key}.meta`);
            const alt = t(`items.${item.key}.alt`);
            const itemLabel = t("itemAria", {title});

            return (
              <div className={item.className} key={item.key}>
                <div
                  className='award__single'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                  {...(item.delay ? {"data-aos-delay": item.delay} : {})}
                >
                  <div className='thumb'>
                    <Link href='/events/seminars' locale={locale} aria-label={itemLabel} title={itemLabel}>
                      <Image
                        src={item.src}
                        alt={alt}
                        width={item.width}
                        height={item.height}
                        sizes={item.sizes}
                        quality={item.quality}
                        loading='lazy'
                      />
                    </Link>
                  </div>
                  <div className='content'>
                    <div className='award__content'>
                      <h5>
                        <Link href='/events/seminars' locale={locale}>{title}</Link>
                      </h5>
                      <p>{meta}</p>
                    </div>
                    <div className='award__thumb'>
                      <Link href='/events/seminars' locale={locale} aria-label={itemLabel} title={itemLabel}>
                        <i className={iconClass} aria-hidden='true' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center'>
              <Link
                href='/events/seminars'
                locale={locale}
                aria-label={t("ctaAria")}
                title={t("ctaAria")}
                className='btn--primary'
              >
                {t("cta")} <i className={iconClass} aria-hidden='true' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardOne;

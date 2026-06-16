import Image from "next/image";
import {getTranslations} from "next-intl/server";

import {defaultLocale, isRtlLocale, normalizeLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const HERO_IMAGE_SIZES = "(min-width: 1400px) 13vw, (min-width: 992px) 17vw, 0vw";

const renderHeroImage = ({src, width, height}) => (
  <Image
    src={src}
    alt=''
    width={width}
    height={height}
    sizes={HERO_IMAGE_SIZES}
    quality={60}
    loading='lazy'
    decoding='async'
    aria-hidden='true'
  />
);

const Banner = async ({locale: localeInput = defaultLocale}) => {
  const locale = normalizeLocale(localeInput);
  const t = await getTranslations({locale, namespace: "Banner"});
  const isRtl = isRtlLocale(locale);
  const dir = isRtl ? "rtl" : "ltr";
  const ctaIconClass = `fa-solid ${isRtl ? "fa-arrow-left" : "fa-arrow-right"}`;

  return (
    <section className='banner banner--hero' dir={dir} lang={locale}>
      <div className='container-fluid'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-6'>
            <div className='banner__content'>
              <h1 className='title-animation_inner'>{t("title")}</h1>
              <p>{t("subtitle")}</p>
              <div className='banner__content-cta cta'>
                <Link
                  href='/publishing'
                  locale={locale}
                  aria-label={t("ctaPrimaryAria")}
                  title={t("ctaPrimaryAria")}
                  className='btn--tertiary'
                >
                  {t("ctaPrimary")} <i className={ctaIconClass} aria-hidden='true' />
                </Link>
                <Link
                  href='/library'
                  locale={locale}
                  aria-label={t("ctaSecondaryAria")}
                  title={t("ctaSecondaryAria")}
                  className='btn--primary'
                >
                  {t("ctaSecondary")} <i className={ctaIconClass} aria-hidden='true' />
                </Link>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 d-none d-lg-block'>
            <div className='banner__thumb'>
              <div className='banner__thumb-inner'>
                <div className='group'>
                  <div className='m-one move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/kasbah.png",
                      width: 697,
                      height: 522
                    })}
                  </div>
                  <div className='m-three move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/lagrotte.png",
                      width: 491,
                      height: 787
                    })}
                  </div>
                </div>
                <div className='group'>
                  <div className='m-two move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/babhar.png",
                      width: 883,
                      height: 885
                    })}
                  </div>
                  <div className='m-four move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/port.png",
                      width: 692,
                      height: 693
                    })}
                  </div>
                </div>
                <div className='group'>
                  <div className='m-one move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/phare.png",
                      width: 486,
                      height: 856
                    })}
                  </div>
                  <div className='m-three move-image'>
                    {renderHeroImage({
                      src: "/assets/images/banner/atlas.png",
                      width: 526,
                      height: 514
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

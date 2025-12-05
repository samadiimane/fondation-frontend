"use client";

import {useMemo, useRef} from "react";
import {useLocale, useTranslations} from "next-intl";
import Slider from "react-slick";

import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const Banner = () => {
  const sliderRef = useRef(null);
  const t = useTranslations("Banner");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);

  const slidesFromTranslations = useMemo(() => {
    if (typeof t.raw !== "function") return null;
    try {
      return t.raw("slides");
    } catch {
      return null;
    }
  }, [t]);

  const slides =
    Array.isArray(slidesFromTranslations) && slidesFromTranslations.length
      ? slidesFromTranslations
      : [{title: t("title"), subtitle: t("subtitle")}];

  const settings = useMemo(
    () => ({
      infinite: true,
      speed: 2000,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      autoplay: true,
      autoplaySpeed: 6000,
      pauseOnHover: true,
      arrows: false,
      // Keep slick layout LTR to avoid direction clashes; content itself uses dir for RTL text
      rtl: false
    }),
    []
  );

  return (
    <section className='banner banner--hero'>
      <div className='container-fluid'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-6'>
            <div className='banner__slider' style={{direction: "ltr"}}>
              <Slider {...settings} ref={sliderRef} className='banner__slides'>
                {slides.map((slide, index) => (
                  <div className='banner__slide' key={slide?.title ?? index}>
                    <div className='banner__content' dir={isRtl ? "rtl" : "ltr"}>
                      <h1 className='title-animation_inner'>{slide?.title}</h1>
                      <p>{slide?.subtitle}</p>
                      <div className='banner__content-cta cta'>
                        <Link
                          href='/foundation'
                          aria-label={t("ctaPrimaryAria")}
                          title={t("ctaPrimaryAria")}
                          className='btn--tertiary'
                        >
                          {t("ctaPrimary")} <i className='fa-solid fa-arrow-right' />
                        </Link>
                        <Link
                          href='/library'
                          aria-label={t("ctaSecondaryAria")}
                          title={t("ctaSecondaryAria")}
                          className='btn--primary'
                        >
                          {t("ctaSecondary")} <i className='fa-solid fa-arrow-right' />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className='col-12 col-lg-6 d-none d-lg-block'>
            <div className='banner__thumb'>
              <div className='banner__thumb-inner'>
                <div className='group'>
                  <div className='m-one move-image'>
                    <img
                      src='/assets/images/banner/kasbah.png'
                      alt={t("altKasbah")}
                      data-aos='fade-right'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-three move-image'>
                    <img
                      src='/assets/images/banner/lagrotte.png'
                      alt={t("altGrotto")}
                      data-aos='fade-right'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-two move-image'>
                    <img
                      src='/assets/images/banner/babhar.png'
                      alt={t("altPort")}
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-four move-image'>
                    <img
                      src='/assets/images/banner/port.png'
                      alt={t("altPort")}
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-one move-image'>
                    <img
                      src='/assets/images/banner/phare.png'
                      alt={t("altLighthouse")}
                      data-aos='fade-right'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-three move-image'>
                    <img
                      src='/assets/images/banner/atlas.png'
                      alt={t("altAtlas")}
                      data-aos='fade-right'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
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

"use client";

import {useMemo, useRef} from "react";
import {useLocale, useTranslations} from "next-intl";

import {SERVICE_SLUGS, getServiceContent} from "@/content/services";
import {useDeferredSlider} from "@/hooks/useDeferredSlider";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const CARD_CLASSNAMES = ["difference__single-first", "difference__single-second", "difference__single-third"];

const truncateText = (text = "", length = 160) => {
  if (text.length <= length) return text;
  const sliced = text.slice(0, length);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 80 ? lastSpace : length)}…`;
};

const ServicesHome = () => {
  const sliderRef = useRef(null);
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
  const {SliderComponent, containerRef, loadSlider} = useDeferredSlider({
    enabled: slides.length > 1,
    rootMargin: "700px"
  });

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    rtl: isRtl,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const handlePrev = () => {
    if (!SliderComponent) {
      loadSlider();
      return;
    }
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    if (!SliderComponent) {
      loadSlider();
      return;
    }
    sliderRef.current?.slickNext();
  };

  const prevIcon = <i className='fa-solid fa-arrow-left' />;
  const nextIcon = <i className='fa-solid fa-arrow-right' />;
  const renderServiceCard = (slide, index) => (
    <div className='difference__single-wrapper'>
      <div className={`difference__single ${CARD_CLASSNAMES[index % CARD_CLASSNAMES.length]}`}>
        <div className='difference__single-content'>
          <h5>
            <Link href={`/services/${slide.slug}`}>{slide.title}</Link>
          </h5>
          <p>{slide.intro || t("fallback")}</p>
          <div className='readmore'>
            <Link
              href={`/services/${slide.slug}`}
              aria-label={`${t("readMore")}: ${slide.title}`}
              title={`${t("readMore")}: ${slide.title}`}
            >
              {t("readMore")}
              <span className='visually-hidden'>: {slide.title}</span>
              <i className='fa-solid fa-circle-arrow-right' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='difference' id='services' dir={isRtl ? "rtl" : "ltr"}>
      <div className='container'>
        <div className='row justify-content-center p-2'>
          <div className='col-12 col-lg-10 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
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
              <div className='difference__slider swiper' ref={containerRef}>
                {SliderComponent ? (
                  <SliderComponent {...settings} ref={sliderRef} className='swiper-wrapper'>
                    {slides.map((slide, index) => (
                      <div className='swiper-slide px-2' key={slide.slug}>
                        {renderServiceCard(slide, index)}
                      </div>
                    ))}
                  </SliderComponent>
                ) : (
                  <div className='row gutter-24'>
                    {slides.slice(0, 3).map((slide, index) => (
                      <div className='col-12 col-md-6 col-xl-4' key={slide.slug}>
                        {renderServiceCard(slide, index)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='slider-navigation'>
          <button
            onClick={isRtl ? handleNext : handlePrev}
            type='button'
            aria-label='prev slide'
            title='prev slide'
            className='prev-difference slider-btn'
            disabled={!SliderComponent}
          >
            {isRtl ? nextIcon : prevIcon}
          </button>
          <button
            onClick={isRtl ? handlePrev : handleNext}
            type='button'
            aria-label='next slide'
            title='next slide'
            className='next-difference slider-btn slider-btn-next'
            disabled={!SliderComponent}
          >
            {isRtl ? prevIcon : nextIcon}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesHome;

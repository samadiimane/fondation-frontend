"use client";

import {useMemo, useRef} from "react";
import {useLocale, useTranslations} from "next-intl";
import {useQuery} from "@tanstack/react-query";

import {getLatestDocuments, PublicDocument} from "@/lib/api/publicDocuments";
import {useDeferredSlider} from "@/hooks/useDeferredSlider";
import {Link} from "@/i18n/navigation";
import {isRtlLocale} from "@/i18n/config";

const baseSliderSettings = {
  infinite: true,
  speed: 1000,
  slidesToScroll: 1,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  centerMode: true,
  centerPadding: "0%",
  arrows: false,
  dots: true,
  dotsClass: "slick-dots pagination-one ff-pagination",
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        centerPadding: "5%"
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        centerPadding: "5%"
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        centerPadding: "5%"
      }
    }
  ]
};

const FALLBACK_IMAGE = "/assets/images/blog/one.png";

const formatDate = (value: string | undefined, locale: string) => {
  if (!value) return "";
  const normalized = value.includes(" ") ? value.replace(" ", "T") : value;
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(normalized));
  } catch {
    return normalized;
  }
};

const trimText = (text: string, length = 140) => {
  if (!text) return "";
  if (text.length <= length) return text;
  const truncated = text.slice(0, length);
  const cut = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, cut > 60 ? cut : length)}…`;
};

const LatestDocuments = () => {
  const sliderRef = useRef<any>(null);
  const locale = useLocale();
  const t = useTranslations("home.latest");
  const isRtl = isRtlLocale(locale);

  const sliderSettings = useMemo(
    () => ({
      ...baseSliderSettings,
      rtl: isRtl
    }),
    [isRtl]
  );

  const { data, isLoading, isError, refetch } = useQuery<PublicDocument[]>({
    queryKey: ["latest-documents", locale],
    queryFn: () => getLatestDocuments({ pageSize: 10, locale }),
    staleTime: 1000 * 60
  });

  const slides = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((doc) => {
      const authors = Array.isArray(doc.authors) ? doc.authors : [];
      const firstAuthor = authors.find(Boolean);
      const author = firstAuthor || t("unknownAuthor");
      const categories = Array.isArray(doc.categories) ? doc.categories : [];
      const category = categories[0] || t("unknownTag");
      const dateValue = doc.year || doc.published_at || doc.created_at || doc.updated_at || "";
      const year = doc.year || formatDate(dateValue, locale);
      const excerpt = trimText(doc.abstract || "", 150);
      const href = `/documents/${doc.id}`;
      return {
        id: doc.id,
        title: doc.title || t("imageAltFallback"),
        author,
        category,
        year,
        excerpt,
        href,
        image: doc.cover_image_url || FALLBACK_IMAGE
      };
    });
  }, [data, locale, t]);

  const isEmpty = !isLoading && !isError && slides.length === 0;
  const {SliderComponent, containerRef} = useDeferredSlider({
    enabled: !isLoading && slides.length > 1,
    rootMargin: "700px"
  });

  const skeletonCards = Array.from({ length: 4 }, (_, idx) => (
    <div key={`skeleton-${idx}`} className='col-12 col-md-6 col-xl-3'>
      <div className='blog__single-wrapper'>
        <div className='blog__single van-tilt'>
          <div className='blog__single-thumb skeleton-box' style={{ height: "240px" }} />
          <div className='blog__single-inner'>
            <div className='blog__single-meta'>
              <p className='skeleton-box' style={{ width: "50%", height: "12px" }} />
              <p className='skeleton-box' style={{ width: "40%", height: "12px" }} />
            </div>
            <div className='blog__single-content'>
              <p className='skeleton-box' style={{ width: "80%", height: "16px" }} />
              <p className='skeleton-box' style={{ width: "90%", height: "14px" }} />
            </div>
            <div className='blog__single-cta'>
              <span className='skeleton-box' style={{ width: "30%", height: "12px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
  const renderDocumentCard = (doc: (typeof slides)[number]) => (
    <div className='blog__single-wrapper'>
      <div className='blog__single van-tilt'>
        <div className='blog__single-thumb'>
          <Link href={doc.href} aria-label={doc.title}>
            <img src={doc.image} alt={doc.title || t("imageAltFallback")} />
          </Link>
          <div className='tag'>
            <span>
              <i className='fa-solid fa-tags' />
              {doc.category}
            </span>
          </div>
        </div>
        <div className='blog__single-inner'>
          <div className='blog__single-meta'>
            <p>
              <i className='icon-user' />
              {doc.author}
            </p>
            {doc.year ? (
              <p>
                <i className='fa-regular fa-calendar' />
                {doc.year}
              </p>
            ) : null}
          </div>
          <div className='blog__single-content'>
            <h6>
              <Link href={doc.href} aria-label={doc.title}>
                {doc.title}
              </Link>
            </h6>
            {doc.excerpt ? <p>{doc.excerpt}</p> : null}
          </div>
          <div className='blog__single-cta'>
            <Link
              href={doc.href}
              aria-label={doc.title}
              title={doc.title}
            >
              {t("readMore")}
              <i className='fa-solid fa-circle-arrow-right' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='blog' dir={isRtl ? "rtl" : "ltr"}>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <h2 className='title-animation_inner'>{t("heading")}</h2>
              <p>{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12' ref={containerRef}>
            {isError ? (
              <div className='text-center my-4'>
                <p>{t("error")}</p>
                <button type='button' className='btn--secondary' onClick={() => refetch()}>
                  {t("retry")}
                </button>
              </div>
            ) : isLoading ? (
              <div className='row gutter-24'>{skeletonCards}</div>
            ) : isEmpty ? (
              <div className='text-center my-4'>{t("empty")}</div>
            ) : SliderComponent && slides.length > 1 ? (
              <SliderComponent {...sliderSettings} ref={sliderRef}>
                {slides.map((doc, index) => (
                  <div key={doc.id || index} className='px-3'>
                    {renderDocumentCard(doc)}
                  </div>
                ))}
              </SliderComponent>
            ) : (
              <div className='row gutter-24'>
                {slides.map((doc, index) => (
                  <div key={doc.id || index} className='col-12 col-md-6 col-xl-3'>
                    {renderDocumentCard(doc)}
                  </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {/* slick renders pagination dots via dotsClass */}
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center'>
              <Link
                href='/library'
                aria-label={t("exploreLibrary")}
                title={t("exploreLibrary")}
                className='btn--primary'
              >
                {t("exploreLibrary")} <i className='fa-solid fa-arrow-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestDocuments;

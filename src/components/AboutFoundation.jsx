"use client";

import React from "react";
import {useLocale} from "next-intl";

import {getAboutFoundationContent} from "@/content/aboutFoundation";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";
import CounterOne from "./CounterOne";
import Partner from "./Partner";

const AboutFoundation = () => {
  const locale = useLocale();
  const content = getAboutFoundationContent(locale);
  const isRtl = isRtlLocale(locale);
  const textAlignClass = isRtl ? "text-end" : "text-start";

  return (
    <>

      {/* HERO SECTION */}
      <section className='hero about-hero' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-xl-10'>
              <div
                className='section__header'
                data-aos='fade-up'
                data-aos-duration={900}
              >
                <h2 className='title-animation_inner text-center'>
                  <span>{content.hero.highlight}</span> {content.hero.title}
                </h2>
                <p className='mt-3 text-justify'>
                  {content.hero.description}
                </p>
                <div className='d-flex gap-3 justify-content-center mt-4'>
                  <Link
                    href={content.hero.ctaHref}
                    aria-label={content.hero.ctaLabel}
                    className='btn--secondary'
                  >
                    {content.hero.ctaLabel} <i className='fa-solid fa-arrow-right' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDATION HISTORY */}
      <section className='about about-history pt-0 mt-5' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-8 col-xxl-7'>
              <div
                className='section__header'
                data-aos='fade-up'
                data-aos-duration={900}
              >

                <h2 className='title-animation_inner'>{content.history.title}</h2>
                {content.history.paragraphs.map((paragraph, index) => (
                  <p key={`${content.history.title}-${index}`} className={index === content.history.paragraphs.length - 1 ? "mb-0" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className='col-12 col-lg-3 col-xxl-5'>
              <div className='difference-two__thumb-wrapper'>
                <div className='difference-two__thumb mt-5'>
                  <div
                    className='thumb-lg p-5'
                    data-aos='fade-right'
                    data-aos-duration={1000}
                  >
                    <img
                      src='/assets/images/difference/fondation.jpg'
                      alt={content.history.imageAlt}
                      style={{borderRadius: "20px"}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className='about mission-vision' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row g-4 align-items-start'>
            {content.pillars.map((pillar, index) => (
              <div className='col-12 col-lg-4' key={pillar.key}>
                <div
                  className={`af-card ${textAlignClass}`}
                  data-aos={index === 0 ? "fade-right" : "fade-left"}
                  data-aos-duration={800}
                  data-aos-delay={index === 0 ? undefined : index * 100}
                >
                  <h5 className='mb-3'>{pillar.title}</h5>
                  <p>{pillar.intro}</p>
                  <ul className={`mt-3 af-list af-list-check ${textAlignClass}`}>
                    {pillar.bullets.map((bullet, bulletIndex) => (
                      <li key={`${pillar.key}-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className='difference values' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center p-2'>
            <div className='col-12 col-xl-10'>
              <div className='section__header text-center' data-aos='fade-up'>
                <h2 className='title-animation_inner'>{content.goals.title}</h2>
                <p>
                  {content.goals.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div className='row g-4'>
            {content.goals.cards.map((card, index) => (
              <div
                className='col-12 col-md-6 col-xl-4'
                data-aos='fade-up'
                data-aos-delay={index * 100}
                key={`${card.title}-${index}`}
              >
                <div className={`af-card af-hover ${textAlignClass}`}>
                  <h5>{card.title}</h5>
                  <p>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CounterOne */}
      <CounterOne />


      {/* Partner */}
      <Partner />


    </>
  );
};

export default AboutFoundation;

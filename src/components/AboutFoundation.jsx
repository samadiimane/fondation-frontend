"use client";

import Image from "next/image";
import {useLocale} from "next-intl";

import {getAboutFoundationContent} from "@/content/aboutFoundation";
import {isRtlLocale} from "@/i18n/config";
import Counter from "./Counter";
import Partner from "./Partner";

const AboutFoundation = () => {
  const locale = useLocale();
  const content = getAboutFoundationContent(locale);
  const isRtl = isRtlLocale(locale);
  const textAlignClass = isRtl ? "text-end" : "text-start";

  return (
    <>

      {/* HERO SECTION */}
      <section className='about-hero' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12'>
              <div className='about-hero__header'>
                <h2 className='title-animation_inner'>
                  <span>{content.hero.highlight}</span> {content.hero.title}
                </h2>
                <p className='about-hero__description'>{content.hero.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDATION PURPOSE */}
      <section className='about-history' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row align-items-center justify-content-between g-4'>
            <div className='col-12 col-lg-6'>
              <div className='about-history__content'>
                <h3 className='title-animation_inner'>{content.history.title}</h3>
                {content.history.paragraphs.map((paragraph, index) => (
                  <p key={`${content.history.title}-${index}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className='col-12 col-lg-6'>
              <div className='about-history__media'>
                <Image
                  src='/assets/images/difference/fondation.jpg'
                  alt={content.history.imageAlt}
                  width={760}
                  height={420}
                  sizes='(min-width: 992px) 45vw, 100vw'
                  className='about-history__image'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className='about-pillars' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row g-4 align-items-start'>
            {content.pillars.map((pillar) => (
              <div className='col-12 col-lg-4' key={pillar.key}>
                <div className={`af-card af-card--pillar ${textAlignClass}`}>
                  <h4>{pillar.title}</h4>
                  <p>{pillar.intro}</p>
                  <ul className={`af-list af-list-check ${textAlignClass}`}>
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

      {/* FIELDS OF ACTION */}
      <section className='about-actions' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-xl-10'>
              <div className='about-actions__header'>
                <h3 className='title-animation_inner'>{content.goals.title}</h3>
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
                key={`${card.title}-${index}`}
              >
                <div className={`af-card af-card--action af-hover ${textAlignClass}`}>
                  <h4>{card.title}</h4>
                  <p>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Counter */}
      <Counter />


      {/* Partner */}
      <Partner />


    </>
  );
};

export default AboutFoundation;

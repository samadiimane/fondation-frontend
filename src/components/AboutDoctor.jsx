"use client";
import {useRef} from "react";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getAboutDoctorContent} from "@/content/aboutDoctor";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const AboutDoctor = () => {
  const locale = useLocale();
  const content = getAboutDoctorContent(locale);
  const isRtl = isRtlLocale(locale);
  const archiveTrackRefs = useRef({});
  const textAlignClass = isRtl ? "text-end" : "text-start";
  const biographyMilestones =
    content.biography.milestones ??
    [
      ...(content.biography.education ?? []).map((item) => ({
        period: item.year,
        category: content.biography.educationTitle ?? content.nav.biography,
        title: item.degree,
        place: item.institution,
        description: item.thesis ?? ""
      })),
      ...(content.biography.career ?? []).map((item) => ({
        period: item.period,
        category: content.biography.careerTitle ?? content.nav.biography,
        title: item.title,
        place: item.institution,
        description: item.description
      }))
    ];
  const archiveGroups = content.archive?.groups.filter((group) => group.images.length > 0) ?? [];
  const handleArchiveScroll = (groupKey, direction) => {
    const track = archiveTrackRefs.current[groupKey];

    if (!track) {
      return;
    }

    const scrollDistance = Math.max(track.clientWidth * 0.78, 260);
    track.scrollBy({
      left: direction * scrollDistance,
      behavior: "smooth"
    });
  };

  return (
    <>
      {/* Main Hero Section */}
      <section className='doctor-hero' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row gutter-40 align-items-center'>
            <div className='col-12 col-md-5 col-lg-4 col-xxl-4'>
              <div className='doctor-hero__media'>
                <div className='doctor-hero__portrait'>
                  <Image
                    src='/assets/images/difference/temsamani.png'
                    alt={content.hero.imageAlt ?? content.hero.name}
                    width={540}
                    height={650}
                    sizes='(min-width: 1200px) 360px, (min-width: 992px) 32vw, (min-width: 768px) 34vw, 82vw'
                    priority
                    className='doctor-hero__image'
                  />
                </div>
              </div>
            </div>
            <div className='col-12 col-md-7 col-lg-8 col-xxl-8'>
              <div className='doctor-hero__body'>
                <div className='doctor-hero__content'>
                  {content.hero.eyebrow ? (
                    <p className={`doctor-hero__eyebrow ${textAlignClass}`}>
                      {content.hero.eyebrow}
                    </p>
                  ) : null}
                  <h2 className='title-animation_inner'>
                    <span>{content.hero.title}</span> {content.hero.name}
                  </h2>
                  <p className={`doctor-subtitle ${textAlignClass}`}>{content.hero.subtitle}</p>
                  {content.hero.intro.map((paragraph, index) => (
                    <p key={`hero-intro-${index}`} className={`doctor-hero__intro ${textAlignClass}`}>
                      {paragraph}
                    </p>
                  ))}
                  <div className={`mt-3 ${isRtl ? "text-start" : "text-start"}`}>
                    <a
                      href='/assets/docs/biographie-temsamani.pdf'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='btn--secondary'
                      aria-label={content.hero.ctaLabel}
                    >
                      {content.hero.ctaLabel}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formation Section */}
      {content.formation ? (
        <section id='formation' className='doctor-formation' dir={isRtl ? "rtl" : "ltr"}>
          <div className='container'>
            <div className='row justify-content-center'>
                <header className='doctor-formation__header'>
                  <h2 className='title-animation_inner'>{content.formation.title}</h2>
                  {content.formation.intro.map((paragraph, index) => (
                    <p className='doctor-formation__intro' key={`formation-intro-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                </header>
            </div>

            <ul className='doctor-formation__grid'>
              {content.formation.cards.map((card, index) => (
                <li className='doctor-formation__card' key={`formation-card-${index}`}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </li>
              ))}
            </ul>

            {content.formation.quote ? (
              <figure className='doctor-formation__quote-card'>
                <div className='doctor-formation__quote-image' aria-hidden='true'>
                  <Image
                    src='/assets/images/difference/akt.jpg'
                    alt=''
                    width={128}
                    height={128}
                    sizes='112px'
                    className='doctor-formation__quote-photo'
                  />
                </div>
                <blockquote className='doctor-formation__quote'>
                  {content.formation.quote}
                </blockquote>
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Biography Section */}
      <section
        id='biography'
        className='doctor-biography'
        dir={isRtl ? "rtl" : "ltr"}
        aria-labelledby='doctor-biography-title'
      >
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12'>
              <header className='doctor-biography__header'>
                <h2 id='doctor-biography-title' className='title-animation_inner'>
                  {content.biography.title}
                </h2>
                {content.biography.subtitle ? (
                  <p className='doctor-biography__subtitle'>{content.biography.subtitle}</p>
                ) : null}
              </header>
            </div>
          </div>

          <ul className='doctor-biography__milestones'>
            {biographyMilestones.map((milestone, index) => (
              <li className='doctor-biography__milestone' key={`biography-milestone-${index}`}>
                <article className='doctor-biography__entry'>
                  <div className='doctor-biography__period'>{milestone.period}</div>
                  <div className='doctor-biography__content'>
                    <div className='doctor-biography__heading'>
                      <p className='doctor-biography__category'>{milestone.category}</p>
                      <h3>{milestone.title}</h3>
                    </div>
                    {milestone.place ? <p className='doctor-biography__place'>{milestone.place}</p> : null}
                    {milestone.description ? (
                      <p className='doctor-biography__description'>{milestone.description}</p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Methodology Section */}
      {content.methodology ? (
        <section
          id='methodology'
          className='doctor-methodology'
          dir={isRtl ? "rtl" : "ltr"}
          aria-labelledby='doctor-methodology-title'
        >
          <div className='container'>
            <div className='doctor-methodology__layout'>
              <header className='doctor-methodology__intro'>
                <p className='doctor-methodology__eyebrow'>{content.methodology.eyebrow}</p>
                <h2 id='doctor-methodology-title' className='title-animation_inner'>
                  {content.methodology.title}
                </h2>
                <p className='doctor-methodology__subtitle'>{content.methodology.subtitle}</p>
                <p className='doctor-methodology__body'>{content.methodology.body}</p>
              </header>

              <figure className='doctor-methodology__quote'>
                <blockquote>{content.methodology.quote}</blockquote>
                {content.methodology.quoteSource ? (
                  <figcaption>{content.methodology.quoteSource}</figcaption>
                ) : null}
              </figure>
            </div>

            <ul className='doctor-methodology__principles'>
              {content.methodology.principles.map((principle, index) => (
                <li className='doctor-methodology__principle' key={principle.title}>
                  <span className='doctor-methodology__principle-label'>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Journals Section */}
      {content.journals ? (
        <section
          id='journals'
          className='doctor-journals'
          dir={isRtl ? "rtl" : "ltr"}
          aria-labelledby='doctor-journals-title'
        >
          <div className='container'>
            <header className='doctor-journals__header'>
              <h2 id='doctor-journals-title' className='title-animation_inner'>
                {content.journals.title}
              </h2>
              <p className='doctor-journals__intro'>{content.journals.intro}</p>
            </header>

            <aside className='doctor-journals__highlight' aria-label={content.journals.highlightSource}>
              <p>{content.journals.highlight}</p>
              <span>{content.journals.highlightSource}</span>
            </aside>

            <div className='doctor-journals__items'>
              {content.journals.items.map((journal) => (
                <article
                  className={`doctor-journals__item${journal.image ? "" : " doctor-journals__item--text-only"}`}
                  key={journal.key}
                >
                  {journal.image ? (
                    <figure className='doctor-journals__media'>
                      <Image
                        src={journal.image}
                        alt={journal.imageAlt ?? journal.title}
                        width={420}
                        height={596}
                        sizes='(min-width: 1200px) 150px, (min-width: 768px) 22vw, 56vw'
                        className='doctor-journals__cover'
                      />
                    </figure>
                  ) : null}

                  <div className='doctor-journals__content'>
                    <h3>{journal.title}</h3>
                    <p className='doctor-journals__period'>{journal.period}</p>
                    <p className='doctor-journals__description'>{journal.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Publications Section */}
      <section
        id='publications'
        className='doctor-publications'
        dir={isRtl ? "rtl" : "ltr"}
        aria-labelledby='doctor-publications-title'
      >
        <div className='container'>
          <header className='doctor-publications__header'>
              <h2 id='doctor-publications-title' className='title-animation_inner'>
              {content.publications.title}
            </h2>
            <p className='doctor-publications__intro'>{content.publications.intro}</p>
          </header>

          <div className='doctor-publications__body'>
            <ul className='doctor-publications__list'>
              {content.publications.items.map((item) => (
                <li className='doctor-publications__item' key={item.title}>
                  <p className='doctor-publications__line'>
                    <strong>{item.title}</strong>
                    <span aria-hidden='true'> &nbsp; : &nbsp;</span>
                    <span>{item.meta}</span>
                  </p>
                </li>
              ))}
            </ul>

            <div className='doctor-publications__cta'>
              <Link href={content.publications.ctaHref} className='btn--secondary'>
                {content.publications.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Section */}
      {content.archive && archiveGroups.length > 0 ? (
        <section
          id='archive'
          className='doctor-archive'
          dir={isRtl ? "rtl" : "ltr"}
          aria-labelledby='doctor-archive-title'
        >
          <div className='container'>
            <header className='doctor-archive__header'>
              <h2 id='doctor-archive-title' className='title-animation_inner'>
                {content.archive.title}
              </h2>
            </header>

            {archiveGroups.map((group) => (
              <div className='doctor-archive__group' key={group.key}>
                <div className='doctor-archive__carousel'>
                  <button
                    type='button'
                    className='doctor-archive__control doctor-archive__control--prev'
                    aria-label={content.archive.controls.previous}
                    onClick={() => handleArchiveScroll(group.key, -1)}
                  >
                    <span aria-hidden='true'>&lsaquo;</span>
                  </button>

                  <ul
                    className='doctor-archive__gallery'
                    dir='ltr'
                    ref={(node) => {
                      if (node) {
                        archiveTrackRefs.current[group.key] = node;
                      }
                    }}
                  >
                    {group.images.map((image) => (
                      <li className='doctor-archive__gallery-item' key={image.src}>
                        <figure className='doctor-archive__figure' dir={isRtl ? "rtl" : "ltr"}>
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={420}
                            height={560}
                            sizes='(min-width: 1400px) 230px, (min-width: 1200px) 18vw, (min-width: 768px) 28vw, 46vw'
                            loading='lazy'
                            className='doctor-archive__image'
                          />
                          {image.caption ? (
                            <figcaption>{image.caption}</figcaption>
                          ) : null}
                        </figure>
                      </li>
                    ))}
                  </ul>

                  <button
                    type='button'
                    className='doctor-archive__control doctor-archive__control--next'
                    aria-label={content.archive.controls.next}
                    onClick={() => handleArchiveScroll(group.key, 1)}
                  >
                    <span aria-hidden='true'>&rsaquo;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

    </>
  );
};

export default AboutDoctor;

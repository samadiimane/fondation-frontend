"use client";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getAboutDoctorContent} from "@/content/aboutDoctor";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const AboutDoctor = () => {
  const locale = useLocale();
  const content = getAboutDoctorContent(locale);
  const isRtl = isRtlLocale(locale);
  const textAlignClass = isRtl ? "text-end" : "text-start";
  const timelineClass = `timeline${isRtl ? " timeline-rtl" : ""}`;
  const badgeClass = `timeline-badge${isRtl ? " timeline-badge-rtl" : ""}`;

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

      {content.formation ? (
        <section id='formation' className='doctor-formation' dir={isRtl ? "rtl" : "ltr"}>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-12 col-lg-10'>
                <div className='section__header text-center'>
                  <p className='doctor-formation__subtitle'>{content.formation.subtitle}</p>
                  <h2 className='title-animation_inner'>{content.formation.title}</h2>
                  {content.formation.intro.map((paragraph, index) => (
                    <p className='doctor-formation__intro' key={`formation-intro-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <ul className='doctor-formation__grid'>
              {content.formation.cards.map((card, index) => (
                <li className='doctor-formation__card' key={`formation-card-${index}`}>
                  <span className='doctor-formation__icon' aria-hidden='true'>
                    <i className={card.icon}></i>
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </li>
              ))}
            </ul>

            {content.formation.quote ? (
              <blockquote className='doctor-formation__quote'>
                {content.formation.quote}
              </blockquote>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Biography Section */}
      <section id="biography" className='team' style={{paddingTop: "60px"}} dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-10'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>{content.biography.title}</h2>
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className='row mb-5'>
            <div className='col-12'>
              <div className='education-timeline' data-aos='fade-up' data-aos-duration={1000}>
                <h3 className='section-subtitle mb-4'>
                  {content.biography.educationTitle}
                </h3>
                <div className={timelineClass}>
                  {content.biography.education.map((item, index) => (
                    <div className='timeline-item' key={`education-${index}`}>
                      <div className={badgeClass}>{item.year}</div>
                      <div className='timeline-content'>
                        <h4>{item.degree}</h4>
                        <p className='institution'>{item.institution}</p>
                        {item.thesis ? <p className={`thesis ${textAlignClass}`}>{item.thesis}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Career Timeline */}
          <div className='row'>
            <div className='col-12'>
              <div className='career-timeline' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={300}>
                <h3 className='section-subtitle mb-4'>
                  {content.biography.careerTitle}
                </h3>
                <div className={timelineClass}>
                  {content.biography.career.map((position, index) => (
                    <div key={`career-${index}`} className='timeline-item'>
                      <div className={badgeClass}>{position.period}</div>
                      <div className='timeline-content'>
                        <h4>{position.title}</h4>
                        <p className='institution'>{position.institution}</p>
                        <p className={textAlignClass}>{position.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section id="research" className='difference' style={{background: "#f8f9fa"}} dir={isRtl ? "rtl" : "ltr"}>
        <div className='container mb-4'>
          <div className='row justify-content-center p-2'>
            <div className='col-12 col-lg-10 col-xl-8'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>{content.research.title}</h2>
                <p className={textAlignClass}>{content.research.description}</p>
              </div>
            </div>
          </div>

          <div className='row g-4'>
            {content.research.areas.map((area, index) => (
              <div key={`area-${index}`} className='col-lg-6' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                <div className='research-area-card'>
                  <div className='research-icon'>
                    <i className={area.icon}></i>
                  </div>
                  <div className='research-content'>
                    <h4>{area.title}</h4>
                    <p className={textAlignClass}>{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className='blog' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-8 col-xl-8'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>{content.publications.title}</h2>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <h3 className='section-subtitle mb-4'>
                {content.publications.landmarkTitle}
              </h3>
              <div className='publications-grid'>
                {content.publications.books.map((book, index) => (
                  <div key={`book-${index}`} className='publication-card' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                    <div className='publication-header'>
                      <h4>{book.title}</h4>
                      <div className='publication-meta'>
                        <span>{book.publisher}</span>
                        <span className='year'>{book.year}</span>
                      </div>
                    </div>
                    <p className={`publication-description ${textAlignClass}`}>{book.description}</p>
                    <div className='publication-stats'>
                      <div className='stats-left'>
                        <div className='stat'>
                          <i className='fa-solid fa-quote-left'></i>
                          <span>{book.citations}</span>
                        </div>
                        <div className='stat'>
                          <i className='fa-solid fa-download'></i>
                          <span>{book.downloads}</span>
                        </div>
                      </div>
                      <Link href='/library' className='view-more-btn'>
                        {content.publications.viewMoreLabel} <i className="fa-solid fa-book-open"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards Section */}
              <div className='awards-section mt-5' data-aos='fade-up' data-aos-duration={1000}>
                <h3 className='section-subtitle mb-4'>
                  <i className='fa-solid fa-award'></i> {content.publications.awardsTitle}
                </h3>
                <div className='awards-grid'>
                  {content.publications.awards.map((award, index) => (
                    <div key={`award-${index}`} className='award-item'>
                      <div className='award-year'>{award.year}</div>
                      <div className='award-title'>{award.award}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className='team' style={{background: "#f8f9fa"}} dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-10'>
              <div className='section__header text-center' data-aos='fade-up' data-aos-duration={1000}>
                <h2 className='title-animation_inner'>{content.testimonials.title}</h2>
              </div>
            </div>
          </div>

          <div className='row g-4'>
            {content.testimonials.items.map((testimonial, index) => (
              <div key={`testimonial-${index}`} className='col-lg-4' data-aos='fade-up' data-aos-duration={1000} data-aos-delay={index * 200}>
                <div className='testimonial-card'>
                  <div className='quote-icon'>
                    <i className='fa-solid fa-quote-left'></i>
                  </div>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <div className='testimonial-author'>
                    <h5 className={textAlignClass}>{testimonial.name}</h5>
                    <p className={textAlignClass}>{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className='difference-two' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row align-items-center'>
            <div className='col-12'>
              <div className='difference-two__content text-center'>
                <h2 className='title-animation_inner mb-4'>
                  {content.legacy.title}
                </h2>
                <blockquote className='doctor-quote'>
                  "{content.legacy.quote}"
                </blockquote>

                <div className='philosophy-grid'>
                  {content.legacy.principles.map((principle, index) => (
                    <div
                      key={`principle-${index}`}
                      className='philosophy-item'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                      data-aos-delay={index * 200}
                    >
                      <h4>{principle.title}</h4>
                      <p className={textAlignClass}>{principle.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutDoctor;

"use client";

import Image from "next/image";
import {useState} from "react";
import ModalVideo from "react-modal-video";
import {useLocale, useTranslations} from "next-intl";

import {getFoundationIntroContent} from "@/content/foundationIntro";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const TAB_KEYS = ["mission", "vision", "excellence"];

const FoundationIntro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const locale = useLocale();
  const t = useTranslations("foundation-intro");
  const content = getFoundationIntroContent(locale);
  const isRtl = isRtlLocale(locale);

  const currentBullets = content.tabs[activeTab] || [];

  return (
    <>
      <section className='difference-two' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <div className='row gutter-40 align-items-center'>
            <div className='col-12 col-lg-3 col-xxl-5 d-none d-lg-block'>
              <div className='difference-two__thumb-wrapper'>
                <div className='difference-two__thumb'>
                  <div
                    className='thumb-lg'
                    data-aos='fade-right'
                    data-aos-duration={1000}
                  >
                    <Image
                      src={content.images.primary}
                      alt={t("aria.primaryImage")}
                      width={888}
                      height={533}
                      sizes='(min-width: 1400px) 500px, (min-width: 992px) 36vw, 0vw'
                      quality={72}
                      loading='lazy'
                    />
                    <div className='video-btn-wrapper'>
                      <button
                        onClick={() => setIsOpen(true)}
                        className='open-video-popup'
                        aria-label={t("aria.openVideo")}
                      >
                        <i className='icon-play' />
                      </button>
                    </div>
                  </div>
                  <div
                    className='thumb-sm'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={300}
                  >
                    <Image
                      src={content.images.secondary}
                      alt={t("aria.secondaryImage")}
                      width={780}
                      height={780}
                      sizes='(min-width: 992px) 250px, 0vw'
                      quality={70}
                      loading='lazy'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-lg-8 col-xxl-7'>
              <div className='difference-two__tab'>
                <div className='difference-two__content'>
                  <h2 className='title-animation_inner'>
                    <span>{t("titleShort")}</span> {content.heroTitle}
                  </h2>
                  {content.intro.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  <div className='difference-two__inner cta'>
                    <div className='difference-two__tab'>
                      <div className='difference-two__tab-btns'>
                        {TAB_KEYS.map((key) => (
                          <button
                            key={key}
                            className={`difference-two__tab-btn ${activeTab === key ? "active" : ""}`}
                            onClick={() => setActiveTab(key)}
                            aria-label={t(`tabs.${key}`)}
                            title={t(`tabs.${key}`)}
                          >
                            {t(`tabs.${key}`)}
                          </button>
                        ))}
                      </div>

                      <div className='difference-two__tab-content'>
                        <div className='difference-two__content-single' id={activeTab}>
                          <ul>
                            {currentBullets.map((bullet) => (
                              <li key={bullet}>
                                <i className='fa-solid fa-check' /> {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='difference-two__cta d-flex gap-3 flex-wrap mt-4'>
                    <Link
                      href='/foundation'
                      className='btn--primary'
                      aria-label={t("cta.foundation")}
                      style={{borderRadius: "999px"}}
                    >
                      {t("cta.foundation")} <i className='fa-solid fa-arrow-right' />
                    </Link>
                    <Link href='/dr-temsamani' className='btn--secondary' aria-label={t("cta.founder")}>
                      {t("cta.founder")} <i className='fa-solid fa-arrow-right' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalVideo
        channel='youtube'
        autoplay
        isOpen={isOpen}
        videoId={content.videoId}
        onClose={() => setIsOpen(false)}
        allowFullScreen
      />
    </>
  );
};

export default FoundationIntro;

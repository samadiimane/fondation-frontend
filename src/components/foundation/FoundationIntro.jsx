"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {useId, useState} from "react";
import {useLocale, useTranslations} from "next-intl";

import {getFoundationIntroContent} from "@/content/foundationIntro";
import {isRtlLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const TAB_KEYS = ["mission", "vision", "excellence"];

const ModalVideo = dynamic(() => import("react-modal-video"), {ssr: false});

const FoundationIntro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const idPrefix = useId();
  const locale = useLocale();
  const t = useTranslations("foundation-intro");
  const content = getFoundationIntroContent(locale);
  const isRtl = isRtlLocale(locale);
  const ctaIconClass = `fa-solid ${isRtl ? "fa-arrow-left" : "fa-arrow-right"}`;
  const tablistId = `${idPrefix}-foundation-intro-tabs`;
  const getTabId = (key) => `${idPrefix}-foundation-intro-tab-${key}`;
  const getPanelId = (key) => `${idPrefix}-foundation-intro-panel-${key}`;

  return (
    <>
      <section
        className={`difference-two foundation-intro ${isRtl ? "foundation-intro--rtl" : "foundation-intro--ltr"}`}
        dir={isRtl ? "rtl" : "ltr"}
        lang={locale}
      >
        <div className='container'>
          <div className='row gutter-40 align-items-center'>
            <div className='col-12 col-lg-3 col-xxl-5 d-none d-lg-block'>
              <div className='difference-two__thumb-wrapper'>
                <div className='difference-two__thumb'>
                  <div className='thumb-lg'>
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
                        type='button'
                        onClick={() => setIsOpen(true)}
                        className='open-video-popup'
                        aria-label={t("aria.openVideo")}
                      >
                        <i className='icon-play' aria-hidden='true' />
                      </button>
                    </div>
                  </div>
                  <div className='thumb-sm'>
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
                    <span>{t("titleShort")}</span>
                  </h2>
                  {content.intro.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  <div className='difference-two__inner cta'>
                    <div className='difference-two__tab'>
                      <div
                        className='difference-two__tab-btns'
                        role='tablist'
                        id={tablistId}
                        aria-label={t("tabs.ariaLabel")}
                      >
                        {TAB_KEYS.map((key) => (
                          <button
                            key={key}
                            type='button'
                            id={getTabId(key)}
                            className={`difference-two__tab-btn ${activeTab === key ? "active" : ""}`}
                            onClick={() => setActiveTab(key)}
                            role='tab'
                            aria-selected={activeTab === key}
                            aria-controls={getPanelId(key)}
                            title={t(`tabs.${key}`)}
                          >
                            {t(`tabs.${key}`)}
                          </button>
                        ))}
                      </div>

                      <div className='difference-two__tab-content'>
                        {TAB_KEYS.map((key) => (
                          <div
                            key={key}
                            className='difference-two__content-single'
                            id={getPanelId(key)}
                            role='tabpanel'
                            aria-labelledby={getTabId(key)}
                            hidden={activeTab !== key}
                          >
                            <ul>
                              {(content.tabs[key] || []).map((bullet) => (
                                <li key={bullet}>
                                  <i className='fa-solid fa-check' aria-hidden='true' /> {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
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
                      {t("cta.foundation")} <i className={ctaIconClass} aria-hidden='true' />
                    </Link>
                    <Link href='/dr-temsamani' className='btn--secondary' aria-label={t("cta.founder")}>
                      {t("cta.founder")} <i className={ctaIconClass} aria-hidden='true' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isOpen ? (
        <ModalVideo
          channel='youtube'
          autoplay
          isOpen={isOpen}
          videoId={content.videoId}
          onClose={() => setIsOpen(false)}
          allowFullScreen
        />
      ) : null}
    </>
  );
};

export default FoundationIntro;

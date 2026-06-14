"use client";

import {useLocale, useTranslations} from "next-intl";

import {isRtlLocale} from "@/i18n/config";

const logos = [
  "/assets/images/sponsor/uae.png",
  "/assets/images/sponsor/ucd.png",
  "/assets/images/sponsor/um5.png",
  "/assets/images/sponsor/usmba.png"
];

const Partner = () => {
  const locale = useLocale();
  const t = useTranslations("partners");
  const isRtl = isRtlLocale(locale);

  return (
    <section
      className='partner'
      dir={isRtl ? "rtl" : "ltr"}
      aria-labelledby='partner-title'
    >
      <div className='container'>
        <div className='partner__header section__header text-center'>
          <h2 id='partner-title' className='title-animation_inner'>
            {t("title")}
          </h2>
        </div>
        <ul className='partner__grid' aria-hidden='true'>
          {logos.map((src) => (
            <li className='partner__logo-card' key={src}>
              <img
                src={src}
                alt=''
                width={135}
                height={95}
                loading='lazy'
                decoding='async'
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Partner;

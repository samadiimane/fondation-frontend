"use client";

import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";

import {isRtlLocale} from "@/i18n/config";

const HIGHLIGHTS = [
  {key: "heritage", icon: "icon-documents"},
  {key: "research", icon: "icon-review"},
  {key: "publications", icon: "icon-award"},
  {key: "support", icon: "icon-support-hand"}
];

const Counter = () => {
  const locale = useLocale();
  const t = useTranslations("counter");
  const isRtl = isRtlLocale(locale);

  return (
    <section className='counter' dir={isRtl ? "rtl" : "ltr"} aria-labelledby='counter-title'>
      <div className='container'>
        <div className='counter__header'>
          <h2 id='counter-title' className='title-animation_inner'>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>
        <ul className='counter__inner'>
          {HIGHLIGHTS.map((item) => (
            <li key={item.key} className='counter__single'>
              <div className='thumb' aria-hidden='true'>
                <i className={item.icon} />
              </div>
              <div className='counter__content'>
                <h3>{t(`items.${item.key}.title`)}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='poor' aria-hidden='true'>
        <Image
          src='/assets/images/counter/old.png'
          alt=''
          fill
          sizes='100vw'
          quality={65}
          className='parallax-image'
          loading='lazy'
          style={{objectFit: "cover"}}
        />
      </div>
    </section>
  );
};

export default Counter;

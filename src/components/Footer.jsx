"use client";

import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {isRtlLocale} from "@/i18n/config";

const SOCIAL_LINKS = [
  {href: "https://www.facebook.com", icon: "fa-brands fa-facebook-f", labelKey: "facebook"},
  {href: "https://x.com", icon: "fa-brands fa-twitter", labelKey: "twitter"},
  {href: "https://www.linkedin.com", icon: "fa-brands fa-linkedin-in", labelKey: "linkedin"}
];

const Footer = () => {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSupport = useTranslations("support");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const year = new Date().getFullYear();

  const quickLinks = [
    {href: "/foundation", label: tNav("foundation")},
    {href: "/library", label: tNav("digitalLibrary")},
    {href: "/journals", label: tNav("journals")},
    {href: "/support/faq", label: tNav("faq")},
    {href: "/support/contact", label: tNav("contactUs")}
  ];

  const serviceLinks = [
    {href: "/services/academic-consultations", label: tNav("consultations")},
    {href: "/services/researcher-support", label: tNav("support")},
    {href: "/services/personal-platform", label: tNav("platform")}
  ];

  const contactLinks = [
    {
      href: "https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8",
      icon: "fa-solid fa-location-dot",
      label: t("contact.address")
    },
    {
      href: "tel:+2122466422710",
      icon: "fa-solid fa-phone",
      label: t("contact.phone")
    },
    {
      href: "mailto:AKT_Research_Foundation@gmail.com",
      icon: "fa-regular fa-envelope",
      label: t("contact.email")
    }
  ];

  return (
    <footer
      className={`footer-two${isRtl ? " footer-two--rtl" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
      style={isRtl ? {textAlign: "right"} : undefined}
    >
      <div className='container'>
        <div className='row gutter-60'>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='footer-two__widget-logo'>
                <Link href='/'>
                  <Image
                    src='/assets/images/logo2.png'
                    alt={t("logoAlt")}
                    width={472}
                    height={197}
                    sizes='200px'
                    quality={75}
                    loading='lazy'
                    style={{height: "100px", width: "200px", objectFit: "contain"}}
                  />
                </Link>
              </div>
              <div className='footer-two__widget-content'>
                <p>{t("description")}</p>
                <div className='social'>
                  {SOCIAL_LINKS.map(({href, icon, labelKey}) => (
                    <a
                      key={href}
                      href={href}
                      target='_blank'
                      rel='noreferrer'
                      aria-label={t(`social.${labelKey}`)}
                      title={t(`social.${labelKey}`)}
                    >
                      <i className={icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-2 offset-xl-1'>
            <div
              className='footer-two__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={200}
            >
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.quickLinks")}</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                    <Link href={item.href}>
                      <i className='fa-solid fa-arrow-right' />
                      {item.label}
                    </Link>
                  </li>
                ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget footer-two__widget--alternate'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={400}
            >
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.services")}</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  {serviceLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <i className='fa-solid fa-arrow-right' />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget footer-two__widget--alternate'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.contact")}</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content footer-two__widget-content--contact'>
                <ul>
                  {contactLinks.map((item) => {
                    const isExternal = item.href.startsWith("http");
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          {...(isExternal ? {target: "_blank", rel: "noreferrer"} : {})}
                        >
                          <i className={item.icon} />
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-two__copyright'>
        <div className='container'>
          <div className='row align-items-center gutter-12 justify-content-between'>
            <div className='col-12 col-lg-auto'>
              <div className='footer-two__copyright-inner text-center text-lg-start'>
                <p>{t("copyright", {year})}</p>
              </div>
            </div>
            <div className='col-12 col-lg-auto'>
              <div className='footer__bottom-left'>
                <ul
                  className='footer__bottom-list justify-content-center justify-content-lg-end'
                  style={isRtl ? {flexDirection: "row-reverse"} : undefined}
                >
                  <li>
                    <Link href='/support/terms'>{tSupport("terms")}</Link>
                  </li>
                  <li>
                    <Link href='/support/faq'>{tSupport("faq")}</Link>
                  </li>
                  <li>
                    <Link href='/support/contact'>{tSupport("contact")}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isRtl ? (
        <style jsx global>{`
          .footer-two--rtl .footer-two__widget a::after,
          .footer-two--rtl .footer__bottom-list a::after {
            inset-inline-start: auto !important;
            inset-inline-end: 0 !important;
            transform: translateX(0) !important;
            transform-origin: right center !important;
          }
          .footer-two--rtl .footer-two__widget a:hover::after,
          .footer-two--rtl .footer__bottom-list a:hover::after {
            width: 100% !important;
            inset-inline-end: 0 !important;
            inset-inline-start: auto !important;
          }
        `}</style>
      ) : null}
    </footer>
  );
};

export default Footer;

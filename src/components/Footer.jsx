import Image from "next/image";
import {getLocale, getTranslations} from "next-intl/server";

import {defaultLocale, isRtlLocale, normalizeLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const SOCIAL_LINKS = [
  {href: "https://www.facebook.com", icon: "fa-brands fa-facebook-f", labelKey: "facebook"},
  {href: "https://x.com", icon: "fa-brands fa-twitter", labelKey: "twitter"},
  {href: "https://www.linkedin.com", icon: "fa-brands fa-linkedin-in", labelKey: "linkedin"}
];

/**
 * @param {{locale?: string}} [props]
 */
const Footer = async ({locale: localeInput} = {}) => {
  const inferredLocale = localeInput ?? await getLocale();
  const locale = normalizeLocale(inferredLocale || defaultLocale);
  const t = await getTranslations({locale, namespace: "footer"});
  const isRtl = isRtlLocale(locale);
  const year = new Date().getFullYear();
  const copyrightText = t("copyright", {year});

  const quickLinks = [
    {href: "/foundation", label: t("links.quick.foundation")},
    {href: "/library", label: t("links.quick.digitalLibrary")},
    {href: "/journals", label: t("links.quick.journals")},
    {href: "/support/faq", label: t("links.quick.faq")},
    {href: "/support/contact", label: t("links.quick.contact")}
  ];

  const serviceLinks = [
    {href: "/services/academic-consultations", label: t("links.services.consultations")},
    {href: "/services/researcher-support", label: t("links.services.researcherSupport")},
    {href: "/services/personal-platform", label: t("links.services.personalPlatform")}
  ];

  const contactLinks = [
    {
      href: "https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8",
      icon: "fa-solid fa-location-dot",
      label: t("contact.address")
    },
    {
      href: "tel:+212628595830",
      icon: "fa-solid fa-phone",
      label: t("contact.phone"),
      textDirection: "ltr",
      valueClass: "footer-two__contact-value--phone"
    },
    {
      href: "mailto:aktfoundation.ma@gmail.com",
      icon: "fa-regular fa-envelope",
      label: t("contact.email"),
      textDirection: "ltr",
      valueClass: "footer-two__contact-value--email"
    }
  ];

  return (
    <footer
      className={`footer-two${isRtl ? " footer-two--rtl" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className='container'>
        <div className='row gutter-60'>
          <div className='col-12 col-md-6 col-xl-3'>
            <div className='footer-two__widget'>
              <div className='footer-two__widget-logo'>
                <Link href='/' locale={locale} aria-label={t("logoAlt")}>
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
                      rel='noopener noreferrer'
                      aria-label={t(`social.${labelKey}`)}
                      title={t(`social.${labelKey}`)}
                    >
                      <i className={icon} aria-hidden='true' />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-2'>
            <div className='footer-two__widget'>
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.quickLinks")}</h5>
                <div className='line' aria-hidden='true'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} locale={locale}>
                        <i className='fa-solid fa-arrow-right' aria-hidden='true' />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div className='footer-two__widget footer-two__widget--alternate'>
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.services")}</h5>
                <div className='line' aria-hidden='true'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  {serviceLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} locale={locale}>
                        <i className='fa-solid fa-arrow-right' aria-hidden='true' />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='footer-two__widget footer-two__widget--alternate'>
              <div className='footer-two__widget-intro'>
                <h5>{t("headings.contact")}</h5>
                <div className='line' aria-hidden='true'>
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
                          {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                        >
                          <i className={item.icon} aria-hidden='true' />
                          <span
                            className={`footer-two__contact-value ${item.textDirection ? "footer-two__contact-value--latin" : ""} ${item.valueClass || ""}`}
                            dir={item.textDirection}
                          >
                            {item.label}
                          </span>
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
                <p>{copyrightText}</p>
              </div>
            </div>
            <div className='col-12 col-lg-auto'>
              <div className='footer__bottom-left'>
                <ul className='footer__bottom-list justify-content-center justify-content-lg-end'>
                  <li>
                    <Link href='/support/terms' locale={locale}>{t("links.bottom.terms")}</Link>
                  </li>
                  <li>
                    <Link href='/support/faq' locale={locale}>{t("links.bottom.faq")}</Link>
                  </li>
                  <li>
                    <Link href='/support/contact' locale={locale}>{t("links.bottom.contact")}</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

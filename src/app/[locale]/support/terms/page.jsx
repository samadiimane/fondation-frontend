import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getTermsContent } from "@/content/support";
import { isRtlLocale, locales, normalizeLocale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale: normalizedLocale, namespace: "support" });
  const terms = getTermsContent(normalizedLocale);
  return {
    title: `${t("title")} - ${t("terms")}`,
    description: terms?.intro ?? t("empty"),
  };
}

const splitHeading = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");

  if (splitIndex <= 0) {
    return {
      lead: title,
      rest: "",
    };
  }

  return {
    lead: title.slice(0, splitIndex),
    rest: title.slice(splitIndex + 1),
  };
};

const TermsPage = async ({ params }) => {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const isRtl = isRtlLocale(normalizedLocale);
  const t = await getTranslations({ locale: normalizedLocale, namespace: "support" });

  const terms = getTermsContent(normalizedLocale);
  const title = terms?.heading ?? t("terms");
  const intro = terms?.intro ?? "";
  const sections = Array.isArray(terms?.sections) ? terms.sections : [];
  const heading = splitHeading(title);
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: title, current: true }
  ];

  return (
      <section className='page-wrapper'>

        <main className='support-page support-page--terms' dir={isRtl ? "rtl" : "ltr"} lang={normalizedLocale}>
          <section className='support-detail support-detail--terms-page'>
            <div className='container'>
              <div className='support-detail__inner support-detail__inner--terms'>
                <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />

                <header className='support-detail__header support-detail__header--publishing'>
                  <h1 className='title-animation_inner'>
                    <span>{heading.lead || title}</span>
                    {heading.rest ? ` ${heading.rest}` : ""}
                  </h1>
                  {intro ? <p>{intro}</p> : null}
                </header>

                <article className='article-detail__card article-detail__card--primary support-detail__card support-terms'>
                  {sections.length > 0 ? (
                    sections.map((section, index) => {
                      const headingLabel = section.title || t("termsSectionFallback", { number: index + 1 });
                      const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];

                      return (
                        <section key={`terms-${index + 1}`} className='support-terms__section'>
                          <h2 dir='auto'>{headingLabel}</h2>
                          {paragraphs.length > 0 ? (
                            paragraphs.map((paragraph, paragraphIndex) => (
                              <p key={`terms-${index + 1}-paragraph-${paragraphIndex}`} dir='auto'>
                                {paragraph}
                              </p>
                            ))
                          ) : (
                            <p dir='auto'>{t("empty")}</p>
                          )}
                        </section>
                      );
                    })
                  ) : (
                    <p className='support-faq__empty'>{t("empty")}</p>
                  )}
                </article>
              </div>
            </div>
          </section>
        </main>

        <Footer locale={locale} />
      </section>
  );
};

export default TermsPage;

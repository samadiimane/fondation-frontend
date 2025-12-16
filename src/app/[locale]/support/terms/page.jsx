import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getTermsContent } from "@/content/support";
import { locales } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });
  return {
    title: `${t("title")} · ${t("terms")}`,
    description: t("empty"),
  };
}

const slugify = (value, fallback) => {
  if (!value) return fallback;
  const candidate = value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/gi, "")
    .trim()
    .replace(/\s+/g, "-");
  return candidate || fallback;
};

const TermsPage = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });

  const terms = getTermsContent(locale);
  const title = terms?.heading ?? t("terms");
  const intro = terms?.intro;
  const sections = Array.isArray(terms?.sections) ? terms.sections : [];
  const hasSections = sections.length > 0;

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("title"), href: "/support/faq" },
    { label: t("terms"), current: true },
  ];

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <section className='support-detail pt-120 pb-120'>
          <div className='container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />

            <div className='article-detail support-detail__inner'>
              <header className='support-detail__header'>
                <h1>{title}</h1>
                {intro ? <p>{intro}</p> : null}
              </header>

              {hasSections ? (
                <nav className='support-detail__toc' aria-label={t("termsTocLabel") ?? "Table of contents"}>
                  <ul>
                    {sections.map((section, index) => {
                      const sectionId = slugify(section.title, `section-${index + 1}`);
                      return (
                        <li key={sectionId}>
                          <a href={`#${sectionId}`}>{section.title || t("termsSectionFallback", { number: index + 1 })}</a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ) : null}

              <article className='article-detail__card article-detail__card--primary support-detail__card'>
                {hasSections ? (
                  sections.map((section, index) => {
                    const sectionId = slugify(section.title, `section-${index + 1}`);
                    const heading = section.title || t("termsSectionFallback", { number: index + 1 });
                    const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];
                    return (
                      <section key={sectionId} id={sectionId} className='support-detail__terms-section'>
                        <h2>{heading}</h2>
                        {paragraphs.length > 0 ? (
                          paragraphs.map((paragraph, idx) => <p key={`${sectionId}-p-${idx}`}>{paragraph}</p>)
                        ) : (
                          <p>{t("empty")}</p>
                        )}
                      </section>
                    );
                  })
                ) : (
                  <p>{t("empty")}</p>
                )}
              </article>
            </div>
          </div>
        </section>

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default TermsPage;

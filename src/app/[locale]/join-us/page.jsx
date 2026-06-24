import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JoinUsForm from "@/components/join/JoinUsForm";
import { getJoinUsContent } from "@/content/joinUs";
import { isRtlLocale, locales, normalizeLocale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const content = getJoinUsContent(normalizedLocale);

  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

const JoinUsPage = async ({ params }) => {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const isRtl = isRtlLocale(normalizedLocale);
  const content = getJoinUsContent(normalizedLocale);
  const titleParts = splitTitle(content.title);
  const breadcrumbs = [
    { label: content.breadcrumbs.home, href: "/" },
    { label: content.breadcrumbs.current, current: true },
  ];

  return (
    <section className="page-wrapper">
      <main className="join-us-page" dir={isRtl ? "rtl" : "ltr"} lang={normalizedLocale}>
        <section className="join-us-page__container">
          <Breadcrumbs
            items={breadcrumbs}
            ariaLabel={content.breadcrumbs.ariaLabel}
            locale={normalizedLocale}
          />

          <header className="join-us-page__header">
            <h1 className="title-animation_inner">
              <span>{titleParts.lead || content.title}</span>
              {titleParts.rest ? ` ${titleParts.rest}` : ""}
            </h1>
            <p>{content.intro}</p>
          </header>

          <div className="join-us-page__layout">
            <aside className="join-us-page__note" aria-label={content.breadcrumbs.current}>
              <p>{content.note}</p>
            </aside>
            <div className="join-us-page__form-card">
              <JoinUsForm content={content} />
            </div>
          </div>
        </section>
      </main>
      <Footer locale={normalizedLocale} />
    </section>
  );
};

export default JoinUsPage;


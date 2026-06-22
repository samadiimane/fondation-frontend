import Image from "next/image";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import {getJournalsContent} from "@/content/journals";
import {defaultLocale, isRtlLocale, locales, normalizeLocale} from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.locale || defaultLocale);
  const content = getJournalsContent(locale);

  return {
    title: content.title,
    description: content.intro,
  };
}

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");

  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

export default async function JournalsPage({params}) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams?.locale || defaultLocale);
  const content = getJournalsContent(locale);
  const isRtl = isRtlLocale(locale);
  const titleParts = splitTitle(content.title);
  const breadcrumbs = [
    {label: content.breadcrumbs.home, href: "/"},
    {label: content.breadcrumbs.current, current: true},
  ];

  return (
    <section className="page-wrapper">
      <main className="library-journals journals-static pt-3" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
        <div className="journals-static__container">
          <Breadcrumbs
            items={breadcrumbs}
            ariaLabel={content.breadcrumbs.ariaLabel}
            locale={locale}
          />

          <header className="journals-static__header section__header">
            <h1 className="title-animation_inner mt-0">
              <span>{titleParts.lead || content.title}</span>
              {titleParts.rest ? ` ${titleParts.rest}` : ""}
            </h1>
          </header>

          <div className="journals-static__grid" aria-label={content.title}>
            {content.journals.map((journal) => (
              <article className="journal-feature-card" key={journal.slug}>
                <figure className="journal-feature-card__cover">
                  <Image
                    src={journal.image}
                    alt={journal.imageAlt}
                    fill
                    sizes="(max-width: 991px) 92vw, 520px"
                    className="journal-feature-card__image"
                  />
                </figure>

                <div className="journal-feature-card__content">
                  <h2>{journal.title}</h2>
                  <p className="journal-feature-card__description">{journal.description}</p>
                  <span className="journal-feature-card__availability">
                    {content.availabilityLabel}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </section>
  );
}

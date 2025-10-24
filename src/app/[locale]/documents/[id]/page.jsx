import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentDownloadButton from "@/components/documents/DocumentDownloadButton";
import DocumentPreview from "@/components/documents/DocumentPreview";
import ExpandableText from "@/components/documents/ExpandableText";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import { getDocument } from "@/lib/api";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const buildStrings = (t) => ({
  breadcrumbs: {
    home: { label: t("breadcrumbs.home.label"), href: t("breadcrumbs.home.href") },
    library: { label: t("breadcrumbs.library.label"), href: t("breadcrumbs.library.href") },
    journals: { label: t("breadcrumbs.journals.label"), href: t("breadcrumbs.journals.href") },
  },
  a11y: {
    breadcrumbs: t("a11y.breadcrumbs"),
  },
  header: {
    metaSeparator: t("header.metaSeparator"),
    authorsFallback: t("header.authorsFallback"),
    yearFallback: t("header.yearFallback"),
    typeFallback: t("header.typeFallback"),
    languageFallback: t("header.languageFallback"),
    journalContext: t("header.journalContext"),
    issueContext: t("header.issueContext"),
    pages: t("header.pages"),
    badges: {
      doi: t("header.badges.doi"),
      isbn: t("header.badges.isbn"),
      issn: t("header.badges.issn"),
    },
  },
  download: {
    cta: t("download.cta"),
    loading: t("download.loading"),
    error: t("download.error"),
  },
  preview: {
    loading: t("preview.loading"),
    unavailable: t("preview.unavailable"),
    hint: t("preview.hint"),
    ariaLabel: t("preview.ariaLabel"),
  },
  abstract: {
    title: t("abstract.title"),
    more: t("abstract.more"),
    less: t("abstract.less"),
    empty: t("abstract.empty"),
  },
  details: {
    title: t("details.title"),
    doi: t("details.doi"),
    isbn: t("details.isbn"),
    issn: t("details.issn"),
    category: t("details.category"),
    primaryCategory: t("details.primaryCategory"),
    createdAt: t("details.createdAt"),
    keywords: t("details.keywords"),
    noKeywords: t("details.noKeywords"),
  },
});

const formatAuthors = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }
  return value;
};

export async function generateMetadata({ params }) {
  const locale = await getLocale();
  const id = params?.id;
  if (!id) return {};

  const metaT = await getTranslations({ locale, namespace: "library.articleDetail.meta" });

  try {
    const doc = await getDocument(id);
    return {
      title: metaT("title", { title: doc.title }),
      description: doc.abstract?.slice(0, 140) || metaT("descriptionFallback"),
    };
  } catch {
    return {
      title: metaT("title", { title: id }),
      description: metaT("descriptionFallback"),
    };
  }
}

export default async function DocumentDetailPage({ params }) {
  const locale = await getLocale();
  const id = params?.id;
  if (!id) {
    notFound();
  }

  let document;
  try {
    document = await getDocument(id);
  } catch (error) {
    if (error?.message?.includes("404")) {
      notFound();
    }
    throw error;
  }

  const t = await getTranslations({ locale, namespace: "library.articleDetail" });
  const strings = buildStrings(t);

  const authors = formatAuthors(document.authors) || strings.header.authorsFallback;
  const year = document.year ?? strings.header.yearFallback;
  const type = document.type || strings.header.typeFallback;
  const language = (document.language || strings.header.languageFallback).toUpperCase();
  const pages = document.startPage && document.endPage
    ? `${document.startPage}-${document.endPage}`
    : document.pages || null;

  const breadcrumbItems = [
    strings.breadcrumbs.home,
    strings.breadcrumbs.library,
  ];

  if (document.journal?.name) {
    breadcrumbItems.push({
      label: strings.breadcrumbs.journals.label,
      href: strings.breadcrumbs.journals.href,
    });
    if (document.journal.slug) {
      breadcrumbItems.push({
        label: document.journal.name,
        href: `/journals/${document.journal.slug}`,
      });
    } else {
      breadcrumbItems.push({ label: document.journal.name, current: true });
    }
  } else {
    breadcrumbItems.push(strings.breadcrumbs.journals);
  }

  breadcrumbItems.push({ label: document.title, current: true });

  const keywords = Array.isArray(document.keywords) ? document.keywords.filter(Boolean) : [];

  const createdAt = document.createdAt
    ? new Intl.DateTimeFormat(locale || undefined, { dateStyle: "medium" }).format(
        new Date(document.createdAt)
      )
    : null;

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="article-detail">
          <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} />

          <div className="article-detail__layout">
            <article className="article-detail__main">
              <header className="article-detail__header">
                <span className="article-detail__eyebrow">{type}</span>
                <h1>{document.title}</h1>
                <p className="article-detail__meta">
                  <span>{authors}</span>
                  <span aria-hidden="true">{strings.header.metaSeparator}</span>
                  <span>{year}</span>
                  <span aria-hidden="true">{strings.header.metaSeparator}</span>
                  <span>{language}</span>
                </p>

                {document.journal?.name && (
                  <p className="article-detail__context">
                    <strong>{strings.header.journalContext}</strong>
                    {document.journal.slug ? (
                      <a href={`/journals/${document.journal.slug}`}>{document.journal.name}</a>
                    ) : (
                      <span>{document.journal.name}</span>
                    )}
                    {document.issue && (
                      <span>
                        {strings.header.metaSeparator}
                        {strings.header.issueContext
                          .replace("{volume}", document.issue.volume ?? "-")
                          .replace("{number}", document.issue.number ?? "-")
                          .replace("{year}", document.issue.year ?? year)}
                      </span>
                    )}
                  </p>
                )}

                {pages && (
                  <p className="article-detail__pages">
                    <i className="fa-regular fa-file-lines" aria-hidden="true" />
                    <span>{strings.header.pages.replace("{pages}", pages)}</span>
                  </p>
                )}

                <div className="article-detail__actions">
                  <DocumentDownloadButton
                    documentId={document.id}
                    strings={strings.download}
                    tone="primary"
                  />
                </div>

                <ul className="article-detail__badges">
                  {document.doi && (
                    <li>
                      <span>{strings.header.badges.doi}</span>
                      <a
                        href={`https://doi.org/${document.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {document.doi}
                      </a>
                    </li>
                  )}
                  {document.isbn && (
                    <li>
                      <span>{strings.header.badges.isbn}</span>
                      <span>{document.isbn}</span>
                    </li>
                  )}
                  {document.issn && (
                    <li>
                      <span>{strings.header.badges.issn}</span>
                      <span>{document.issn}</span>
                    </li>
                  )}
                </ul>
              </header>

              <section className="article-detail__abstract" aria-labelledby="article-abstract">
                <h2 id="article-abstract">{strings.abstract.title}</h2>
                {document.abstract ? (
                  <ExpandableText
                    text={document.abstract}
                    strings={{ more: strings.abstract.more, less: strings.abstract.less }}
                  />
                ) : (
                  <p className="article-detail__abstract-empty">{strings.abstract.empty}</p>
                )}
              </section>

              <section className="article-detail__preview" aria-labelledby="article-preview">
                <h2 id="article-preview">{strings.preview.ariaLabel}</h2>
                <DocumentPreview documentId={document.id} strings={strings.preview} />
              </section>
            </article>

            <aside className="article-detail__sidebar">
              <div className="article-detail__panel">
                <h2>{strings.details.title}</h2>
                <dl>
                  {document.doi && (
                    <div>
                      <dt>{strings.details.doi}</dt>
                      <dd>{document.doi}</dd>
                    </div>
                  )}
                  {document.isbn && (
                    <div>
                      <dt>{strings.details.isbn}</dt>
                      <dd>{document.isbn}</dd>
                    </div>
                  )}
                  {document.issn && (
                    <div>
                      <dt>{strings.details.issn}</dt>
                      <dd>{document.issn}</dd>
                    </div>
                  )}
                  {document.primaryCategory && (
                    <div>
                      <dt>{strings.details.primaryCategory}</dt>
                      <dd>{document.primaryCategory}</dd>
                    </div>
                  )}
                  {document.categorySlug && (
                    <div>
                      <dt>{strings.details.category}</dt>
                      <dd>{document.categorySlug}</dd>
                    </div>
                  )}
                  {createdAt && (
                    <div>
                      <dt>{strings.details.createdAt}</dt>
                      <dd>{createdAt}</dd>
                    </div>
                  )}
                </dl>

                <div className="article-detail__keywords">
                  <h3>{strings.details.keywords}</h3>
                  {keywords.length ? (
                    <ul>
                      {keywords.map((keyword) => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{strings.details.noKeywords}</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
}

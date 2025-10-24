import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "@/i18n/navigation";
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
    issue: t("breadcrumbs.issue"),
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
    valueUnknown: t("header.valueUnknown"),
    labels: {
      authors: t("header.labels.authors"),
      year: t("header.labels.year"),
      type: t("header.labels.type"),
      language: t("header.labels.language"),
    },
    imageAlt: t("header.imageAlt"),
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
    journal: t("details.journal"),
    issue: t("details.issue"),
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

const formatTypeLabel = (value, fallback) => {
  if (!value) return fallback;
  const formatted = value.replace(/_/g, " ").trim();
  if (!formatted) return fallback;
  return formatted.replace(/\b\w/g, (char) => char.toUpperCase());
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
  const typeLabel = formatTypeLabel(document.type, strings.header.typeFallback);
  const language = (document.language || strings.header.languageFallback).toUpperCase();
  const pages =
    document.startPage && document.endPage
      ? `${document.startPage}–${document.endPage}`
      : document.pages || null;
  const coverImage = document.coverImage || null;

  const issueContext = document.issue
    ? strings.header.issueContext
        .replace("{volume}", document.issue.volume ?? strings.header.valueUnknown)
        .replace("{number}", document.issue.number ?? strings.header.valueUnknown)
        .replace("{year}", document.issue.year ?? strings.header.valueUnknown)
    : null;

  const issueBreadcrumbLabel = issueContext
    ? strings.breadcrumbs.issue
        .replace("{volume}", document.issue?.volume ?? strings.header.valueUnknown)
        .replace("{number}", document.issue?.number ?? strings.header.valueUnknown)
        .replace("{year}", document.issue?.year ?? strings.header.valueUnknown)
    : null;

  const journalLink = document.journal?.slug ? `/journals/${document.journal.slug}` : null;

  const typeClass = (document.type || "document")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const detailClassName = `article-detail article-detail--${typeClass}`;

  const breadcrumbItems = [
    strings.breadcrumbs.home,
    strings.breadcrumbs.library,
    strings.breadcrumbs.journals,
  ];

  if (document.journal?.name) {
    breadcrumbItems.push({
      label: document.journal.name,
      href: journalLink ?? undefined,
    });
    if (issueBreadcrumbLabel) {
      breadcrumbItems.push({
        label: issueBreadcrumbLabel,
      });
    }
  }

  breadcrumbItems.push({ label: document.title, current: true });

  const primaryCategoryName =
    typeof document.primaryCategory === "string"
      ? document.primaryCategory
      : document.primaryCategory?.name ?? document.primaryCategory?.slug ?? null;
  const categoryLabel =
    document.category?.name ??
    document.category?.title ??
    (typeof document.category === "string" ? document.category : null) ??
    document.categorySlug ??
    null;

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

        <main className={detailClassName}>
          <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} />

          <div className="article-detail__layout">
            <article className="article-detail__main">
              <header className="article-detail__header">
                <span className="article-detail__eyebrow">{typeLabel}</span>
                <h1>{document.title}</h1>
                <ul className="article-detail__meta-list">
                  <li>
                    <strong>{strings.header.labels.authors}</strong>
                    <span>{authors}</span>
                  </li>
                  <li>
                    <strong>{strings.header.labels.year}</strong>
                    <span>{year}</span>
                  </li>
                  <li>
                    <strong>{strings.header.labels.type}</strong>
                    <span>{typeLabel}</span>
                  </li>
                  <li>
                    <strong>{strings.header.labels.language}</strong>
                    <span>{language}</span>
                  </li>
                </ul>

                {document.journal?.name && (
                  <p className="article-detail__context">
                    <strong>{strings.header.journalContext}</strong>
                    {journalLink ? (
                      <Link href={journalLink}>{document.journal.name}</Link>
                    ) : (
                      <span>{document.journal.name}</span>
                    )}
                    {issueContext && (
                      <span className="article-detail__issue">
                        {strings.header.metaSeparator}
                        {issueContext}
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

              {coverImage && (
                <figure className="article-detail__image">
                  <img
                    src={coverImage}
                    alt={strings.header.imageAlt.replace("{title}", document.title)}
                    loading="lazy"
                  />
                </figure>
              )}

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
                  {document.journal?.name && (
                    <div>
                      <dt>{strings.details.journal}</dt>
                      <dd>
                        {journalLink ? (
                          <Link href={journalLink}>{document.journal.name}</Link>
                        ) : (
                          document.journal.name
                        )}
                      </dd>
                    </div>
                  )}
                  {issueContext && (
                    <div>
                      <dt>{strings.details.issue}</dt>
                      <dd>{issueContext}</dd>
                    </div>
                  )}
                  {primaryCategoryName && (
                    <div>
                      <dt>{strings.details.primaryCategory}</dt>
                      <dd>{primaryCategoryName}</dd>
                    </div>
                  )}
                  {categoryLabel && (
                    <div>
                      <dt>{strings.details.category}</dt>
                      <dd>{categoryLabel}</dd>
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

import Footer from "@/components/Footer";
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
import { mapAuthors } from "@/lib/authors";
import { getDocumentTypeLabel } from "@/lib/documentTypes";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isRtlLocale } from "@/i18n/config";

const buildStrings = (t) => ({
  breadcrumbs: {
    home: { label: t("breadcrumbs.home.label"), href: t("breadcrumbs.home.href") },
    library: { label: t("breadcrumbs.library.label"), href: t("breadcrumbs.library.href") },
    journals: { label: t("breadcrumbs.journals.label"), href: t("breadcrumbs.journals.href") },
    issue: t("breadcrumbs.issue", {
      volume: "{volume}",
      number: "{number}",
      year: "{year}",
    }),
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
    issueContext: t("header.issueContext", {
      volume: "{volume}",
      number: "{number}",
      year: "{year}",
    }),
    pages: t("header.pages", { pages: "{pages}" }),
    valueUnknown: t("header.valueUnknown"),
    labels: {
      authors: t("header.labels.authors"),
      year: t("header.labels.year"),
      type: t("header.labels.type"),
      language: t("header.labels.language"),
      pages: t("header.labels.pages"),
    },
    imageAlt: t("header.imageAlt", { title: "{title}" }),
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

export async function generateMetadata(context) {
  const locale = context?.params?.locale || defaultLocale;
  const params = await context?.params;
  const id = params?.id;
  if (!id) return {};

  const metaT = await getTranslations({ locale, namespace: "library.articleDetail.meta" });

  try {
    const doc = await getDocument(id, { locale });
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

export default async function DocumentDetailPage(context) {
  const locale = context?.params?.locale || defaultLocale;
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    notFound();
  }

  let document;
  try {
    document = await getDocument(id, { locale });
  } catch (error) {
    if (error?.message?.includes("404")) {
      notFound();
    }
    throw error;
  }

  const t = await getTranslations({ locale, namespace: "library.articleDetail" });
  const tTypes = await getTranslations({ locale, namespace: "shared.documentTypes" });
  const strings = buildStrings(t);

  const documentTitle = document.title?.trim() || strings.header.valueUnknown;
  const resolvedAuthorEntries = mapAuthors(document.authors, locale);
  const authorEntries =
    resolvedAuthorEntries.length > 0
      ? resolvedAuthorEntries
      : document.author
        ? [{ key: "fallback-author", name: document.author, affiliation: null }]
        : [];

  const authorsDetailValue =
    authorEntries.length > 0
      ? (
        <ul className="article-detail__author-list">
          {authorEntries.map((entry) => (
            <li key={entry.key} className="article-detail__author-list-item">
              <span className="article-detail__author-name">{entry.name}</span>
              {entry.affiliation && (
                <span className="article-detail__author-affiliation"> — {entry.affiliation}</span>
              )}
            </li>
          ))}
        </ul>
      )
      : strings.header.authorsFallback;
  const year = document.year ?? strings.header.yearFallback;
  const typeLabel = getDocumentTypeLabel(document.type, tTypes, strings.header.typeFallback);
  const languageRaw = document.language ?? strings.header.languageFallback;
  const language = String(languageRaw).toUpperCase();
  const pages =
    document.startPage && document.endPage
      ? `${document.startPage}-${document.endPage}`
      : document.pages || null;
  const pagesValue = pages ?? strings.header.valueUnknown;
  const coverImage = document.coverImage ?? document.cover_image_url ?? null;
  const normalizeMetaValue = (value) =>
    value === null || value === undefined || value === "" ? strings.header.valueUnknown : value;
  const issueVolume = document.issue?.volume ?? null;
  const issueNumber = document.issue?.number ?? null;
  const issueYear = document.issue?.year ?? null;
  const hasIssueMetadata =
    document.issue &&
    [issueVolume, issueNumber, issueYear].some(
      (value) => value !== null && value !== undefined && value !== ""
    );

  const issueContext = hasIssueMetadata
    ? strings.header.issueContext
      .replace("{volume}", String(normalizeMetaValue(issueVolume)))
      .replace("{number}", String(normalizeMetaValue(issueNumber)))
      .replace("{year}", String(normalizeMetaValue(issueYear)))
    : null;

  const issueBreadcrumbLabel = hasIssueMetadata
    ? strings.breadcrumbs.issue
      .replace("{volume}", String(normalizeMetaValue(issueVolume)))
      .replace("{number}", String(normalizeMetaValue(issueNumber)))
      .replace("{year}", String(normalizeMetaValue(issueYear)))
    : null;

  const journalName = document.journal?.name?.trim() || null;
  const journalLink = document.journal?.slug ? `/journals/${document.journal.slug}` : null;
  const coverAlt = strings.header.imageAlt.replace("{title}", documentTitle);
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
  const detailEntries = [
    { key: "authors", label: strings.header.labels.authors, value: authorsDetailValue },
    { key: "year", label: strings.header.labels.year, value: year },
    { key: "type", label: strings.header.labels.type, value: typeLabel },
    { key: "language", label: strings.header.labels.language, value: language },
    { key: "pages", label: strings.header.labels.pages, value: pagesValue },
  ];

  if (journalName) {
    detailEntries.push({
      key: "journal",
      label: strings.details.journal,
      value: journalLink ? <Link href={journalLink}>{journalName}</Link> : journalName,
    });
  }

  if (issueContext) {
    detailEntries.push({
      key: "issue",
      label: strings.details.issue,
      value: issueContext,
    });
  }

  if (document.doi) {
    detailEntries.push({
      key: "doi",
      label: strings.details.doi,
      value: (
        <a
          href={`https://doi.org/${document.doi}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {document.doi}
        </a>
      ),
    });
  }

  if (document.isbn) {
    detailEntries.push({
      key: "isbn",
      label: strings.details.isbn,
      value: document.isbn,
    });
  }

  if (document.issn) {
    detailEntries.push({
      key: "issn",
      label: strings.details.issn,
      value: document.issn,
    });
  }

  if (primaryCategoryName) {
    detailEntries.push({
      key: "primaryCategory",
      label: strings.details.primaryCategory,
      value: primaryCategoryName,
    });
  }

  if (categoryLabel) {
    detailEntries.push({
      key: "category",
      label: strings.details.category,
      value: categoryLabel,
    });
  }

  if (createdAt) {
    detailEntries.push({
      key: "createdAt",
      label: strings.details.createdAt,
      value: createdAt,
    });
  }

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

  if (journalName) {
    breadcrumbItems.push({
      label: journalName,
      href: journalLink ?? undefined,
    });
    if (issueBreadcrumbLabel) {
      breadcrumbItems.push({
        label: issueBreadcrumbLabel,
      });
    }
  }

  breadcrumbItems.push({ label: documentTitle, current: true });

  return (
    <AOSWrap>
      <section className="page-wrapper" style={{ backgroundColor: "#f7f8fc" }}>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className={detailClassName} lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
          <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} locale={locale} />

          <section className="article-detail__section">
            <header className="article-detail__header">
              <div
                className='section__header'
                data-aos='fade-up'
                data-aos-duration={900}
              >
                <h5 className="title-animation_inner mt-0"><span>{typeLabel} :</span> {documentTitle}</h5>
              </div>
            </header>

            <div className="article-detail__grid">
              <article className="article-detail__card article-detail__card--primary">
                {coverImage && (
                  <figure className="article-detail__cover">
                    <img src={coverImage} alt={coverAlt} loading="lazy" />
                  </figure>
                )}

                <section className="article-detail__block" aria-labelledby="article-abstract">
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

                <section className="article-detail__block" aria-labelledby="article-preview">
                  <h2 id="article-preview">{strings.preview.ariaLabel}</h2>
                  <DocumentPreview documentId={document.id} strings={strings.preview} />
                  <div className="article-detail__download">
                    <DocumentDownloadButton
                      documentId={document.id}
                      strings={strings.download}
                      tone="primary"
                    />
                  </div>
                </section>
              </article>

              <aside className="article-detail__card--info">
                <h2>{strings.details.title}</h2>
                <dl className="article-detail__info-list">
                  {detailEntries.map((entry) => (
                    <div key={entry.key}>
                      <dt>{entry.label}</dt>
                      <dd>{entry.value}</dd>
                    </div>
                  ))}
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
              </aside>
            </div>
          </section>
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
}

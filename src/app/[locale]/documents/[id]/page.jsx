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

export async function generateMetadata(context) {
  const locale = await getLocale();
  const params = await context?.params;
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

export default async function DocumentDetailPage(context) {
  const locale = await getLocale();
  const params = await context?.params;
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

  const documentTitle = document.title?.trim() || strings.header.valueUnknown;
  const authors = formatAuthors(document.authors) || strings.header.authorsFallback;
  const year = document.year ?? strings.header.yearFallback;
  const typeLabel = formatTypeLabel(document.type, strings.header.typeFallback);
  const languageRaw = document.language ?? strings.header.languageFallback;
  const language = String(languageRaw).toUpperCase();
  const pages =
    document.startPage && document.endPage
      ? `${document.startPage}-${document.endPage}`
      : document.pages || null;
  const pagesValue = pages ?? strings.header.valueUnknown;
  const coverImage = document.coverImage || null;
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
  const metaItems = [
    { key: "year", label: strings.header.labels.year, value: year },
    { key: "type", label: strings.header.labels.type, value: typeLabel },
    { key: "language", label: strings.header.labels.language, value: language },
    { key: "pages", label: strings.header.labels.pages, value: pagesValue },
  ];

  const typeClass = (document.type || "document")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const detailClassName = `article-detail article-detail--${typeClass}`;

  const breadcrumbItems = [
    strings.breadcrumbs.home,
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
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className={detailClassName}>
          <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} />

          <section className="article-detail__section">
            <header className="article-detail__header">
              <div className="article-detail__intro">
                <div
          className='section__header'
          data-aos='fade-up'
          data-aos-duration={900}
        >
          <h5 className="title-animation_inner mt-0"><span>{typeLabel} :</span> {documentTitle}</h5>

        </div>
                <p className="article-detail__byline">
                  <strong>{strings.header.labels.authors}</strong>
                  <span>{authors}</span>
                </p>
                {(journalName || issueContext) && (
                  <p className="article-detail__context">
                    {journalName && (
                      <>
                        <strong>{strings.header.journalContext}</strong>
                        {journalLink ? (
                          <Link href={journalLink}>{journalName}</Link>
                        ) : (
                          <span>{journalName}</span>
                        )}
                      </>
                    )}
                    {issueContext && (
                      <span className="article-detail__issue">
                        {journalName ? strings.header.metaSeparator : ""}
                        {issueContext}
                      </span>
                    )}
                  </p>
                )}
                <div className="article-detail__actions">
                  <DocumentDownloadButton
                    documentId={document.id}
                    strings={strings.download}
                    tone="primary"
                  />
                </div>
                {(document.doi || document.isbn || document.issn) && (
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
                )}
              </div>
              <dl className="article-detail__meta">
                {metaItems.map((item) => (
                  <div key={item.key}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
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
                </section>
              </article>

              <aside className="article-detail__card article-detail__card--info">
                <h2>{strings.details.title}</h2>
                <dl className="article-detail__info-list">
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
              </aside>
            </div>
          </section>
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
}

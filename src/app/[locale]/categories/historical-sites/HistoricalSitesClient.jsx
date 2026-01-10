"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import Pagination from "@/components/search/Pagination";
import { Link } from "@/i18n/navigation";
import useCategoryDocuments from "@/hooks/useCategoryDocuments";
import { getFirstAuthor } from "@/lib/authors";
import { isRtlLocale } from "@/i18n/config";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80",
];

const formatLanguage = (value) => {
  if (!value) return null;
  return value.toString().toUpperCase();
};

const truncate = (value, length = 220) => {
  if (!value) return null;
  if (value.length <= length) return value;
  return `${value.slice(0, Math.max(length - 3, 0))}...`;
};

const HistoricalSitesClient = ({ category }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("library.historicalSites");
  const tToolbar = useTranslations("library.categories.toolbar");
  const tPagination = useTranslations("shared.pagination");
  const slug = category?.slug ?? "historical-sites";
  const documentsCount = category?.counts?.documents ?? null;

  const {
    items,
    total,
    page,
    loading,
    error,
    q,
    setQ,
    sort,
    setSort,
    setPage,
    hasNext,
    hasLoadedOnce,
  } = useCategoryDocuments(slug, { includeDescendants: true });

  const summaryLabel = useMemo(() => {
    if (loading && !hasLoadedOnce) {
      return tToolbar("loading");
    }
    if (loading && hasLoadedOnce) {
      return tToolbar("refreshing");
    }
    if (error) {
      return t("error.message");
    }
    if (!loading && hasLoadedOnce && total === 0) {
      return tToolbar("empty");
    }
    if (!loading && total > 0) {
      return tToolbar("resultsSummary", { count: total });
    }
    return tToolbar("default");
  }, [loading, hasLoadedOnce, total, error, tToolbar, t]);

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
    setPage(1);
  };

  const formatPages = (value) => {
    if (!value) return null;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    return t("cards.pages", { count: numeric });
  };

  const documents = useMemo(() => items ?? [], [items]);
  const titleFallback = t("title");
  const descriptionFallback = t("subtitle");
  const cardTitleFallback = t("cards.titleFallback");
  const cardDescriptionFallback = t("cards.descriptionFallback");
  const paginationLabels = useMemo(
    () => ({
      aria: t("pagination.ariaLabel"),
      prev: tPagination("previous"),
      next: tPagination("next"),
      page: (pageNumber) => tPagination("page", { page: pageNumber }),
    }),
    [t, tPagination],
  );

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader
        title={titleFallback}
        description={descriptionFallback}
        meta={
          documentsCount !== null ? (
            <span>{tToolbar("resultsSummary", { count: documentsCount })}</span>
          ) : null
        }
      />

      <CategoryToolbar
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        summaryLabel={summaryLabel}
        onReset={handleReset}
      />

      <section className="collection-card-section">
        {loading && !hasLoadedOnce && (
          <div className="collection-card-grid" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={`historical-skeleton-${index}`} className="collection-card collection-card--skeleton">
                <div className="collection-card__image shimmer" />
                <div className="collection-card__body">
                  <span className="collection-card__title shimmer" />
                  <span className="collection-card__excerpt shimmer" />
                  <span className="collection-card__excerpt shimmer" />
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="category-grid category-grid--collections category-grid--empty" role="alert">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <p>{t("error.message")}</p>
            <p className="category-card__description--muted">{String(error)}</p>
          </div>
        )}

        {!loading && !error && documents.length === 0 && hasLoadedOnce && (
          <div className="category-grid category-grid--collections category-grid--empty" role="status">
            <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
            <p>{t("empty.title")}</p>
            <p className="category-card__description--muted">{t("empty.description")}</p>
          </div>
        )}

        {!error && documents.length > 0 && (
          <div className="collection-card-grid">
            {documents.map((document, index) => {
              const imageUrl =
                document.coverImage ||
                document.lead_image ||
                document.thumbnail ||
                FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const title = document.title?.trim() || cardTitleFallback;
              const abstract = truncate(document.abstract);
              const language = formatLanguage(document.language ?? document.lang);
              const pages = formatPages(document.pages);
              const linkHref = document.id ? `/documents/${document.id}` : null;
              const firstAuthor = getFirstAuthor(document.authors, locale);
              const authorEntry =
                firstAuthor ?? (document.author ? { name: document.author, affiliation: null } : null);
              const imageAlt = t("cards.imageAlt", { title });

              return (
                <article key={document.id ?? `${document.title}-${index}`} className="collection-card">
                  <div className="collection-card__image">
                    <img src={imageUrl} alt={imageAlt} loading="lazy" />
                  </div>
                  <div className="collection-card__body">
                    <h6 className="collection-card__title">{title}</h6>
                    {authorEntry && (
                      <p className="collection-card__author">
                        <span>{authorEntry.name}</span>
                        {authorEntry.affiliation && (
                          <span className="collection-card__author-affiliation"> — {authorEntry.affiliation}</span>
                        )}
                      </p>
                    )}
                    {abstract ? (
                      <p className="collection-card__excerpt">{abstract}</p>
                    ) : (
                      <p className="collection-card__excerpt collection-card__excerpt--muted">
                        {cardDescriptionFallback}
                      </p>
                    )}
                    <ul className="collection-card__meta">
                      {document.year && (
                        <li>
                          <i className="fa-regular fa-calendar" aria-hidden="true"></i> {document.year}
                        </li>
                      )}
                      {language && (
                        <li>
                          <i className="fa-regular fa-message-lines" aria-hidden="true"></i> {language}
                        </li>
                      )}
                      {pages && (
                        <li>
                          <i className="fa-regular fa-file-lines" aria-hidden="true"></i> {pages}
                        </li>
                      )}
                    </ul>
                    <div className="collection-card__actions">
                      {linkHref ? (
                        <Link href={linkHref} className="collection-card__action">
                          {t("cards.readMore")} <i className="fa-solid fa-circle-arrow-right flip-x" />
                        </Link>
                      ) : (
                        <span className="collection-card__action collection-card__action--disabled">
                          {t("cards.unavailable")}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {hasLoadedOnce && (documents.length > 0 || hasNext) && !error && (
          <Pagination
            page={page}
            hasNext={hasNext}
            setPage={setPage}
            loading={loading}
            content={{ pagination: paginationLabels }}
          />
        )}
      </section>
    </section>
  );
};

export default HistoricalSitesClient;

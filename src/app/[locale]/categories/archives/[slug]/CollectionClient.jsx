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
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
];

const formatLanguage = (value) => {
  if (!value) return null;
  return value.toString().toUpperCase();
};

const formatPages = (value, t) => {
  if (!value) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return t("collection.pages", { count: numeric });
};

const truncate = (value, length = 220) => {
  if (!value) return null;
  if (value.length <= length) return value;
  return `${value.slice(0, Math.max(length - 3, 0))}...`;
};

const formatSummary = ({ loading, hasLoadedOnce, total, page, t }) => {
  if (loading && !hasLoadedOnce) {
    return t("collection.summary.loading");
  }
  if (loading && hasLoadedOnce) {
    return t("collection.summary.refreshing");
  }
  if (!loading && hasLoadedOnce && total === 0) {
    return t("collection.summary.empty");
  }
  if (!loading && total > 0) {
    return t("collection.summary.available", { count: total, page });
  }
  return t("collection.summary.default");
};


const CollectionClient = ({ category, slug }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("library.categories");

  const {
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    q,
    setQ,
    sort,
    setSort,
    setPage,
    hasNext,
    hasLoadedOnce,
  } = useCategoryDocuments(slug, { includeDescendants: false });

  const summaryLabel = formatSummary({ loading, hasLoadedOnce, total, page, t });
  const titleFallback = t("collection.documentTitleFallback");
  const descriptionFallback = t("collection.documentDescriptionFallback");

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
    setPage(1);
  };

  const documents = useMemo(() => items ?? [], [items]);
  const paginationLabels = useMemo(
    () => ({
      aria: t("collection.pagination.ariaLabel"),
      prev: t("collection.pagination.previous"),
      next: t("collection.pagination.next"),
      page: (pageNumber) => t("collection.pagination.page", { page: pageNumber }),
    }),
    [t]
  );

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader
        title={category?.name}
        description={category?.description}
        meta={
          <span>
            {t("collection.meta", { count: total })}
          </span>
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
              <article key={`skeleton-${index}`} className="collection-card collection-card--skeleton">
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
            <p>{t("collection.errorTitle")}</p>
            <p className="category-card__description--muted">{String(error)}</p>
          </div>
        )}

        {!loading && !error && documents.length === 0 && hasLoadedOnce && (
          <div className="category-grid category-grid--collections category-grid--empty" role="status">
            <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
            <p>{t("collection.emptyTitle")}</p>
            <p className="category-card__description--muted">{t("collection.emptyDescription")}</p>
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
              const title = document.title ?? titleFallback;
              const abstract = truncate(document.abstract);
              const language = formatLanguage(document.language ?? document.lang);
              const pages = formatPages(document.pages, t);
              const linkHref = document.id ? `/documents/${document.id}` : null;
              const firstAuthor = getFirstAuthor(document.authors, locale);
              const authorEntry =
                firstAuthor ?? (document.author ? { name: document.author, affiliation: null } : null);
              const imageAlt = t("collection.imageAlt", { title });

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
                          <span className="collection-card__author-affiliation"> - {authorEntry.affiliation}</span>
                        )}
                      </p>
                    )}
                    {abstract ? (
                      <p className="collection-card__excerpt">{abstract}</p>
                    ) : (
                      <p className="collection-card__excerpt collection-card__excerpt--muted">
                        {descriptionFallback}
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
                          {t("collection.readMore")} <i className="fa-solid fa-circle-arrow-right flip-x" />
                        </Link>
                      ) : (
                        <span className="collection-card__action collection-card__action--disabled">
                          {t("collection.unavailable")}
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

export default CollectionClient;

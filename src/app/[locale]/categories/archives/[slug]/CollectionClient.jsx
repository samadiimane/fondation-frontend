"use client";

import { useMemo } from "react";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import Pagination from "@/components/search/Pagination";
import { Link } from "@/i18n/navigation";
import useCategoryDocuments from "@/hooks/useCategoryDocuments";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
];

const formatLanguage = (value) => {
  if (!value) return "";
  return value.toString().toUpperCase();
};

const formatPages = (value) => {
  if (!value) return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `${numeric} pages`;
};

const truncate = (value, length = 220) => {
  if (!value) return null;
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1)}`;
};

const formatSummary = ({ loading, hasLoadedOnce, total, page }) => {
  if (loading && !hasLoadedOnce) {
    return "Loading documents for this collection";
  }
  if (loading && hasLoadedOnce) {
    return "Refreshing documents";
  }
  if (!loading && hasLoadedOnce && total === 0) {
    return "No documents matched the current filters.";
  }
  if (!loading && total > 0) {
    return `${total} document${total === 1 ? "" : "s"} available  page ${page}`;
  }
  return "Browse documents associated with this collection.";
};

const CollectionClient = ({ category, slug }) => {
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

  const summaryLabel = formatSummary({ loading, hasLoadedOnce, total, page });

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
    setPage(1);
  };

  const documents = useMemo(() => items ?? [], [items]);

  return (
    <>
      <CategoryHeader
        title={category?.name}
        description={category?.description}
        meta={
          <span>
            {total} document{total === 1 ? "" : "s"} catalogued
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
            <p>We could not load archival documents for this collection.</p>
            <p className="category-card__description--muted">{String(error)}</p>
          </div>
        )}

        {!loading && !error && documents.length === 0 && hasLoadedOnce && (
          <div className="category-grid category-grid--collections category-grid--empty" role="status">
            <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
            <p>No documents match your current filters.</p>
            <p className="category-card__description--muted">Try adjusting your search term or clearing the filters.</p>
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
              const abstract = truncate(document.abstract);
              const language = formatLanguage(document.language ?? document.lang);
              const pages = formatPages(document.pages);
              const linkHref = document.id ? `/documents/${document.id}` : null;

              return (
                <article key={document.id ?? `${document.title}-${index}`} className="collection-card">
                  <div className="collection-card__image">
                    <img src={imageUrl} alt={document.title ? `${document.title} cover` : "Archive item"} loading="lazy" />
                  </div>
                  <div className="collection-card__body">
                    <h6 className="collection-card__title">{document.title ?? "Untitled"}</h6>
                    {abstract ? (
                      <p className="collection-card__excerpt">{abstract}</p>
                    ) : (
                      <p className="collection-card__excerpt collection-card__excerpt--muted">
                        Description for this document will be added soon.
                      </p>
                    )}
                    <ul className="collection-card__meta">
                      {document.year && (
                        <li>
                          <i className="fa-regular fa-calendar" aria-hidden="true"></i> {document.year}
                        </li>
                      )}
                      {language && language !== "" && (
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
                          Read more <i className='fa-solid fa-circle-arrow-right' />
                        </Link>
                      ) : (
                        <span className="collection-card__action collection-card__action--disabled">Unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {hasLoadedOnce && (documents.length > 0 || hasNext) && !error && (
          <Pagination page={page} hasNext={hasNext} setPage={setPage} loading={loading} />
        )}
      </section>
    </>
  );
};

export default CollectionClient;

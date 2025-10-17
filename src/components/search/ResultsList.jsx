"use client";

import { memo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Skeleton from "@/components/Skeleton";

const formatTypeClass = (type = "") => type.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const ResultCard = memo(({ document, viewMode }) => {
  const formatIcon = (() => {
    const format = document.format ?? document.type;
    switch ((format || "").toLowerCase()) {
      case "pdf":
        return "fa-solid fa-file-pdf";
      case "digital archive":
        return "fa-solid fa-database";
      case "epub":
        return "fa-solid fa-book";
      default:
        return "fa-solid fa-file-lines";
    }
  })();

  const typeClass = formatTypeClass(document.type);

  const abstract = document.abstract || "";
  const trimmedAbstract = abstract.length > 320 ? `${abstract.slice(0, 317)}…` : abstract;

  const categoryName = document.primary_category?.name ?? document.primaryCategory?.name ?? "";
  const language = (document.language || document.lang || "").toString();

  return (
    <article className={`result-card ${viewMode}`}>
      <div className="result-content">
        <header className="result-header">
          <h3 className="result-title">{document.title}</h3>
          <div className="result-badges">
            {document.type && (
              <span className={`type-badge ${typeClass}`}>
                <i className={formatIcon} aria-hidden="true"></i>
                {document.type}
              </span>
            )}
            {categoryName && (
              <span className="collection-badge">
                <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                {categoryName}
              </span>
            )}
            {document.year && (
              <span className="year-badge">
                <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                {document.year}
              </span>
            )}
          </div>
        </header>

        <div className="result-meta">
          {document.authors && <span className="result-author">{document.authors}</span>}
          {!document.authors && document.author && <span className="result-author">{document.author}</span>}
          {language && (
            <span className="result-language">
              <i className="fa-regular fa-message-lines" aria-hidden="true"></i>
              {language.toUpperCase()}
            </span>
          )}
          {document.pages && (
            <span className="result-pages">
              <i className="fa-regular fa-file-lines" aria-hidden="true"></i>
              {document.pages} pages
            </span>
          )}
        </div>

        {trimmedAbstract && <p className="result-abstract">{trimmedAbstract}</p>}

        <footer className="result-actions">
          <button type="button" className="result-action" disabled>
            <i className="fa-solid fa-eye" aria-hidden="true"></i>
            Preview
          </button>
          <button type="button" className="result-action" disabled>
            <i className="fa-solid fa-download" aria-hidden="true"></i>
            Download
          </button>
          <Link href={`/documents/${document.id}`} className="result-action link">
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            Details
          </Link>
        </footer>
      </div>
    </article>
  );
});

const ResultsList = ({
  items,
  loading,
  error,
  hasLoadedOnce,
  total,
  page,
  pageSize,
  sort,
  setSort,
  viewMode,
  onViewModeChange,
}) => {
  const handleSortChange = useCallback(
    (event) => {
      setSort?.(event.target.value);
    },
    [setSort]
  );

  const handleSetView = useCallback(
    (mode) => () => onViewModeChange?.(mode),
    [onViewModeChange]
  );

  return (
    <div className="results-panel">
      <div className="results-header">
        <div className="results-info">
          <h3 className="results-title">
            <i className="fa-solid fa-list-check" aria-hidden="true"></i>
            Research Results
          </h3>
          <p className="results-count">
            {loading && !hasLoadedOnce && "Searching the collection…"}
            {loading && hasLoadedOnce && "Refreshing results…"}
            {!loading && hasLoadedOnce && total > 0 && (
              <>
                Found {total} document{total === 1 ? "" : "s"} (page {page} of {Math.max(Math.ceil(total / pageSize), 1)}
                )
              </>
            )}
            {!loading && hasLoadedOnce && total === 0 && "No documents found for this search."}
            {!loading && !hasLoadedOnce && "Start exploring the collection by searching our library."}
          </p>
        </div>
        <div className="results-controls">
          <div className="view-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === "detailed" ? "active" : ""}`}
              onClick={handleSetView("detailed")}
              aria-label="Detailed view"
            >
              <i className="fa-solid fa-list" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "compact" ? "active" : ""}`}
              onClick={handleSetView("compact")}
              aria-label="Compact view"
            >
              <i className="fa-solid fa-bars" aria-hidden="true"></i>
            </button>
          </div>
          <select className="sort-select" value={sort} onChange={handleSortChange}>
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="year_desc">Year Descending</option>
            <option value="year_asc">Year Ascending</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
          </select>
        </div>
      </div>

      <div className={`results-grid ${viewMode}`}>
        {loading && !hasLoadedOnce &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="result-card skeleton-card"
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <Skeleton style={{ width: "60%", height: "1.1rem" }} />
              <Skeleton style={{ width: "40%", height: "0.9rem" }} />
              <Skeleton style={{ width: "100%", height: "0.9rem" }} />
              <Skeleton style={{ width: "80%", height: "0.9rem" }} />
            </div>
          ))}

        {items.map((document) => (
          <ResultCard key={document.id ?? document.title} document={document} viewMode={viewMode} />
        ))}

        {!loading && hasLoadedOnce && items.length === 0 && !error && (
          <div className="result-card empty-result">
            <div className="result-content">
              <i className="fa-solid fa-magnifying-glass mb-3" aria-hidden="true"></i>
              <h4 className="result-title">No documents found</h4>
              <p>Try adjusting your keywords or filters to discover more resources.</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="results-error" role="alert">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default memo(ResultsList);

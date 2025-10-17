"use client";

import { memo, useCallback } from "react";

const SORT_OPTIONS = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
  { value: "year_desc", label: "Year (desc)" },
  { value: "year_asc", label: "Year (asc)" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
];

const ResultsToolbar = ({
  loading,
  total,
  page,
  pageSize,
  hasLoadedOnce,
  sort,
  setSort,
  onOpenFilters,
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
    (mode) => () => {
      onViewModeChange?.(mode);
    },
    [onViewModeChange]
  );

  const totalPages = Math.max(Math.ceil(total / (pageSize || 1)), 1);

  return (
    <header className="results-toolbar">
      <div className="results-toolbar__meta">
        <h2 className="results-toolbar__title">Results</h2>
        <p className="results-toolbar__summary" aria-live="polite">
          {loading && !hasLoadedOnce && "Searching the collection..."}
          {loading && hasLoadedOnce && "Refreshing results..."}
          {!loading && hasLoadedOnce && total > 0 && (
            <>
              {total} document{total === 1 ? "" : "s"} - Page {page} of {totalPages}
            </>
          )}
          {!loading && hasLoadedOnce && total === 0 && "No documents found for this search."}
          {!loading && !hasLoadedOnce && "Start exploring the library by running a search."}
        </p>
      </div>
      <div className="results-toolbar__actions">
        {onOpenFilters && (
          <button type="button" className="results-toolbar__filters" onClick={onOpenFilters}>
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
            Filters
          </button>
        )}
        <div className="results-toolbar__view" role="group" aria-label="Change view mode">
          <button
            type="button"
            className={`results-toolbar__view-btn ${viewMode === "detailed" ? "is-active" : ""}`}
            onClick={handleSetView("detailed")}
          >
            <span className="sr-only">Detailed view</span>
            <i className="fa-solid fa-list" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className={`results-toolbar__view-btn ${viewMode === "compact" ? "is-active" : ""}`}
            onClick={handleSetView("compact")}
          >
            <span className="sr-only">Compact view</span>
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
        </div>
        <label className="results-toolbar__sort">
          <span className="sr-only">Sort results</span>
          <select value={sort} onChange={handleSortChange} aria-label="Sort results">
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};

export default memo(ResultsToolbar);

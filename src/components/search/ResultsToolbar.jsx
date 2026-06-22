"use client";

import {memo, useCallback} from "react";

const ResultsToolbar = ({
  loading,
  error,
  total,
  page,
  pageSize,
  hasLoadedOnce,
  sort,
  setSort,
  onOpenFilters,
  viewMode,
  onViewModeChange,
  activeFiltersSummary,
  content,
  textAlign
}) => {
  const hasError = Boolean(error);

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
        <h2 className="results-toolbar__title">{content.toolbar.title}</h2>
        <p className={`results-toolbar__summary ${textAlign}`} aria-live="polite">
          {loading && !hasLoadedOnce && content.toolbar.searching}
          {loading && hasLoadedOnce && content.toolbar.refreshing}
          {!loading && hasError && content.unavailable.title}
          {!loading && !hasError && hasLoadedOnce && total > 0 && content.toolbar.results(total, page, totalPages)}
          {!loading && !hasError && hasLoadedOnce && total === 0 && content.toolbar.noResults}
          {!loading && !hasLoadedOnce && content.toolbar.start}
          {activeFiltersSummary ? ` — ${activeFiltersSummary}` : ""}
        </p>
      </div>
      <div className="results-toolbar__actions">
        {onOpenFilters && (
          <button type="button" className="results-toolbar__filters" onClick={onOpenFilters}>
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
            {content.toolbar.filtersButton}
          </button>
        )}
        <div className="results-toolbar__view" role="group" aria-label={content.toolbar.viewGroupAria}>
          <button
            type="button"
            className={`results-toolbar__view-btn ${viewMode === "detailed" ? "is-active" : ""}`}
            onClick={handleSetView("detailed")}
          >
            <span className="sr-only">{content.toolbar.viewDetailed}</span>
            <i className="fa-solid fa-list" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className={`results-toolbar__view-btn ${viewMode === "compact" ? "is-active" : ""}`}
            onClick={handleSetView("compact")}
          >
            <span className="sr-only">{content.toolbar.viewCompact}</span>
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
        </div>
        <label className="results-toolbar__sort">
          <span className="sr-only">{content.toolbar.sortAria}</span>
          <select value={sort} onChange={handleSortChange} aria-label={content.toolbar.sortAria}>
            {content.toolbar.sortOptions.map((option) => (
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

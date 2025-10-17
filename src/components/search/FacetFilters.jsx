"use client";

import { memo, useCallback, useMemo } from "react";

const FacetFilters = ({
  facets,
  typeSelected,
  toggleType,
  langSelected,
  toggleLang,
  categorySlug,
  setCategorySlug,
  yearMin,
  setYearMin,
  yearMax,
  setYearMax,
  resetFilters,
  loading,
}) => {
  const yearBuckets = facets.year?.buckets ?? [];

  const handleBucketSelect = useCallback(
    (bucket) => {
      setYearMin(bucket.from);
      setYearMax(bucket.to);
    },
    [setYearMin, setYearMax]
  );

  const typeOptions = useMemo(() => facets.type ?? [], [facets.type]);
  const langOptions = useMemo(() => facets.lang ?? [], [facets.lang]);
  const categoryOptions = useMemo(() => facets.category ?? [], [facets.category]);

  return (
    <aside className="filters-panel" aria-label="Facet filters">
      <div className="filters-card">
        <div className="filters-header">
          <h3 className="filters-title">Filter Results</h3>
          <button
            type="button"
            className="filter-clear"
            onClick={resetFilters}
            disabled={loading}
          >
            <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
            Reset
          </button>
        </div>

        <div className="filters-group">
          <h4 className="filter-label">Type</h4>
          <ul className="facet-list">
            {typeOptions.length === 0 && <li className="facet-empty">No types available</li>}
            {typeOptions.map(({ value, count }) => {
              const checked = typeSelected.includes(value);
              return (
                <li key={value}>
                  <label className={`facet-option ${checked ? "active" : ""}`}>
                    <input
                      type="checkbox"
                      value={value}
                      checked={checked}
                      onChange={() => toggleType(value)}
                      disabled={loading}
                    />
                    <span className="facet-name">{value}</span>
                    <span className="facet-count">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="filters-group">
          <h4 className="filter-label">Language</h4>
          <ul className="facet-list">
            {langOptions.length === 0 && <li className="facet-empty">No languages available</li>}
            {langOptions.map(({ value, count }) => {
              const checked = langSelected.includes(value);
              return (
                <li key={value}>
                  <label className={`facet-option ${checked ? "active" : ""}`}>
                    <input
                      type="checkbox"
                      value={value}
                      checked={checked}
                      onChange={() => toggleLang(value)}
                      disabled={loading}
                    />
                    <span className="facet-name">{value.toUpperCase()}</span>
                    <span className="facet-count">{count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="filters-group">
          <h4 className="filter-label">Category</h4>
          <ul className="facet-list">
            {categoryOptions.length === 0 && <li className="facet-empty">No categories available</li>}
            {categoryOptions.map(({ slug, name, count }) => {
              const isActive = categorySlug === slug;
              return (
                <li key={slug}>
                  <button
                    type="button"
                    className={`facet-option ${isActive ? "active" : ""}`}
                    onClick={() => setCategorySlug(isActive ? "" : slug)}
                    disabled={loading}
                  >
                    <span className="facet-name">{name}</span>
                    <span className="facet-count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="filters-group">
          <h4 className="filter-label">Year</h4>
          <div className="year-range-inputs">
            <label className="filter-label small" htmlFor="year-min">
              Min
            </label>
            <input
              id="year-min"
              type="number"
              value={yearMin ?? ""}
              onChange={(event) => {
                const { value } = event.target;
                if (value === "") {
                  setYearMin("");
                  return;
                }
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                  setYearMin(parsed);
                }
              }}
              className="filter-input"
              placeholder={facets.year?.min ?? "From"}
              disabled={loading}
            />
            <label className="filter-label small" htmlFor="year-max">
              Max
            </label>
            <input
              id="year-max"
              type="number"
              value={yearMax ?? ""}
              onChange={(event) => {
                const { value } = event.target;
                if (value === "") {
                  setYearMax("");
                  return;
                }
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                  setYearMax(parsed);
                }
              }}
              className="filter-input"
              placeholder={facets.year?.max ?? "To"}
              disabled={loading}
            />
          </div>

          {yearBuckets.length > 0 && (
            <div className="facet-buckets">
              {yearBuckets.map((bucket) => {
                const isActive = yearMin === bucket.from && yearMax === bucket.to;
                return (
                  <button
                    key={`${bucket.from}-${bucket.to}`}
                    type="button"
                    className={`facet-bucket ${isActive ? "active" : ""}`}
                    onClick={() => handleBucketSelect(bucket)}
                    disabled={loading}
                  >
                    <span>
                      {bucket.from} – {bucket.to}
                    </span>
                    <span className="facet-count">{bucket.count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(FacetFilters);

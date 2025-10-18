"use client";

import { memo, useCallback } from "react";

const FiltersRow = ({
  facets,
  typeSelected,
  setTypeSelected,
  langSelected,
  setLangSelected,
  categorySlug,
  setCategorySlug,
  advancedOpen,
  onToggleAdvanced,
  loading,
}) => {
  const typeOptions = facets.type ?? [];
  const langOptions = facets.lang ?? [];
  const categoryOptions = facets.category ?? [];

  const handleTypeChange = useCallback(
    (event) => {
      const { value } = event.target;
      setTypeSelected(value ? [value] : []);
    },
    [setTypeSelected]
  );

  const handleLangChange = useCallback(
    (event) => {
      const { value } = event.target;
      setLangSelected(value ? [value] : []);
    },
    [setLangSelected]
  );

  const handleCategoryChange = useCallback(
    (event) => {
      setCategorySlug(event.target.value);
    },
    [setCategorySlug]
  );

  return (
    <section className="filters-row" aria-label="Primary filters">
      <label className="filters-row__item">
        <span className="filters-row__label">Type</span>
        <select
          value={typeSelected[0] || ""}
          onChange={handleTypeChange}
          disabled={loading}
        >
          <option value="">All types</option>
          {typeOptions.map(({ value, count }) => (
            <option key={value} value={value}>
              {value} ({count})
            </option>
          ))}
        </select>
      </label>

      <label className="filters-row__item">
        <span className="filters-row__label">Language</span>
        <select
          value={langSelected[0] || ""}
          onChange={handleLangChange}
          disabled={loading}
        >
          <option value="">All languages</option>
          {langOptions.map(({ value, count }) => (
            <option key={value} value={value}>
              {value.toUpperCase()} ({count})
            </option>
          ))}
        </select>
      </label>

      <label className="filters-row__item">
        <span className="filters-row__label">Category</span>
        <select
          value={categorySlug || ""}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <option value="">All categories</option>
          {categoryOptions.map(({ slug, name, count }) => (
            <option key={slug} value={slug}>
              {name} ({count})
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={`filters-row__advanced ${advancedOpen ? "is-active" : ""}`}
        onClick={onToggleAdvanced}
        aria-expanded={advancedOpen}
      >
        {advancedOpen ? "Hide advanced" : "Advanced search"}
      </button>
    </section>
  );
};

export default memo(FiltersRow);

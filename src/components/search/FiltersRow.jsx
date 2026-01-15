"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getDocumentTypeLabel } from "@/lib/documentTypes";

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
  content,
}) => {
  const tTypes = useTranslations("shared.documentTypes");
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
    <section className="filters-row" aria-label={content.filters.aria}>
      <label className="filters-row__item">
        <span className="filters-row__label">{content.filters.typeLabel}</span>
        <select
          value={typeSelected[0] || ""}
          onChange={handleTypeChange}
          disabled={loading}
        >
          <option value="">{content.filters.allTypes}</option>
          {typeOptions.map(({ value, count }) => {
            const rawValue = value ?? "";
            const label = getDocumentTypeLabel(rawValue, tTypes) || rawValue;
            return (
              <option key={rawValue} value={rawValue}>
                {label} ({count})
              </option>
            );
          })}
        </select>
      </label>

      <label className="filters-row__item">
        <span className="filters-row__label">{content.filters.langLabel}</span>
        <select
          value={langSelected[0] || ""}
          onChange={handleLangChange}
          disabled={loading}
        >
          <option value="">{content.filters.allLanguages}</option>
          {langOptions.map(({ value, count }) => (
            <option key={value} value={value}>
              {value.toUpperCase()} ({count})
            </option>
          ))}
        </select>
      </label>

      <label className="filters-row__item">
        <span className="filters-row__label">{content.filters.categoryLabel}</span>
        <select
          value={categorySlug || ""}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <option value="">{content.filters.allCategories}</option>
          {categoryOptions.map(({ slug, name, count }) => {
            const label =
              count === undefined || count === null
                ? name
                : `${name} (${count})`;
            return (
              <option key={slug} value={slug}>
                {label}
              </option>
            );
          })}
        </select>
      </label>

      <button
        type="button"
          className={`filters-row__advanced ${advancedOpen ? "is-active" : ""}`}
          onClick={onToggleAdvanced}
          aria-expanded={advancedOpen}
        >
        {advancedOpen ? content.filters.advancedClose : content.filters.advancedOpen}
      </button>
    </section>
  );
};

export default memo(FiltersRow);

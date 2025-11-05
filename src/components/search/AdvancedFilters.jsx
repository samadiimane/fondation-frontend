"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";

const AdvancedFilters = ({
  yearMin,
  setYearMin,
  yearMax,
  setYearMax,
  author,
  setAuthor,
  authorSupported = true,
  resetFilters,
  onClose,
  className = "",
}) => {
  const t = useTranslations("library.search");
  const handleYearMin = useCallback(
    (event) => {
      const { value } = event.target;
      if (value === "") {
        setYearMin("");
        return;
      }
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        setYearMin(parsed);
      }
    },
    [setYearMin]
  );

  const handleYearMax = useCallback(
    (event) => {
      const { value } = event.target;
      if (value === "") {
        setYearMax("");
        return;
      }
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        setYearMax(parsed);
      }
    },
    [setYearMax]
  );

  const handleAuthorChange = useCallback(
    (event) => {
      setAuthor?.(event.target.value);
    },
    [setAuthor]
  );

  return (
    <section className={`advanced-panel ${className}`.trim()} aria-label="Advanced search filters">
      <header className="advanced-panel__header">
        {onClose && (
          <button type="button" className="advanced-panel__close" onClick={onClose}>
            <span className="sr-only">Close advanced search</span>
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        )}
      </header>

      <div className="advanced-panel__body">
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-author">
            {t("authorLabel")}
          </label>
          <input
            id="advanced-author"
            type="search"
            className="advanced-panel__input"
            value={author ?? ""}
            onChange={handleAuthorChange}
            placeholder={t("authorPlaceholder")}
            autoComplete="off"
            disabled={!authorSupported}
          />
        </div>
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-year-min">
            Publication year (from)
          </label>
          <input
            id="advanced-year-min"
            type="number"
            className="advanced-panel__input"
            value={yearMin ?? ""}
            onChange={handleYearMin}
            placeholder="e.g. 1900"
          />
        </div>
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-year-max">
            Publication year (to)
          </label>
          <input
            id="advanced-year-max"
            type="number"
            className="advanced-panel__input"
            value={yearMax ?? ""}
            onChange={handleYearMax}
            placeholder="e.g. 2024"
          />
        </div>
      </div>

      <div className="advanced-panel__footer">
        <button type="button" className="advanced-panel__reset" onClick={resetFilters}>
          <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
          Reset all filters
        </button>
      </div>
    </section>
  );
};

export default memo(AdvancedFilters);

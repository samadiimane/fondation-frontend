"use client";

import { memo, useCallback } from "react";

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
  content,
}) => {
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
    <section className={`advanced-panel ${className}`.trim()} aria-label={content.advanced.aria}>
      <header className="advanced-panel__header">
        {onClose && (
          <button type="button" className="advanced-panel__close" onClick={onClose}>
            <span className="sr-only">{content.advanced.closeSr}</span>
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        )}
      </header>

      <div className="advanced-panel__body">
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-author">
            {content.advanced.authorLabel}
          </label>
          <input
            id="advanced-author"
            type="search"
            className="advanced-panel__input"
            value={author ?? ""}
            onChange={handleAuthorChange}
            placeholder={content.advanced.authorPlaceholder}
            autoComplete="off"
            disabled={!authorSupported}
          />
        </div>
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-year-min">
            {content.advanced.yearFrom}
          </label>
          <input
            id="advanced-year-min"
            type="number"
            className="advanced-panel__input"
            value={yearMin ?? ""}
            onChange={handleYearMin}
            placeholder={content.advanced.yearFromPlaceholder}
          />
        </div>
        <div className="advanced-panel__group">
          <label className="advanced-panel__label" htmlFor="advanced-year-max">
            {content.advanced.yearTo}
          </label>
          <input
            id="advanced-year-max"
            type="number"
            className="advanced-panel__input"
            value={yearMax ?? ""}
            onChange={handleYearMax}
            placeholder={content.advanced.yearToPlaceholder}
          />
        </div>
      </div>

      <div className="advanced-panel__footer">
        <button type="button" className="advanced-panel__reset" onClick={resetFilters}>
          <i className="fa-solid fa-rotate-left" aria-hidden="true"></i>
          {content.advanced.reset}
        </button>
      </div>
    </section>
  );
};

export default memo(AdvancedFilters);

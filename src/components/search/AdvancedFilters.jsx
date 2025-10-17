"use client";

import { memo, useCallback } from "react";

const AdvancedFilters = ({
  yearMin,
  setYearMin,
  yearMax,
  setYearMax,
  resetFilters,
  onClose,
  className = "",
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

  return (
    <section className={`advanced-panel ${className}`.trim()} aria-label="Advanced search filters">
      <header className="advanced-panel__header">
        <h3 className="advanced-panel__title">
          <i className="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>
          Advanced search
        </h3>
        {onClose && (
          <button type="button" className="advanced-panel__close" onClick={onClose}>
            <span className="sr-only">Close advanced search</span>
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        )}
      </header>

      <div className="advanced-panel__body">
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

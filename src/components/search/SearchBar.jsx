"use client";

import { memo, useCallback } from "react";

const SearchBar = ({ value, onChange, onSubmit, loading }) => {
  const handleChange = useCallback(
    (event) => {
      onChange?.(event.target.value);
    },
    [onChange]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit?.();
    },
    [onSubmit]
  );

  return (
    <div className="search-bar-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <div className="search-icon">
            <i className="fa-solid fa-search" aria-hidden="true"></i>
          </div>
          <input
            type="search"
            value={value}
            onChange={handleChange}
            className="search-input"
            placeholder="Search documents, themes, or keywords..."
            aria-label="Search documents"
          />
          <button type="submit" className="search-button" disabled={loading}>
            <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-search"}`} aria-hidden="true"></i>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(SearchBar);

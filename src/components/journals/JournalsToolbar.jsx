"use client";

import { useCallback } from "react";

const JournalsToolbar = ({
  strings,
  q,
  onQueryChange,
  issn,
  onIssnChange,
  sort,
  onSortChange,
  summary,
  loading,
}) => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form className="journals-toolbar mb-3" role="search" onSubmit={handleSubmit}>
      <div className="journals-toolbar__inputs">
        <div className="journals-toolbar__field">
          <label htmlFor="journals-search">{strings.searchLabel}</label>
          <input
            id="journals-search"
            type="search"
            placeholder={strings.searchPlaceholder}
            value={q}
            onChange={(event) => onQueryChange(event.target.value)}
            autoComplete="off"
            inputMode="search"
          />
        </div>

        <div className="journals-toolbar__field journals-toolbar__field--narrow">
          <label htmlFor="journals-issn">{strings.issnLabel}</label>
          <input
            id="journals-issn"
            type="text"
            placeholder={strings.issnPlaceholder}
            value={issn}
            onChange={(event) => onIssnChange(event.target.value)}
            inputMode="numeric"
            pattern="[0-9Xx-]*"
            autoComplete="off"
          />
        </div>

        <div className="journals-toolbar__field journals-toolbar__field--select">
          <label htmlFor="journals-sort">{strings.sortLabel}</label>
          <select
            id="journals-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="name_asc">{strings.sortOptions.nameAsc}</option>
            <option value="name_desc">{strings.sortOptions.nameDesc}</option>
            <option value="created_desc">{strings.sortOptions.createdDesc}</option>
          </select>
        </div>
      </div>

      <div className="journals-toolbar__summary" role="status" aria-live="polite">
        <span>{loading ? strings.loading : summary}</span>
      </div>
    </form>
  );
};

export default JournalsToolbar;

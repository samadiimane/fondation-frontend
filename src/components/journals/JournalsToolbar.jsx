"use client";

import { useCallback } from "react";
import { isRtlLocale } from "@/i18n/config";

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
  locale,
  subtitle,
}) => {
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  const isRtl = isRtlLocale(locale);

  return (
    <form
      className="journals-toolbar mb-3"
      role="search"
      onSubmit={handleSubmit}
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
    >
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

      <div
        className="journals-toolbar__summary d-flex align-items-center gap-2 flex-wrap"
        role="status"
        aria-live="polite"
      >
        <span>{loading ? strings.loading : summary}</span>
        {subtitle ? <span className="mb-0 journals-toolbar__subtitle">{subtitle}</span> : null}
      </div>
    </form>
  );
};

export default JournalsToolbar;

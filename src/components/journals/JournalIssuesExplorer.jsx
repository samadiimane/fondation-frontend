"use client";

import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import useJournalIssues from "@/hooks/useJournalIssues";

const JournalIssuesExplorer = ({ slug, locale, strings }) => {
  const {
    items,
    total,
    page,
    pageSize,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    sort,
    setSort,
    yearMin,
    setYearMin,
    yearMax,
    setYearMax,
    number,
    setNumber,
    setPage,
    resetFilters,
    announcement,
  } = useJournalIssues({ slug, locale });

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);

  const summaryText = strings.summaryTemplate.replace(
    "{count}",
    numberFormatter.format(total ?? 0)
  );

  const canShowPagination = !error && (total > pageSize || page > 1 || hasNext);

  const isRtl = typeof locale === "string" && locale.toLowerCase().startsWith("ar");
  const previousIcon = isRtl ? "fa-arrow-right" : "fa-arrow-left";
  const nextIcon = isRtl ? "fa-arrow-left" : "fa-arrow-right";
  const isInvalidFilters = error === "invalidFilters";
  const isUnavailable = error === "journalIssuesUnavailable";

  return (
    <section className="journal-issues-section" id="issues" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <div className="journal-issues__header">
        <div className="journal-issues__heading">
          <h2>{strings.title}</h2>
          <div className="journal-issues__summary" role="status" aria-live="polite">
            <span className="sr-only">
              {strings.a11y.resultsTemplate.replace("{count}", announcement || "0")}
            </span>
            <span>{loading ? strings.loading : summaryText}</span>
          </div>
        </div>
        <div className="journal-issues__sort">
          <select
            id="issues-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="year_desc">{strings.sort.options.yearDesc}</option>
            <option value="year_asc">{strings.sort.options.yearAsc}</option>
          </select>
        </div>
      </div>

      <div className="journal-issues__layout">
        <aside className="journal-issues__filters" aria-label={strings.filters.ariaLabel}>
          <div className="journal-issues__filters-inner">
            <h3>{strings.filters.title}</h3>
            <div className="journal-issues__filter-group">
              <label htmlFor="filter-year-min">{strings.filters.yearMin}</label>
              <input
                id="filter-year-min"
                type="number"
                min="0"
                value={yearMin}
                inputMode="numeric"
                onChange={(event) => setYearMin(event.target.value)}
                placeholder="1900"
              />
            </div>
            <div className="journal-issues__filter-group">
              <label htmlFor="filter-year-max">{strings.filters.yearMax}</label>
              <input
                id="filter-year-max"
                type="number"
                min="0"
                value={yearMax}
                inputMode="numeric"
                onChange={(event) => setYearMax(event.target.value)}
                placeholder="2025"
              />
            </div>
            <div className="journal-issues__filter-group">
              <label htmlFor="filter-number">{strings.filters.number}</label>
              <input
                id="filter-number"
                type="number"
                min="0"
                value={number}
                inputMode="numeric"
                onChange={(event) => setNumber(event.target.value)}
                placeholder="2"
              />
            </div>
            <button type="button" className="journal-issues__reset" onClick={resetFilters}>
              {strings.filters.reset}
            </button>
          </div>
        </aside>

        <div className="journal-issues__results">
          {error ? (
            <div
              className="journal-issues__error"
              role={isInvalidFilters ? "alert" : "status"}
              aria-live="polite"
            >
              <h3>{isUnavailable ? strings.unavailable.title : strings.invalidFilters}</h3>
              {isUnavailable ? <p>{strings.unavailable.message}</p> : null}
            </div>
          ) : (
            <>
              <div className="journal-issues__table-wrapper" aria-live="polite">
                {loading && !hasLoadedOnce ? (
                  <div className="journal-issues__loading">
                    <p>{strings.loading}</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="journal-issues__empty" role="status">
                    <i className="fa-regular fa-calendar" aria-hidden="true" />
                    <h3>{strings.empty.title}</h3>
                    <p>{strings.empty.description}</p>
                  </div>
                ) : (
                  <>
                    <table className="journal-issues__table">
                      <thead>
                        <tr>
                          <th scope="col">{strings.table.year}</th>
                          <th scope="col">{strings.table.title}</th>
                          <th scope="col" aria-label={strings.table.actions}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((issue) => {
                          const titleDisplay = issue.title ?? "";
                          const descriptionDisplay = issue.description ?? "";

                          return (
                            <tr key={issue.id}>
                              <td data-title={strings.table.year}>
                                {issue.year ?? strings.table.valueUnknown}
                              </td>
                              <td data-title={strings.table.title}>
                                <div>{titleDisplay}</div>
                                {descriptionDisplay ? (
                                  <div className="journal-issues__description">{descriptionDisplay}</div>
                                ) : null}
                              </td>
                              <td data-title={strings.table.actions}>
                                <Link
                                  href={`/journals/${slug}/issues/${issue.id}`}
                                  className="journal-issues__action"
                                >
                                  {strings.table.browseIssue}
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="journal-issues__cards">
                      {items.map((issue) => {
                        const titleDisplay = issue.title ?? "";
                        const descriptionDisplay = issue.description ?? "";
                        return (
                          <article key={`card-${issue.id}`} className="journal-issues__card">
                            <header>
                              <span className="journal-issues__card-year">
                                {issue.year ?? strings.table.valueUnknown}
                              </span>
                              <h3>{titleDisplay}</h3>
                            </header>
                            {descriptionDisplay ? (
                              <p className="journal-issues__card-description">{descriptionDisplay}</p>
                            ) : null}
                            <Link
                              href={`/journals/${slug}/issues/${issue.id}`}
                              className="journal-issues__action journal-issues__action--full"
                            >
                              {strings.table.browseIssue}
                            </Link>
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {canShowPagination && (
                <nav className="journal-issues__pagination" aria-label={strings.pagination.ariaLabel}>
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    disabled={loading || page <= 1}
                  >
                    <i className={`fa-solid ${previousIcon}`} aria-hidden="true" />
                    {strings.pagination.previous}
                  </button>
                  <span>{strings.pagination.pageTemplate.replace("{page}", String(page))}</span>
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={loading || !hasNext}
                  >
                    {strings.pagination.next}
                    <i className={`fa-solid ${nextIcon}`} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default JournalIssuesExplorer;

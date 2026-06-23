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
    volume,
    setVolume,
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

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale || undefined, { dateStyle: "medium" });
    } catch {
      return new Intl.DateTimeFormat("en", { dateStyle: "medium" });
    }
  }, [locale]);

  const summaryText = strings.summaryTemplate.replace(
    "{count}",
    numberFormatter.format(total ?? 0)
  );

  const canShowPagination = !error && (total > pageSize || page > 1 || hasNext);

  const isRtl = typeof locale === "string" && locale.toLowerCase().startsWith("ar");

  return (
    <section className="journal-issues-section" id="issues" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <div className="journal-issues__header">
        <div>
          <h5>{strings.title}</h5>
          <p>{strings.subtitle}</p>
        </div>
        <div className="journal-issues__sort">
          <label htmlFor="issues-sort">{strings.sort.label}</label>
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
                value={yearMax}
                inputMode="numeric"
                onChange={(event) => setYearMax(event.target.value)}
                placeholder="2025"
              />
            </div>
            <div className="journal-issues__filter-group">
              <label htmlFor="filter-volume">{strings.filters.volume}</label>
              <input
                id="filter-volume"
                value={volume}
                inputMode="numeric"
                onChange={(event) => setVolume(event.target.value)}
                placeholder="1"
              />
            </div>
            <div className="journal-issues__filter-group">
              <label htmlFor="filter-number">{strings.filters.number}</label>
              <input
                id="filter-number"
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
          <div className="journal-issues__summary mb-3" role="status" aria-live="polite">
            <span className="sr-only">
              {strings.a11y.resultsTemplate.replace("{count}", announcement || "0")}
            </span>
            <span>{loading ? strings.loading : summaryText}</span>
          </div>

          {error ? (
            <div className="journal-issues__error" role="alert">
              <p>{strings.error}</p>
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
                          <th scope="col">{strings.table.volume}</th>
                          <th scope="col">{strings.table.number}</th>
                          <th scope="col">{strings.table.date}</th>
                          <th scope="col">{strings.table.documents}</th>
                          <th scope="col" aria-label={strings.table.actions}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((issue) => {
                          const formattedDate = issue.issueDate
                            ? dateFormatter.format(new Date(issue.issueDate))
                            : strings.table.dateUnknown;
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
                              <td data-title={strings.table.volume}>
                                {issue.volume ?? strings.table.valueUnknown}
                              </td>
                              <td data-title={strings.table.number}>
                                {issue.number ?? strings.table.valueUnknown}
                              </td>
                              <td data-title={strings.table.date}>{formattedDate}</td>
                              <td data-title={strings.table.documents}>
                                {numberFormatter.format(issue.documentsCount ?? 0)}
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
                        const formattedDate = issue.issueDate
                          ? dateFormatter.format(new Date(issue.issueDate))
                          : strings.table.dateUnknown;
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
                            <ul className="journal-issues__card-meta">
                              <li>
                                <strong>{strings.table.volume}</strong>{" "}
                                {issue.volume ?? strings.table.valueUnknown}
                              </li>
                              <li>
                                <strong>{strings.table.number}</strong>{" "}
                                {issue.number ?? strings.table.valueUnknown}
                              </li>
                              <li>
                                <strong>{strings.table.date}</strong> {formattedDate}
                              </li>
                              <li>
                                <strong>{strings.table.documents}</strong>{" "}
                                {numberFormatter.format(issue.documentsCount ?? 0)}
                              </li>
                            </ul>
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
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    {strings.pagination.previous}
                  </button>
                  <span>{strings.pagination.pageTemplate.replace("{page}", String(page))}</span>
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={loading || !hasNext}
                  >
                    {strings.pagination.next}
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
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

"use client";

import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import useIssueArticles from "@/hooks/useIssueArticles";

const formatAuthors = (value, fallback) => {
  if (!value) return fallback;
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return filtered.length ? filtered.join(", ") : fallback;
  }
  return value;
};

const IssueArticlesExplorer = ({
  slug,
  issueId,
  locale,
  strings,
  journal,
  issue,
}) => {
  const {
    items,
    total,
    page,
    pageSize,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    announcement,
    setPage,
  } = useIssueArticles({ slug, issueId, locale });

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);

  const fallbackDocumentsCount =
    typeof issue?.counts?.documents === "number"
      ? issue.counts.documents
      : Number.parseInt(issue?.counts?.documents ?? "", 10);
  const normalizedTotal = Number.isFinite(total)
    ? total
    : Number.isFinite(fallbackDocumentsCount)
      ? fallbackDocumentsCount
      : 0;
  const currentPage = Number.isFinite(page) ? page : 1;
  const currentPageSize = Number.isFinite(pageSize) ? pageSize : Math.max(items.length, 20);

  const issueLabel = strings.header.issueLabel
    .replace("{volume}", String(issue?.volume ?? strings.header.unknown))
    .replace("{number}", String(issue?.number ?? strings.header.unknown))
    .replace("{year}", String(issue?.year ?? strings.header.unknown));

  const hasDocumentsCount = Number.isFinite(total) || Number.isFinite(fallbackDocumentsCount);
  const documentsLabel = hasDocumentsCount
    ? strings.header.documentsCount.replace("{count}", numberFormatter.format(normalizedTotal))
    : strings.header.unknown;

  const canShowPagination = normalizedTotal > currentPageSize || currentPage > 1 || hasNext;
  const announcementValue = announcement || numberFormatter.format(normalizedTotal);
  const journalName = journal?.name ?? strings.header.unknown;

  return (
    <section className="issue-articles" aria-live="polite">
      <header className="issue-articles__header">
        <div
          className='section__header'
          data-aos='fade-up'
          data-aos-duration={900}
        >
          <h2 className="title-animation_inner mt-0"><span>{strings.header.journalLabel} :</span> {strings.header.title.replace("{journal}", journalName)} </h2>

        </div>
        <dl className="issue-articles__meta">
          <div>
            <dt>{strings.header.meta.volume}</dt>
            <dd>{issue?.volume ?? strings.header.unknown}</dd>
          </div>
          <div>
            <dt>{strings.header.meta.number}</dt>
            <dd>{issue?.number ?? strings.header.unknown}</dd>
          </div>
          <div>
            <dt>{strings.header.meta.year}</dt>
            <dd>{issue?.year ?? strings.header.unknown}</dd>
          </div>
          <div>
            <dt>{strings.header.meta.documents}</dt>
            <dd>{documentsLabel}</dd>
          </div>
        </dl>
      </header>

      <div className="issue-articles__results">
        {error ? (
          <div className="issue-articles__error" role="alert">
            <p>{strings.error.message}</p>
          </div>
        ) : (
          <>
            {!loading && hasLoadedOnce && items.length === 0 ? (
              <div className="issue-articles__empty">
                <h2>{strings.empty.title}</h2>
                <p>{strings.empty.description}</p>
              </div>
            ) : (
              <>
                <table className="issue-articles__table" aria-label={strings.table.ariaLabel}>
                  <thead>
                    <tr>
                      <th scope="col">{strings.table.title}</th>
                      <th scope="col">{strings.table.authors}</th>
                      <th scope="col">{strings.table.year}</th>
                      <th scope="col">{strings.table.langOnly}</th>
                      <th scope="col">{strings.table.pages}</th>
                      <th scope="col" aria-label={strings.table.actions}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((doc) => {
                      const authors = formatAuthors(doc.authors, strings.table.authorsFallback);
                      const langLabel = (doc.language || "").toUpperCase();
                      const pages =
                        doc.startPage && doc.endPage
                          ? `${doc.startPage}-${doc.endPage}`
                          : doc.pages || strings.table.noPages;
                      return (
                        <tr key={doc.id}>
                          <td data-title={strings.table.title}>
                            <Link href={`/library/${doc.id}`}>{doc.title}</Link>
                          </td>
                          <td data-title={strings.table.authors}>{authors}</td>
                          <td data-title={strings.table.year}>
                            {doc.year ?? strings.table.noYear}
                          </td>
                          <td data-title={strings.table.langOnly}>
                            {langLabel || strings.table.languageFallback}
                          </td>
                          <td data-title={strings.table.pages}>{pages}</td>
                          <td data-title={strings.table.actions}>
                            <Link href={`/library/${doc.id}`} className="journal-issues__action">
                              {strings.table.seeDetails}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="issue-articles__cards">
                  {items.map((doc) => {
                    const authors = formatAuthors(doc.authors, strings.table.authorsFallback);
                    const langLabel = (doc.language || "").toUpperCase();
                    const pages =
                      doc.startPage && doc.endPage
                        ? `${doc.startPage}-${doc.endPage}`
                        : doc.pages || strings.table.noPages;
                    return (
                      <article key={`card-${doc.id}`} className="issue-articles__card">
                        <header>
                          <h3>
                            <Link href={`/library/${doc.id}`}>{doc.title}</Link>
                          </h3>
                          <p className="issue-articles__card-authors">{authors}</p>
                        </header>
                        <ul className="issue-articles__card-meta">
                          <li>
                            <strong>{strings.table.year}</strong>{" "}
                            {doc.year ?? strings.table.noYear}
                          </li>
                          <li>
                            <strong>{strings.table.langOnly}</strong>{" "}
                            {langLabel || strings.table.languageFallback}
                          </li>
                          <li>
                            <strong>{strings.table.pages}</strong> {pages}
                          </li>
                        </ul>
                        <div className="issue-articles__card-actions">
                          <Link href={`/library/${doc.id}`} className="journal-issues__action">
                            {strings.table.seeDetails}
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {canShowPagination && (
          <nav className="issue-articles__pagination" aria-label={strings.pagination.ariaLabel}>
            <button
              type="button"
              onClick={() => setPage(Math.max(currentPage - 1, 1))}
              disabled={loading || currentPage <= 1}
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              {strings.pagination.previous}
            </button>
            <span>{strings.pagination.pageTemplate.replace("{page}", String(currentPage))}</span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={loading || !hasNext}
            >
              {strings.pagination.next}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

export default IssueArticlesExplorer;

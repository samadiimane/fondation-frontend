"use client";

import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import useIssueArticles from "@/hooks/useIssueArticles";
import DocumentDownloadButton from "@/components/documents/DocumentDownloadButton";

const formatAuthors = (value, fallback) => {
  if (!value) return fallback;
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return filtered.length ? filtered.join(", ") : fallback;
  }
  return value;
};

const formatTypeLabel = (value) => {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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

  const issueLabel = strings.header.issueLabel
    .replace("{volume}", issue?.volume ?? strings.header.unknown)
    .replace("{number}", issue?.number ?? strings.header.unknown)
    .replace("{year}", issue?.year ?? strings.header.unknown);

  const documentsLabel = strings.header.documentsCount.replace(
    "{count}",
    numberFormatter.format(total ?? issue?.counts?.documents ?? 0)
  );

  const canShowPagination = total > pageSize || page > 1 || hasNext;

  return (
    <section className="issue-articles" aria-live="polite">
      <header className="issue-articles__header">
        <div>
          <p className="issue-articles__eyebrow">{strings.header.journalLabel}</p>
          <h1>{strings.header.title.replace("{journal}", journal.name)}</h1>
          <p className="issue-articles__subtitle">
            {strings.header.subtitle.replace("{issue}", issueLabel)}
          </p>
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
        <div className="issue-articles__summary" role="status" aria-live="polite">
          <span className="sr-only">
            {strings.a11y.results.replace("{count}", announcement || "0")}
          </span>
          <strong>{numberFormatter.format(total)}</strong> {strings.resultsLabel}
        </div>

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
                      <th scope="col">{strings.table.typeLang}</th>
                      <th scope="col">{strings.table.pages}</th>
                      <th scope="col" aria-label={strings.table.actions}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((doc) => {
                      const authors = formatAuthors(doc.authors, strings.table.authorsFallback);
                      const typeLabel = formatTypeLabel(doc.type);
                      const langLabel = (doc.language || "").toUpperCase();
                      const pages =
                        doc.startPage && doc.endPage
                          ? `${doc.startPage}–${doc.endPage}`
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
                          <td data-title={strings.table.typeLang}>
                            <span>{typeLabel}</span>
                            {langLabel && <span className="issue-articles__lang">{langLabel}</span>}
                          </td>
                          <td data-title={strings.table.pages}>{pages}</td>
                          <td data-title={strings.table.actions}>
                            <div className="issue-articles__actions">
                              <Link
                                href={`/library/${doc.id}`}
                                className="issue-articles__details"
                              >
                                {strings.table.seeDetails}
                              </Link>
                              <DocumentDownloadButton
                                documentId={doc.id}
                                strings={strings.download}
                                tone="ghost"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="issue-articles__cards">
                  {items.map((doc) => {
                    const authors = formatAuthors(doc.authors, strings.table.authorsFallback);
                    const typeLabel = formatTypeLabel(doc.type);
                    const langLabel = (doc.language || "").toUpperCase();
                    const pages =
                      doc.startPage && doc.endPage
                        ? `${doc.startPage}–${doc.endPage}`
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
                            <strong>{strings.table.typeLang}</strong>{" "}
                            {[typeLabel, langLabel].filter(Boolean).join(" • ") || strings.table.noType}
                          </li>
                          <li>
                            <strong>{strings.table.pages}</strong> {pages}
                          </li>
                        </ul>
                        <div className="issue-articles__card-actions">
                          <Link href={`/library/${doc.id}`} className="issue-articles__details">
                            {strings.table.seeDetails}
                          </Link>
                          <DocumentDownloadButton
                            documentId={doc.id}
                            strings={strings.download}
                            tone="ghost"
                          />
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
      </div>
    </section>
  );
};

export default IssueArticlesExplorer;

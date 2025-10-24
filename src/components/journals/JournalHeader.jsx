"use client";

import { useMemo, useState } from "react";

const JournalHeader = ({ journal, strings, stats, locale }) => {
  const [expanded, setExpanded] = useState(false);

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);

  const issuesCount = numberFormatter.format(journal.counts?.issues ?? 0);
  const documentsCount = numberFormatter.format(journal.counts?.documents ?? 0);

  return (
    <header className="journal-header" id="overview">
      <div className="journal-header__primary">
        <div className="journal-header__eyebrow">{strings.eyebrow}</div>
        <h1 className="journal-header__title">{journal.name}</h1>

        <ul className="journal-header__meta">
          <li>
            <span className="label">{strings.meta.issn}</span>
            <span>{journal.issn || strings.meta.issnUnknown}</span>
          </li>
          <li title={journal.publisher || undefined}>
            <span className="label">{strings.meta.publisher}</span>
            <span>{journal.publisher || strings.meta.publisherUnknown}</span>
          </li>
          {journal.language && (
            <li>
              <span className="label">{strings.meta.language}</span>
              <span>{journal.language}</span>
            </li>
          )}
          {journal.country && (
            <li>
              <span className="label">{strings.meta.country}</span>
              <span>{journal.country}</span>
            </li>
          )}
        </ul>

        <div className={`journal-header__description ${expanded ? "is-expanded" : ""}`}>
          <p>{journal.description || strings.descriptionFallback}</p>
          {journal.description && journal.description.length > 320 && (
            <button
              type="button"
              className="journal-header__toggle"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? strings.descriptionToggle.less : strings.descriptionToggle.more}
            </button>
          )}
        </div>
      </div>

      <aside className="journal-header__stats-card" aria-label={strings.statsCardLabel}>
        <dl>
          <div>
            <dt>{strings.stats.issues}</dt>
            <dd>{issuesCount}</dd>
          </div>
          <div>
            <dt>{strings.stats.documents}</dt>
            <dd>{documentsCount}</dd>
          </div>
          <div>
            <dt>{strings.stats.coverage}</dt>
            <dd>{stats.coverage || strings.stats.coverageUnknown}</dd>
          </div>
          {stats.holdings && (
            <div>
              <dt>{strings.stats.holdings}</dt>
              <dd>{stats.holdings}</dd>
            </div>
          )}
        </dl>
      </aside>
    </header>
  );
};

export default JournalHeader;

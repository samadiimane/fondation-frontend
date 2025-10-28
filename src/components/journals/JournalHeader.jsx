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
      <div>
        <div
          className='section__header'
          data-aos='fade-up'
          data-aos-duration={900}
        >
          <h2 className="title-animation_inner mt-0"><span>{strings.eyebrow} :</span> {journal.name}</h2>

        </div>

        <ul className="journal-header__meta mb-3">
          <li>
            <span className="label">{strings.meta.issn} :</span>
            <span>{journal.issn || strings.meta.issnUnknown}</span>
          </li>
          <li title={journal.publisher || undefined}>
            <span className="label">{strings.meta.publisher} :</span>
            <span>{journal.publisher || strings.meta.publisherUnknown}</span>
          </li>
          {journal.language && (
            <li>
              <span className="label">{strings.meta.language} :</span>
              <span>{journal.language}</span>
            </li>
          )}
          {journal.country && (
            <li>
              <span className="label">{strings.meta.country} :</span>
              <span>{journal.country}</span>
            </li>
          )}
        </ul>

        <div className={`journal-header__description mb-2 ${expanded ? "is-expanded" : ""}`}>
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
    </header>
  );
};

export default JournalHeader;

const JournalDetailHero = ({ journal, labels }) => {
  const issuesCount =
    typeof journal?.counts?.issues === "number"
      ? journal.counts.issues.toLocaleString()
      : journal?.counts?.issues ?? "0";
  const documentsCount =
    typeof journal?.counts?.documents === "number"
      ? journal.counts.documents.toLocaleString()
      : journal?.counts?.documents ?? "0";

  return (
    <header className="journal-detail__hero">
      <div className="journal-detail__hero-shell">
        <div className="journal-detail__primary">
          <span className="journal-detail__eyebrow">{labels.eyebrow}</span>
          <h1 className="journal-detail__title">{journal.name}</h1>
          <p className="journal-detail__summary">
            {journal.description || labels.fallbackDescription}
          </p>
        </div>
        <dl className="journal-detail__stats">
          <div>
            <dt>{issuesCount}</dt>
            <dd>{labels.stats.issues}</dd>
          </div>
          <div>
            <dt>{documentsCount}</dt>
            <dd>{labels.stats.articles}</dd>
          </div>
        </dl>
      </div>

      <ul className="journal-detail__meta">
        {journal.publisher && (
          <li>
            <i className="fa-solid fa-building-columns" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.publisher}</span>
              {journal.publisher}
            </span>
          </li>
        )}
        {journal.issn && (
          <li>
            <i className="fa-solid fa-barcode" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.issn}</span>
              {journal.issn}
            </span>
          </li>
        )}
        {journal.language && (
          <li>
            <i className="fa-solid fa-language" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.language}</span>
              {journal.language}
            </span>
          </li>
        )}
        {journal.country && (
          <li>
            <i className="fa-solid fa-globe" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.country}</span>
              {journal.country}
            </span>
          </li>
        )}
        {journal.foundedYear && (
          <li>
            <i className="fa-solid fa-calendar-days" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.established}</span>
              {journal.foundedYear}
            </span>
          </li>
        )}
        {journal.website && (
          <li>
            <i className="fa-solid fa-link" aria-hidden="true" />
            <span>
              <span className="label">{labels.meta.website}</span>
              <a href={journal.website} target="_blank" rel="noreferrer">
                {journal.website}
              </a>
            </span>
          </li>
        )}
      </ul>
    </header>
  );
};

export default JournalDetailHero;

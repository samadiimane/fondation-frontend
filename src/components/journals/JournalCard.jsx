import { Link } from "@/i18n/navigation";

const JournalCard = ({ journal, href, labels }) => {
  const { name, description, counts, publisher, issn, foundedYear, country, language } = journal;
  const hasPublisherRow = publisher || country || language;
  const issuesCount =
    typeof counts?.issues === "number" ? counts.issues.toLocaleString() : counts?.issues ?? "0";
  const documentsCount =
    typeof counts?.documents === "number"
      ? counts.documents.toLocaleString()
      : counts?.documents ?? "0";

  return (
    <article className="journal-card">
      <div className="journal-card__header">
        <div className="journal-card__identity">
          <span className="journal-card__badge">
            {issn ? `${labels.meta.issn} ${issn}` : labels.meta.periodical}
          </span>
          <h2 className="journal-card__title">{name}</h2>
        </div>
        <dl className="journal-card__stats">
          <div className="journal-card__stat">
            <dt>{issuesCount}</dt>
            <dd>{labels.stats.issues}</dd>
          </div>
          <div className="journal-card__stat">
            <dt>{documentsCount}</dt>
            <dd>{labels.stats.articles}</dd>
          </div>
        </dl>
      </div>

      <p className="journal-card__description">
        {description || labels.fallbackDescription}
      </p>

      {hasPublisherRow && (
        <ul className="journal-card__meta">
          {publisher && (
            <li>
              <i className="fa-solid fa-building-columns" aria-hidden="true" />
              {publisher}
            </li>
          )}
          {country && (
            <li>
              <i className="fa-solid fa-globe" aria-hidden="true" />
              {country}
            </li>
          )}
          {language && (
            <li>
              <i className="fa-solid fa-language" aria-hidden="true" />
              {language}
            </li>
          )}
          {foundedYear && (
            <li>
              <i className="fa-solid fa-calendar-days" aria-hidden="true" />
              {labels.meta.established} {foundedYear}
            </li>
          )}
        </ul>
      )}

      <div className="journal-card__footer">
        <Link className="journal-card__action" href={href}>
          <span>{labels.actions.details}</span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default JournalCard;

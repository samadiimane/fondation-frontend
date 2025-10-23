import { Link } from "@/i18n/navigation";

const JournalIssuesList = ({ issues, labels }) => {
  if (!issues.length) {
    return (
      <section className="journal-issues journal-issues--empty">
        <div className="journal-issues__empty">
          <i className="fa-regular fa-folder-open" aria-hidden="true" />
          <h2>{labels.empty.title}</h2>
          <p>{labels.empty.description}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="journal-issues">
      <div className="journal-issues__header">
        <h2>{labels.title}</h2>
        <p>{labels.subtitle}</p>
      </div>

      <div className="journal-issues__timeline" role="list">
        {issues.map((issue) => {
          const year = issue.year ?? issue.issueDate?.slice?.(0, 4);
          return (
            <article key={issue.id ?? `${issue.volume}-${issue.number}`} className="journal-issue" role="listitem">
              <div className="journal-issue__marker" aria-hidden="true">
                <span>{year ?? "—"}</span>
              </div>
              <div className="journal-issue__body">
                <header>
                  <h3>{issue.title || labels.item.untitled}</h3>
                  <p className="journal-issue__meta">
                    {issue.volume && (
                      <span>
                        <i className="fa-solid fa-layer-group" aria-hidden="true" />
                        {labels.item.volume} {issue.volume}
                      </span>
                    )}
                    {issue.number && (
                      <span>
                        <i className="fa-solid fa-hashtag" aria-hidden="true" />
                        {labels.item.issue} {issue.number}
                      </span>
                    )}
                    {issue.documentsCount !== null && issue.documentsCount !== undefined && (
                      <span>
                        <i className="fa-solid fa-file-lines" aria-hidden="true" />
                        {issue.documentsCount} {labels.item.documents}
                      </span>
                    )}
                  </p>
                </header>

                {issue.description && (
                  <p className="journal-issue__description">{issue.description}</p>
                )}

                <div className="journal-issue__actions">
                  <Link href="/library" className="journal-issue__action">
                    <span>{labels.item.viewDocuments}</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default JournalIssuesList;

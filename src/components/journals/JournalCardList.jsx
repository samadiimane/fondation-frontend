import JournalCard from "@/components/journals/JournalCard";

const JournalCardList = ({ items, strings, loading, empty, formatNumber }) => {
  if (loading) {
    return (
      <div className="journals-list journals-list--loading" role="status" aria-live="polite">
        <p>{strings.loading}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="journals-list journals-list--empty" role="status" aria-live="polite">
        <i className="fa-regular fa-folder-open" aria-hidden="true" />
        <h2>{strings.emptyTitle}</h2>
        <p>{strings.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="journals-grid__items">
      {items.map((journal) => (
        <JournalCard
          key={journal.id ?? journal.slug}
          journal={journal}
          strings={strings}
          formatNumber={formatNumber}
        />
      ))}
    </div>
  );
};

export default JournalCardList;

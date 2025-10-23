import JournalCard from "@/components/journals/JournalCard";

const JournalsGrid = ({ journals, labels, makeHref }) => {
  if (!journals.length) {
    return (
      <section className="journals-grid journals-grid--empty">
        <div className="journals-grid__empty">
          <i className="fa-solid fa-book-open" aria-hidden="true" />
          <h2>{labels.empty.title}</h2>
          <p>{labels.empty.description}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="journals-grid">
      <div className="journals-grid__items">
        {journals.map((journal) => (
          <JournalCard
            key={journal.id ?? journal.slug}
            journal={journal}
            href={makeHref(journal)}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
};

export default JournalsGrid;

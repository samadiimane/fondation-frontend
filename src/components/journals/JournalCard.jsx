import { Link } from "@/i18n/navigation";

const JournalCard = ({ journal, strings, formatNumber, locale }) => {
  const isRtl = typeof locale === "string" && locale.toLowerCase().startsWith("ar");
  const issuesCount = formatNumber(journal.counts?.issues ?? 0);
  const documentsCount = formatNumber(journal.counts?.documents ?? 0);
  const issnLabel = journal.issn
    ? `${strings.badges.issn} ${journal.issn}`
    : strings.badges.fallback;
  const publisherDisplay = journal.publisher?.trim() ?? "";

  const baseDescription = journal.description?.trim() ?? "";
  const description =
    baseDescription.length > 200
      ? `${baseDescription.slice(0, 197).trimEnd()}...`
      : baseDescription;

  const metaLineTemplate = strings.metaLineTemplate || "{issues} / {documents}";
  const metaLine = metaLineTemplate
    .replace("{issues}", issuesCount)
    .replace("{documents}", documentsCount);

  return (
    <article className="journal-card" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <header className="journal-card__header">
        <span className="journal-card__badge">{issnLabel}</span>
        <h2 className="journal-card__title">
          <Link href={`/journals/${journal.slug}`}>{journal.name}</Link>
        </h2>
        <p className="journal-card__meta-line">{metaLine}</p>
      </header>

      <p
        className="journal-card__publisher"
        title={publisherDisplay || undefined}
      >
        <span>
          <strong>{strings.publisherLabel} :</strong> {publisherDisplay}
        </span>
      </p>

      <p className="journal-card__description">{description}</p>

      <footer className="journal-card__footer">
        <Link className="journal-card__action" href={`/journals/${journal.slug}`}>
          <span>{strings.cta}</span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
};

export default JournalCard;

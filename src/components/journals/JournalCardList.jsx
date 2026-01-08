import JournalCard from "@/components/journals/JournalCard";
import { isRtlLocale } from "@/i18n/config";

const JournalCardList = ({ items, strings, loading, empty, formatNumber, locale }) => {
  const isRtl = isRtlLocale(locale);
  const dir = isRtl ? "rtl" : "ltr";

  if (loading) {
    return (
      <div
        className="journals-list journals-list--loading"
        role="status"
        aria-live="polite"
        lang={locale}
        dir={dir}
      >
        <p>{strings.loading}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div
        className="journals-list journals-list--empty"
        role="status"
        aria-live="polite"
        lang={locale}
        dir={dir}
      >
        <i className="fa-regular fa-folder-open" aria-hidden="true" />
        <h2>{strings.emptyTitle}</h2>
        <p>{strings.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="journals-grid__items" lang={locale} dir={dir}>
      {items.map((journal) => (
        <JournalCard
          key={journal.id ?? journal.slug}
          journal={journal}
          strings={strings}
          formatNumber={formatNumber}
          locale={locale}
        />
      ))}
    </div>
  );
};

export default JournalCardList;

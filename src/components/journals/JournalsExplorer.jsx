"use client";

import { useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import useJournalsSearch from "@/hooks/useJournalsSearch";
import JournalsToolbar from "@/components/journals/JournalsToolbar";
import JournalCardList from "@/components/journals/JournalCardList";
import JournalsPagination from "@/components/journals/JournalsPagination";

const JournalsExplorer = ({ locale, strings }) => {
  const {
    items,
    total,
    page,
    pageSize,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    q,
    setQ,
    issn,
    setIssn,
    sort,
    setSort,
    setPage,
    announcement,
  } = useJournalsSearch({ locale });

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);

  const summaryText = strings.toolbar.summaryTemplate.replace(
    "{count}",
    numberFormatter.format(total)
  );

  const breadcrumbItems = useMemo(
    () => [
      {
        label: strings.breadcrumbs.home.label,
        href: strings.breadcrumbs.home.href,
      },
      {
        label: strings.breadcrumbs.journals.label,
        href: strings.breadcrumbs.journals.href,
        current: true,
      },
    ],
    [strings]
  );

  const canShowPagination = total > pageSize || page > 1 || hasNext;

  return (
    <section className="journals-explorer">
      <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} />

      <header className="journals-explorer__header">
        <h1>{strings.title}</h1>
        <p>{strings.subtitle}</p>
      </header>

      <JournalsToolbar
        strings={strings.toolbar}
        q={q}
        onQueryChange={setQ}
        issn={issn}
        onIssnChange={setIssn}
        sort={sort}
        onSortChange={setSort}
        summary={summaryText}
        loading={loading}
      />

      <div className="journals-explorer__results" aria-live="polite">
        <span className="sr-only">
          {strings.toolbar.announceTemplate.replace("{count}", announcement || "0")}
        </span>

        {error ? (
          <div role="status" className="journals-explorer__error">
            <p>{strings.error.message}</p>
          </div>
        ) : (
          <JournalCardList
            items={items}
            strings={strings.cards}
            loading={loading && !hasLoadedOnce}
            empty={!loading && hasLoadedOnce && items.length === 0}
            formatNumber={(value) => numberFormatter.format(value ?? 0)}
          />
        )}
      </div>

      {canShowPagination && (
        <JournalsPagination
          page={page}
          hasNext={hasNext}
          onNavigate={setPage}
          strings={strings.pagination}
          disabled={loading}
        />
      )}
    </section>
  );
};

export default JournalsExplorer;

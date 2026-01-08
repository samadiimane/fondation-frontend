"use client";

import { useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import useJournalsSearch from "@/hooks/useJournalsSearch";
import JournalsToolbar from "@/components/journals/JournalsToolbar";
import JournalCardList from "@/components/journals/JournalCardList";
import JournalsPagination from "@/components/journals/JournalsPagination";
import { isRtlLocale } from "@/i18n/config";

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

  const isRtl = isRtlLocale(locale);

  return (
    <section className="journals-explorer" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <Breadcrumbs items={breadcrumbItems} ariaLabel={strings.a11y.breadcrumbs} locale={locale} />
      <div
        className='section__header'
        data-aos='fade-up'
        data-aos-duration={900}
      >
        <h2 className="title-animation_inner mt-0">{strings.title}</h2>
      </div>

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
        locale={locale}
        subtitle={strings.subtitle}
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
            locale={locale}
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

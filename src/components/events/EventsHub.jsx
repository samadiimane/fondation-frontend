"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import useEvents from "@/hooks/useEvents";
import EventCard from "@/components/events/EventCard";
import EventListSkeleton from "@/components/events/EventListSkeleton";

const EVENT_TYPES = ["all", "seminar", "award", "exhibition"];

const EventsHub = () => {
  const locale = useLocale();
  const t = useTranslations("events");
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = searchParams?.get("type");
  const normalizedInitialType = EVENT_TYPES.includes(initialType ?? "") ? initialType : "all";

  const {
    type,
    setType,
    page,
    setPage,
    pageSize,
    items,
    loading,
    error,
    hasNext,
    hasLoadedOnce,
    total,
  } = useEvents({ initialType: normalizedInitialType, initialPageSize: 12 });

  useEffect(() => {
    if (normalizedInitialType && normalizedInitialType !== type) {
      setType(normalizedInitialType);
    }
  }, [normalizedInitialType, setType, type]);

  const tabs = useMemo(
    () => [
      { value: "all", label: t("tabs.all") },
      { value: "seminar", label: t("tabs.seminar") },
      { value: "award", label: t("tabs.award") },
      { value: "exhibition", label: t("tabs.exhibition") },
    ],
    [t],
  );

  const handleTypeChange = (nextType) => {
    setType(nextType);
    const query = nextType === "all" ? "" : `?type=${encodeURIComponent(nextType)}`;
    router.replace(`/${locale}/events${query}`);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setPage(page + 1);
    }
  };

  const typeLabels = useMemo(
    () => ({
      seminar: t("tabs.seminar"),
      award: t("tabs.award"),
      exhibition: t("tabs.exhibition"),
    }),
    [t],
  );

  const isEmpty = !loading && hasLoadedOnce && items.length === 0;
  const showError = Boolean(error) && !loading && items.length === 0;
  const showEmpty = !showError && isEmpty;

  return (
    <section className='event pt-120 pb-120'>
      <div className='container'>
        <div className='section__header text-center'>
          <h2 className='title-animation_inner'>{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>

        <div className='event-tabs' role='tablist' aria-label={t("tabs.ariaLabel")}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type='button'
              className={`event-tabs__button ${type === tab.value ? "is-active" : ""}`}
              aria-pressed={type === tab.value}
              onClick={() => handleTypeChange(tab.value)}
              disabled={loading && type === tab.value}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && !hasLoadedOnce ? (
          <EventListSkeleton count={pageSize} />
        ) : items.length > 0 ? (
          <div className='row'>
            {items.map((event) => (
              <div key={event.slug} className='col-12 col-md-6 col-xl-4 event__single-wrapper'>
                <EventCard event={event} locale={locale} typeLabels={typeLabels} />
              </div>
            ))}
          </div>
        ) : null}

        {showError ? (
          <div className='event__empty event__empty--error' role='status'>
            <p>{t("error")}</p>
          </div>
        ) : null}

        {showEmpty ? <div className='event__empty'>{t("empty")}</div> : null}

        {items.length > 0 ? (
          <div className='events-pagination'>
            <button
              type='button'
              className='events-pagination__button'
              onClick={handlePrevious}
              disabled={loading || page <= 1}
            >
              <i className='fa-solid fa-arrow-left' aria-hidden='true' />
              <span>{t("pagination.previous")}</span>
            </button>
            <p className='events-pagination__meta'>
              {t("pagination.pageOf", { page, total: Math.max(Math.ceil(total / (pageSize || 1)), 1) })}
            </p>
            <button
              type='button'
              className='events-pagination__button'
              onClick={handleNext}
              disabled={loading || !hasNext}
            >
              <span>{t("pagination.next")}</span>
              <i className='fa-solid fa-arrow-right' aria-hidden='true' />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default EventsHub;

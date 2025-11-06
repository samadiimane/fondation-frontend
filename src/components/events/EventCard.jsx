"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FALLBACK_IMAGE = "/assets/images/event/poster.png";

const formatDateRange = (locale, startDate, endDate, fallback) => {
  if (!startDate && !endDate) {
    return fallback;
  }
  try {
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    if (startDate && endDate) {
      if (startDate === endDate) {
        return formatter.format(new Date(startDate));
      }
      return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
    }
    const value = startDate || endDate;
    return formatter.format(new Date(value));
  } catch {
    if (startDate && endDate) {
      return `${startDate} – ${endDate}`;
    }
    return startDate || endDate || fallback;
  }
};

const EventCard = ({ event, locale, typeLabels }) => {
  const currentLocale = useLocale();
  const activeLocale = locale || currentLocale;
  const t = useTranslations("events");

  const typeLabel = useMemo(() => {
    if (!event?.type) return null;
    return typeLabels?.[event.type] ?? t(`tabs.${event.type}`, { default: event.type });
  }, [event?.type, t, typeLabels]);

  const dateLabel = formatDateRange(activeLocale, event?.startDate, event?.endDate, t("dateTba"));
  const locationLabel = event?.location || t("locationTba");
  const imageUrl = event?.coverImageUrl || FALLBACK_IMAGE;

  return (
    <div className='event__single event-single-alt'>
      <div className='event__single-thumb'>
        <Link href={`/events/${event.slug}`}>
          <img src={imageUrl} alt={event?.title || "Event cover"} loading='lazy' />
        </Link>
      </div>
      <div className='event__content'>
        {typeLabel ? <span className='event__badge'>{typeLabel}</span> : null}
        <h4>
          <Link href={`/events/${event.slug}`}>{event?.title ?? "Untitled event"}</Link>
        </h4>
        <p>
          <i className='fa-solid fa-calendar-days' aria-hidden='true' />
          <span>{dateLabel}</span>
        </p>
        <p>
          <i className='fa-solid fa-location-dot' aria-hidden='true' />
          <span>{locationLabel}</span>
        </p>
      </div>
    </div>
  );
};

export default EventCard;

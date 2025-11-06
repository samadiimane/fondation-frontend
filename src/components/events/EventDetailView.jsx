"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

const FALLBACK_IMAGE = "/assets/images/event/poster-two.png";

const formatDateRange = (locale, startDate, endDate, fallback) => {
  if (!startDate && !endDate) {
    return fallback;
  }
  try {
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
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

const renderBody = (body) => {
  if (!body) {
    return null;
  }
  return body
    .split(/\n{2,}/)
    .map((paragraph, index) => (
      <p key={`body-${index}`}>
        {paragraph.trim()}
      </p>
    ));
};

const SeminarDetails = ({ details, strings }) => {
  if (!details || (!details.speakers.length && !details.agenda.length && !details.media.length)) {
    return <p className='cm-details__empty'>{strings.detailsSoon}</p>;
  }

  return (
    <>
      {details.speakers.length ? (
        <div className='cm-group'>
          <h3>{strings.speakers}</h3>
          <ul className='cm-details__list'>
            {details.speakers.map((speaker, index) => (
              <li key={`${speaker.name}-${index}`}>
                <i className='fa-solid fa-user' aria-hidden='true' />
                <span>
                  <strong>{speaker.name}</strong>
                  {speaker.role ? ` — ${speaker.role}` : ""}
                  {speaker.affiliation ? ` (${speaker.affiliation})` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {details.agenda.length ? (
        <div className='cm-group'>
          <h3>{strings.agenda}</h3>
          <div className='cm-agenda'>
            {details.agenda.map((item, index) => (
              <div key={`${item.title}-${index}`} className='cm-agenda__item'>
                {item.time ? <span className='cm-agenda__time'>{item.time}</span> : null}
                <div>
                  <strong>{item.title}</strong>
                  {item.speaker ? <p>{item.speaker}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {details.media.length ? (
        <div className='cm-group'>
          <h3>{strings.gallery}</h3>
          <div className='cm-img-group'>
            {details.media.map((mediaUrl) => (
              <div key={mediaUrl} className='cm-img-group__item'>
                <img src={mediaUrl} alt={strings.galleryItemAlt} loading='lazy' />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

const AwardDetails = ({ details, strings }) => {
  if (!details) {
    return <p className='cm-details__empty'>{strings.detailsSoon}</p>;
  }
  const { awardYear, discipline, notes, winners } = details;
  return (
    <>
      <div className='cm-details-meta cm-details-meta--alt'>
        {awardYear ? (
          <p>
            <i className='fa-solid fa-calendar' aria-hidden='true' />
            <span>{strings.awardYearLabel}: {awardYear}</span>
          </p>
        ) : null}
        {discipline ? (
          <p>
            <i className='fa-solid fa-graduation-cap' aria-hidden='true' />
            <span>{strings.disciplineLabel}: {discipline}</span>
          </p>
        ) : null}
      </div>
      {notes ? <p>{notes}</p> : null}
      {winners?.length ? (
        <div className='cm-group'>
          <h3>{strings.winners}</h3>
          <div className='cm-winners'>
            {winners.map((winner) => (
              <div key={`${winner.id ?? winner.winnerName}`} className='cm-winners__item'>
                <span className='cm-winners__rank'>
                  {typeof winner.rank === "number" ? strings.rankLabel.replace("{rank}", winner.rank) : strings.honorableMention}
                </span>
                <div className='cm-winners__content'>
                  <strong>{winner.winnerName}</strong>
                  {winner.workTitle ? <p>{winner.workTitle}</p> : null}
                  {winner.affiliation ? <p>{winner.affiliation}</p> : null}
                  {winner.notes ? <p>{winner.notes}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

const ExhibitionDetails = ({ details, strings }) => {
  if (!details) {
    return <p className='cm-details__empty'>{strings.detailsSoon}</p>;
  }

  return (
    <>
      <div className='cm-details-meta cm-details-meta--alt'>
        {details.venue ? (
          <p>
            <i className='fa-solid fa-building' aria-hidden='true' />
            <span>{strings.venueLabel}: {details.venue}</span>
          </p>
        ) : null}
        {details.curator ? (
          <p>
            <i className='fa-solid fa-user' aria-hidden='true' />
            <span>{strings.curatorLabel}: {details.curator}</span>
          </p>
        ) : null}
      </div>
      {details.gallery?.length ? (
        <div className='cm-group'>
          <h3>{strings.gallery}</h3>
          <div className='cm-img-group'>
            {details.gallery.map((imageUrl) => (
              <div key={imageUrl} className='cm-img-group__item'>
                <img src={imageUrl} alt={strings.galleryItemAlt} loading='lazy' />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

const EventDetailView = ({ event }) => {
  const locale = useLocale();
  const t = useTranslations("events");

  const typeLabels = useMemo(
    () => ({
      seminar: t("tabs.seminar"),
      award: t("tabs.award"),
      exhibition: t("tabs.exhibition"),
    }),
    [t],
  );

  const strings = useMemo(
    () => ({
      dateLabel: t("labels.date"),
      locationLabel: t("labels.location"),
      typeLabel: t("labels.type"),
      dateTba: t("dateTba"),
      locationTba: t("locationTba"),
      detailsSoon: t("detailsSoon"),
      speakers: t("speakers"),
      agenda: t("agenda"),
      winners: t("winners"),
      gallery: t("gallery"),
      galleryItemAlt: t("galleryItemAlt"),
      awardYearLabel: t("awardYear"),
      disciplineLabel: t("discipline"),
      rankLabel: t("rankLabel"),
      honorableMention: t("honorableMention"),
      venueLabel: t("venue"),
      curatorLabel: t("curator"),
      overviewHeading: t("overviewHeading"),
    }),
    [t],
  );

  const dateRange = formatDateRange(locale, event?.startDate, event?.endDate, strings.dateTba);
  const location = event?.location || strings.locationTba;
  const typeBadge = event?.type ? typeLabels[event.type] ?? event.type : null;
  const details = event?.details;

  return (
    <section className='cm-details pt-100 pb-120'>
      <div className='container'>
        <div className='row gutter-40'>
          <div className='col-12 col-xl-6'>
            <div className='cm-details__poster'>
              <img src={event?.coverImageUrl || FALLBACK_IMAGE} alt={event?.title || "Event cover"} />
            </div>
          </div>
          <div className='col-12 col-xl-6'>
            <div className='cm-details-meta'>
              {typeBadge ? (
                <p>
                  <i className='fa-solid fa-tags' aria-hidden='true' />
                  <span>{typeBadge}</span>
                </p>
              ) : null}
              <p>
                <i className='fa-solid fa-calendar-days' aria-hidden='true' />
                <span>{dateRange}</span>
              </p>
              <p>
                <i className='fa-solid fa-location-dot' aria-hidden='true' />
                <span>{location}</span>
              </p>
            </div>
            {event?.summary ? <p>{event.summary}</p> : null}
          </div>
        </div>

        <div className='cm-group'>
          <h3>{strings.overviewHeading}</h3>
          {renderBody(event?.body) ?? <p>{strings.detailsSoon}</p>}
        </div>

        <div className='cm-group cm-group--details'>
          {event?.type === "seminar" ? (
            <SeminarDetails details={details} strings={strings} />
          ) : null}
          {event?.type === "award" ? (
            <AwardDetails details={details} strings={strings} />
          ) : null}
          {event?.type === "exhibition" ? (
            <ExhibitionDetails details={details} strings={strings} />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default EventDetailView;


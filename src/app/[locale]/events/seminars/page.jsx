import Image from "next/image";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import {isRtlLocale, normalizeLocale} from "@/i18n/config";
import {Link} from "@/i18n/navigation";

const DETAIL_HREF = "/events/seminars/dar-al-niaba-anniversary";

const CONTENT = {
  ar: {
    title: "الندوات والمحاضرات",
    intro:
      "يضم هذا القسم الندوات والمحاضرات واللقاءات العلمية التي تنظمها المؤسسة أو توثقها، في صلة بتاريخ طنجة وشمال المغرب، وبقضايا البحث التاريخي، والذاكرة الوثائقية، والإنتاج العلمي.",
    breadcrumbs: {
      home: "الرئيسية",
      current: "الندوات والمحاضرات",
      ariaLabel: "مسار التنقل"
    },
    event: {
      eyebrow: "لقاء علمي وثقافي",
      title: "ذكرى مجلة دار النيابة",
      dateLabel: "التاريخ",
      date: "24 دجنبر 2024",
      locationLabel: "المكان",
      location: "قصر البلدية، طنجة",
      description:
        "لقاء خصص لاستحضار مسار مجلة «دار النيابة» والاحتفاء بعودتها، في سياق ثقافي وعلمي يكرس قيمة الوثيقة وذاكرة البحث التاريخي بمدينة طنجة.",
      detailsLabel: "عرض التفاصيل"
    },
    metaLabels: {
      date: "التاريخ",
      time: "التوقيت",
      location: "المكان"
    },
    upcomingEvent: {
      id: "morocco-arab-world-western-game",
      type: "upcoming",
      image: "/assets/images/event/01.jpg",
      eyebrow: "ندوة علمية وفكرية",
      badge: "ندوة قادمة",
      title: "المغرب والعالم العربي في معترك الصراع الدولي",
      subtitle: "قراءة في كتاب «لعبة الغرب» للدكتور محمد براص",
      date: "السبت 27 يونيو 2026",
      time: "ابتداءً من الساعة الخامسة والنصف مساءً",
      location: "بيت الصحافة، طنجة",
      description:
        "ندوة علمية تنظمها مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي تخليداً لذكرى مؤسسها، وقراءةً في كتاب «لعبة الغرب» من خلال مقاربات فكرية وتاريخية تضيء موقع المغرب والعالم العربي ضمن تحولات الصراع الدولي.",
      participants: [
        "د. الطيب بوتبقالت",
        "د. محمد جبرون",
        "د. عبد العزيز السعود",
        "د. المبارك العروسي"
      ],
      moderator: "د. خالد أشطيبات",
      ctaLabel: "تفاصيل الندوة قريباً",
      href: null
    }
  },
  en: {
    title: "Seminars and Lectures",
    intro:
      "This section brings together seminars, lectures, and scholarly meetings organized or documented by the Foundation, with a focus on the history of Tangier and northern Morocco, documentary memory, and academic production.",
    breadcrumbs: {
      home: "Home",
      current: "Seminars and Lectures",
      ariaLabel: "Breadcrumb"
    },
    event: {
      eyebrow: "Scholarly and cultural meeting",
      title: "Dar Al-Niaba Journal Anniversary",
      dateLabel: "Date",
      date: "24 December 2024",
      locationLabel: "Location",
      location: "Municipal Palace, Tangier",
      description:
        "A meeting dedicated to recalling the history of Dar Al-Niaba journal and celebrating its return, within a scholarly and cultural context centered on documentary heritage and historical memory in Tangier.",
      detailsLabel: "View details"
    },
    metaLabels: {
      date: "Date",
      time: "Time",
      location: "Location"
    },
    upcomingEvent: {
      id: "morocco-arab-world-western-game",
      type: "upcoming",
      image: "/assets/images/event/01.jpg",
      eyebrow: "Scholarly and intellectual seminar",
      badge: "Upcoming seminar",
      title: "Morocco and the Arab World in the Arena of International Conflict",
      subtitle: "A reading of The Western Game by Dr. Mohamed Bourass",
      date: "Saturday, 27 June 2026",
      time: "Starting at 5:30 PM",
      location: "Bayt Assahafa, Tangier",
      description:
        "A scholarly seminar organized by the Abdelaziz Khallouk Temsamani Foundation for Scientific Research in memory of its founder, offering historical and intellectual readings of The Western Game and its reflections on Morocco, the Arab world, and international power dynamics.",
      participants: [
        "Dr. Tayeb Boutbkalt",
        "Dr. Mohamed Jabrane",
        "Dr. Abdelaziz Saoud",
        "Dr. El Mbarek El Aroussi"
      ],
      moderator: "Dr. Khalid Achtibat",
      ctaLabel: "Details coming soon",
      href: null
    }
  },
  fr: {
    title: "Séminaires et conférences",
    intro:
      "Cette section rassemble les séminaires, conférences et rencontres scientifiques organisés ou documentés par la Fondation, en lien avec l'histoire de Tanger et du nord du Maroc, la mémoire documentaire et la production scientifique.",
    breadcrumbs: {
      home: "Accueil",
      current: "Séminaires et conférences",
      ariaLabel: "Fil d'Ariane"
    },
    event: {
      eyebrow: "Rencontre scientifique et culturelle",
      title: "Anniversaire de la revue Dar Al-Niaba",
      dateLabel: "Date",
      date: "24 décembre 2024",
      locationLabel: "Lieu",
      location: "Palais municipal, Tanger",
      description:
        "Une rencontre consacrée à l'évocation du parcours de la revue « Dar Al-Niaba » et à la célébration de son retour, dans un cadre scientifique et culturel mettant en valeur la documentation et la mémoire historique de Tanger.",
      detailsLabel: "Voir les détails"
    },
    metaLabels: {
      date: "Date",
      time: "Horaire",
      location: "Lieu"
    },
    upcomingEvent: {
      id: "morocco-arab-world-western-game",
      type: "upcoming",
      image: "/assets/images/event/01.jpg",
      eyebrow: "Séminaire scientifique et intellectuel",
      badge: "Séminaire à venir",
      title: "Le Maroc et le monde arabe dans l’arène du conflit international",
      subtitle: "Lecture de L’Ouest en jeu du Dr Mohamed Bourass",
      date: "Samedi 27 juin 2026",
      time: "À partir de 17h30",
      location: "Bayt Assahafa, Tanger",
      description:
        "Un séminaire scientifique organisé par la Fondation Abdelaziz Khallouk Temsamani pour la recherche scientifique en mémoire de son fondateur, autour d’une lecture historique et intellectuelle de l’ouvrage L’Ouest en jeu et des enjeux internationaux liés au Maroc et au monde arabe.",
      participants: [
        "Dr Tayeb Boutbkalt",
        "Dr Mohamed Jabrane",
        "Dr Abdelaziz Saoud",
        "Dr El Mbarek El Aroussi"
      ],
      moderator: "Dr Khalid Achtibat",
      ctaLabel: "Détails à venir",
      href: null
    }
  },
  es: {
    title: "Seminarios y conferencias",
    intro:
      "Esta sección reúne seminarios, conferencias y encuentros científicos organizados o documentados por la Fundación, vinculados a la historia de Tánger y del norte de Marruecos, la memoria documental y la producción académica.",
    breadcrumbs: {
      home: "Inicio",
      current: "Seminarios y conferencias",
      ariaLabel: "Ruta de navegación"
    },
    event: {
      eyebrow: "Encuentro científico y cultural",
      title: "Aniversario de la revista Dar Al-Niaba",
      dateLabel: "Fecha",
      date: "24 de diciembre de 2024",
      locationLabel: "Lugar",
      location: "Palacio Municipal, Tánger",
      description:
        "Un encuentro dedicado a recordar la trayectoria de la revista « Dar Al-Niaba » y celebrar su regreso, en un marco científico y cultural centrado en el patrimonio documental y la memoria histórica de Tánger.",
      detailsLabel: "Ver detalles"
    },
    metaLabels: {
      date: "Fecha",
      time: "Hora",
      location: "Lugar"
    },
    upcomingEvent: {
      id: "morocco-arab-world-western-game",
      type: "upcoming",
      image: "/assets/images/event/01.jpg",
      eyebrow: "Seminario científico e intelectual",
      badge: "Seminario próximo",
      title: "Marruecos y el mundo árabe en la arena del conflicto internacional",
      subtitle: "Lectura de El juego de Occidente del Dr. Mohamed Bourass",
      date: "Sábado, 27 de junio de 2026",
      time: "A partir de las 17:30",
      location: "Bayt Assahafa, Tánger",
      description:
        "Un seminario científico organizado por la Fundación Abdelaziz Khallouk Temsamani para la Investigación Científica en memoria de su fundador, con lecturas históricas e intelectuales de El juego de Occidente y sus implicaciones para Marruecos, el mundo árabe y el orden internacional.",
      participants: [
        "Dr. Tayeb Boutbkalt",
        "Dr. Mohamed Jabrane",
        "Dr. Abdelaziz Saoud",
        "Dr. El Mbarek El Aroussi"
      ],
      moderator: "Dr. Khalid Achtibat",
      ctaLabel: "Detalles próximamente",
      href: null
    }
  }
};

const getContent = (locale) => CONTENT[normalizeLocale(locale)] ?? CONTENT.en;

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

export async function generateMetadata({params}) {
  const {locale} = await params;
  const content = getContent(locale);

  return {
    title: content.title,
    description: content.intro
  };
}

const SeminarsPage = async ({params}) => {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const content = getContent(locale);
  const isRtl = isRtlLocale(locale);
  const titleParts = splitTitle(content.title);

  const breadcrumbs = [
    {label: content.breadcrumbs.home, href: "/"},
    {label: content.breadcrumbs.current, current: true}
  ];
  const seminarEvents = [
    {
      id: "dar-al-niaba-anniversary",
      type: "published",
      image: "/assets/images/event/1.jpg",
      href: DETAIL_HREF,
      ctaLabel: content.event.detailsLabel,
      ...content.event
    },
    content.upcomingEvent
  ].filter(Boolean);

  return (
    <section className='page-wrapper'>
      <section
        className='events-category-static pt-3'
        dir={isRtl ? "rtl" : "ltr"}
        lang={locale}
      >
        <div className='events-category-static__container'>
          <Breadcrumbs
            items={breadcrumbs}
            ariaLabel={content.breadcrumbs.ariaLabel}
            locale={locale}
          />

          <header className='events-category-static__header section__header'>
            <h1 className='title-animation_inner'>
              <span>{titleParts.lead || content.title}</span>
              {titleParts.rest ? ` ${titleParts.rest}` : ""}
            </h1>
            <p>{content.intro}</p>
          </header>

          <div className='events-featured-list'>
            {seminarEvents.map((event) => {
              const titleId = `seminar-${event.id}-title`;
              const metaRows = [
                {
                  label: event.dateLabel || content.metaLabels.date,
                  value: event.date
                },
                {
                  label: event.timeLabel || content.metaLabels.time,
                  value: event.time
                },
                {
                  label: event.locationLabel || content.metaLabels.location,
                  value: event.location
                }
              ].filter((item) => item.label && item.value);

              return (
                <article
                  key={event.id}
                  className={`events-featured-card ${event.type === "upcoming" ? "events-featured-card--upcoming" : ""}`}
                  aria-labelledby={titleId}
                >
                  <div className='events-featured-card__media' aria-hidden='true'>
                    <Image
                      src={event.image}
                      alt=''
                      fill
                      sizes='(max-width: 992px) 92vw, 540px'
                      className='events-featured-card__image'
                    />
                    <span className='events-featured-card__overlay' />
                  </div>

                  <div className='events-featured-card__content'>
                    <div className='events-featured-card__topline'>
                      <p className='events-featured-card__eyebrow'>{event.eyebrow}</p>
                      {event.badge ? <span className='events-featured-card__badge'>{event.badge}</span> : null}
                    </div>

                    <h2 id={titleId}>{event.title}</h2>
                    {event.subtitle ? <p className='events-featured-card__subtitle'>{event.subtitle}</p> : null}
                    <p className='events-featured-card__description'>{event.description}</p>

                    <dl className='events-featured-card__meta'>
                      {metaRows.map((item) => (
                        <div key={`${event.id}-${item.label}`}>
                          <dt>{item.label}</dt>
                          <dd>{item.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {event.href ? (
                      <Link
                        href={event.href}
                        locale={locale}
                        className='events-featured-card__link'
                        aria-label={`${event.ctaLabel}: ${event.title}`}
                      >
                        {event.ctaLabel}
                        <i
                          className={`fa-solid ${isRtl ? "fa-arrow-left" : "fa-arrow-right"}`}
                          aria-hidden='true'
                        />
                      </Link>
                    ) : (
                      <span className='events-featured-card__link events-featured-card__link--disabled' aria-disabled='true'>
                        {event.ctaLabel}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </section>
  );
};

export default SeminarsPage;

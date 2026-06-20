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
    }
  }
};

const getContent = (locale) => CONTENT[normalizeLocale(locale)] ?? CONTENT.en;

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

  const breadcrumbs = [
    {label: content.breadcrumbs.home, href: "/"},
    {label: content.breadcrumbs.current, current: true}
  ];

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
            <h1 className='title-animation_inner'>{content.title}</h1>
            <p>{content.intro}</p>
          </header>

          <article className='events-featured-card' aria-labelledby='featured-seminar-title'>
            <div className='events-featured-card__media' aria-hidden='true'>
              <Image
                src='/assets/images/event/1.jpg'
                alt=''
                fill
                sizes='min(1040px, 92vw)'
                className='events-featured-card__image'
              />
              <span className='events-featured-card__overlay' />
            </div>

            <div className='events-featured-card__content'>
              <p className='events-featured-card__eyebrow'>{content.event.eyebrow}</p>
              <h2 id='featured-seminar-title'>{content.event.title}</h2>
              <p className='events-featured-card__description'>{content.event.description}</p>

              <dl className='events-featured-card__meta'>
                <div>
                  <dt>{content.event.dateLabel}</dt>
                  <dd>{content.event.date}</dd>
                </div>
                <div>
                  <dt>{content.event.locationLabel}</dt>
                  <dd>{content.event.location}</dd>
                </div>
              </dl>

              <Link
                href={DETAIL_HREF}
                locale={locale}
                className='events-featured-card__link'
                aria-label={`${content.event.detailsLabel}: ${content.event.title}`}
              >
                {content.event.detailsLabel}
                <i
                  className={`fa-solid ${isRtl ? "fa-arrow-left" : "fa-arrow-right"}`}
                  aria-hidden='true'
                />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <Footer locale={locale} />
    </section>
  );
};

export default SeminarsPage;

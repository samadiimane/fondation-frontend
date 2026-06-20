import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { isRtlLocale } from "@/i18n/config";

const CONTENT = {
  ar: {
    home: "الرئيسية",
    ariaLabel: "مسار التنقل",
    title: "الندوات والمحاضرات",
    intro:
      "يضم هذا القسم الندوات والمحاضرات واللقاءات العلمية التي تنظمها المؤسسة أو توثقها، في صلةٍ بتاريخ طنجة وشمال المغرب، وبقضايا البحث التاريخي، والذاكرة الوثائقية، والإنتاج العلمي.",
    eventTitle: "ذكرى مجلة دار النيابة",
    dateLabel: "التاريخ",
    date: "24 دجنبر 2024",
    locationLabel: "المكان",
    location: "قصر البلدية، طنجة",
    readMore: "عرض التفاصيل",
  },
  en: {
    home: "Home",
    ariaLabel: "Breadcrumb",
    title: "Seminars & Lectures",
    intro:
      "This section gathers seminars, lectures, and scholarly meetings organized or documented by the Foundation around the history of Tangier and Northern Morocco, historical research, documentary memory, and scholarly production.",
    eventTitle: "Dar al-Niaba Journal Anniversary",
    dateLabel: "Date",
    date: "24 December 2024",
    locationLabel: "Location",
    location: "Municipal Palace, Tangier",
    readMore: "View details",
  },
  fr: {
    home: "Accueil",
    ariaLabel: "Fil d'Ariane",
    title: "Seminaires et conferences",
    intro:
      "Cette section rassemble les seminaires, conferences et rencontres scientifiques organises ou documentes par la Fondation autour de l'histoire de Tanger et du Nord du Maroc, de la recherche historique, de la memoire documentaire et de la production scientifique.",
    eventTitle: "Anniversaire de la revue Dar al-Niaba",
    dateLabel: "Date",
    date: "24 decembre 2024",
    locationLabel: "Lieu",
    location: "Palais municipal, Tanger",
    readMore: "Voir les details",
  },
  es: {
    home: "Inicio",
    ariaLabel: "Ruta de navegacion",
    title: "Seminarios y conferencias",
    intro:
      "Esta seccion reune seminarios, conferencias y encuentros academicos organizados o documentados por la Fundacion sobre la historia de Tanger y el norte de Marruecos, la investigacion historica, la memoria documental y la produccion cientifica.",
    eventTitle: "Aniversario de la revista Dar al-Niaba",
    dateLabel: "Fecha",
    date: "24 de diciembre de 2024",
    locationLabel: "Lugar",
    location: "Palacio Municipal, Tanger",
    readMore: "Ver detalles",
  },
};

const getContent = (locale) => CONTENT[locale] ?? CONTENT.en;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = getContent(locale);

  return {
    title: content.title,
    description: content.intro,
  };
}

const SeminarsPage = async ({ params }) => {
  const { locale } = await params;
  const content = getContent(locale);
  const isRtl = isRtlLocale(locale);

  const breadcrumbs = [
    { label: content.home, href: "/" },
    { label: content.title, current: true },
  ];

  return (
    <section className='page-wrapper'>
      <section className='support-detail pt-120 pb-120' dir={isRtl ? "rtl" : "ltr"}>
        <div className='container'>
          <Breadcrumbs items={breadcrumbs} ariaLabel={content.ariaLabel} locale={locale} />

          <div className='support-detail__inner support-detail__inner--faq'>
            <header className='support-detail__header section__header text-center'>
              <h1 className='title-animation_inner'>{content.title}</h1>
              <p>{content.intro}</p>
            </header>

            <article className='support-detail__card'>
              <div className='support-faq__item'>
                <h3>
                  <Link href='/events/seminars/dar-al-niaba-anniversary'>
                    {content.eventTitle}
                  </Link>
                </h3>
                <p>
                  <strong>{content.dateLabel}:</strong> {content.date}
                </p>
                <p>
                  <strong>{content.locationLabel}:</strong> {content.location}
                </p>
                <Link href='/events/seminars/dar-al-niaba-anniversary' className='service-detail__return-link'>
                  {content.readMore}
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </section>
  );
};

export default SeminarsPage;

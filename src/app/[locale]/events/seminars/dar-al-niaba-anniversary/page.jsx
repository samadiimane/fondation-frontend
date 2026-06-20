import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { isRtlLocale, normalizeLocale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const COVER_IMAGE = "/assets/images/event/1.jpg";

const GALLERY_IMAGES = [
  "/assets/images/event/1.jpg",
  "/assets/images/event/2.jpg",
  "/assets/images/event/3.jpg",
  "/assets/images/event/4.jpg",
  "/assets/images/event/5.jpg",
  "/assets/images/event/6.jpg",
  "/assets/images/event/7.jpg",
  "/assets/images/event/8.jpg",
  "/assets/images/event/9.jpg",
];

const CONTENT = {
  ar: {
    title: "ذكرى مجلة دار النيابة",
    date: "24 دجنبر 2024",
    location: "قصر البلدية، طنجة",
    theme: "مجلة دار النيابة: منبر لترسيخ ثقافة الاعتراف",
    intro:
      "احتضنت مدينة طنجة يوم 24 دجنبر 2024 لقاءً ثقافياً وعلمياً خُصص لاستحضار مسار مجلة «دار النيابة» والاحتفاء بعودتها في سياق رمزي يرتبط بالذكرى الأربعين لصدورها. وقد شكل هذا اللقاء مناسبة للتذكير بالدور الذي اضطلعت به المجلة في خدمة البحث التاريخي، وفي ترسيخ ثقافة الاعتراف داخل الوسط الأكاديمي والثقافي.",
    sections: [
      {
        title: "حدث علمي وثقافي بمدينة طنجة",
        paragraphs: [
          "نُظم اللقاء بقصر البلدية بمدينة طنجة، بحضور عدد من الباحثين والمؤرخين والمهتمين بالشأن الثقافي، إلى جانب شخصيات من مجالات مختلفة وممثلي وسائل الإعلام. وقد عكس الحضور المتنوع مكانة المجلة في الذاكرة الثقافية للمدينة، وارتباطها بمسار البحث التاريخي في شمال المغرب.",
          "وتوالت خلال اللقاء شهادات ومداخلات علمية استحضرت تاريخ هذا المنبر الثقافي، ودوره في إتاحة فضاء للكتابة التاريخية الرصينة، وفي جمع أسماء وازنة من الباحثين والمؤرخين حول قضايا الوثيقة والذاكرة والتاريخ.",
        ],
      },
      {
        title: "مجلة دار النيابة وثقافة الاعتراف",
        paragraphs: [
          "حمل اللقاء شعار «مجلة دار النيابة: منبر لترسيخ ثقافة الاعتراف»، وهو شعار يعكس طبيعة المناسبة بوصفها لحظة وفاء علمي وثقافي، لا مجرد إعلان عن عودة مجلة. فقد جرى التأكيد على القيمة الرمزية والمعرفية لهذا المنبر الذي تأسس بمدينة طنجة سنة 1984، وأسهم على مدى عقود في خدمة تاريخ المغرب وشماله.",
          "كما شكلت المناسبة فرصة لتكريم عدد من المؤرخين والباحثين، والاعتراف بما قدموه من إسهامات علمية في مجالات التاريخ والوثيقة والبحث الأكاديمي، بما يعزز حضور قيم التقدير والاحترام المتبادل داخل المجال العلمي.",
        ],
      },
      {
        title: "استحضار إرث المؤرخ الراحل عبد العزيز خلوق التمسماني",
        paragraphs: [
          "استحضر اللقاء مكانة المؤرخ الراحل عبد العزيز خلوق التمسماني، باعتباره أحد الأسماء البارزة في المدرسة التاريخية الوطنية بعد الاستقلال، وأحد الوجوه التي ارتبطت بإخراج مجلة «دار النيابة» وجعلها فضاءً للكتابة التاريخية والبحث الوثائقي.",
          "وقد أبرزت المداخلات العلمية القيمة التاريخية للمجلة، وصلتها بمشروع التمسماني في خدمة الوثيقة، وصيانة الذاكرة، وإعادة الاعتبار لتاريخ طنجة وشمال المغرب من خلال البحث الجاد والمنظم.",
        ],
      },
    ],
    labels: {
      home: "الرئيسية",
      seminars: "الندوات والمحاضرات",
      breadcrumb: "مسار التنقل",
      date: "التاريخ",
      location: "المكان",
      theme: "الموضوع",
      galleryTitle: "معرض الصور",
      backToSeminars: "العودة إلى الندوات والمحاضرات",
      coverAlt: "صورة من لقاء ذكرى مجلة دار النيابة",
      galleryAlt: "صورة من لقاء ذكرى مجلة دار النيابة رقم {number}",
    },
    metadataDescription:
      "لقاء ثقافي وعلمي احتضنته مدينة طنجة لاستحضار مسار مجلة دار النيابة والاحتفاء بعودتها في الذكرى الأربعين لصدورها.",
  },
  en: {
    title: "Dar Al-Niaba Journal Anniversary",
    date: "24 December 2024",
    location: "Municipal Palace, Tangier",
    theme: "Dar Al-Niaba Journal: a platform for strengthening a culture of recognition",
    intro:
      "On 24 December 2024, Tangier hosted a cultural and scholarly meeting dedicated to recalling the history of Dar Al-Niaba journal and celebrating its return in a symbolic context linked to the fortieth anniversary of its first issue. The meeting was an occasion to highlight the journal’s role in serving historical research and strengthening a culture of recognition within academic and cultural circles.",
    sections: [
      {
        title: "A scholarly and cultural event in Tangier",
        paragraphs: [
          "The meeting was held at the Municipal Palace in Tangier, with the participation of researchers, historians, cultural actors, public figures, and media representatives. This varied attendance reflected the journal’s place in the city’s cultural memory and its connection to historical research in northern Morocco.",
          "The program included testimonies and scholarly interventions that recalled the history of this cultural platform, its role in supporting rigorous historical writing, and its capacity to bring together researchers and historians around questions of documents, memory, and history.",
        ],
      },
      {
        title: "Dar Al-Niaba Journal and the culture of recognition",
        paragraphs: [
          "The meeting was held under the theme “Dar Al-Niaba Journal: a platform for strengthening a culture of recognition,” a title that frames the occasion as a moment of scholarly and cultural fidelity, rather than simply the announcement of a journal’s return. Participants emphasized the symbolic and intellectual value of a platform founded in Tangier in 1984 and dedicated for decades to the history of Morocco and its northern regions.",
          "The occasion also provided an opportunity to honor historians and researchers and to recognize their scholarly contributions in the fields of history, documentation, and academic research, reinforcing values of appreciation and mutual respect within the scholarly community.",
        ],
      },
      {
        title: "Recalling the legacy of the late historian Abdelaziz Khallouk Temsamani",
        paragraphs: [
          "The meeting recalled the place of the late historian Abdelaziz Khallouk Temsamani as one of the notable figures of Morocco’s post-independence historical school and as a scholar closely associated with the creation of Dar Al-Niaba journal as a space for historical writing and documentary research.",
          "The scholarly interventions underlined the journal’s historical value and its connection to Temsamani’s project of serving documentary knowledge, preserving memory, and restoring the history of Tangier and northern Morocco through serious and organized research.",
        ],
      },
    ],
    labels: {
      home: "Home",
      seminars: "Seminars and Lectures",
      breadcrumb: "Breadcrumb",
      date: "Date",
      location: "Location",
      theme: "Theme",
      galleryTitle: "Photo Gallery",
      backToSeminars: "Back to Seminars and Lectures",
      coverAlt: "Photo from the Dar Al-Niaba journal anniversary meeting",
      galleryAlt: "Photo from the Dar Al-Niaba journal anniversary meeting number {number}",
    },
    metadataDescription:
      "A cultural and scholarly meeting held in Tangier to recall the history of Dar Al-Niaba journal and celebrate its return on the fortieth anniversary of its first issue.",
  },
  fr: {
    title: "Anniversaire de la revue Dar Al-Niaba",
    date: "24 décembre 2024",
    location: "Palais municipal, Tanger",
    theme: "La revue Dar Al-Niaba : un espace pour renforcer la culture de la reconnaissance",
    intro:
      "Le 24 décembre 2024, la ville de Tanger a accueilli une rencontre culturelle et scientifique consacrée à l’évocation du parcours de la revue Dar Al-Niaba et à la célébration de son retour, dans un contexte symbolique lié au quarantième anniversaire de sa parution. Cette rencontre a permis de rappeler le rôle joué par la revue au service de la recherche historique et de la culture de la reconnaissance dans les milieux académiques et culturels.",
    sections: [
      {
        title: "Un événement scientifique et culturel à Tanger",
        paragraphs: [
          "La rencontre s’est tenue au Palais municipal de Tanger, en présence de chercheurs, d’historiens, d’acteurs culturels, de personnalités de différents horizons et de représentants des médias. Cette participation variée a reflété la place de la revue dans la mémoire culturelle de la ville et son lien avec la recherche historique sur le nord du Maroc.",
          "Des témoignages et interventions scientifiques ont rappelé l’histoire de cette plateforme culturelle, son rôle dans l’ouverture d’un espace pour une écriture historique rigoureuse et sa capacité à réunir des chercheurs et historiens autour des questions de document, de mémoire et d’histoire.",
        ],
      },
      {
        title: "La revue Dar Al-Niaba et la culture de la reconnaissance",
        paragraphs: [
          "La rencontre était placée sous le thème « La revue Dar Al-Niaba : un espace pour renforcer la culture de la reconnaissance », une formulation qui donne à l’événement le sens d’un moment de fidélité scientifique et culturelle, et non d’une simple annonce de retour. Les participants ont souligné la valeur symbolique et intellectuelle de cette revue fondée à Tanger en 1984 et consacrée pendant des décennies à l’histoire du Maroc et de son nord.",
          "L’événement a également constitué une occasion d’honorer plusieurs historiens et chercheurs et de reconnaître leurs apports scientifiques dans les domaines de l’histoire, du document et de la recherche académique, en renforçant les valeurs d’estime et de respect mutuel dans le champ scientifique.",
        ],
      },
      {
        title: "Évoquer l’héritage de feu l’historien Abdelaziz Khallouk Temsamani",
        paragraphs: [
          "La rencontre a rappelé la place de feu l’historien Abdelaziz Khallouk Temsamani, figure importante de l’école historique marocaine après l’indépendance et acteur lié à la création de la revue Dar Al-Niaba comme espace d’écriture historique et de recherche documentaire.",
          "Les interventions scientifiques ont mis en lumière la valeur historique de la revue et son lien avec le projet de Temsamani : servir la connaissance documentaire, préserver la mémoire et rendre justice à l’histoire de Tanger et du nord du Maroc par une recherche sérieuse et organisée.",
        ],
      },
    ],
    labels: {
      home: "Accueil",
      seminars: "Séminaires et conférences",
      breadcrumb: "Fil d’Ariane",
      date: "Date",
      location: "Lieu",
      theme: "Thème",
      galleryTitle: "Galerie de photos",
      backToSeminars: "Retour aux séminaires et conférences",
      coverAlt: "Photo de la rencontre anniversaire de la revue Dar Al-Niaba",
      galleryAlt: "Photo de la rencontre anniversaire de la revue Dar Al-Niaba numéro {number}",
    },
    metadataDescription:
      "Une rencontre culturelle et scientifique organisée à Tanger pour évoquer le parcours de la revue Dar Al-Niaba et célébrer son retour à l’occasion du quarantième anniversaire de sa parution.",
  },
  es: {
    title: "Aniversario de la revista Dar Al-Niaba",
    date: "24 de diciembre de 2024",
    location: "Palacio Municipal, Tánger",
    theme: "La revista Dar Al-Niaba: una plataforma para fortalecer la cultura del reconocimiento",
    intro:
      "El 24 de diciembre de 2024, la ciudad de Tánger acogió un encuentro cultural y académico dedicado a recordar la trayectoria de la revista Dar Al-Niaba y a celebrar su regreso, en un contexto simbólico vinculado al cuadragésimo aniversario de su primera aparición. El encuentro permitió destacar el papel de la revista al servicio de la investigación histórica y de la cultura del reconocimiento en los ámbitos académico y cultural.",
    sections: [
      {
        title: "Un evento académico y cultural en Tánger",
        paragraphs: [
          "El encuentro se celebró en el Palacio Municipal de Tánger, con la participación de investigadores, historiadores, actores culturales, personalidades de distintos ámbitos y representantes de los medios. Esta presencia diversa reflejó el lugar de la revista en la memoria cultural de la ciudad y su vínculo con la investigación histórica sobre el norte de Marruecos.",
          "Durante el acto se presentaron testimonios e intervenciones académicas que recordaron la historia de esta plataforma cultural, su papel en la apertura de un espacio para una escritura histórica rigurosa y su capacidad para reunir a investigadores e historiadores en torno a los documentos, la memoria y la historia.",
        ],
      },
      {
        title: "La revista Dar Al-Niaba y la cultura del reconocimiento",
        paragraphs: [
          "El encuentro se organizó bajo el lema «La revista Dar Al-Niaba: una plataforma para fortalecer la cultura del reconocimiento», una formulación que presenta la ocasión como un momento de fidelidad académica y cultural, y no como un simple anuncio del regreso de una revista. Se subrayó el valor simbólico e intelectual de esta plataforma fundada en Tánger en 1984 y dedicada durante décadas a la historia de Marruecos y de su norte.",
          "La ocasión también permitió rendir homenaje a historiadores e investigadores y reconocer sus aportes científicos en los campos de la historia, la documentación y la investigación académica, fortaleciendo los valores de aprecio y respeto mutuo dentro del ámbito científico.",
        ],
      },
      {
        title: "Recordar el legado del difunto historiador Abdelaziz Khallouk Temsamani",
        paragraphs: [
          "El encuentro recordó el lugar del difunto historiador Abdelaziz Khallouk Temsamani como una figura destacada de la escuela histórica marroquí posterior a la independencia y como un académico estrechamente vinculado a la creación de la revista Dar Al-Niaba como espacio de escritura histórica e investigación documental.",
          "Las intervenciones académicas pusieron de relieve el valor histórico de la revista y su relación con el proyecto de Temsamani: servir al conocimiento documental, preservar la memoria y restituir la historia de Tánger y del norte de Marruecos mediante una investigación seria y organizada.",
        ],
      },
    ],
    labels: {
      home: "Inicio",
      seminars: "Seminarios y conferencias",
      breadcrumb: "Ruta de navegación",
      date: "Fecha",
      location: "Lugar",
      theme: "Tema",
      galleryTitle: "Galería de fotos",
      backToSeminars: "Volver a seminarios y conferencias",
      coverAlt: "Foto del encuentro aniversario de la revista Dar Al-Niaba",
      galleryAlt: "Foto del encuentro aniversario de la revista Dar Al-Niaba número {number}",
    },
    metadataDescription:
      "Un encuentro cultural y académico celebrado en Tánger para recordar la trayectoria de la revista Dar Al-Niaba y celebrar su regreso en el cuadragésimo aniversario de su primera aparición.",
  },
};

const getContent = (locale) => CONTENT[normalizeLocale(locale)] ?? CONTENT.en;
const formatGalleryAlt = (template, number, locale) =>
  template.replace("{number}", new Intl.NumberFormat(locale).format(number));

export async function generateMetadata({ params }) {
  const { locale: localeParam } = await params;
  const content = getContent(localeParam);

  return {
    title: content.title,
    description: content.metadataDescription,
  };
}

const DarAlNiabaAnniversaryPage = async ({ params }) => {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const content = getContent(locale);
  const labels = content.labels;
  const isRtl = isRtlLocale(locale);

  const breadcrumbs = [
    { label: labels.home, href: "/" },
    { label: labels.seminars, href: "/events/seminars" },
    { label: content.title, current: true },
  ];

  return (
    <section className='page-wrapper'>
      <article
        className='event-detail-static'
        dir={isRtl ? "rtl" : "ltr"}
        lang={locale}
      >
        <div className='event-detail-static__container'>
          <Breadcrumbs items={breadcrumbs} ariaLabel={labels.breadcrumb} locale={locale} />

          <header className='event-detail-static__hero section__header' aria-labelledby='event-detail-title'>
            <h1 id='event-detail-title' className='title-animation_inner'>
              {content.title}
            </h1>

            <dl className='event-detail-static__meta'>
              <div>
                <dt>{labels.date}</dt>
                <dd>{content.date}</dd>
              </div>
              <div>
                <dt>{labels.location}</dt>
                <dd>{content.location}</dd>
              </div>
              <div>
                <dt>{labels.theme}</dt>
                <dd>{content.theme}</dd>
              </div>
            </dl>
          </header>

          <figure className='event-detail-static__cover'>
            <div className='event-detail-static__cover-media'>
              <Image
                src={COVER_IMAGE}
                alt={labels.coverAlt}
                fill
                priority
                sizes='min(860px, 92vw)'
                className='event-detail-static__image'
              />
            </div>
          </figure>

          <div className='event-detail-static__body'>
            <p className='event-detail-static__intro'>{content.intro}</p>

            {content.sections.map((section) => (
              <section key={section.title} className='event-detail-static__section'>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <section className='event-detail-static__gallery' aria-labelledby='event-gallery-title'>
            <h2 id='event-gallery-title'>{labels.galleryTitle}</h2>
            <ul className='event-detail-static__gallery-list'>
              {GALLERY_IMAGES.map((src, index) => (
                <li key={src}>
                  <figure className='event-detail-static__gallery-item'>
                    <Image
                      src={src}
                      alt={formatGalleryAlt(labels.galleryAlt, index + 1, locale)}
                      fill
                      loading='lazy'
                      sizes='(max-width: 640px) 92vw, (max-width: 992px) 45vw, 30vw'
                      className='event-detail-static__image'
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </section>

          <nav className='event-detail-static__actions' aria-label={labels.backToSeminars}>
            <Link href='/events/seminars' locale={locale} className='event-detail-static__back-link'>
              {labels.backToSeminars}
            </Link>
          </nav>
        </div>
      </article>

      <Footer locale={locale} />
    </section>
  );
};

export default DarAlNiabaAnniversaryPage;

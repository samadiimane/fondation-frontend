import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

const event = {
  title: "ذكرى مجلة دار النيابة",
  eyebrow: "الندوات والمحاضرات",
  subtitle: "عودة مجلة دار النيابة واحتفاء بالتراث الثقافي لمدينة طنجة",
  date: "24 دجنبر 2024",
  location: "قصر البلدية، طنجة",
  theme: "مجلة دار النيابة: منبر لترسيخ ثقافة الاعتراف",
  youtubeUrl: "",
  coverImage: "/assets/images/event/1.jpg",
  gallery: [
    "/assets/images/event/1.jpg",
    "/assets/images/event/2.jpg",
    "/assets/images/event/3.jpg",
    "/assets/images/event/4.jpg",
    "/assets/images/event/5.jpg",
    "/assets/images/event/6.jpg",
    "/assets/images/event/7.jpg",
    "/assets/images/event/8.jpg",
    "/assets/images/event/9.jpg",
  ],
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
      title: "استحضار إرث عبد العزيز خلوق التمسماني",
      paragraphs: [
        "استحضر اللقاء مكانة المؤرخ الراحل عبد العزيز خلوق التمسماني، باعتباره أحد الأسماء البارزة في المدرسة التاريخية الوطنية بعد الاستقلال، وأحد الوجوه التي ارتبطت بإخراج مجلة «دار النيابة» وجعلها فضاءً للكتابة التاريخية والبحث الوثائقي.",
        "وقد أبرزت المداخلات العلمية القيمة التاريخية للمجلة، وصلتها بمشروع التمسماني في خدمة الوثيقة، وصيانة الذاكرة، وإعادة الاعتبار لتاريخ طنجة وشمال المغرب من خلال البحث الجاد والمنظم.",
      ],
    },
    {
      title: "ذاكرة موثقة بالصور",
      paragraphs: [
        "توثق الصور المرفقة جوانب من أجواء اللقاء، والحضور العلمي والثقافي الذي ميز هذه المناسبة، بما يجعلها جزءاً من الذاكرة البصرية للمؤسسة ولمسار مجلة «دار النيابة».",
      ],
    },
  ],
};

const labels = {
  home: "الرئيسية",
  seminars: "الندوات والمحاضرات",
  breadcrumb: "مسار التنقل",
  date: "التاريخ",
  location: "المكان",
  theme: "الموضوع",
  galleryTitle: "معرض الصور",
  youtubeTitle: "تسجيل مرئي",
  backToSeminars: "العودة إلى الندوات والمحاضرات",
};

export async function generateMetadata() {
  return {
    title: event.title,
    description:
      "لقاء ثقافي وعلمي احتضنته مدينة طنجة لاستحضار مسار مجلة دار النيابة والاحتفاء بعودتها في الذكرى الأربعين لصدورها.",
  };
}

const DarAlNiabaAnniversaryPage = async ({ params }) => {
  const { locale } = await params;

  const breadcrumbs = [
    { label: labels.home, href: "/" },
    { label: labels.seminars, href: "/events/seminars" },
    { label: event.title, current: true },
  ];

  return (
    <section className='page-wrapper'>
      <article className='event-detail-static pt-120 pb-120' dir='rtl' lang='ar'>
        <div className='container'>
          <Breadcrumbs items={breadcrumbs} ariaLabel={labels.breadcrumb} locale='ar' />

          <header className='event-detail-static__hero' aria-labelledby='event-detail-title'>
            <p className='event-detail-static__eyebrow'>{event.eyebrow}</p>
            <h1 id='event-detail-title' className='title-animation_inner'>
              {event.title}
            </h1>
            <p className='event-detail-static__subtitle'>{event.subtitle}</p>

            <dl className='event-detail-static__meta'>
              <div>
                <dt>{labels.date}</dt>
                <dd>{event.date}</dd>
              </div>
              <div>
                <dt>{labels.location}</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt>{labels.theme}</dt>
                <dd>{event.theme}</dd>
              </div>
            </dl>
          </header>

          <figure className='event-detail-static__cover'>
            <div className='event-detail-static__cover-media'>
              <Image
                src={event.coverImage}
                alt='صورة من لقاء ذكرى مجلة دار النيابة'
                fill
                priority
                sizes='min(1120px, 92vw)'
                className='event-detail-static__image'
              />
            </div>
          </figure>

          <div className='event-detail-static__body'>
            <p className='event-detail-static__intro'>{event.intro}</p>

            {event.sections.map((section) => (
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
              {event.gallery.map((src, index) => (
                <li key={src}>
                  <figure className='event-detail-static__gallery-item'>
                    <Image
                      src={src}
                      alt={`صورة من لقاء ذكرى مجلة دار النيابة رقم ${index + 1}`}
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

          {event.youtubeUrl ? (
            <section className='event-detail-static__video' aria-labelledby='event-video-title'>
              <h2 id='event-video-title'>{labels.youtubeTitle}</h2>
              <iframe
                src={event.youtubeUrl}
                title={labels.youtubeTitle}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </section>
          ) : null}

          <nav className='event-detail-static__actions' aria-label={labels.backToSeminars}>
            <Link href='/events/seminars' className='service-detail__return-link'>
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

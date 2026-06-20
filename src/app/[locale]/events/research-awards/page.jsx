import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { isRtlLocale } from "@/i18n/config";

const CONTENT = {
  ar: {
    home: "الرئيسية",
    ariaLabel: "مسار التنقل",
    title: "جوائز البحث",
    message: "سيتم نشر محتوى هذا القسم لاحقاً.",
  },
  en: {
    home: "Home",
    ariaLabel: "Breadcrumb",
    title: "Research Awards",
    message: "Content for this section will be published later.",
  },
  fr: {
    home: "Accueil",
    ariaLabel: "Fil d'Ariane",
    title: "Prix de recherche",
    message: "Le contenu de cette section sera publie ulterieurement.",
  },
  es: {
    home: "Inicio",
    ariaLabel: "Ruta de navegacion",
    title: "Premios de investigacion",
    message: "El contenido de esta seccion se publicara mas adelante.",
  },
};

const getContent = (locale) => CONTENT[locale] ?? CONTENT.en;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = getContent(locale);

  return {
    title: content.title,
    description: content.message,
  };
}

const ResearchAwardsPage = async ({ params }) => {
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
            </header>

            <div className='support-detail__card'>
              <p>{content.message}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </section>
  );
};

export default ResearchAwardsPage;

import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { isRtlLocale, normalizeLocale } from "@/i18n/config";

const CONTENT = {
  ar: {
    title: "المعارض والوسائط الوثائقية",
    message: "سيتم نشر محتوى هذا القسم لاحقاً.",
    breadcrumbs: {
      home: "الرئيسية",
      current: "المعارض والوسائط الوثائقية",
      ariaLabel: "مسار التنقل",
    },
  },
  en: {
    title: "Exhibitions and Documentary Media",
    message: "Content for this section will be published later.",
    breadcrumbs: {
      home: "Home",
      current: "Exhibitions and Documentary Media",
      ariaLabel: "Breadcrumb",
    },
  },
  fr: {
    title: "Expositions et médias documentaires",
    message: "Le contenu de cette section sera publié ultérieurement.",
    breadcrumbs: {
      home: "Accueil",
      current: "Expositions et médias documentaires",
      ariaLabel: "Fil d’Ariane",
    },
  },
  es: {
    title: "Exposiciones y medios documentales",
    message: "El contenido de esta sección se publicará más adelante.",
    breadcrumbs: {
      home: "Inicio",
      current: "Exposiciones y medios documentales",
      ariaLabel: "Ruta de navegación",
    },
  },
};

const getContent = (locale) => CONTENT[normalizeLocale(locale)] ?? CONTENT.en;

export async function generateMetadata({ params }) {
  const { locale: localeParam } = await params;
  const content = getContent(localeParam);

  return {
    title: content.title,
    description: content.message,
  };
}

const DocumentaryMediaPage = async ({ params }) => {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const content = getContent(locale);
  const isRtl = isRtlLocale(locale);

  const breadcrumbs = [
    { label: content.breadcrumbs.home, href: "/" },
    { label: content.breadcrumbs.current, current: true },
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
          </header>

          <div className='events-category-static__placeholder'>
            <p>{content.message}</p>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </section>
  );
};

export default DocumentaryMediaPage;

import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { isRtlLocale, normalizeLocale } from "@/i18n/config";

const CONTENT = {
  ar: {
    title: "المعارض والوسائط الوثائقية",
    message: "سيتم الإعلان عن محتوى هذا القسم بعد استكمال إعداده العلمي والتوثيقي.",
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

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

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
  const titleParts = splitTitle(content.title);

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
            <h1 className='title-animation_inner'>
              <span>{titleParts.lead || content.title}</span>
              {titleParts.rest ? ` ${titleParts.rest}` : ""}
            </h1>
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

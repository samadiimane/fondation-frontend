import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import {defaultLocale, isRtlLocale, normalizeLocale} from "@/i18n/config";

const categoryPageCopy = {
  en: {
    breadcrumbsLabel: "Breadcrumb",
    home: "Home",
    library: "Digital Library",
    archives: "Archives and Documentary Heritage",
    historicalSites: "Historical Sites and Landmarks",
    researchThemes: "Research Themes",
  },
  fr: {
    breadcrumbsLabel: "Fil d'Ariane",
    home: "Accueil",
    library: "Bibliotheque numerique",
    archives: "Archives et patrimoine documentaire",
    historicalSites: "Sites et monuments historiques",
    researchThemes: "Axes de recherche",
  },
  es: {
    breadcrumbsLabel: "Ruta de navegacion",
    home: "Inicio",
    library: "Biblioteca digital",
    archives: "Archivos y patrimonio documental",
    historicalSites: "Sitios y monumentos historicos",
    researchThemes: "Lineas de investigacion",
  },
  ar: {
    breadcrumbsLabel: "مسار التصفح",
    home: "الرئيسية",
    library: "المكتبة الرقمية",
    archives: "الأرشيف والتراث الوثائقي",
    historicalSites: "المواقع والمعالم التاريخية",
    researchThemes: "محاور البحث",
  },
};

export function getStaticCategoryPageCopy(locale, categoryKey) {
  const normalizedLocale = normalizeLocale(locale);
  const copy = categoryPageCopy[normalizedLocale] ?? categoryPageCopy[defaultLocale];

  return {
    ...copy,
    title: copy[categoryKey] ?? copy.archives,
  };
}

export function StaticCategoryUnavailablePage({locale, categoryKey}) {
  const normalizedLocale = normalizeLocale(locale);
  const copy = getStaticCategoryPageCopy(normalizedLocale, categoryKey);
  const isRtl = isRtlLocale(normalizedLocale);
  const breadcrumbsItems = [
    {label: copy.home, href: "/"},
    {label: copy.library, href: "/library"},
    {label: copy.title, current: true},
  ];

  return (
    <section className="page-wrapper category-page-shell">
      <main className="category-page-static" lang={normalizedLocale} dir={isRtl ? "rtl" : "ltr"}>
        <Breadcrumbs
          items={breadcrumbsItems}
          ariaLabel={copy.breadcrumbsLabel}
          locale={normalizedLocale}
        />

        <header className="category-page-static__header">
          <h1 className="title-animation_inner">{copy.title}</h1>
        </header>

        <PublicUnavailableNotice locale={normalizedLocale} />
      </main>

      <Footer locale={normalizedLocale} />
    </section>
  );
}

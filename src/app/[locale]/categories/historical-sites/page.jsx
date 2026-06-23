import {defaultLocale} from "@/i18n/config";
import {
  getStaticCategoryPageCopy,
  StaticCategoryUnavailablePage,
} from "../_staticPages";

/*
Backend-driven implementation preserved for later database restoration.

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import HistoricalSitesClient from "./HistoricalSitesClient";
import {getPublicCategory} from "../_helpers";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.historicalSites.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const HistoricalSitesPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.historicalSites" });
  const {category, unavailable} = await getPublicCategory("historical-sites", { locale });
  const breadcrumbsItems = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.library"), href: "/library" },
    { label: t("breadcrumbs.historicalSites"), current: true },
  ];

  if (unavailable) {
    return (
      <section className="page-wrapper">
        <main className="category-section">
          <Breadcrumbs
            items={breadcrumbsItems}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <PublicUnavailableNotice locale={locale} />
        </main>

        <Footer locale={locale} />
      </section>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <section className="page-wrapper">
      <main className="category-section">
        <Breadcrumbs
          items={breadcrumbsItems}
          ariaLabel={t("a11y.breadcrumbs")}
          locale={locale}
        />
        <HistoricalSitesClient category={category} />
      </main>

      <Footer locale={locale} />
    </section>
  );
};

export default HistoricalSitesPage;
*/

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const copy = getStaticCategoryPageCopy(locale, "historicalSites");

  return {
    title: `${copy.title} | AKT Research Foundation`,
    description: copy.title,
  };
}

const HistoricalSitesPage = async ({params}) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;

  return <StaticCategoryUnavailablePage locale={locale} categoryKey="historicalSites" />;
};

export default HistoricalSitesPage;

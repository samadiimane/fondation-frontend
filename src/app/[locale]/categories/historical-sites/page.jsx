import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import HistoricalSitesClient from "./HistoricalSitesClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

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
  const category = await getCategory("historical-sites", { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.historicalSites" });

  return (
      <section className="page-wrapper">
        <HeaderFour />

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.historicalSites"), current: true },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <HistoricalSitesClient category={category} />
        </main>

        <Footer />
      </section>
  );
};

export default HistoricalSitesPage;

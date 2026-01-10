import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import HistoricalSitesClient from "./HistoricalSitesClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const locale = params?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.historicalSites.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const HistoricalSitesPage = async ({ params }) => {
  const locale = params?.locale || defaultLocale;
  const category = await getCategory("historical-sites", { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.historicalSites" });

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
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
    </AOSWrap>
  );
};

export default HistoricalSitesPage;

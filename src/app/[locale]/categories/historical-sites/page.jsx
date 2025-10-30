import Breadcrumbs from "@/components/Breadcrumbs";
import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import HistoricalSitesClient from "./HistoricalSitesClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Historical Sites & Landmarks",
  description: "Documentation, condition assessments, and narratives for historical sites.",
};

const HistoricalSitesPage = async () => {
  const category = await getCategory("historical-sites");
  if (!category) {
    notFound();
  }
  const t = await getTranslations("library.category.breadcrumbs");

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
              { label: t("home"), href: "/" },
              { label: t("library"), href: "/library" },
              { label: t("historicalSites"), current: true },
            ]}
          />
          <HistoricalSitesClient category={category} />
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default HistoricalSitesPage;

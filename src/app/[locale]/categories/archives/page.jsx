import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import ArchivesClient from "./ArchivesClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Archives Collections",
  description: "Explore archival collections curated by the foundation.",
};

const ArchivesPage = async () => {
  const category = await getCategory("archives");
  if (!category) {
    notFound();
  }
  const t = await getTranslations("library.category.breadcrumbs");

  return (
    <AOSWrap>
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("library"), href: "/library" },
              { label: t("archives"), current: true },
            ]}
          />
          <ArchivesClient category={category} />
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default ArchivesPage;

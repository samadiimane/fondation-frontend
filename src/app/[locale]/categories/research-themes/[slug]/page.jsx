import Breadcrumbs from "@/components/Breadcrumbs";
import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import ResearchThemeClient from "./ResearchThemeClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Research Theme",
  description: "Explore documents mapped to this research theme.",
};

const ResearchThemePage = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) {
    notFound();
  }

  const category = await getCategory(slug);
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
              { label: t("researchThemes"), href: "/categories/research-themes" },
              { label: category?.name ?? slug, current: true },
            ]}
          />
          <ResearchThemeClient category={category} slug={slug} />
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default ResearchThemePage;

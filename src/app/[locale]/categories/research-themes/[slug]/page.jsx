import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import ResearchThemeClient from "./ResearchThemeClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const locale = params?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.researchThemes.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ResearchThemePage = async ({ params }) => {
  const locale = params?.locale || defaultLocale;
  const slug = params?.slug;
  if (!slug) {
    notFound();
  }

  const category = await getCategory(slug, { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.researchThemes" });

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
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.themes"), href: "/categories/research-themes" },
              { label: category?.name ?? slug, current: true },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <ResearchThemeClient category={category} slug={slug} />
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default ResearchThemePage;

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import ResearchThemeClient from "./ResearchThemeClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.researchThemes.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ResearchThemePage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const slug = resolvedParams?.slug;
  if (!slug) {
    notFound();
  }

  const category = await getCategory(slug, { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.researchThemes" });

  return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
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
  );
};

export default ResearchThemePage;

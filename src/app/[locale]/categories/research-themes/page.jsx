import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import ResearchThemesClient from "./ResearchThemesClient";
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

const ResearchThemesPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const category = await getCategory("research-themes", { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.researchThemes" });

  return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.themes"), current: true },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <ResearchThemesClient category={category} />
        </main>

        <Footer />
      </section>
  );
};

export default ResearchThemesPage;

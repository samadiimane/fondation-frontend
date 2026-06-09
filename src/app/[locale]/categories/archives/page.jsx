import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import ArchivesClient from "./ArchivesClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.categories.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const ArchivesPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const category = await getCategory("archives", { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.category" });
  const tCategories = await getTranslations({ locale, namespace: "library.categories" });

  return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
        <HeaderFour />

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              {
                label: tCategories("heading") || t("breadcrumbs.archives"),
                current: true
              },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <ArchivesClient category={category} />
        </main>

        <Footer />
      </section>
  );
};

export default ArchivesPage;

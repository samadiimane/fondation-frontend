import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicationsClient from "./PublicationsClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "library.publications.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const PublicationsPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const category = await getCategory("publications", { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.publications" });

  return (
      <section className="page-wrapper">

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.publications"), current: true },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <PublicationsClient category={category} />
        </main>

        <Footer locale={locale} />
      </section>
  );
};

export default PublicationsPage;

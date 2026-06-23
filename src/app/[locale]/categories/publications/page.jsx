import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicationsClient from "./PublicationsClient";
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
  const t = await getTranslations({ locale, namespace: "library.publications" });
  const category = {
    slug: "publications",
    counts: {},
  };
  const breadcrumbsItems = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.library"), href: "/library" },
    { label: t("breadcrumbs.publications"), current: true },
  ];

  return (
      <section className="page-wrapper category-publications-page">
        <main className="category-publications-page__container">
          <Breadcrumbs
            items={breadcrumbsItems}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />

          <div className="section__header">
            <h1 className="title-animation_inner mt-0">
              <span>{t("title")}</span>
            </h1>
          </div>

          <PublicationsClient category={category} showHeader={false} />
        </main>

        <Footer locale={locale} />
      </section>
  );
};

export default PublicationsPage;

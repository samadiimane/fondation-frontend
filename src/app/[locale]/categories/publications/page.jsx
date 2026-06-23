import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import PublicationsClient from "./PublicationsClient";
import {getPublicCategory} from "../_helpers";
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
  const t = await getTranslations({ locale, namespace: "library.publications" });
  const {category, unavailable} = await getPublicCategory("publications", { locale });
  const breadcrumbsItems = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.library"), href: "/library" },
    { label: t("breadcrumbs.publications"), current: true },
  ];

  if (unavailable) {
    return (
      <section className="page-wrapper">
        <main className="category-section">
          <Breadcrumbs
            items={breadcrumbsItems}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <PublicUnavailableNotice locale={locale} />
        </main>

        <Footer locale={locale} />
      </section>
    );
  }

  if (!category) {
    notFound();
  }

  return (
      <section className="page-wrapper">

        <main className="category-section">
          <Breadcrumbs
            items={breadcrumbsItems}
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

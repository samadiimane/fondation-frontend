import {defaultLocale} from "@/i18n/config";
import {
  getStaticCategoryPageCopy,
  StaticCategoryUnavailablePage,
} from "../_staticPages";

/*
Backend-driven implementation preserved for later database restoration.

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import ArchivesClient from "./ArchivesClient";
import {getPublicCategory} from "../_helpers";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

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
  const t = await getTranslations({ locale, namespace: "library.category" });
  const tCategories = await getTranslations({ locale, namespace: "library.categories" });
  const {category, unavailable} = await getPublicCategory("archives", { locale });
  const breadcrumbsItems = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.library"), href: "/library" },
    {
      label: tCategories("heading") || t("breadcrumbs.archives"),
      current: true
    },
  ];

  if (unavailable) {
    return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
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
    <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
      <main className="category-section">
        <Breadcrumbs
          items={breadcrumbsItems}
          ariaLabel={t("a11y.breadcrumbs")}
          locale={locale}
        />
        <ArchivesClient category={category} />
      </main>

      <Footer locale={locale} />
    </section>
  );
};

export default ArchivesPage;
*/

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const copy = getStaticCategoryPageCopy(locale, "archives");

  return {
    title: `${copy.title} | AKT Research Foundation`,
    description: copy.title,
  };
}

const ArchivesPage = async ({params}) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;

  return <StaticCategoryUnavailablePage locale={locale} categoryKey="archives" />;
};

export default ArchivesPage;

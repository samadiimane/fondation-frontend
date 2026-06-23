import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import CollectionClient from "./CollectionClient";
import {getPublicCategory} from "../../_helpers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

export const metadata = {
  title: "Archive Collection",
  description: "Detailed view of an archival collection.",
};

const ArchiveCollectionPage = async ({ params }) => {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const slug = resolvedParams?.slug;
  if (!slug) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "library.category" });
  const {category, unavailable} = await getPublicCategory(slug, { locale });

  if (unavailable) {
    return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.archives"), href: "/categories/archives" },
              { label: slug, current: true },
            ]}
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
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.library"), href: "/library" },
              { label: t("breadcrumbs.archives"), href: "/categories/archives" },
              { label: category?.name ?? t("breadcrumbs.collection"), current: true },
            ]}
            ariaLabel={t("a11y.breadcrumbs")}
            locale={locale}
          />
          <CollectionClient category={category} slug={slug} />
        </main>

        <Footer locale={locale} />
      </section>
  );
};

export default ArchiveCollectionPage;

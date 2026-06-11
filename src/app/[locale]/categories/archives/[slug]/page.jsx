import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import CollectionClient from "./CollectionClient";
import { getCategory } from "@/lib/api";
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

  const category = await getCategory(slug, { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "library.category" });

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

        <Footer />
      </section>
  );
};

export default ArchiveCollectionPage;

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import CollectionClient from "./CollectionClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata = {
  title: "Archive Collection",
  description: "Detailed view of an archival collection.",
};

const ArchiveCollectionPage = async ({ params }) => {
  const locale = await getLocale();
  const slug = params?.slug;
  if (!slug) {
    notFound();
  }

  const category = await getCategory(slug, { locale });
  if (!category) {
    notFound();
  }
  const t = await getTranslations("library.category.breadcrumbs");

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
              { label: t("home"), href: "/" },
              { label: t("library"), href: "/library" },
              { label: t("archives"), href: "/categories/archives" },
              { label: category?.name ?? slug, current: true },
            ]}
            locale={locale}
          />
          <CollectionClient category={category} slug={slug} />
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default ArchiveCollectionPage;

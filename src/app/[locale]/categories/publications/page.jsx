import Breadcrumbs from "@/components/Breadcrumbs";
import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import PublicationsClient from "./PublicationsClient";
import { getCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Publications",
  description: "Foundation publications, translations, and research outputs.",
};

const PublicationsPage = async () => {
  const category = await getCategory("publications");
  if (!category) {
    notFound();
  }
  const t = await getTranslations("library.category.breadcrumbs");

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="category-section">
          <Breadcrumbs
            items={[
              { label: t("home"), href: "/" },
              { label: t("library"), href: "/library" },
              { label: t("publications"), current: true },
            ]}
          />
          <PublicationsClient category={category} />
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default PublicationsPage;

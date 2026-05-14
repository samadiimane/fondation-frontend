import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/helper/CustomCursor";
import AOSWrap from "@/helper/AOSWrap";
import AssistantClient from "@/components/assistant/AssistantClient";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

type LocaleParams = Promise<{ locale?: string }>;

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = (await params)?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "assistant" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const AdvancedSearchPage = () => (
  <AOSWrap>
    <section className="page-wrapper">
      <Preloader />
      <CustomCursor />
      <TopBarTwo />
      <HeaderFour />
      <AssistantClient />
      <Footer />
    </section>
  </AOSWrap>
);

export default AdvancedSearchPage;

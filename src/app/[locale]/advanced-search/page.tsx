import Footer from "@/components/Footer";
import AssistantClient from "@/components/assistant/AssistantClient";
import { getTranslations } from "next-intl/server";
import { defaultLocale, normalizeLocale } from "@/i18n/config";

type LocaleParams = Promise<{ locale?: string }>;

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = (await params)?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "assistant" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const AdvancedSearchPage = async ({ params }: { params: LocaleParams }) => {
  const locale = normalizeLocale((await params)?.locale || defaultLocale);

  return (
    <section className="page-wrapper">
      <AssistantClient />
      <Footer locale={locale} />
    </section>
  );
};

export default AdvancedSearchPage;

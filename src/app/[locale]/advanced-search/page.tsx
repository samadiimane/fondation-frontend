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

const AdvancedSearchPage = async ({ params }: { params: LocaleParams }) => {
  await params;

  return (
    <section className="page-wrapper assistant-page-wrapper">
      <AssistantClient />
    </section>
  );
};

export default AdvancedSearchPage;

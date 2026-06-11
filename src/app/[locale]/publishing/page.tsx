import Footer from "@/components/Footer";
import PublishingClient from "@/components/publishing/PublishingClient";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";

type LocaleParams = Promise<{ locale?: string }>;

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = (await params)?.locale || defaultLocale;
  const t = await getTranslations({ locale, namespace: "publishing" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const PublishingPage = () => (
    <section className="page-wrapper">
      <PublishingClient />
      <Footer />
    </section>
);

export default PublishingPage;

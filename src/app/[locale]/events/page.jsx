import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventsHub from "@/components/events/EventsHub";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

const EventsPage = async ({ params }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.events"), current: true },
  ];

  return (
      <section className='page-wrapper'>

        <section className='support-detail pt-120 pb-0'>
          <div className='container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("tabs.ariaLabel")} />
          </div>
        </section>

        <EventsHub />

        <Footer locale={locale} />
      </section>
  );
};

export default EventsPage;

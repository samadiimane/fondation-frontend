import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventDetailView from "@/components/events/EventDetailView";
import { getEvent } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const [t, event] = await Promise.all([
    getTranslations({ locale, namespace: "events" }),
    getEvent(slug).catch(() => null),
  ]);

  if (!event) {
    return {
      title: t("title"),
      description: t("detailsSoon"),
    };
  }

  return {
    title: `${event.title} · ${t("title")}`,
    description: event.summary || t("detailsSoon"),
  };
}

const EventDetailPage = async ({ params }) => {
  const { locale, slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "events" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.events"), href: "/events" },
    { label: event.title ?? "Event", current: true },
  ];

  return (
      <section className='page-wrapper'>

        <section className='support-detail pt-120 pb-0'>
          <div className='container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("tabs.ariaLabel")} />
          </div>
        </section>

        <EventDetailView event={event} />

        <Footer locale={locale} />
      </section>
  );
};

export default EventDetailPage;

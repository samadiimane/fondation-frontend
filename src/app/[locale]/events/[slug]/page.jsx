import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventDetailView from "@/components/events/EventDetailView";
import { getEvent } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
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
  const { locale, slug } = params;
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
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <section className='support-detail pt-120 pb-0'>
          <div className='container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("tabs.ariaLabel")} />
          </div>
        </section>

        <EventDetailView event={event} />

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default EventDetailPage;

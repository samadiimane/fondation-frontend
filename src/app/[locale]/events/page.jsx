import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventsHub from "@/components/events/EventsHub";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "events" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

const EventsPage = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "events" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.events"), current: true },
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

        <EventsHub />

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default EventsPage;

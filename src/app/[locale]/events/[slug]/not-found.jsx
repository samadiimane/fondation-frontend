import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const EventNotFound = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "events" });

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />
        <section className='support-detail pt-120 pb-120'>
          <div className='container text-center'>
            <h1 className='title-animation_inner'>{t("title")}</h1>
            <p>{t("empty")}</p>
            <Link href='/events' className='btn--primary mt-4'>
              {t("backToList")}
            </Link>
          </div>
        </section>
        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default EventNotFound;

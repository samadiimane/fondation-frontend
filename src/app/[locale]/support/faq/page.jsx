import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqOne from "@/components/FaqOne";
import { getFaqContent } from "@/content/support";
import { locales } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });
  return {
    title: `${t("title")} · ${t("faq")}`,
    description: t("empty"),
  };
}

const FaqPage = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });
  const faqContent = getFaqContent(locale);

  const title = faqContent?.heading ?? t("faq");
  const items = Array.isArray(faqContent?.items) ? faqContent.items : [];
  const description = faqContent?.intro ?? t("faqIntro") ?? "";

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("title"), href: "/support/faq" },
    { label: t("faq"), current: true },
  ];

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <section className='support-detail pt-120 pb-60'>
          <div className='container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />
            <header className='support-detail__header'>
              <h1>{title}</h1>
              {description ? <p>{description}</p> : null}
            </header>
          </div>
        </section>

        <FaqOne
          subTitle={t("faq")}
          titlePrimary={title}
          titleHighlight=''
          titleSuffix=''
          description=''
          items={items.map(({ question, answer }) => ({ question, answer }))}
          emptyMessage={t("empty")}
        />

        <Footer />
      </section>
    </AOSWrap>
  );
};

export default FaqPage;

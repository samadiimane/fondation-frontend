import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactUsInner from "@/components/ContactUsInner";
import { getContactContent } from "@/content/support";
import { locales } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });
  return {
    title: `${t("title")} · ${t("contact")}`,
    description: t("contactTagline") ?? t("empty"),
  };
}

const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[\n,;]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const ContactPage = async ({ params }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "support" });

  const contact = getContactContent(locale);
  const title = contact?.heading ?? t("contact");
  const address = contact?.address ?? "";
  const phoneNumbers = normalizeToArray(contact?.phone);
  const emailAddresses = normalizeToArray(contact?.email ?? "support@aktfoundation.org");
  const note = contact?.note ?? "";

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("title"), href: "/support/faq" },
    { label: t("contact"), current: true },
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
              <p>{t("contactTagline") ?? ""}</p>
            </header>
          </div>
        </section>

        <ContactUsInner
          subTitle={t("contact")}
          title={title}
          description={note || t("contactTagline") || ""}
          address={address}
          phoneNumbers={phoneNumbers}
          emailAddresses={emailAddresses}
          emptyMessage={t("empty")}
        />

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default ContactPage;


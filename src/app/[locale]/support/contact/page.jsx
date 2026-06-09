import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import ContactUsInner from "@/components/ContactUsInner";
import { getContactContent } from "@/content/support";
import { isRtlLocale, locales, normalizeLocale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const t = await getTranslations({ locale: normalizedLocale, namespace: "support" });
  return {
    title: `${t("title")} - ${t("contact")}`,
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
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const isRtl = isRtlLocale(normalizedLocale);
  const t = await getTranslations({ locale: normalizedLocale, namespace: "support" });

  const contact = getContactContent(normalizedLocale);
  const title = contact?.heading ?? t("contact");
  const address = contact?.address ?? "";
  const mapLink = contact?.mapLink ?? "";
  const phoneNumbers = normalizeToArray(contact?.phone);
  const emailAddresses = normalizeToArray(contact?.email ?? "support@aktfoundation.org");
  const officeHours = normalizeToArray(contact?.hours);
  const focusAreas = normalizeToArray(contact?.focus);
  const responseTime = contact?.responseTime ?? "";
  const note = contact?.note ?? "";
  const description = note || t("contactTagline") || "";
  const titleSplitIndex = title.indexOf(" ");
  const titleLead = titleSplitIndex > 0 ? title.slice(0, titleSplitIndex) : title;
  const titleRest = titleSplitIndex > 0 ? title.slice(titleSplitIndex + 1) : "";

  return (
      <section className='page-wrapper'>
        <HeaderFour />

        <main className='support-page' dir={isRtl ? "rtl" : "ltr"} lang={normalizedLocale}>
          <section className='support-detail'>
            <div className='container'>
              <div className='support-detail__inner support-detail__inner--contact'>
                <header className='support-detail__header support-detail__header--publishing'>
                  <h3 className='title-animation_inner'>
                    <span>{titleLead}</span>
                    {titleRest ? ` ${titleRest}` : ""}
                  </h3>
                  <p>{t("contactTagline")}</p>
                </header>

                <ContactUsInner
                  title={title}
                  description={description}
                  address={address}
                  mapLink={mapLink}
                  phoneNumbers={phoneNumbers}
                  emailAddresses={emailAddresses}
                  officeHours={officeHours}
                  focusAreas={focusAreas}
                  responseTime={responseTime}
                  labels={{
                    address: t("contactFields.address"),
                    phone: t("contactFields.phone"),
                    email: t("contactFields.email"),
                    focus: t("contactFields.focus"),
                    hours: t("contactFields.hours"),
                    responseTime: t("contactFields.responseTime"),
                  }}
                  asideTitle={t("contactAside.title")}
                  ctaLabel={t("contactAside.cta")}
                  emptyMessage={t("empty")}
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </section>
  );
};

export default ContactPage;

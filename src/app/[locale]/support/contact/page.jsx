import Footer from "@/components/Footer";
import ContactUsInner from "@/components/ContactUsInner";
import Breadcrumbs from "@/components/Breadcrumbs";
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

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
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
  const emailAddresses = normalizeToArray(contact?.email ?? "aktfoundation.ma@gmail.com");
  const officeHours = normalizeToArray(contact?.hours);
  const focusAreas = normalizeToArray(contact?.focus);
  const responseTime = contact?.responseTime ?? "";
  const note = contact?.note ?? "";
  const description = note || t("contactTagline") || "";
  const titleParts = splitTitle(title);
  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: title, current: true }
  ];

  return (
      <section className='page-wrapper'>

        <main className='support-page support-page--contact' dir={isRtl ? "rtl" : "ltr"} lang={normalizedLocale}>
          <section className='support-detail support-detail--contact'>
            <div className='container'>
              <div className='support-detail__inner support-detail__inner--contact'>
                <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />

                <header className='support-detail__header support-detail__header--publishing'>
                  <h1 className='title-animation_inner'>
                    <span>{titleParts.lead || title}</span>
                    {titleParts.rest ? ` ${titleParts.rest}` : ""}
                  </h1>
                  <p>{t("contactTagline")}</p>
                </header>

                <ContactUsInner
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
                  ctaLabel={t("contactAside.cta")}
                  emptyMessage={t("empty")}
                />
              </div>
            </div>
          </section>
        </main>

        <Footer locale={locale} />
      </section>
  );
};

export default ContactPage;

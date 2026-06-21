import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServiceContent, SERVICE_SLUGS } from "@/content/services";
import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return SERVICE_SLUGS.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const service = getServiceContent(locale, slug);

  const title = service?.title ?? t("title");
  const description = service?.intro ?? t("fallback");

  return {
    title,
    description,
  };
}

const splitTitle = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");
  return {
    lead: splitIndex > 0 ? title.slice(0, splitIndex) : title,
    rest: splitIndex > 0 ? title.slice(splitIndex + 1) : "",
  };
};

const ServiceDetailPage = async ({ params }) => {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  const service = getServiceContent(locale, slug);
  if (!service) {
    notFound();
  }
  const title = service?.title ?? t("title");
  const intro = service?.intro;
  const heroImage = service?.heroImage;
  const bodySections = Array.isArray(service?.bodySections) ? service.bodySections : [];
  const hasBody = bodySections.length > 0;
  const isRtl = locale === "ar";
  const titleParts = splitTitle(title);

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: title, current: true }
  ];

  const fallbackMessage = t("fallback");

  return (
      <section className='page-wrapper'>

        <section
          className='service-detail pt-3'
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className='service-detail__container'>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />
            <div className='section__header'>
              <h1 className='title-animation_inner mt-0'>
                <span>{titleParts.lead || title}</span>
                {titleParts.rest ? ` ${titleParts.rest}` : ""}
              </h1>
            </div>
            <div className='article-detail service-detail__inner'>
              <header className='service-detail__header article-detail__block'>
                <p>{intro ?? fallbackMessage}</p>
              </header>

              {heroImage ? (
                <figure className='article-detail__cover service-detail__cover'>
                  <div className='service-detail__cover-media'>
                    <Image
                      src={heroImage.src}
                      alt={heroImage.alt ?? t("heroAlt")}
                      fill
                      sizes='min(1120px, 92vw)'
                      className='service-detail__cover-image'
                    />
                  </div>
                  {heroImage.caption ? <figcaption>{heroImage.caption}</figcaption> : null}
                </figure>
              ) : null}

              <article className='article-detail__card article-detail__card--primary service-detail__card mb-3'>
                {hasBody ? (
                  bodySections.map((section) => (
                    <div key={section.title} className='article-detail__block'>
                      <h2>{section.title}</h2>
                      {Array.isArray(section.paragraphs) && section.paragraphs.length > 0 ? (
                        section.paragraphs.map((paragraph, index) => (
                          <p key={`${section.title}-${index}`}>{paragraph}</p>
                        ))
                      ) : (
                        <p>{fallbackMessage}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>{fallbackMessage}</p>
                )}
              </article>
              <nav className='service-detail__actions' aria-label={t("returnHome")}>
                <Link href='/' className='service-detail__return-link'>
                  {t("returnHome")}
                </Link>
              </nav>
            </div>
          </div>
        </section>

        <Footer locale={locale} />
      </section>
  );
};

export default ServiceDetailPage;

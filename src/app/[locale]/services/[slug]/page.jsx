import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServiceContent, SERVICE_SLUGS } from "@/content/services";
import { locales } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

const FALLBACK_IMAGE_ALT = "Service illustration";

export function generateStaticParams() {
  return SERVICE_SLUGS.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "services" });
  const service = getServiceContent(locale, slug);

  const title = service?.title ?? t("title");
  const description = service?.intro ?? t("fallback");

  return {
    title,
    description,
  };
}

const ServiceDetailPage = async ({ params }) => {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "services" });

  const service = getServiceContent(locale, slug);
  const title = service?.title ?? t("title");
  const intro = service?.intro;
  const heroImage = service?.heroImage;
  const bodySections = Array.isArray(service?.bodySections) ? service.bodySections : [];
  const hasBody = bodySections.length > 0;

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.services") },
    { label: title, current: true },
  ];

  const fallbackMessage = t("fallback");

  return (
    <AOSWrap>
      <section className='page-wrapper'>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <section className='service-detail pt-3' style={{ backgroundColor: "#f7f8fc" }}>
          <div className='container' style={{ maxWidth: "80%" }}>
            <Breadcrumbs items={breadcrumbs} ariaLabel={t("breadcrumbs.ariaLabel")} />
            <div
              className='section__header'
              data-aos='fade-up'
              data-aos-duration={900}
            >
              <h2 className="title-animation_inner mt-0"> {title} </h2>
            </div>
            <div className='article-detail service-detail__inner'>
              <header className='service-detail__header article-detail__block'>
                <p>{intro ?? fallbackMessage}</p>
              </header>

              {heroImage ? (
                <figure className='article-detail__cover service-detail__cover'>
                  <img src={heroImage.src} alt={heroImage.alt ?? FALLBACK_IMAGE_ALT} />
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
            </div>
          </div>
        </section>

        <FooterOne />
      </section>
    </AOSWrap>
  );
};

export default ServiceDetailPage;


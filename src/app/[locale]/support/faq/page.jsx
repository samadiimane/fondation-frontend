import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import TopBarTwo from "@/components/TopBarTwo";
import { getFaqContent } from "@/content/support";
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
    title: `${t("title")} - ${t("faq")}`,
    description: t("faqIntro") ?? t("empty"),
  };
}

const createFaqGroups = (items, defaultCategoryTitle) => {
  const safeItems = Array.isArray(items) ? items : [];
  const map = new Map();

  safeItems.forEach((item) => {
    if (!item || (!item.question && !item.answer)) return;
    const category = typeof item.category === "string" ? item.category.trim() : "";
    const key = category || "default";
    const current = map.get(key);

    if (current) {
      current.items.push(item);
      return;
    }

    map.set(key, {
      key,
      title: category || defaultCategoryTitle,
      items: [item],
    });
  });

  return Array.from(map.values());
};

const splitHeading = (value) => {
  const title = typeof value === "string" ? value.trim() : "";
  const splitIndex = title.indexOf(" ");

  if (splitIndex <= 0) {
    return {
      lead: title,
      rest: "",
    };
  }

  return {
    lead: title.slice(0, splitIndex),
    rest: title.slice(splitIndex + 1),
  };
};

const FaqPage = async ({ params }) => {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const isRtl = isRtlLocale(normalizedLocale);
  const t = await getTranslations({ locale: normalizedLocale, namespace: "support" });
  const faqContent = getFaqContent(normalizedLocale);

  const title = faqContent?.heading ?? t("faq");
  const description = faqContent?.intro ?? t("faqIntro") ?? "";
  const groups = createFaqGroups(faqContent?.items, t("faq"));
  const heading = splitHeading(title);

  return (
      <section className='page-wrapper'>
        <TopBarTwo />
        <HeaderFour />

        <main className='support-page' dir={isRtl ? "rtl" : "ltr"} lang={normalizedLocale}>
          <section className='support-detail'>
            <div className='container'>
              <div className='support-detail__inner support-detail__inner--faq'>
                <header className='support-detail__header support-detail__header--publishing'>
                  <h3 className='title-animation_inner'>
                    <span>{heading.lead || title}</span>
                    {heading.rest ? ` ${heading.rest}` : ""}
                  </h3>
                  {description ? <p>{description}</p> : null}
                </header>

                <article className='article-detail__card article-detail__card--primary support-detail__card support-faq'>
                  {groups.length ? (
                    <div className='support-faq__groups'>
                      {groups.map((group, groupIndex) => (
                        <section key={`${group.key}-${groupIndex}`} className='support-faq__group'>
                          {group.title ? (
                            <h2 className='support-faq__group-title' dir='auto'>
                              {group.title}
                            </h2>
                          ) : null}
                          <ul className='support-faq__list'>
                            {group.items.map((item, itemIndex) => (
                              <li key={`${group.key}-${itemIndex}`} className='support-faq__item'>
                                {item.question ? <h3 dir='auto'>{item.question}</h3> : null}
                                <p dir='auto'>{item.answer || t("empty")}</p>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className='support-faq__empty'>{t("empty")}</p>
                  )}
                </article>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </section>
  );
};

export default FaqPage;

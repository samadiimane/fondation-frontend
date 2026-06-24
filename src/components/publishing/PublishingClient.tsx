"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRtlLocale } from "@/i18n/config";
import Section from "./Section";
import Timeline from "./Timeline";

type TocItem = {
  id: string;
  label: string;
};

const BREADCRUMB_LABELS = {
  ar: {
    home: "الرئيسية",
    ariaLabel: "مسار التنقل"
  },
  en: {
    home: "Home",
    ariaLabel: "Breadcrumb"
  },
  fr: {
    home: "Accueil",
    ariaLabel: "Fil d'Ariane"
  },
  es: {
    home: "Inicio",
    ariaLabel: "Ruta de navegación"
  }
} as const;

const safeArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const PublishingClient = () => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("publishing");
  const tTopbar = useTranslations("topbar");
  const [activeId, setActiveId] = useState<string>("overview");
  const breadcrumbLabels = BREADCRUMB_LABELS[locale as keyof typeof BREADCRUMB_LABELS] ?? BREADCRUMB_LABELS.en;

  const headerTitle = t("header.title");
  const titleSplitIndex = headerTitle.indexOf(" ");
  const titleLead = titleSplitIndex > 0 ? headerTitle.slice(0, titleSplitIndex) : headerTitle;
  const titleRest = titleSplitIndex > 0 ? headerTitle.slice(titleSplitIndex + 1) : "";

  const eligibilityItems = safeArray<string>(t.raw("sections.eligibility.items"));
  const guidelinesItems = safeArray<string>(t.raw("sections.guidelines.items"));
  const policiesItems = safeArray<string>(t.raw("sections.policies.items"));
  const timelineSteps = safeArray<{ label: string; duration: string }>(t.raw("sections.timeline.steps"));
  const faqItems = safeArray<{ q: string; a: string }>(t.raw("sections.faq.items"));

  const tocItems: TocItem[] = useMemo(
    () => [
      { id: "overview", label: t("sections.overview.title") },
      { id: "eligibility", label: t("sections.eligibility.title") },
      { id: "guidelines", label: t("sections.guidelines.title") },
      { id: "policies", label: t("sections.policies.title") },
      { id: "start", label: t("sections.submission.title") },
      { id: "timeline", label: t("sections.timeline.title") },
      { id: "faq", label: t("sections.faq.title") },
    ],
    [t],
  );

  const getScrollOffset = useCallback(() => {
    const topbar = document.querySelector(".topbar");
    const header = document.querySelector(".header");
    const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 0;
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    return topbarHeight + headerHeight + 16;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = getScrollOffset();
      const scrollPosition = window.scrollY + offset + 1;
      let nextId = tocItems[0]?.id;

      tocItems.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPosition) {
          nextId = item.id;
        }
      });

      if (nextId) {
        setActiveId((prev) => (prev === nextId ? prev : nextId));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [getScrollOffset, tocItems]);

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = getScrollOffset();
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <main className="publishing-page" dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className="publishing-page__container">
        <Breadcrumbs
          items={[
            { label: breadcrumbLabels.home, href: "/" },
            { label: headerTitle, current: true }
          ]}
          ariaLabel={breadcrumbLabels.ariaLabel}
          locale={locale}
        />

        <header className="publishing-hero">
          <h1 className="publishing-hero__title title-animation_inner">
            <span>{titleLead}</span>
            {titleRest ? ` ${titleRest}` : ""}
          </h1>
          <p className="publishing-hero__subtitle">{t("header.subtitle")}</p>
        </header>

        <div className="publishing-toc-mobile">
          <Select value={activeId} onValueChange={handleScrollTo}>
            <SelectTrigger aria-label={t("toc.title")}>
              <SelectValue placeholder={t("toc.title")} />
            </SelectTrigger>
            <SelectContent>
              {tocItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="publishing-layout">
          <aside className="publishing-toc" aria-label={t("toc.title")}>
            <h5 className="publishing-toc__title">{t("toc.title")}</h5>
            <ol className="publishing-toc__list">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`publishing-toc__link publishing-focus ${activeId === item.id ? "is-active" : ""}`}
                    aria-current={activeId === item.id ? "true" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleScrollTo(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div>
            <Section id="overview" title={t("sections.overview.title")}>
              <p className="publishing-section__body">{t("sections.overview.body")}</p>
            </Section>

            <Section id="eligibility" title={t("sections.eligibility.title")}>
              <ul className="publishing-list">
                {eligibilityItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section id="guidelines" title={t("sections.guidelines.title")}>
              <ul className="publishing-list">
                {guidelinesItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section id="policies" title={t("sections.policies.title")}>
              <ul className="publishing-list">
                {policiesItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Section id="start" title={t("sections.submission.title")}>
              <div className="publishing-cta">
                <Button asChild>
                  <Link href="/join-us">{t("sections.submission.cta")}</Link>
                </Button>
              </div>
            </Section>

            <Section id="timeline" title={t("sections.timeline.title")}>
              <Timeline steps={timelineSteps} />
            </Section>

            <Section id="faq" title={t("sections.faq.title")}>
              <div className="publishing-faq">
                {faqItems.map((item) => (
                  <div key={item.q} className="publishing-faq__item">
                    <h6 className="publishing-faq__question">{item.q}</h6>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="publishing-contact">
                <h6>{t("contact.title")}</h6>
                <p>
                  {t("contact.emailLabel")}:{" "}
                  <a className="publishing-contact__link" href={`mailto:${tTopbar("email")}`}>
                    {tTopbar("email")}
                  </a>
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublishingClient;

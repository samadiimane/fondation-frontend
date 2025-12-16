import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import JournalsExplorer from "@/components/journals/JournalsExplorer";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import {getLocale, getTranslations} from "next-intl/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: "library.journals.meta"});
  return {
    title: t("title"),
    description: t("description"),
  };
}

const buildStrings = (t) => ({
  title: t("title"),
  subtitle: t("subtitle"),
  a11y: {
    breadcrumbs: t("a11y.breadcrumbs"),
  },
  breadcrumbs: {
    home: {
      label: t("breadcrumbs.home.label"),
      href: t("breadcrumbs.home.href"),
    },
    journals: {
      label: t("breadcrumbs.journals.label"),
      href: t("breadcrumbs.journals.href"),
    },
  },
  toolbar: {
    searchLabel: t("toolbar.searchLabel"),
    searchPlaceholder: t("toolbar.searchPlaceholder"),
    issnLabel: t("toolbar.issnLabel"),
    issnPlaceholder: t("toolbar.issnPlaceholder"),
    sortLabel: t("toolbar.sortLabel"),
    sortOptions: {
      nameAsc: t("toolbar.sortOptions.nameAsc"),
      nameDesc: t("toolbar.sortOptions.nameDesc"),
      createdDesc: t("toolbar.sortOptions.createdDesc"),
    },
    summaryTemplate: t("toolbar.summary", {count: "{count}"}),
    loading: t("toolbar.loading"),
    announceTemplate: t("toolbar.announce", {count: "{count}"}),
  },
  cards: {
    loading: t("cards.loading"),
    emptyTitle: t("cards.emptyTitle"),
    emptyDescription: t("cards.emptyDescription"),
    badges: {
      issn: t("cards.badges.issn"),
      fallback: t("cards.badges.fallback"),
    },
    publisherLabel: t("cards.publisherLabel"),
    publisherUnknown: t("cards.publisherUnknown"),
    descriptionFallback: t("cards.descriptionFallback"),
    metaLineTemplate: t("cards.metaLine", {issues: "{issues}", documents: "{documents}"}),
    cta: t("cards.cta"),
  },
  error: {
    message: t("error.message"),
  },
  pagination: {
    ariaLabel: t("pagination.ariaLabel"),
    previous: t("pagination.previous"),
    next: t("pagination.next"),
    pageTemplate: t("pagination.pageIndicator", {page: "{page}"}),
  },
});

export default async function JournalsPage() {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: "library.journals"});
  const strings = buildStrings(t);

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="library-journals">
          <JournalsExplorer locale={locale} strings={strings} />
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
}

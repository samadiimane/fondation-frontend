import Footer from "@/components/Footer";
import JournalsExplorer from "@/components/journals/JournalsExplorer";
import {getTranslations} from "next-intl/server";
import {defaultLocale} from "@/i18n/config";

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({locale, namespace: "library.journals.meta"});
  return {
    title: t("title"),
    description: t("description"),
  };
}

const buildStrings = (t, tPagination) => ({
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
      current: true,
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
    previous: tPagination("previous"),
    next: tPagination("next"),
    pageTemplate: tPagination("page", {page: "{page}"}),
  },
});

export default async function JournalsPage({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const t = await getTranslations({locale, namespace: "library.journals"});
  const tPagination = await getTranslations({locale, namespace: "shared.pagination"});
  const strings = buildStrings(t, tPagination);

  return (
      <section className="page-wrapper">

        <main className="library-journals">
          <JournalsExplorer key={locale} locale={locale} strings={strings} />
        </main>

        <Footer />
      </section>
  );
}

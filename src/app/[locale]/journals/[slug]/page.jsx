import Footer from "@/components/Footer";
import JournalHeader from "@/components/journals/JournalHeader";
import JournalIssuesExplorer from "@/components/journals/JournalIssuesExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PublicUnavailableNotice from "@/components/PublicUnavailableNotice";
import {isPublicJournalSlug} from "@/content/journalSlugs";
import {getJournal} from "@/lib/api";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {defaultLocale, isRtlLocale} from "@/i18n/config";

export const dynamic = "force-dynamic";

const buildHeaderStrings = (t) => ({
  eyebrow: t("header.eyebrow"),
  meta: {
    issn: t("header.meta.issn"),
    publisher: t("header.meta.publisher"),
    language: t("header.meta.language"),
    country: t("header.meta.country"),
  },
});

const isJournalNotFoundError = (error) => {
  const message = String(error?.message || "");
  return Number(error?.status) === 404 || /\b404\b|not found/i.test(message);
};

const buildIssuesStrings = (t, tPagination) => ({
  title: t("issues.title"),
  summaryTemplate: t("issues.summary", {count: "{count}"}),
  loading: t("issues.loading"),
  invalidFilters: t("issues.invalidFilters"),
  unavailable: {
    title: t("issues.unavailable.title"),
    message: t("issues.unavailable.message"),
  },
  sort: {
    label: t("issues.sort.label"),
    options: {
      yearDesc: t("issues.sort.options.yearDesc"),
      yearAsc: t("issues.sort.options.yearAsc"),
    },
  },
  filters: {
    ariaLabel: t("issues.filters.ariaLabel"),
    title: t("issues.filters.title"),
    yearMin: t("issues.filters.yearMin"),
    yearMax: t("issues.filters.yearMax"),
    number: t("issues.filters.number"),
    reset: t("issues.filters.reset"),
  },
  empty: {
    title: t("issues.empty.title"),
    description: t("issues.empty.description"),
  },
  table: {
    year: t("issues.table.year"),
    title: t("issues.table.title"),
    documents: t("issues.table.documents"),
    actions: t("issues.table.actions"),
    browseIssue: t("issues.table.browseIssue"),
    valueUnknown: t("issues.table.valueUnknown"),
    untitled: t("issues.table.untitled"),
  },
  pagination: {
    ariaLabel: t("issues.pagination.ariaLabel"),
    previous: tPagination("previous"),
    next: tPagination("next"),
    pageTemplate: tPagination("page", {page: "{page}"}),
  },
  a11y: {
    resultsTemplate: t("issues.a11y.results", {count: "{count}"}),
  },
});

const buildBreadcrumbs = (t, journalName) => [
  {label: t("breadcrumbs.home.label"), href: t("breadcrumbs.home.href")},
  {label: t("breadcrumbs.journals.label"), href: t("breadcrumbs.journals.href")},
  {label: journalName, current: true},
];

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const slug = resolvedParams?.slug;
  if (!isPublicJournalSlug(slug)) {
    return {};
  }

  const metaT = await getTranslations({locale, namespace: "library.journalDetail.meta"});

  try {
    const journal = await getJournal(slug, { locale });
    return {
      title: metaT("title", {name: journal.name}),
      description:
        journal.description?.trim() || metaT("descriptionFallback", {name: journal.name}),
    };
  } catch {
    return {
      title: metaT("title", {name: slug}),
      description: metaT("descriptionFallback", {name: slug}),
    };
  }
}

export default async function JournalDetailPage({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const slug = resolvedParams?.slug;

  if (!isPublicJournalSlug(slug)) {
    notFound();
  }

  let journal;
  try {
    journal = await getJournal(slug, { locale });
  } catch (error) {
    if (isJournalNotFoundError(error)) {
      notFound();
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Journal "${slug}" is temporarily unavailable.`, error);
    }
    return (
      <section className="page-wrapper journal-page-shell">
        <main className="journal-page-content journal-detail-page" lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
          <PublicUnavailableNotice locale={locale} />
        </main>
        <Footer locale={locale} />
      </section>
    );
  }

  if (!journal) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "library.journalDetail"});
  const tPagination = await getTranslations({locale, namespace: "shared.pagination"});
  const headerStrings = buildHeaderStrings(t);
  const issuesStrings = buildIssuesStrings(t, tPagination);
  const breadcrumbsItems = buildBreadcrumbs(t, journal.name);
  const isRtl = isRtlLocale(locale);

  return (
      <section className="page-wrapper journal-page-shell">

        <main className="journal-page-content journal-detail-page" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
          <Breadcrumbs items={breadcrumbsItems} ariaLabel={t("a11y.breadcrumbs")} locale={locale} />

          <JournalHeader
            journal={journal}
            strings={headerStrings}
            locale={locale}
          />

          <JournalIssuesExplorer slug={slug} locale={locale} strings={issuesStrings} />
        </main>

        <Footer locale={locale} />
      </section>
  );
}

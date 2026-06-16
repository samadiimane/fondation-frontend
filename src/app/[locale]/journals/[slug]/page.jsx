import Footer from "@/components/Footer";
import JournalHeader from "@/components/journals/JournalHeader";
import JournalIssuesExplorer from "@/components/journals/JournalIssuesExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {getJournal} from "@/lib/api";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {defaultLocale, isRtlLocale} from "@/i18n/config";

const extractCoverage = (journal, t) => {
  const rawCoverage = journal?.raw?.coverage ?? journal?.raw?.years ?? {};
  const start =
    rawCoverage.start_year ??
    rawCoverage.start ??
    rawCoverage.year_min ??
    rawCoverage.min_year ??
    rawCoverage.min;
  const end =
    rawCoverage.end_year ??
    rawCoverage.end ??
    rawCoverage.year_max ??
    rawCoverage.max_year ??
    rawCoverage.max;

  if (start && end) {
    return `${start} - ${end}`;
  }
  if (start) {
    return `${t("header.stats.coverageSingle")} ${start}`;
  }
  if (end) {
    return `${t("header.stats.coverageSingle")} ${end}`;
  }
  return null;
};

const buildHeaderStrings = (t) => ({
  eyebrow: t("header.eyebrow"),
  descriptionFallback: t("header.descriptionFallback"),
  descriptionToggle: {
    more: t("header.descriptionToggle.more"),
    less: t("header.descriptionToggle.less"),
  },
  meta: {
    issn: t("header.meta.issn"),
    issnUnknown: t("header.meta.issnUnknown"),
    publisher: t("header.meta.publisher"),
    publisherUnknown: t("header.meta.publisherUnknown"),
    language: t("header.meta.language"),
    country: t("header.meta.country"),
  },
  stats: {
    issues: t("header.stats.issues"),
    documents: t("header.stats.documents"),
    coverage: t("header.stats.coverage"),
    coverageUnknown: t("header.stats.coverageUnknown"),
    coverageSingle: t("header.stats.coverageSingle"),
    holdings: t("header.stats.holdings"),
  },
  statsCardLabel: t("header.statsCardLabel"),
});

const buildIssuesStrings = (t, tPagination) => ({
  title: t("issues.title"),
  subtitle: t("issues.subtitle"),
  summaryTemplate: t("issues.summary", {count: "{count}"}),
  loading: t("issues.loading"),
  error: t("issues.error"),
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
    volume: t("issues.filters.volume"),
    number: t("issues.filters.number"),
    reset: t("issues.filters.reset"),
  },
  empty: {
    title: t("issues.empty.title"),
    description: t("issues.empty.description"),
  },
  table: {
    year: t("issues.table.year"),
    volume: t("issues.table.volume"),
    number: t("issues.table.number"),
    title: t("issues.table.title"),
    date: t("issues.table.date"),
    dateUnknown: t("issues.table.dateUnknown"),
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

const buildNavStrings = (t) => ({
  ariaLabel: t("nav.ariaLabel"),
  overview: t("nav.overview"),
  issues: t("nav.issues"),
});

export async function generateMetadata({params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  const slug = resolvedParams?.slug;
  if (!slug) {
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

  if (!slug) {
    notFound();
  }

  let journal;
  try {
    journal = await getJournal(slug, { locale });
  } catch (error) {
    if (error?.message?.includes("404")) {
      notFound();
    }
    throw error;
  }

  if (!journal) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "library.journalDetail"});
  const tPagination = await getTranslations({locale, namespace: "shared.pagination"});
  const headerStrings = buildHeaderStrings(t);
  const issuesStrings = buildIssuesStrings(t, tPagination);
  const navStrings = buildNavStrings(t);
  const breadcrumbsItems = buildBreadcrumbs(t, journal.name);
  const isRtl = isRtlLocale(locale);

  const coverage = extractCoverage(journal, t);
  const holdings =
    journal.raw?.holdings_note ?? journal.raw?.holding_note ?? journal.raw?.holdings ?? null;

  return (
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>

        <main className="journal-detail-page" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
          <Breadcrumbs items={breadcrumbsItems} ariaLabel={t("a11y.breadcrumbs")} locale={locale} />

          <JournalHeader
            journal={journal}
            strings={headerStrings}
            stats={{
              coverage,
              holdings,
            }}
            locale={locale}
          />

          <JournalIssuesExplorer slug={slug} locale={locale} strings={issuesStrings} />
        </main>

        <Footer locale={locale} />
      </section>
  );
}

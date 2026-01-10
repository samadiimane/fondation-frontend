import Footer from "@/components/Footer";
import HeaderFour from "@/components/HeaderFour";
import IssueArticlesExplorer from "@/components/journals/IssueArticlesExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import { getJournal, getJournalIssues } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isRtlLocale } from "@/i18n/config";

const ISSUE_PAGE_SIZE = 100;
const MAX_LOOKUP_ITERATIONS = 20;

const findIssueById = async (slug, issueId, locale) => {
  let page = 1;
  let iterations = 0;

  while (iterations < MAX_LOOKUP_ITERATIONS) {
    const response = await getJournalIssues(slug, {
      page,
      pageSize: ISSUE_PAGE_SIZE,
      locale,
    });

    const issues = Array.isArray(response.issues) ? response.issues : [];
    const match = issues.find((entry) => Number(entry.id) === Number(issueId));
    if (match) {
      return match;
    }

    if (!response.hasNext || issues.length === 0) {
      break;
    }

    page += 1;
    iterations += 1;
  }

  return null;
};

export async function generateMetadata(context) {
  const locale = context?.params?.locale || defaultLocale;
  const params = await context?.params;
  const slug = params?.slug;
  const issueId = Number(params?.issueId);
  if (!slug || Number.isNaN(issueId)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "library.issueArticles.meta" });

  try {
    const journal = await getJournal(slug, { locale });
    return {
      title: t("title", { journal: journal.name }),
      description: t("description", { journal: journal.name }),
    };
  } catch {
    return {
      title: t("title", { journal: slug }),
      description: t("description", { journal: slug }),
    };
  }
}

export default async function IssueArticlesPage(context) {
  const locale = context?.params?.locale || defaultLocale;
  const params = await context?.params;
  const slug = params?.slug;
  const issueIdParam = params?.issueId;
  const issueId = Number(issueIdParam);

  if (!slug || Number.isNaN(issueId)) {
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

  const issue = await findIssueById(slug, issueId, locale);
  if (!issue) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "library.issueArticles" });
  const tPagination = await getTranslations({ locale, namespace: "shared.pagination" });
  const detailT = await getTranslations({ locale, namespace: "library.articleDetail" });

  const unknownLabel = t("header.unknown");

  const strings = {
    header: {
      journalLabel: t("header.journalLabel"),
      title: t("header.title", { journal: "{journal}" }),
      subtitle: t("header.subtitle", { issue: "{issue}" }),
      issueLabel: t("header.issueLabel", {
        volume: "{volume}",
        number: "{number}",
        year: "{year}",
      }),
      documentsCount: t("header.documentsCount", { count: "{count}" }),
      unknown: unknownLabel,
      meta: {
        volume: t("header.meta.volume"),
        number: t("header.meta.number"),
        year: t("header.meta.year"),
        documents: t("header.meta.documents"),
      },
    },
    resultsLabel: t("resultsLabel"),
    a11y: {
      results: t("a11y.results", { count: "{count}" }),
    },
    error: {
      message: t("error.message"),
    },
    empty: {
      title: t("empty.title"),
      description: t("empty.description"),
    },
    table: {
      ariaLabel: t("table.ariaLabel"),
      title: t("table.title"),
      authors: t("table.authors"),
      authorsFallback: t("table.authorsFallback"),
      year: t("table.year"),
      noYear: t("table.noYear"),
      typeLang: t("table.typeLang"),
      noType: t("table.noType"),
      langOnly: t("table.langOnly"),
      languageFallback: t("table.languageFallback"),
      pages: t("table.pages"),
      noPages: t("table.noPages"),
      actions: t("table.actions"),
      seeDetails: t("table.seeDetails"),
    },
    download: {
      cta: detailT("download.cta"),
      loading: detailT("download.loading"),
      error: detailT("download.error"),
    },
    pagination: {
      ariaLabel: t("pagination.ariaLabel"),
      previous: tPagination("previous"),
      next: tPagination("next"),
      pageTemplate: tPagination("page", { page: "{page}" }),
    },
  };

  const formatIssueValue = (value) => (value ?? unknownLabel);
  const journalDisplayName = journal?.name?.trim() || slug;
  const issueBreadcrumbLabel = t("breadcrumbs.issue", {
    volume: formatIssueValue(issue.volume),
    number: formatIssueValue(issue.number),
    year: formatIssueValue(issue.year),
  });
  const isRtl = isRtlLocale(locale);

  const breadcrumbsItems = [
    { label: t("breadcrumbs.home.label"), href: t("breadcrumbs.home.href") },
    { label: t("breadcrumbs.journals.label"), href: t("breadcrumbs.journals.href") },
    { label: journalDisplayName, href: `/journals/${slug}` },
  ];

  return (
    <AOSWrap>
      <section className="page-wrapper" style={{backgroundColor: "#f7f8fc"}}>
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="issue-articles-page" lang={locale} dir={isRtl ? "rtl" : "ltr"}>
          <Breadcrumbs items={breadcrumbsItems} ariaLabel={t("a11y.breadcrumbs")} locale={locale} />
          <IssueArticlesExplorer
            slug={slug}
            issueId={issueId}
            locale={locale}
            strings={strings}
            journal={{ ...journal, name: journalDisplayName }}
            issue={issue}
          />
        </main>

        <Footer />
      </section>
    </AOSWrap>
  );
}

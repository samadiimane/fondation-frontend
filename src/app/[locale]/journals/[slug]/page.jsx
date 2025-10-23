import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import JournalDetailHero from "@/components/journals/JournalDetailHero";
import JournalIssuesList from "@/components/journals/JournalIssuesList";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import { getJournal, getJournalWithIssues } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.journalDetail" });
  const slug = params?.slug ?? "";

  try {
    const journal = await getJournal(slug);
    return {
      title: t("title", { name: journal.name }),
      description:
        journal.description?.trim() ||
        t("description", { name: journal.name }),
    };
  } catch {
    return {
      title: t("title", { name: slug }),
      description: t("descriptionFallback"),
    };
  }
}

export default async function JournalDetailPage({ params }) {
  const slug = params?.slug;

  if (!slug) {
    notFound();
  }

  let payload;
  try {
    payload = await getJournalWithIssues(slug, { pageSize: 50 });
  } catch (error) {
    if (error?.message?.includes?.("404")) {
      notFound();
    }
    throw error;
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "journals.detail" });

  const journal = payload?.journal ?? null;
  const issues = payload?.issues?.issues ?? [];

  if (!journal) {
    notFound();
  }

  const heroLabels = {
    eyebrow: t("hero.eyebrow"),
    fallbackDescription: t("hero.fallbackDescription"),
    stats: {
      issues: t("hero.stats.issues"),
      articles: t("hero.stats.articles"),
    },
    meta: {
      publisher: t("hero.meta.publisher"),
      issn: t("hero.meta.issn"),
      language: t("hero.meta.language"),
      country: t("hero.meta.country"),
      established: t("hero.meta.established"),
      website: t("hero.meta.website"),
    },
  };

  const issueLabels = {
    title: t("issues.title"),
    subtitle: t("issues.subtitle"),
    empty: {
      title: t("issues.empty.title"),
      description: t("issues.empty.description"),
    },
    item: {
      untitled: t("issues.item.untitled"),
      volume: t("issues.item.volume"),
      issue: t("issues.item.issue"),
      documents: t("issues.item.documents"),
      viewDocuments: t("issues.item.viewDocuments"),
    },
  };

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="journal-detail">
          <div className="journal-detail__container">
            <nav className="journal-detail__back">
              <Link href="/journals">
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                <span>{t("backLink")}</span>
              </Link>
            </nav>

            <JournalDetailHero journal={journal} labels={heroLabels} />

            <JournalIssuesList issues={issues} labels={issueLabels} />
          </div>
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
}

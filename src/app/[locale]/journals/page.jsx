import FooterOne from "@/components/FooterOne";
import HeaderFour from "@/components/HeaderFour";
import JournalsGrid from "@/components/journals/JournalsGrid";
import JournalsHero from "@/components/journals/JournalsHero";
import Preloader from "@/components/Preloader";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";
import { getJournal, getJournals } from "@/lib/api";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.journals" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

const formatNumberFactory = (locale) => {
  try {
    return new Intl.NumberFormat(locale || undefined);
  } catch {
    return new Intl.NumberFormat("en");
  }
};

const enrichJournals = async (journals) => {
  return Promise.all(
    journals.map(async (journal) => {
      if (journal.hasCounts && journal.description) {
        return journal;
      }
      try {
        const detailed = await getJournal(journal.slug);
        return {
          ...journal,
          counts: detailed.counts,
          description: journal.description || detailed.description,
          publisher: journal.publisher || detailed.publisher,
          issn: journal.issn || detailed.issn,
          language: journal.language || detailed.language,
          country: journal.country || detailed.country,
          foundedYear:
            journal.foundedYear !== null && journal.foundedYear !== undefined
              ? journal.foundedYear
              : detailed.foundedYear,
          website: journal.website || detailed.website,
          hasCounts: detailed.hasCounts ?? true,
        };
      } catch {
        return journal;
      }
    })
  );
};

export default async function JournalsPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "journals" });

  const { journals = [] } = await getJournals({ pageSize: 48 });
  const enrichedJournals = await enrichJournals(journals);

  const totals = enrichedJournals.reduce(
    (acc, journal) => {
      const issues = Number(journal.counts?.issues ?? 0);
      const documents = Number(journal.counts?.documents ?? 0);
      if (Number.isFinite(issues)) acc.issues += issues;
      if (Number.isFinite(documents)) acc.documents += documents;
      return acc;
    },
    { issues: 0, documents: 0 }
  );

  const formatter = formatNumberFactory(locale);
  const stats = [
    {
      id: "journals",
      value: formatter.format(enrichedJournals.length),
      label: t("hero.stats.journals"),
    },
    {
      id: "issues",
      value: formatter.format(totals.issues),
      label: t("hero.stats.issues"),
    },
    {
      id: "articles",
      value: formatter.format(totals.documents),
      label: t("hero.stats.articles"),
    },
  ];

  const listLabels = {
    stats: {
      issues: t("list.stats.issues"),
      articles: t("list.stats.articles"),
    },
    fallbackDescription: t("list.fallbackDescription"),
    meta: {
      periodical: t("list.meta.periodical"),
      issn: t("list.meta.issn"),
      established: t("list.meta.established"),
    },
    actions: {
      details: t("list.actions.details"),
    },
    empty: {
      title: t("list.empty.title"),
      description: t("list.empty.description"),
    },
  };

  return (
    <AOSWrap>
      <section className="page-wrapper">
        <Preloader />
        <CustomCursor />
        <TopBarTwo />
        <HeaderFour />

        <main className="journals-page">
          <JournalsHero
            eyebrow={t("hero.eyebrow")}
            title={t("hero.title")}
            description={t("hero.description")}
            stats={stats}
            cta={null}
          />

          <JournalsGrid
            journals={enrichedJournals}
            labels={listLabels}
            makeHref={(journal) => `/journals/${journal.slug}`}
          />
        </main>

        <FooterOne />
      </section>
    </AOSWrap>
  );
}

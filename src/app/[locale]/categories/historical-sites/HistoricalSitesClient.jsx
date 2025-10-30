"use client";

import { useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";

const HistoricalSitesClient = ({ category }) => {
  const t = useTranslations("library.category");
  const slug = category?.slug ?? "historical-sites";
  const documentsCount = category?.counts?.documents ?? null;

  return (
    <>
      <CategoryHeader
        title={category?.name ?? t("breadcrumbs.historicalSites")}
        description={category?.description}
        meta={
          documentsCount !== null ? (
            <span>{t("toolbar.summary", { count: documentsCount })}</span>
          ) : null
        }
      />

      <CategoryDocumentsExplorer
        categorySlug={slug}
        includeDescendants
        renderToolbar={({ q, setQ, sort, setSort, summaryLabel, resetFilters }) => (
          <CategoryToolbar
            q={q}
            setQ={setQ}
            sort={sort}
            setSort={setSort}
            summaryLabel={summaryLabel}
            onReset={resetFilters}
          />
        )}
      />
    </>
  );
};

export default HistoricalSitesClient;

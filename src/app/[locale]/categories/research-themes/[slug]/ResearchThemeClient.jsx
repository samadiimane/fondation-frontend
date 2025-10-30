"use client";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";

const ResearchThemeClient = ({ category, slug }) => {
  const documentsCount = category?.counts?.documents ?? null;

  return (
    <>
      <CategoryHeader
        title={category?.name}
        description={category?.description}
        meta={
          documentsCount !== null ? (
            <span>
              {documentsCount} document{documentsCount === 1 ? "" : "s"} connected to this theme
            </span>
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

export default ResearchThemeClient;

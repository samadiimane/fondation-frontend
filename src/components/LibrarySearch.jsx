"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import useDocumentsSearch from "@/hooks/useDocumentsSearch";
import SearchHero from "@/components/search/SearchHero";
import FiltersRow from "@/components/search/FiltersRow";
import AdvancedFilters from "@/components/search/AdvancedFilters";
import ResultsToolbar from "@/components/search/ResultsToolbar";
import ResultsList from "@/components/search/ResultsList";
import SearchPagination from "@/components/search/Pagination";

const LibrarySearch = () => {
  const tSearch = useTranslations("library.search");
  const {
    items,
    facets,
    total,
    page,
    pageSize,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    q,
    setQ,
    type,
    setType,
    lang,
    setLang,
    yearMin,
    setYearMin,
    yearMax,
    setYearMax,
    categorySlug,
    setCategorySlug,
    sort,
    setSort,
    author,
    setAuthor,
    authorSupported,
    setPage,
    resetFilters,
  } = useDocumentsSearch();

  const [viewMode, setViewMode] = useState("detailed");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const toggleAdvanced = useCallback(() => setAdvancedOpen((prev) => !prev), []);
  const authorFilter = (author || "").trim();
  const authorSummary =
    authorSupported && authorFilter ? tSearch("summaryAuthor", { author: authorFilter }) : null;

  return (
    <section className="library-search">
      <SearchHero query={q} setQuery={setQ} loading={loading && !hasLoadedOnce} />

      <div className="library-search__shell">
        <FiltersRow
          facets={facets}
          typeSelected={type}
          setTypeSelected={setType}
          langSelected={lang}
          setLangSelected={setLang}
          categorySlug={categorySlug}
          setCategorySlug={setCategorySlug}
          advancedOpen={advancedOpen}
          onToggleAdvanced={toggleAdvanced}
          loading={loading}
        />

        {advancedOpen && (
          <AdvancedFilters
            className="advanced-panel--inline"
            yearMin={yearMin}
            setYearMin={setYearMin}
            yearMax={yearMax}
            setYearMax={setYearMax}
            author={author}
            setAuthor={setAuthor}
            authorSupported={authorSupported}
            resetFilters={resetFilters}
            onClose={() => setAdvancedOpen(false)}
          />
        )}

        <ResultsToolbar
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          hasLoadedOnce={hasLoadedOnce}
          sort={sort}
          setSort={setSort}
          activeFiltersSummary={authorSummary}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ResultsList
          items={items}
          loading={loading}
          error={error}
          hasLoadedOnce={hasLoadedOnce}
          viewMode={viewMode}
        />

        {(hasNext || page > 1) && (
          <div className="library-search__pagination">
            <SearchPagination page={page} hasNext={hasNext} setPage={setPage} loading={loading} />
          </div>
        )}
      </div>
    </section>
  );
};

export default LibrarySearch;

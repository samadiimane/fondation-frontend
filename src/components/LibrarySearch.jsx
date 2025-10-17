"use client";

import { useState } from "react";
import useDocumentsSearch from "@/hooks/useDocumentsSearch";
import SearchBar from "@/components/search/SearchBar";
import FacetFilters from "@/components/search/FacetFilters";
import ResultsList from "@/components/search/ResultsList";
import SearchPagination from "@/components/search/Pagination";

const LibrarySearch = () => {
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
    toggleType,
    lang,
    toggleLang,
    yearMin,
    setYearMin,
    yearMax,
    setYearMax,
    categorySlug,
    setCategorySlug,
    sort,
    setSort,
    setPage,
    resetFilters,
  } = useDocumentsSearch();

  const [viewMode, setViewMode] = useState("detailed");

  return (
    <section className="library-search">
      <div className="search-hero" data-aos="fade-up" data-aos-delay="100">
        <div className="search-copy">
          <h2 className="search-title">Explore the Abdelaziz Khallouk Temsamani Library</h2>
          <p className="search-subtitle">
            Discover manuscripts, research papers, archival documents, and cultural heritage resources curated by the
            foundation.
          </p>
        </div>
        <SearchBar value={q} onChange={setQ} loading={loading && !hasLoadedOnce} />
      </div>

      <div className="library-content">
        <FacetFilters
          facets={facets}
          typeSelected={type}
          toggleType={toggleType}
          langSelected={lang}
          toggleLang={toggleLang}
          categorySlug={categorySlug}
          setCategorySlug={setCategorySlug}
          yearMin={yearMin}
          setYearMin={setYearMin}
          yearMax={yearMax}
          setYearMax={setYearMax}
          resetFilters={resetFilters}
          loading={loading}
        />

        <div className="results-wrapper">
          <ResultsList
            items={items}
            loading={loading}
            error={error}
            hasLoadedOnce={hasLoadedOnce}
            total={total}
            page={page}
            pageSize={pageSize}
            sort={sort}
            setSort={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {(hasNext || page > 1) && (
            <SearchPagination page={page} hasNext={hasNext} setPage={setPage} loading={loading} />
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarySearch;

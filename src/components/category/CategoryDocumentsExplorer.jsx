"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useCategoryDocuments from "@/hooks/useCategoryDocuments";
import CategoryToolbar from "./CategoryToolbar";
import ResultsToolbar from "@/components/search/ResultsToolbar";
import ResultsList from "@/components/search/ResultsList";
import Pagination from "@/components/search/Pagination";
import { getLibrarySearchContent } from "@/content/librarySearch";

const DEFAULT_VIEW_MODE = "detailed";

const normalizeTypeValues = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined && item !== null && item !== "")
      .map((item) => String(item));
  }
  if (value === "" || value === undefined || value === null) {
    return [];
  }
  return [String(value)];
};

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
};

const CategoryDocumentsExplorer = ({
  locale,
  categorySlug,
  defaultFilters,
  includeDescendants = true,
  renderToolbar,
  toolbarNamespace = "library.categories.toolbar",
  content,
  textAlign,
}) => {
  const contextLocale = useLocale();
  const resolvedLocale = locale || contextLocale;
  const fallbackContent = useMemo(
    () => getLibrarySearchContent(resolvedLocale),
    [resolvedLocale],
  );
  const resolvedContent = content || fallbackContent;

  const defaultsAppliedRef = useRef(false);
  const lastDefaultsRef = useRef(null);

  const tToolbar = useTranslations(toolbarNamespace);
  const defaultTypeFilter = defaultFilters?.typeFilter;
  const initialTypes = useMemo(
    () => normalizeTypeValues(defaultTypeFilter?.value ?? defaultFilters?.type),
    [defaultFilters?.type, defaultTypeFilter?.value],
  );
  const [types, setTypes] = useState(initialTypes);
  const [viewMode, setViewMode] = useState(DEFAULT_VIEW_MODE);

  const {
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    q,
    setQ,
    sort,
    setSort,
    author,
    setAuthor,
    authorSupported,
    setPage,
    hasNext,
    hasLoadedOnce,
  } = useCategoryDocuments(categorySlug, { includeDescendants, types });

  useEffect(() => {
    if (!defaultFilters) {
      defaultsAppliedRef.current = true;
      lastDefaultsRef.current = defaultFilters;
      return;
    }

    if (defaultsAppliedRef.current && lastDefaultsRef.current === defaultFilters) {
      return;
    }

    if (defaultFilters.q && !q) {
      setQ(defaultFilters.q);
    }

    if (defaultFilters.sort && sort !== defaultFilters.sort) {
      setSort(defaultFilters.sort);
    }

    if (defaultFilters.page && Number(defaultFilters.page) > 1) {
      setPage(defaultFilters.page);
    }

    const normalizedDefaultTypes = normalizeTypeValues(
      defaultFilters?.typeFilter?.value ?? defaultFilters.type,
    );
    if (!arraysEqual(normalizedDefaultTypes, types)) {
      setTypes(normalizedDefaultTypes);
    }

    defaultsAppliedRef.current = true;
    lastDefaultsRef.current = defaultFilters;
  }, [defaultFilters, q, sort, types, setQ, setSort, setPage]);

  const summaryLabel = useMemo(() => {
    if (loading && !hasLoadedOnce) {
      return tToolbar("loading");
    }
    if (loading && hasLoadedOnce) {
      return tToolbar("refreshing");
    }
    if (!loading && hasLoadedOnce && total === 0) {
      return tToolbar("empty");
    }
    if (!loading && total > 0) {
      return tToolbar("resultsSummary", { count: total });
    }
    return tToolbar("default");
  }, [loading, hasLoadedOnce, total, tToolbar]);
  const authorFilter = (author || "").trim();
  const authorSummary =
    authorSupported && authorFilter ? tToolbar("summaryAuthor", { author: authorFilter }) : null;
  const summaryWithFilters = authorSummary ? `${summaryLabel} - ${authorSummary}` : summaryLabel;

  const setPageSafe = useCallback(
    (value) => {
      const next = Math.max(Number(value) || 1, 1);
      setPage(next);
    },
    [setPage],
  );

  const setSortSafe = useCallback(
    (value) => {
      setSort((prev) => {
        const next = value || "title_asc";
        if (prev !== next) {
          setPageSafe(1);
        }
        return next;
      });
    },
    [setSort, setPageSafe],
  );

  const setQSafe = useCallback(
    (value) => {
      setQ(value);
      setPageSafe(1);
    },
    [setQ, setPageSafe],
  );

  const setAuthorSafe = useCallback(
    (value) => {
      setAuthor(value);
      setPageSafe(1);
    },
    [setAuthor, setPageSafe],
  );

  const setTypesSafe = useCallback(
    (value) => {
      const normalized = normalizeTypeValues(value);
      setTypes((prev) => {
        if (arraysEqual(prev, normalized)) {
          return prev;
        }
        return normalized;
      });
      setPageSafe(1);
      defaultTypeFilter?.onChange?.(normalized);
    },
    [setPageSafe, defaultTypeFilter],
  );

  const handleResetFilters = useCallback(() => {
    setQSafe("");
    setSortSafe("title_asc");
    setTypesSafe([]);
    setAuthorSafe("");
  }, [setQSafe, setSortSafe, setTypesSafe, setAuthorSafe]);

  const typeFilterControl = defaultTypeFilter
    ? {
        ...defaultTypeFilter,
        value: defaultTypeFilter.multiple ? types : (types[0] ?? ""),
        onChange: setTypesSafe,
      }
    : undefined;

  const controls = {
    q,
    setQ: setQSafe,
    sort,
    setSort: setSortSafe,
    page,
    setPage: setPageSafe,
    pageSize,
    total,
    loading,
    error,
    hasNext,
    hasLoadedOnce,
    summaryLabel: summaryWithFilters,
    resetFilters: handleResetFilters,
    typeFilter: typeFilterControl,
    type: types,
    setType: setTypesSafe,
    author,
    setAuthor: setAuthorSafe,
    authorSupported,
    items,
  };

  const toolbarContent = renderToolbar ? (
    renderToolbar(controls)
  ) : (
    <CategoryToolbar
      q={q}
      setQ={setQSafe}
      sort={sort}
      setSort={setSortSafe}
      summaryLabel={summaryWithFilters}
      onReset={handleResetFilters}
      typeFilter={typeFilterControl}
      author={author}
      setAuthor={setAuthorSafe}
      authorSupported={authorSupported}
      namespace={toolbarNamespace}
    />
  );

  return (
    <section className="category-documents">
      {toolbarContent}

      <div className="category-documents__results">
        <ResultsToolbar
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          hasLoadedOnce={hasLoadedOnce}
          sort={sort}
          setSort={setSortSafe}
          activeFiltersSummary={authorSummary}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          content={resolvedContent}
          textAlign={textAlign}
        />

        <ResultsList
          items={items}
          loading={loading}
          error={error}
          hasLoadedOnce={hasLoadedOnce}
          viewMode={viewMode}
          content={resolvedContent}
          textAlign={textAlign}
        />

        {hasLoadedOnce && (
          <Pagination
            page={page}
            hasNext={hasNext}
            setPage={setPageSafe}
            loading={loading}
            content={resolvedContent}
          />
        )}
      </div>
    </section>
  );
};

export default CategoryDocumentsExplorer;



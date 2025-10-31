"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useCategoryDocuments from "@/hooks/useCategoryDocuments";
import CategoryToolbar from "./CategoryToolbar";
import { useTranslations } from "next-intl";
import ResultsToolbar from "@/components/search/ResultsToolbar";
import ResultsList from "@/components/search/ResultsList";
import Pagination from "@/components/search/Pagination";

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
}) => {
  void locale;

  const defaultsAppliedRef = useRef(false);
  const lastDefaultsRef = useRef(null);

  const tToolbar = useTranslations("library.category.toolbar");
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
      return tToolbar("summary", { count: total });
    }
    return tToolbar("default");
  }, [loading, hasLoadedOnce, total, tToolbar]);

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
  }, [setQSafe, setSortSafe, setTypesSafe]);

  const typeFilterControl = defaultTypeFilter
    ? {
        ...defaultTypeFilter,
        value: types,
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
    summaryLabel,
    resetFilters: handleResetFilters,
    typeFilter: typeFilterControl,
    type: types,
    setType: setTypesSafe,
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
      summaryLabel={summaryLabel}
      onReset={handleResetFilters}
      typeFilter={typeFilterControl}
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

        {hasLoadedOnce && (
          <Pagination page={page} hasNext={hasNext} setPage={setPageSafe} loading={loading} />
        )}
      </div>
    </section>
  );
};

export default CategoryDocumentsExplorer;


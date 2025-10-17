"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch, buildQuery } from "@/lib/api";

const EMPTY_FACETS = {
  type: [],
  lang: [],
  category: [],
  year: { min: null, max: null, buckets: [] },
};

const parseInitialParams = () => {
  if (typeof window === "undefined") {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  const toInt = (value) => {
    if (value === null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    q: params.get("q") || "",
    type: params.getAll("type"),
    lang: params.getAll("lang"),
    yearMin: toInt(params.get("year_from") ?? params.get("year_min")),
    yearMax: toInt(params.get("year_to") ?? params.get("year_max")),
    category: params.get("category") ?? params.get("category_slug") ?? "",
    page: Math.max(Number(params.get("page")) || 1, 1),
    pageSize: Math.min(Math.max(Number(params.get("page_size")) || 20, 1), 100),
    sort: params.get("sort") || "created_desc",
  };
};

const createHistoryParams = (state) => {
  const params = {
    q: state.q || undefined,
    page: state.page > 1 ? state.page : undefined,
    page_size: state.pageSize !== 20 ? state.pageSize : undefined,
    sort: state.sort !== "created_desc" ? state.sort : undefined,
    category: state.categorySlug || undefined,
    year_from: state.yearMin ?? undefined,
    year_to: state.yearMax ?? undefined,
  };

  if (state.type?.length) {
    params.type = state.type;
  }
  if (state.lang?.length) {
    params.lang = state.lang;
  }

  return params;
};

const useDebouncedValue = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
};

const normalizeFacetYear = (facets = {}) => {
  const year = facets.year || {};
  return {
    min: year.min ?? null,
    max: year.max ?? null,
    buckets: Array.isArray(year.buckets) ? year.buckets : [],
  };
};

const useDocumentsSearch = () => {
  const initial = useMemo(() => parseInitialParams(), []);

  const [q, setQ] = useState(initial.q || "");
  const [type, setType] = useState(initial.type || []);
  const [lang, setLang] = useState(initial.lang || []);
  const [yearMin, setYearMin] = useState(initial.yearMin ?? null);
  const [yearMax, setYearMax] = useState(initial.yearMax ?? null);
  const [categorySlug, setCategorySlug] = useState(initial.category || "");
  const [sort, setSort] = useState(initial.sort || "created_desc");
  const [page, setPage] = useState(initial.page || 1);
  const [pageSize, setPageSize] = useState(initial.pageSize || 20);

  const [items, setItems] = useState([]);
  const [facets, setFacets] = useState(EMPTY_FACETS);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const abortRef = useRef(null);
  const prevFilterSignature = useRef(null);

  const debouncedQ = useDebouncedValue(q, 500);

  const requestParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      type: [...type],
      lang: [...lang],
      year_from: yearMin ?? undefined,
      year_to: yearMax ?? undefined,
      category: categorySlug || undefined,
      sort,
      page,
      page_size: pageSize,
    }),
    [debouncedQ, type, lang, yearMin, yearMax, categorySlug, sort, page, pageSize]
  );

  const requestKey = useMemo(() => JSON.stringify(requestParams), [requestParams]);

  // reset page when filters (except page) change
  useEffect(() => {
    const signature = JSON.stringify({
      q: debouncedQ,
      type: [...type].sort(),
      lang: [...lang].sort(),
      yearMin,
      yearMax,
      categorySlug,
      sort,
      pageSize,
    });

    if (prevFilterSignature.current && prevFilterSignature.current !== signature) {
      setPage(1);
    }
    prevFilterSignature.current = signature;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, type, lang, yearMin, yearMax, categorySlug, sort, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        const data = await apiFetch("/v1/search/documents", {
          params: requestParams,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        const safeItems = Array.isArray(data.items) ? data.items : [];
        const safeFacets = data.facets || {};

        setItems(safeItems);
        setFacets({
          type: Array.isArray(safeFacets.type) ? safeFacets.type : [],
          lang: Array.isArray(safeFacets.lang) ? safeFacets.lang : [],
          category: Array.isArray(safeFacets.category) ? safeFacets.category : [],
          year: normalizeFacetYear(safeFacets),
        });
        setTotal(Number(data.total) || safeItems.length);
        setHasNext(Boolean(data.has_next ?? data.hasNext ?? false));
        setHasLoadedOnce(true);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setError(err.message || "Unable to load documents.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = createHistoryParams({
      q,
      type,
      lang,
      yearMin,
      yearMax,
      categorySlug,
      sort,
      page,
      pageSize,
    });
    const query = buildQuery(params);
    const newUrl = `${window.location.pathname}${query}`;
    window.history.replaceState(null, "", newUrl);
  }, [q, type, lang, yearMin, yearMax, categorySlug, sort, page, pageSize]);

  const resetFilters = useCallback(() => {
    setType([]);
    setLang([]);
    setYearMin(null);
    setYearMax(null);
    setCategorySlug("");
    setSort("created_desc");
    setPage(1);
  }, []);

  const toggleArrayValue = useCallback((setter) => (value) => {
    setter((prev) => {
      const exists = prev.includes(value);
      if (exists) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
    setPage(1);
  }, []);

  const toggleType = useMemo(() => toggleArrayValue(setType), [toggleArrayValue]);
  const toggleLang = useMemo(() => toggleArrayValue(setLang), [toggleArrayValue]);

  const setYearMinSafe = useCallback((value) => {
    setYearMin(value === "" ? null : Number(value));
    setPage(1);
  }, []);

  const setYearMaxSafe = useCallback((value) => {
    setYearMax(value === "" ? null : Number(value));
    setPage(1);
  }, []);

  const setCategorySlugSafe = useCallback((value) => {
    setCategorySlug(value);
    setPage(1);
  }, []);

  const setSortSafe = useCallback((value) => {
    setSort(value);
    setPage(1);
  }, []);

  const setPageSizeSafe = useCallback((value) => {
    const next = Math.min(Math.max(Number(value) || 20, 1), 100);
    setPageSize(next);
    setPage(1);
  }, []);

  const setQSafe = useCallback((value) => {
    setQ(value);
  }, []);

  return {
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
    setQ: setQSafe,
    type,
    setType,
    toggleType,
    lang,
    setLang,
    toggleLang,
    yearMin,
    setYearMin: setYearMinSafe,
    yearMax,
    setYearMax: setYearMaxSafe,
    categorySlug,
    setCategorySlug: setCategorySlugSafe,
    sort,
    setSort: setSortSafe,
    setPage,
    setPageSize: setPageSizeSafe,
    resetFilters,
  };
};

export default useDocumentsSearch;

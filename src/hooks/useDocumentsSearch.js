"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { apiFetch, buildQuery, getCategories } from "@/lib/api";

const EMPTY_FACETS = {
  type: [],
  lang: [],
  category: [],
  year: { min: null, max: null, buckets: [] },
};

const LEGACY_AUTHOR_ERROR_CODES = new Set([400, 422]);

const pickText = (...values) => {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }
  return "";
};

const resolveCategoryName = (entry) =>
  pickText(
    entry?.name,
    entry?.title,
    entry?.base_name,
    entry?.baseName,
    entry?.default_name,
    entry?.defaultName,
    entry?.original_name,
    entry?.originalName,
    entry?.slug,
  );

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
    author: params.get("author") || "",
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
    author: state.author || undefined,
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
  const locale = useLocale();
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
  const [author, setAuthor] = useState(initial.author || "");
  const [authorSupported, setAuthorSupported] = useState(true);

  const [journalCategories, setJournalCategories] = useState([]);
  const journalCategoriesRef = useRef([]);
  const [items, setItems] = useState([]);
  const [facets, setFacets] = useState(EMPTY_FACETS);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    getCategories({
      kind: "journal",
      pageSize: 100,
      locale,
      signal: controller.signal,
    })
      .then((result) => {
        if (!active) return;
        const categories = result?.categories ?? [];
        journalCategoriesRef.current = categories;
        setJournalCategories(categories);
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return;
        console.error(err);
        journalCategoriesRef.current = [];
        setJournalCategories([]);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [locale]);

  useEffect(() => {
    if (!journalCategories.length) {
      return;
    }
    setFacets((previous) => {
      if (!previous) {
        return previous;
      }
      const baseCategoryFacets = Array.isArray(previous.category)
        ? [...previous.category]
        : [];
      const seen = new Set(
        baseCategoryFacets
          .map((entry) => entry?.slug)
          .filter(Boolean)
      );
      let mutated = false;
      journalCategories.forEach((category) => {
        if (!category?.slug || seen.has(category.slug)) {
          return;
        }
        baseCategoryFacets.push({
          slug: category.slug,
          name: category.name ?? category.slug,
          count: null,
        });
        seen.add(category.slug);
        mutated = true;
      });
      if (!mutated) {
        return previous;
      }
      return {
        ...previous,
        category: baseCategoryFacets,
      };
    });
  }, [journalCategories]);

  const abortRef = useRef(null);
  const prevFilterSignature = useRef(null);

  const debouncedQ = useDebouncedValue(q, 500);
  const debouncedAuthor = useDebouncedValue(author, 300);

  const requestParams = useMemo(() => {
    const authorFilter = (debouncedAuthor || "").trim();
    const params = {
      q: debouncedQ || undefined,
      type: [...type],
      lang: [...lang],
      year_from: yearMin ?? undefined,
      year_to: yearMax ?? undefined,
      category: categorySlug || undefined,
      sort,
      page,
      page_size: pageSize,
      locale: locale || undefined,
    };
    if (authorSupported && authorFilter) {
      params.author = authorFilter;
    }
    return params;
  }, [
    debouncedQ,
    debouncedAuthor,
    type,
    lang,
    yearMin,
    yearMax,
    categorySlug,
    sort,
    page,
    pageSize,
    authorSupported,
    locale,
  ]);

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
      author: debouncedAuthor,
    });

    if (prevFilterSignature.current && prevFilterSignature.current !== signature) {
      setPage(1);
    }
    prevFilterSignature.current = signature;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, type, lang, yearMin, yearMax, categorySlug, sort, pageSize, debouncedAuthor]);

  useEffect(() => {
    const controller = new AbortController();
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const applyPayload = (data) => {
      const safeItems = Array.isArray(data.items) ? data.items : [];
      const safeFacets = data.facets || {};

      setItems(safeItems);
      const baseCategoryFacets = Array.isArray(safeFacets.category)
        ? safeFacets.category.map((entry) => ({
            ...entry,
            name: resolveCategoryName(entry),
          }))
        : [];
      const seenCategorySlugs = new Set(
        baseCategoryFacets
          .map((entry) => entry?.slug)
          .filter(Boolean)
      );
      journalCategoriesRef.current.forEach((category) => {
        if (!category?.slug || seenCategorySlugs.has(category.slug)) {
          return;
        }
        baseCategoryFacets.push({
          slug: category.slug,
          name: resolveCategoryName(category),
          count: null,
        });
        seenCategorySlugs.add(category.slug);
      });

      setFacets({
        type: Array.isArray(safeFacets.type) ? safeFacets.type : [],
        lang: Array.isArray(safeFacets.lang) ? safeFacets.lang : [],
        category: baseCategoryFacets,
        year: normalizeFacetYear(safeFacets),
      });
      setTotal(Number(data.total) || safeItems.length);
      setHasNext(Boolean(data.has_next ?? data.hasNext ?? false));
      setHasLoadedOnce(true);
    };

    const run = async () => {
      try {
        const data = await apiFetch("/v1/search/documents", {
          params: requestParams,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        applyPayload(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        const status = err?.status;
        const authorFilter = (debouncedAuthor || "").trim();
        if (authorSupported && authorFilter && status && LEGACY_AUTHOR_ERROR_CODES.has(status)) {
          console.warn("Author filter unsupported by backend, retrying without author parameter.", err);
          setAuthorSupported(false);
          try {
            const fallbackParams = { ...requestParams };
            delete fallbackParams.author;
            const fallbackData = await apiFetch("/v1/search/documents", {
              params: fallbackParams,
              signal: controller.signal,
            });
            if (controller.signal.aborted) return;
            applyPayload(fallbackData);
            return;
          } catch (fallbackError) {
            if (controller.signal.aborted) return;
            console.error(fallbackError);
            setError(fallbackError.message || "Unable to load documents.");
            return;
          }
        }
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
  }, [requestKey, locale]);

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
    author,
  });
    const query = buildQuery(params);
    const newUrl = `${window.location.pathname}${query}`;
    window.history.replaceState(null, "", newUrl);
  }, [q, type, lang, yearMin, yearMax, categorySlug, sort, page, pageSize, author]);

  const resetFilters = useCallback(() => {
    setType([]);
    setLang([]);
    setYearMin(null);
    setYearMax(null);
    setCategorySlug("");
    setSort("created_desc");
    setAuthor("");
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

  const setAuthorSafe = useCallback((value) => {
    setAuthor(value);
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
    author,
    setAuthor: setAuthorSafe,
    authorSupported,
    setPage,
    setPageSize: setPageSizeSafe,
    resetFilters,
  };
};

export default useDocumentsSearch;

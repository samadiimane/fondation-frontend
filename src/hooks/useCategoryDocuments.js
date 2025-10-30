"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { buildCategoryQuery } from "@/lib/categoryQuery";

const DEFAULT_SORT = "title_asc";
const ALLOWED_SORTS = new Set(["title_asc", "title_desc", "year_desc", "year_asc"]);

const parseInitialState = () => {
  if (typeof window === "undefined") {
    return {
      q: "",
      sort: DEFAULT_SORT,
      page: 1,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || "";
  const sortParam = params.get("sort") || DEFAULT_SORT;
  const sort = ALLOWED_SORTS.has(sortParam) ? sortParam : DEFAULT_SORT;
  const parsedPage = Number(params.get("page")) || 1;
  const page = parsedPage > 0 ? parsedPage : 1;
  return { q, sort, page };
};

const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
};

const clampPageSize = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(Math.max(Math.floor(parsed), 1), 100);
};

const normalizeDocuments = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { items: [], total: 0, page: 1, pageSize: 20, hasNext: false };
  }
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.documents)
      ? payload.documents
      : Array.isArray(payload.results)
        ? payload.results
        : [];
  const total = Number(payload.total ?? items.length) || items.length;
  const page = Number(payload.page) || 1;
  const pageSize = Number(payload.page_size ?? payload.pageSize) || items.length || 20;
  let hasNext = false;
  if (typeof payload.has_next === "boolean") {
    hasNext = payload.has_next;
  } else if (typeof payload.hasNext === "boolean") {
    hasNext = payload.hasNext;
  } else if ("next" in payload) {
    hasNext = Boolean(payload.next);
  } else {
    const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
    hasNext = page < totalPages;
    if (!Number.isFinite(totalPages) || totalPages === 0) {
      hasNext = items.length >= pageSize;
    }
  }
  return { items, total, page, pageSize, hasNext };
};

const normalizeTypes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }
  return [String(value).trim()].filter(Boolean);
};

const useCategoryDocuments = (
  slug,
  {
    pageSize: initialPageSize = 20,
    includeDescendants = false,
    types: externalTypes,
  } = {},
) => {
  const initial = useMemo(() => parseInitialState(), []);
  const [q, setQ] = useState(initial.q);
  const [sort, setSort] = useState(initial.sort);
  const [page, setPage] = useState(initial.page);
  const [pageSize] = useState(() => clampPageSize(initialPageSize));

  const [items, setItems] = useState(() => []);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const debouncedQ = useDebouncedValue(q);

  const requestKey = useMemo(() => {
    return JSON.stringify({
      slug,
      q: debouncedQ,
      sort,
      page,
      pageSize,
      includeDescendants,
      type: normalizeTypes(externalTypes),
    });
  }, [slug, debouncedQ, sort, page, pageSize, includeDescendants, externalTypes]);

  const previousSlugRef = useRef(slug);

  useEffect(() => {
    if (previousSlugRef.current && previousSlugRef.current !== slug) {
      setPage(1);
    }
    previousSlugRef.current = slug;
  }, [slug]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    if (sort && sort !== DEFAULT_SORT) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const typeValues = normalizeTypes(externalTypes);
    params.delete("type");
    typeValues.forEach((value) => params.append("type", value));

    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [q, sort, page, externalTypes]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    if (!slug) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      setHasNext(false);
      setHasLoadedOnce(false);
      return () => {
        controller.abort();
      };
    }

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const resource = buildCategoryQuery({
          slug,
          q: debouncedQ,
          page,
          pageSize,
          sort,
          includeDescendants,
        });
        const payload = await apiFetch(resource, { signal: controller.signal });
        if (!active || controller.signal.aborted) return;
        const {
          items: fetchedItems,
          total: fetchedTotal,
          hasNext: fetchedHasNext,
        } = normalizeDocuments(payload);
        setItems(fetchedItems);
        setTotal(fetchedTotal);
        setHasNext(Boolean(fetchedHasNext));
        setHasLoadedOnce(true);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        if (err?.name === "AbortError") return;
        console.error(err);
        setError(err?.message || "Unable to load documents.");
        setItems([]);
        setTotal(0);
        setHasNext(false);
        setHasLoadedOnce(true);
      } finally {
        if (!active || controller.signal.aborted) return;
        setLoading(false);
      }
    };

    fetchDocuments();

    return () => {
      active = false;
      controller.abort();
    };
  }, [requestKey, slug, debouncedQ, sort, page, pageSize, includeDescendants, externalTypes]);

  const setPageSafe = useCallback((value) => {
    const next = Math.max(Number(value) || 1, 1);
    setPage(next);
  }, [setPage]);

  const setSortSafe = useCallback((value) => {
    setSort((prev) => {
      const next = ALLOWED_SORTS.has(value) ? value : DEFAULT_SORT;
      if (prev !== next) {
        setPageSafe(1);
      }
      return next;
    });
  }, [setPageSafe]);

  const setQSafe = useCallback((value) => {
    setQ(value);
    setPageSafe(1);
  }, [setPageSafe]);

  return {
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    q,
    setQ: setQSafe,
    sort,
    setSort: setSortSafe,
    setPage: setPageSafe,
    hasNext,
    hasLoadedOnce,
  };
};

export default useCategoryDocuments;

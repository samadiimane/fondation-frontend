"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { buildCategoryQuery } from "@/lib/categoryQuery";

const DEFAULT_SORT = "title_asc";
const ALLOWED_SORTS = new Set(["title_asc", "title_desc", "year_desc", "year_asc"]);
const LEGACY_AUTHOR_ERROR_CODES = new Set([400, 422]);

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
  const author = params.get("author") || "";
  return { q, sort, page, author };
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
  const [author, setAuthor] = useState(initial.author || "");
  const [authorSupported, setAuthorSupported] = useState(true);

  const [items, setItems] = useState(() => []);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const debouncedQ = useDebouncedValue(q);
  const debouncedAuthor = useDebouncedValue(author);

  const requestKey = useMemo(() => {
    const authorFilter = (debouncedAuthor || "").trim();
    return JSON.stringify({
      slug,
      q: debouncedQ,
      sort,
      page,
      pageSize,
      includeDescendants,
      type: normalizeTypes(externalTypes),
      author: authorFilter,
      authorSupported,
    });
  }, [
    slug,
    debouncedQ,
    debouncedAuthor,
    sort,
    page,
    pageSize,
    includeDescendants,
    externalTypes,
    authorSupported,
  ]);

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

    if (author) {
      params.set("author", author);
    } else {
      params.delete("author");
    }

    const typeValues = normalizeTypes(externalTypes);
    params.delete("type");
    typeValues.forEach((value) => params.append("type", value));

    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [q, sort, page, externalTypes, author]);

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

    const authorFilter = (debouncedAuthor || "").trim();

    const applyPayload = (payload) => {
      const { items: fetchedItems, total: fetchedTotal, hasNext: fetchedHasNext } = normalizeDocuments(payload);
      setItems(fetchedItems);
      setTotal(fetchedTotal);
      setHasNext(Boolean(fetchedHasNext));
      setHasLoadedOnce(true);
    };

    const buildResource = (includeAuthor) => {
      const queryArgs = {
        slug,
        q: debouncedQ,
        page,
        pageSize,
        sort,
        includeDescendants,
      };
      if (includeAuthor && authorFilter) {
        queryArgs.author = authorFilter;
      }
      return buildCategoryQuery(queryArgs);
    };

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const resource = buildResource(authorSupported);
        const payload = await apiFetch(resource, { signal: controller.signal });
        if (!active || controller.signal.aborted) return;
        applyPayload(payload);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        if (err?.name === "AbortError") return;
        const status = err?.status;
        if (authorSupported && authorFilter && status && LEGACY_AUTHOR_ERROR_CODES.has(status)) {
          console.warn("Category documents endpoint does not support author filter; retrying without it.", err);
          setAuthorSupported(false);
          try {
            const fallbackResource = buildResource(false);
            const fallbackPayload = await apiFetch(fallbackResource, { signal: controller.signal });
            if (!active || controller.signal.aborted) return;
            applyPayload(fallbackPayload);
            return;
          } catch (fallbackError) {
            if (!active || controller.signal.aborted) return;
            if (fallbackError?.name === "AbortError") return;
            console.error(fallbackError);
            setError(fallbackError?.message || "Unable to load documents.");
            setItems([]);
            setTotal(0);
            setHasNext(false);
            setHasLoadedOnce(true);
            return;
          }
        }
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

    run();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    requestKey,
    slug,
    debouncedQ,
    debouncedAuthor,
    sort,
    page,
    pageSize,
    includeDescendants,
    externalTypes,
    authorSupported,
  ]);

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

  const setAuthorSafe = useCallback((value) => {
    setAuthor(value);
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
    author,
    setAuthor: setAuthorSafe,
    authorSupported,
    setPage: setPageSafe,
    hasNext,
    hasLoadedOnce,
  };
};

export default useCategoryDocuments;

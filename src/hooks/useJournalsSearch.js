"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getJournals } from "@/lib/api";
import { buildQuery } from "@/lib/api";

const PAGE_SIZE = 20;
const DEBOUNCE_DELAY = 300;

const parseInitialParams = (searchParams) => {
  const params = {};
  if (!searchParams) return { page: 1, sort: "name_asc", q: "", issn: "" };
  params.q = searchParams.get("q") ?? "";
  params.issn = searchParams.get("issn") ?? "";
  params.sort = searchParams.get("sort") ?? "name_asc";
  params.page = Math.max(Number(searchParams.get("page")) || 1, 1);
  return {
    q: params.q,
    issn: params.issn,
    sort: ["name_asc", "name_desc", "created_desc"].includes(params.sort)
      ? params.sort
      : "name_asc",
    page: params.page,
  };
};

const useDebouncedValue = (value, delay = DEBOUNCE_DELAY) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
};

const createHistoryParams = ({ q, issn, sort, page }) => {
  return {
    q: q?.trim() ? q.trim() : undefined,
    issn: issn?.trim() ? issn.trim() : undefined,
    sort: sort !== "name_asc" ? sort : undefined,
    page: page > 1 ? page : undefined,
  };
};

const useJournalsSearch = ({ locale } = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => parseInitialParams(searchParams), [searchParams]);

  const [q, setQ] = useState(initial.q);
  const [issn, setIssn] = useState(initial.issn);
  const [sort, setSort] = useState(initial.sort);
  const [page, setPage] = useState(initial.page);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const abortRef = useRef(null);

  const debouncedQ = useDebouncedValue(q);
  const debouncedIssn = useDebouncedValue(issn);

  const requestKey = useMemo(
    () =>
      JSON.stringify({
        q: debouncedQ.trim(),
        page,
        locale,
      }),
    [debouncedQ, page, locale]
  );

  const syncUrl = useCallback(
    (state) => {
      if (!pathname) return;
      const params = createHistoryParams(state);
      const query = buildQuery(params);
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [router, pathname]
  );

  useEffect(() => {
    syncUrl({ q, issn, sort, page });
  }, [q, issn, sort, page, syncUrl]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getJournals({
          q: debouncedQ.trim() || undefined,
          page,
          pageSize: PAGE_SIZE,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        const baseItems = Array.isArray(response.journals) ? response.journals : [];

        const normalizedIssn = debouncedIssn
          .trim()
          .replace(/[^0-9xX]/g, "")
          .toLowerCase();

        let filteredItems = baseItems;
        if (normalizedIssn) {
          filteredItems = baseItems.filter((journal) => {
            const journalIssn = (journal.issn || "")
              .replace(/[^0-9xX]/g, "")
              .toLowerCase();
            return journalIssn === normalizedIssn;
          });
        }

        const sortedItems = [...filteredItems];
        const localeToUse = locale || (typeof window !== "undefined" ? navigator.language : "en");
        const collator = new Intl.Collator(localeToUse, { sensitivity: "base" });

        if (sort === "name_desc") {
          sortedItems.sort((a, b) => collator.compare(b.name || "", a.name || ""));
        } else if (sort === "created_desc") {
          sortedItems.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (dateA === dateB) {
              return collator.compare(a.name || "", b.name || "");
            }
            return dateB - dateA;
          });
        } else {
          sortedItems.sort((a, b) => collator.compare(a.name || "", b.name || ""));
        }

        const totalCount = normalizedIssn
          ? sortedItems.length
          : response.total ?? sortedItems.length;

        setItems(sortedItems);
        setTotal(totalCount);
        setHasNext(Boolean(response.hasNext) && !normalizedIssn);
        setHasLoadedOnce(true);

        const formatter = new Intl.NumberFormat(localeToUse);
        setAnnouncement(formatter.format(totalCount));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message || "Unable to load journals.");
        setItems([]);
        setTotal(0);
        setHasNext(false);
        setAnnouncement("0");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [requestKey, debouncedIssn, sort, page, locale]);

  const setPageSafe = useCallback((value) => {
    const next = Math.max(Number(value) || 1, 1);
    setPage(next);
  }, []);

  const setSortSafe = useCallback((value) => {
    setSort(value);
    setPage(1);
  }, []);

  const setQSafe = useCallback((value) => {
    setQ(value);
    setPage(1);
  }, []);

  const setIssnSafe = useCallback((value) => {
    setIssn(value);
    setPage(1);
  }, []);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    q,
    setQ: setQSafe,
    issn,
    setIssn: setIssnSafe,
    sort,
    setSort: setSortSafe,
    setPage: setPageSafe,
    announcement,
  };
};

export default useJournalsSearch;

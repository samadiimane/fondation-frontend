"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getJournalIssues, buildQuery } from "@/lib/api";

const PAGE_SIZE = 20;
const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

const parseInitialParams = (searchParams) => {
  if (!searchParams) {
    return {
      page: 1,
      sort: "year_desc",
      yearMin: "",
      yearMax: "",
      number: "",
    };
  }

  const numericValueOrEmpty = (key) => digitsOnly(searchParams.get(key));
  const sortParam = searchParams.get("sort") ?? "year_desc";

  return {
    page: Math.max(Number(searchParams.get("page")) || 1, 1),
    sort: ["year_desc", "year_asc"].includes(sortParam) ? sortParam : "year_desc",
    yearMin: numericValueOrEmpty("year_min"),
    yearMax: numericValueOrEmpty("year_max"),
    number: numericValueOrEmpty("number"),
  };
};

const useJournalIssues = ({ slug, locale }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => parseInitialParams(searchParams), [searchParams]);

  const [page, setPage] = useState(initial.page);
  const [sort, setSort] = useState(initial.sort);
  const [yearMin, setYearMin] = useState(initial.yearMin);
  const [yearMax, setYearMax] = useState(initial.yearMax);
  const [number, setNumber] = useState(initial.number);

  const [allIssues, setAllIssues] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const abortRef = useRef(null);

  const historyParams = useMemo(
    () => ({
      year_min: yearMin?.trim() || undefined,
      year_max: yearMax?.trim() || undefined,
      number: number?.trim() || undefined,
      sort: sort !== "year_desc" ? sort : undefined,
      page: page > 1 ? String(page) : undefined,
    }),
    [yearMin, yearMax, number, sort, page]
  );

  useEffect(() => {
    if (!pathname) return;
    const query = buildQuery(historyParams);
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [historyParams, router, pathname]);

  useEffect(() => {
    if (!slug) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchAllIssues = async () => {
      setLoading(true);
      setError(null);
      setHasLoadedOnce(false);

      try {
        let currentPage = 1;
        let aggregated = [];
        let hasMore = true;

        while (hasMore) {
          const response = await getJournalIssues(slug, {
            page: currentPage,
            pageSize: PAGE_SIZE,
            locale,
            signal: controller.signal,
          });
          if (controller.signal.aborted) return;

          const segment = Array.isArray(response.issues) ? response.issues : [];
          aggregated = aggregated.concat(segment);
          hasMore = Boolean(response.hasNext) && segment.length > 0;
          currentPage += 1;
        }

        setAllIssues(aggregated);
        setHasLoadedOnce(true);
        if (page !== 1) {
          setPage(1);
        }
        const formatter = new Intl.NumberFormat(locale || undefined);
        setAnnouncement(formatter.format(aggregated.length));
        setError(null);
      } catch {
        if (controller.signal.aborted) return;
        setError("journalIssuesUnavailable");
        setAllIssues([]);
        setItems([]);
        setTotal(0);
        setHasNext(false);
        setHasLoadedOnce(false);
        setAnnouncement("0");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAllIssues();

    return () => controller.abort();
  }, [slug, locale]);

  useEffect(() => {
    if (!hasLoadedOnce) {
      setItems([]);
      setTotal(0);
      setHasNext(false);
      return;
    }

    const parseNumeric = (value) => {
      if (typeof value !== "string" || value.trim() === "") return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const parsedYearMin = parseNumeric(yearMin);
    const parsedYearMax = parseNumeric(yearMax);
    const parsedNumber = parseNumeric(number);

    if (
      parsedYearMin !== undefined &&
      parsedYearMax !== undefined &&
      parsedYearMin > parsedYearMax
    ) {
      setError("invalidFilters");
      setItems([]);
      setTotal(0);
      setHasNext(false);
      setAnnouncement("0");
      return;
    }

    if (error === "invalidFilters") {
      setError(null);
    }

    const filtered = allIssues.filter((issue) => {
      const year = typeof issue.year === "number" ? issue.year : undefined;
      const numberValue = typeof issue.number === "number" ? issue.number : undefined;

      if (parsedYearMin !== undefined && (year === undefined || year < parsedYearMin)) {
        return false;
      }
      if (parsedYearMax !== undefined && (year === undefined || year > parsedYearMax)) {
        return false;
      }
      if (parsedNumber !== undefined && (numberValue === undefined || numberValue !== parsedNumber)) {
        return false;
      }
      return true;
    });

    const compareIssues = (a, b) => {
      const yearA = typeof a.year === "number" ? a.year : -Infinity;
      const yearB = typeof b.year === "number" ? b.year : -Infinity;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      const numberA = typeof a.number === "number" ? a.number : -Infinity;
      const numberB = typeof b.number === "number" ? b.number : -Infinity;
      if (numberA !== numberB) {
        return numberA - numberB;
      }
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB, locale || "en", { sensitivity: "base" });
    };

    const sorted = [...filtered];
    if (sort === "year_desc") {
      sorted.sort((a, b) => compareIssues(b, a));
    } else {
      sorted.sort(compareIssues);
    }

    const totalCount = sorted.length;
    const totalPages = totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 1;

    if (page > totalPages) {
      setPage(totalPages);
      return;
    }

    const start = (page - 1) * PAGE_SIZE;
    const pagedItems = sorted.slice(start, start + PAGE_SIZE);

    setItems(pagedItems);
    setTotal(totalCount);
    setHasNext(start + PAGE_SIZE < totalCount);

    const formatter = new Intl.NumberFormat(locale || undefined);
    setAnnouncement(formatter.format(totalCount));
  }, [
    allIssues,
    page,
    sort,
    yearMin,
    yearMax,
    number,
    locale,
    hasLoadedOnce,
    error,
  ]);

  const updateAndResetPage = useCallback((setter) => {
    return (value) => {
      setter(digitsOnly(value));
      setPage(1);
    };
  }, []);

  const updateSortAndResetPage = useCallback((value) => {
    setSort(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setYearMin("");
    setYearMax("");
    setNumber("");
    setSort("year_desc");
    setError(null);
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
    sort,
    setSort: updateSortAndResetPage,
    yearMin,
    setYearMin: updateAndResetPage(setYearMin),
    yearMax,
    setYearMax: updateAndResetPage(setYearMax),
    number,
    setNumber: updateAndResetPage(setNumber),
    setPage,
    resetFilters,
    announcement,
  };
};

export default useJournalIssues;

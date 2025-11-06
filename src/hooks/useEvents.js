"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getEvents } from "@/lib/api";

const EVENT_TYPES = ["all", "seminar", "award", "exhibition"];

const useEvents = ({ initialType = "all", initialPageSize = 12 } = {}) => {
  const [type, setType] = useState(EVENT_TYPES.includes(initialType) ? initialType : "all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(Math.min(Math.max(Number(initialPageSize) || 12, 1), 100));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const abortRef = useRef(null);

  const fetchEvents = useCallback(
    async (nextType = type, nextPage = page, nextPageSize = pageSize) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const response = await getEvents({
          type: nextType,
          page: nextPage,
          pageSize: nextPageSize,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        setItems(response.items ?? []);
        setTotal(Number(response.total ?? 0) || 0);
        setHasNext(Boolean(response.hasNext));
        setHasLoadedOnce(true);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err?.message || "Unable to load events.");
        setItems([]);
        setTotal(0);
        setHasNext(false);
        setHasLoadedOnce(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [type, page, pageSize],
  );

  useEffect(() => {
    fetchEvents(type, page, pageSize);
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [type, page, pageSize, fetchEvents]);

  const setTypeSafe = useCallback((value) => {
    const next = EVENT_TYPES.includes(value) ? value : "all";
    setType(next);
    setPage(1);
  }, []);

  const setPageSafe = useCallback((value) => {
    const next = Math.max(Number(value) || 1, 1);
    setPage(next);
  }, []);

  const setPageSizeSafe = useCallback((value) => {
    const next = Math.min(Math.max(Number(value) || 12, 1), 100);
    setPageSize(next);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchEvents(type, 1, pageSize);
  }, [fetchEvents, type, pageSize]);

  return useMemo(
    () => ({
      type,
      setType: setTypeSafe,
      page,
      setPage: setPageSafe,
      pageSize,
      setPageSize: setPageSizeSafe,
      items,
      total,
      hasNext,
      loading,
      error,
      hasLoadedOnce,
      refresh,
      types: EVENT_TYPES,
    }),
    [
      error,
      hasLoadedOnce,
      hasNext,
      items,
      loading,
      page,
      pageSize,
      refresh,
      setPageSafe,
      setPageSizeSafe,
      setTypeSafe,
      total,
      type,
    ],
  );
};

export default useEvents;

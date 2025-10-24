"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildQuery, getIssueArticles } from "@/lib/api";

const PAGE_SIZE = 20;

const parseInitialParams = (searchParams) => {
  if (!searchParams) {
    return {
      page: 1,
    };
  }
  return {
    page: Math.max(Number(searchParams.get("page")) || 1, 1),
  };
};

const useIssueArticles = ({ slug, issueId, locale }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => parseInitialParams(searchParams), [searchParams]);

  const [page, setPage] = useState(initial.page);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [announcement, setAnnouncement] = useState("0");

  const abortRef = useRef(null);

  useEffect(() => {
    if (!pathname) return;
    const query = buildQuery({
      page: page > 1 ? page : undefined,
    });
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [page, pathname, router]);

  useEffect(() => {
    if (!slug || !issueId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getIssueArticles(slug, issueId, {
          page,
          pageSize: PAGE_SIZE,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const documents = Array.isArray(response.documents) ? response.documents : [];
        setItems(documents);
        setTotal(Number(response.total) || documents.length);
        setHasNext(Boolean(response.hasNext));
        setHasLoadedOnce(true);
        const formatter = new Intl.NumberFormat(locale || undefined);
        setAnnouncement(formatter.format(Number(response.total) || documents.length));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message || "Unable to load issue articles.");
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

    run();

    return () => controller.abort();
  }, [slug, issueId, page, locale]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    hasNext,
    loading,
    error,
    hasLoadedOnce,
    announcement,
    setPage,
  };
};

export default useIssueArticles;

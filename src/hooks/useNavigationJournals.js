"use client";

import { useEffect, useState } from "react";
import { getJournals } from "@/lib/api";

const NAVIGATION_CACHE_TTL = 10 * 60 * 1000;

const journalsCache = new Map();
const pendingJournalRequests = new Map();

const DEFAULT_STATE = {
  journals: [],
  loading: true,
  error: null,
};

const getLocaleCacheKey = (locale) => locale || "default";

const readCachedJournals = (cacheKey) => {
  const entry = journalsCache.get(cacheKey);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > NAVIGATION_CACHE_TTL) {
    journalsCache.delete(cacheKey);
    return undefined;
  }
  return entry.journals;
};

const loadJournals = (cacheKey, locale) => {
  const cached = readCachedJournals(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = pendingJournalRequests.get(cacheKey);
  if (pending) {
    return pending;
  }

  const request = getJournals({
    page: 1,
    pageSize: 100,
    locale,
  })
    .then((response) => {
      const journals = Array.isArray(response?.journals) ? response.journals : [];
      journalsCache.set(cacheKey, {
        journals,
        timestamp: Date.now(),
      });
      return journals;
    })
    .finally(() => {
      pendingJournalRequests.delete(cacheKey);
    });

  pendingJournalRequests.set(cacheKey, request);
  return request;
};

const useNavigationJournals = ({ locale } = {}) => {
  const [state, setState] = useState(() => {
    const cached = readCachedJournals(getLocaleCacheKey(locale));
    return cached
      ? {
          journals: cached,
          loading: false,
          error: null,
        }
      : DEFAULT_STATE;
  });

  useEffect(() => {
    let isCurrent = true;
    const cacheKey = getLocaleCacheKey(locale);
    const cached = readCachedJournals(cacheKey);

    if (cached) {
      setState({
        journals: cached,
        loading: false,
        error: null,
      });
      return () => {
        isCurrent = false;
      };
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    loadJournals(cacheKey, locale)
      .then((journals) => {
        if (!isCurrent) return;
        setState({
          journals,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error(error);
        setState({
          journals: [],
          loading: false,
          error,
        });
      });

    return () => {
      isCurrent = false;
    };
  }, [locale]);

  return state;
};

export default useNavigationJournals;

"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories } from "@/lib/api";

const NAVIGATION_CACHE_TTL = 10 * 60 * 1000;

const taxonomyCache = new Map();
const pendingTaxonomyRequests = new Map();

const DEFAULT_STATE = {
  categories: [],
  loading: true,
  error: null,
};

const getLocaleCacheKey = (locale) => locale || "default";

const readCachedTaxonomy = (cacheKey) => {
  const entry = taxonomyCache.get(cacheKey);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > NAVIGATION_CACHE_TTL) {
    taxonomyCache.delete(cacheKey);
    return undefined;
  }
  return entry.categories;
};

const loadTaxonomy = (cacheKey, locale) => {
  const cached = readCachedTaxonomy(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  const pending = pendingTaxonomyRequests.get(cacheKey);
  if (pending) {
    return pending;
  }

  const request = getCategories({
    pageSize: 100,
    locale,
  })
    .then((result) => {
      const categories = result?.categories ?? [];
      taxonomyCache.set(cacheKey, {
        categories,
        timestamp: Date.now(),
      });
      return categories;
    })
    .finally(() => {
      pendingTaxonomyRequests.delete(cacheKey);
    });

  pendingTaxonomyRequests.set(cacheKey, request);
  return request;
};

const useNavigationTaxonomy = ({ locale } = {}) => {
  const [state, setState] = useState(() => {
    const cached = readCachedTaxonomy(getLocaleCacheKey(locale));
    return cached
      ? {
          categories: cached,
          loading: false,
          error: null,
        }
      : DEFAULT_STATE;
  });

  useEffect(() => {
    let isCurrent = true;
    const cacheKey = getLocaleCacheKey(locale);
    const cached = readCachedTaxonomy(cacheKey);

    if (cached) {
      setState({
        categories: cached,
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

    loadTaxonomy(cacheKey, locale)
      .then((categories) => {
        if (!isCurrent) return;
        setState({
          categories,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!isCurrent) return;
        console.error(error);
        setState({
          categories: [],
          loading: false,
          error,
        });
      });

    return () => {
      isCurrent = false;
    };
  }, [locale]);

  const categories = state.categories;
  const indexedBySlug = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      if (!category?.slug) return;
      if (!map.has(category.slug)) {
        map.set(category.slug, category);
      }
    });
    return map;
  }, [categories]);

  return {
    categories,
    categoryBySlug: indexedBySlug,
    loading: state.loading,
    error: state.error,
  };
};

export default useNavigationTaxonomy;

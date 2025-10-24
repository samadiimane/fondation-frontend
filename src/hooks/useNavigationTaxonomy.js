"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories } from "@/lib/api";

const DEFAULT_STATE = {
  categories: [],
  loading: true,
  error: null,
};

const useNavigationTaxonomy = () => {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    let isCurrent = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const result = await getCategories({
          pageSize: 100,
          signal: controller.signal,
        });
        if (!isCurrent) return;
        setState({
          categories: result.categories ?? [],
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!isCurrent || controller.signal.aborted) {
          return;
        }
        console.error(error);
        setState({
          categories: [],
          loading: false,
          error,
        });
      }
    };

    load();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, []);

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

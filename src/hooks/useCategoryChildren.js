"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategoryChildren } from "@/lib/api";

const normalizeLinkedJournal = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }
  return {
    id: value.id ?? null,
    slug: value.slug ?? "",
    name: value.name ?? "",
  };
};

const mapChild = (item) => {
  if (!item || typeof item !== "object") {
    return {
      id: null,
      slug: "",
      name: "",
      kind: "",
      description: "",
      linked_journal: null,
      counts: null,
      raw: item ?? null,
    };
  }

  const linkedJournal = item.linked_journal ?? item.linkedJournal ?? null;
  const counts =
    item.counts && typeof item.counts === "object"
      ? {
          documents:
            typeof item.counts.documents === "number"
              ? item.counts.documents
              : Number(item.counts.documents) || 0,
        }
      : null;

  return {
    id: item.id ?? null,
    slug: item.slug ?? "",
    name: item.name ?? "",
    kind: item.kind ?? "",
    description: item.description ?? "",
    linked_journal: normalizeLinkedJournal(linkedJournal),
    counts,
    raw: item,
  };
};

const useCategoryChildren = (slug, { kind, withCounts = false } = {}) => {
  const [items, setItems] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizedKind = useMemo(() => {
    if (!kind) return undefined;
    return String(kind);
  }, [kind]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    if (!slug) {
      setItems([]);
      setLoading(false);
      setError(null);
      return () => {
        controller.abort();
      };
    }

    setLoading(true);
    setError(null);

    getCategoryChildren(slug, {
      kind: normalizedKind,
      withCounts,
      signal: controller.signal,
    })
      .then((result) => {
        if (!active || controller.signal.aborted) return;
        const safeItems = Array.isArray(result) ? result : [];
        setItems(safeItems.map(mapChild));
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return;
        console.error(err);
        setItems([]);
        setError(err?.message || "Unable to load categories.");
      })
      .finally(() => {
        if (!active || controller.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [slug, normalizedKind, withCounts]);

  return {
    items,
    loading,
    error,
  };
};

export default useCategoryChildren;

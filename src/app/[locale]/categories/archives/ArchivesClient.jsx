"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import CollectionsGrid from "@/components/category/CollectionsGrid";
import useCategoryChildren from "@/hooks/useCategoryChildren";
import { isRtlLocale } from "@/i18n/config";

const sortItems = (items, sort, collator) => {
  if (!Array.isArray(items)) return [];
  const comparer =
    collator ||
    new Intl.Collator(undefined, {
      sensitivity: "base",
    });
  const sorted = [...items];
  switch (sort) {
    case "title_desc":
    case "year_desc":
      return sorted.sort((a, b) => comparer.compare(b?.name ?? "", a?.name ?? ""));
    case "year_asc":
    case "title_asc":
    default:
      return sorted.sort((a, b) => comparer.compare(a?.name ?? "", b?.name ?? ""));
  }
};

const filterItems = (items, query) => {
  if (!query) return items;
  const term = query.trim().toLowerCase();
  if (!term) return items;
  return items.filter((item) => {
    const name = (item?.name ?? "").toLowerCase();
    const slug = (item?.slug ?? "").toLowerCase();
    const description = (item?.description ?? "").toLowerCase();
    return name.includes(term) || slug.includes(term) || description.includes(term);
  });
};

const renderSkeleton = () => (
  <div className="category-grid category-grid--collections category-grid--skeleton" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, index) => (
      <article key={`skeleton-${index}`} className="category-card category-card--skeleton">
        <div className="category-card__title shimmer"></div>
        <div className="category-card__count shimmer"></div>
        <div className="category-card__description shimmer"></div>
        <div className="category-card__description shimmer"></div>
      </article>
    ))}
  </div>
);

const ArchivesClient = ({ category }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("library.categories");
  const { items, loading, error } = useCategoryChildren("archives", { withCounts: true });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("title_asc");

  const collator = useMemo(() => {
    try {
      return new Intl.Collator(locale || undefined, { sensitivity: "base" });
    } catch {
      return new Intl.Collator("en", { sensitivity: "base" });
    }
  }, [locale]);

  const processedItems = useMemo(() => {
    const filtered = filterItems(items, q);
    return sortItems(filtered, sort, collator);
  }, [items, q, sort, collator]);

  const summaryLabel = useMemo(() => {
    if (loading && items.length === 0) {
      return t("toolbar.loading");
    }
    if (error) {
      return t("grid.error");
    }
    if (processedItems.length === 0 && q) {
      return t("toolbar.empty");
    }
    if (processedItems.length === 0) {
      return t("grid.emptyTitle");
    }
    return t("toolbar.resultsSummary", { count: processedItems.length });
  }, [loading, items.length, processedItems.length, error, q, t]);

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
  };

  const meta = useMemo(() => {
    if (loading && items.length === 0) {
      return <span>{t("grid.loading")}</span>;
    }
    if (processedItems.length === 0) {
      return <span>{t("grid.emptyTitle")}</span>;
    }
    return <span>{t("toolbar.resultsSummary", { count: processedItems.length })}</span>;
  }, [loading, items.length, processedItems.length, t]);

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader title={t("heading")} description={category?.description} meta={meta} />

      <CategoryToolbar
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        summaryLabel={summaryLabel}
        onReset={handleReset}
      />

      {loading && items.length === 0 && renderSkeleton()}

      {!loading && error && (
        <div className="category-grid category-grid--collections category-grid--empty" role="alert">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <p>{t("grid.error")}</p>
          <p className="category-card__description--muted">{String(error)}</p>
        </div>
      )}

      {!loading && !error && processedItems.length === 0 && (
        <div className="category-grid category-grid--collections category-grid--empty">
          <i className="fa-solid fa-box-archive" aria-hidden="true"></i>
          <p>{t("grid.emptyTitle")}</p>
          <p className="category-card__description--muted">{t("grid.emptyDescription")}</p>
        </div>
      )}

      {!loading && !error && processedItems.length > 0 && (
        <CollectionsGrid items={processedItems} />
      )}
    </section>
  );
};

export default ArchivesClient;

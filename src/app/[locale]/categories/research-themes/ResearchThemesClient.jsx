"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryToolbar from "@/components/category/CategoryToolbar";
import TopicsGrid from "@/components/category/TopicsGrid";
import useCategoryChildren from "@/hooks/useCategoryChildren";
import { isRtlLocale } from "@/i18n/config";

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
      return sorted.sort((a, b) => comparer.compare(b?.name ?? "", a?.name ?? ""));
    case "year_desc":
    case "year_asc":
    case "title_asc":
    default:
      return sorted.sort((a, b) => comparer.compare(a?.name ?? "", b?.name ?? ""));
  }
};

const renderSkeleton = () => (
  <div className="category-grid category-grid--topics category-grid--skeleton" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, index) => (
      <article key={`topics-skeleton-${index}`} className="category-card category-card--skeleton">
        <div className="category-card__title shimmer"></div>
        <div className="category-card__count shimmer"></div>
        <div className="category-card__description shimmer"></div>
        <div className="category-card__description shimmer"></div>
      </article>
    ))}
  </div>
);

const ResearchThemesClient = ({ category }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("library.researchThemes");
  const { items, loading, error } = useCategoryChildren("research-themes", { withCounts: true });
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
      return t("error.message");
    }
    if (processedItems.length === 0 && q) {
      return t("toolbar.empty");
    }
    if (processedItems.length === 0) {
      return t("cards.emptyTitle");
    }
    return t("toolbar.announce", { count: processedItems.length });
  }, [loading, items.length, processedItems.length, error, q, t]);

  const handleReset = () => {
    setQ("");
    setSort("title_asc");
  };

  const meta = useMemo(() => {
    if (loading && items.length === 0) {
      return <span>{t("cards.loading")}</span>;
    }
    if (processedItems.length === 0) {
      return <span>{t("cards.emptyTitle")}</span>;
    }
    return <span>{t("toolbar.summary", { count: processedItems.length })}</span>;
  }, [loading, items.length, processedItems.length, t]);

  const headerTitle = category?.name || t("title");
  const headerDescription = category?.description || t("subtitle");

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader title={headerTitle} description={headerDescription} meta={meta} />

      <CategoryToolbar
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        summaryLabel={summaryLabel}
        onReset={handleReset}
        namespace="library.researchThemes.toolbar"
      />

      {loading && items.length === 0 && renderSkeleton()}

      {!loading && error && (
        <div className="category-grid category-grid--topics category-grid--empty" role="alert">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <p>{t("error.message")}</p>
          <p className="category-card__description--muted">{String(error)}</p>
        </div>
      )}

      {!loading && !error && processedItems.length === 0 && (
        <div className="category-grid category-grid--topics category-grid--empty">
          <i className="fa-solid fa-sitemap" aria-hidden="true"></i>
          <p>{t("cards.emptyTitle")}</p>
          <p className="category-card__description--muted">{t("cards.emptyDescription")}</p>
        </div>
      )}

      {!loading && !error && processedItems.length > 0 && <TopicsGrid items={processedItems} />}
    </section>
  );
};

export default ResearchThemesClient;

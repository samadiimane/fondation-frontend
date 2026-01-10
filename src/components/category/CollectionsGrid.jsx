"use client";

import { memo, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const formatDescription = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const formatCount = (count) => {
  if (count === undefined || count === null) return null;
  const numeric = Number(count);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
};

const CollectionsGrid = ({ items = [] }) => {
  const locale = useLocale();
  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);
  const t = useTranslations("library.categories");

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="category-grid category-grid--collections category-grid--empty" role="status">
        <i className="fa-solid fa-archive" aria-hidden="true"></i>
        <p>{t("grid.emptyTitle")}</p>
        <p className="category-card__description--muted">{t("grid.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="category-grid category-grid--collections">
      {items.map((item, index) => {
        const slug = item?.slug ?? "";
        const description = formatDescription(item?.description);
        const count = formatCount(item?.counts?.documents ?? item?.documentsCount);
        const formattedCount = count !== null ? numberFormatter.format(count) : null;
        const key = item?.id ?? slug ?? `collection-${index}`;
        const displayName = item?.name ?? t("cards.titleFallback");

        const cardContent = (
          <>
            <header className="category-card__header">
              <span className="category-card__title">{displayName}</span>
              {count !== null && (
                <span className="category-card__count" aria-label={t("toolbar.resultsSummary", { count })}>
                  <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
                  {formattedCount}
                </span>
              )}
            </header>
            {description ? (
              <p className="category-card__description">{description}</p>
            ) : (
              <p className="category-card__description category-card__description--muted">
                {t("cards.descriptionFallback")}
              </p>
            )}
          </>
        );

        if (slug) {
          return (
            <Link
              key={key}
              href={`/categories/archives/${slug}`}
              className="category-card category-card--link"
              aria-label={displayName}
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <article key={key} className="category-card" aria-label={displayName}>
            {cardContent}
          </article>
        );
      })}
    </div>
  );
};

export default memo(CollectionsGrid);

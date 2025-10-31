"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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

const toTitleFromSlug = (slug = "") =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const TopicsGrid = ({ items = [] }) => {
  const t = useTranslations("library.category");

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="category-grid category-grid--topics category-grid--empty" role="status">
        <i className="fa-solid fa-sitemap" aria-hidden="true"></i>
        <p>{t("grid.emptyTitle")}</p>
        <p className="category-card__description--muted">{t("grid.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="category-grid category-grid--topics">
      {items.map((item, index) => {
        const slug = item?.slug ?? "";
        const description = formatDescription(item?.description);
        const count = formatCount(item?.counts?.documents ?? item?.documentsCount);
        const key = item?.id ?? slug ?? `topic-${index}`;
        const displayName = item?.name ?? (slug ? toTitleFromSlug(slug) : t("grid.topicsTitle"));

        const cardContent = (
          <>
            <header className="category-card__header">
              <span className="category-card__title">{displayName}</span>
              {count !== null && (
                <span className="category-card__count" aria-label={t("toolbar.summary", { count })}>
                  <i className="fa-regular fa-book" aria-hidden="true"></i>
                  {t("toolbar.summary", { count })}
                </span>
              )}
            </header>
            {description ? (
              <p className="category-card__description">{description}</p>
            ) : (
              <p className="category-card__description category-card__description--muted">
                {t("grid.emptyDescription")}
              </p>
            )}
          </>
        );

        if (slug) {
          return (
            <Link
              key={key}
              href={`/categories/research-themes/${slug}`}
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

export default memo(TopicsGrid);

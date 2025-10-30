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

        return (
          <article key={key} className="category-card" aria-label={item?.name ?? slug}>
            <header className="category-card__header">
              {slug ? (
                <Link href={`/categories/research-themes/${slug}`} className="category-card__title">
                  {item?.name ?? slug}
                </Link>
              ) : (
                <span className="category-card__title">{item?.name ?? "Theme"}</span>
              )}
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
          </article>
        );
      })}
    </div>
  );
};

export default memo(TopicsGrid);

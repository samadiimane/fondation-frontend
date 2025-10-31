"use client";

import { useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const CategoryHeader = ({ title, description, meta }) => {
  const t = useTranslations("library.category.header");
  const safeTitle = typeof title === "string" && title.trim().length > 0 ? title.trim() : "Collections";
  const safeDescription =
    typeof description === "string" && description.trim().length > 0 ? description.trim() : "";
  const hasDescription = safeDescription.length > 0;
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();

  const shouldAllowToggle = useMemo(() => {
    if (!hasDescription) return false;
    return safeDescription.length > 320;
  }, [hasDescription, safeDescription]);

  const displayedDescription = hasDescription ? safeDescription : t("descriptionFallback");

  return (
    <section className="category-header" aria-labelledby={`${descriptionId}-title`}>
      <div className="category-header__inner">
        <header className="category-header__heading mb-4">
          <h3 id={`${descriptionId}-title`} className="category-header__title">
            {safeTitle}
          </h3>
        </header>
        <div
          id={descriptionId}
          className={`category-header__description ${expanded ? "is-expanded" : ""}`}
          data-testid="category-description"
        >
          {displayedDescription}
        </div>
        {shouldAllowToggle && (
          <button
            type="button"
            className="category-header__toggle"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={descriptionId}
          >
            {expanded ? "Show less" : "Show more"}
            <span className="sr-only"> about this category</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default CategoryHeader;

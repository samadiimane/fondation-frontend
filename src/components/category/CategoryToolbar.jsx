"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const CategoryToolbar = ({
  q,
  setQ,
  sort,
  setSort,
  typeFilter,
  onReset,
  summaryLabel,
  author = "",
  setAuthor,
  authorSupported = true,
  namespace = "library.categories.toolbar",
}) => {
  const t = useTranslations(namespace);
  const [searchValue, setSearchValue] = useState(q ?? "");
  const [authorValue, setAuthorValue] = useState(author ?? "");
  const inputId = useId();
  const authorId = useId();
  const sortId = useId();
  const typeId = useId();
  const summaryId = useId();

  useEffect(() => {
    setSearchValue(q ?? "");
  }, [q]);

  useEffect(() => {
    setAuthorValue(author ?? "");
  }, [author]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setQ?.(searchValue);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchValue, setQ]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setAuthor?.(authorValue);
    }, 300);
    return () => clearTimeout(handle);
  }, [authorValue, setAuthor]);

  const resolvedSummary = summaryLabel || t("default");

  const hasTypeFilter = useMemo(() => {
    if (!typeFilter) return false;
    if (!Array.isArray(typeFilter.options)) return false;
    return typeFilter.options.length > 0;
  }, [typeFilter]);

  const isTypeMultiSelect = Boolean(typeFilter?.multiple && hasTypeFilter);

  const typeValues = useMemo(() => {
    if (!hasTypeFilter) return [];
    const raw = typeFilter?.value;
    if (Array.isArray(raw)) {
      return raw
        .filter((value) => value !== undefined && value !== null && value !== "")
        .map((value) => String(value));
    }
    if (raw === undefined || raw === null || raw === "") {
      return [];
    }
    return [String(raw)];
  }, [hasTypeFilter, typeFilter]);

  const sortedOptions = useMemo(
    () => [
      { value: "title_asc", label: t("sortOptions.titleAsc") },
      { value: "title_desc", label: t("sortOptions.titleDesc") },
      { value: "year_desc", label: t("sortOptions.yearDesc") },
      { value: "year_asc", label: t("sortOptions.yearAsc") },
    ],
    [t],
  );

  return (
    <section className="category-toolbar" aria-label={t("ariaLabel")}>
      <div className="category-toolbar__controls" role="search">
        <div className="category-toolbar__field">
          <label htmlFor={inputId}>{t("searchLabel")}</label>
          <input
            id={inputId}
            type="search"
            placeholder={t("searchPlaceholder")}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            autoComplete="off"
            aria-describedby={summaryId}
          />
        </div>

        <div className="category-toolbar__field">
          <label htmlFor={authorId}>{t("authorLabel")}</label>
          <input
            id={authorId}
            type="search"
            placeholder={t("authorPlaceholder")}
            value={authorValue}
            onChange={(event) => setAuthorValue(event.target.value)}
            autoComplete="off"
            aria-describedby={summaryId}
            disabled={!authorSupported}
          />
        </div>

        <div className="category-toolbar__field">
          <label htmlFor={sortId}>{t("sortLabel")}</label>
          <select
            id={sortId}
            value={sort}
            onChange={(event) => setSort?.(event.target.value)}
            aria-label={t("sortLabel")}
          >
            {sortedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasTypeFilter && (
          <div className="category-toolbar__field">
            {isTypeMultiSelect ? (
              <>
                <span id={typeId} className="category-toolbar__field-label">
                  {t("typeLabel")}
                </span>
                <div className="category-toolbar__multiselect" role="group" aria-labelledby={typeId}>
                  {typeFilter.options.map((option) => {
                    const rawValue = option.value ?? option.label ?? "";
                    const optionValue = String(rawValue).trim();
                    if (!optionValue) {
                      return null;
                    }
                    const safeValue = optionValue.replace(/\s+/g, "-").toLowerCase();
                    const checkboxId = `${typeId}-${safeValue}`;
                    const checked = typeValues.includes(optionValue);
                    return (
                      <label key={checkboxId} htmlFor={checkboxId} className="category-toolbar__checkbox">
                        <input
                          type="checkbox"
                          id={checkboxId}
                          value={optionValue}
                          checked={checked}
                          onChange={(event) => {
                            const next = new Set(typeValues);
                            if (event.target.checked) {
                              next.add(optionValue);
                            } else {
                              next.delete(optionValue);
                            }
                            const orderedValues = (typeFilter.options ?? [])
                              .map((opt) => String(opt.value ?? opt.label ?? "").trim())
                              .filter((value) => value && next.has(value));
                            typeFilter.onChange?.(orderedValues);
                          }}
                        />
                        <span>{option.label ?? optionValue}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <label htmlFor={typeId}>{t("typeLabel")}</label>
                <select
                  id={typeId}
                  value={typeFilter.value ?? ""}
                  onChange={(event) => typeFilter.onChange?.(event.target.value)}
                  aria-label={t("typeLabel")}
                >
                  {(typeFilter.options ?? []).map((option) => (
                    <option key={option.value ?? option.label} value={option.value ?? ""}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        {onReset && (
          <div className="category-toolbar__field category-toolbar__field--reset">
            <button type="button" onClick={onReset} className="category-toolbar__reset">
              {t("clearFilters")}
            </button>
          </div>
        )}
      </div>

      <p id={summaryId} className="category-toolbar__summary" aria-live="polite">
        {resolvedSummary}
      </p>
    </section>
  );
};

export default CategoryToolbar;

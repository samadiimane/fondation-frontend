"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AssistantFilters } from "@/lib/ai/mockClient";

const LANGUAGE_CODES = ["en", "fr", "es", "ar"];

type AssistantToolbarProps = {
  filters: AssistantFilters;
  onFiltersChange: (next: AssistantFilters) => void;
};

const buildLanguageLabels = (locale: string) => {
  try {
    const displayNames = new Intl.DisplayNames([locale || "en"], { type: "language" });
    return Object.fromEntries(
      LANGUAGE_CODES.map((code) => [code, displayNames.of(code) ?? code.toUpperCase()]),
    );
  } catch {
    return Object.fromEntries(LANGUAGE_CODES.map((code) => [code, code.toUpperCase()]));
  }
};

const AssistantToolbar = ({ filters, onFiltersChange }: AssistantToolbarProps) => {
  const t = useTranslations("assistant");
  const locale = useLocale();
  const languageLabels = useMemo(() => buildLanguageLabels(locale), [locale]);

  const scopeOptions = useMemo(
    () => [
      { value: "all", label: t("toolbar.scope.options.all") },
      { value: "section", label: t("toolbar.scope.options.section") },
      { value: "category", label: t("toolbar.scope.options.category") },
      { value: "journal", label: t("toolbar.scope.options.journal") },
      { value: "collection", label: t("toolbar.scope.options.collection") },
    ],
    [t],
  );

  const typeOptions = useMemo(
    () => [
      { value: "", label: t("toolbar.typeOptions.all") },
      { value: "article", label: t("toolbar.typeOptions.article") },
      { value: "manuscript", label: t("toolbar.typeOptions.manuscript") },
      { value: "issue", label: t("toolbar.typeOptions.issue") },
      { value: "collection", label: t("toolbar.typeOptions.collection") },
    ],
    [t],
  );

  const toggleLanguage = (code: string) => {
    const nextLanguages = filters.languages.includes(code)
      ? filters.languages.filter((lang) => lang !== code)
      : [...filters.languages, code];
    onFiltersChange({ ...filters, languages: nextLanguages });
  };

  return (
    <section className="assistant-toolbar">
      <div className="assistant-toolbar__grid">
        <label className="assistant-field">
          <span className="assistant-field__label">{t("toolbar.scope.label")}</span>
          <select
            value={filters.scope}
            onChange={(event) =>
              onFiltersChange({ ...filters, scope: event.target.value as AssistantFilters["scope"] })
            }
          >
            {scopeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="assistant-field">
          <span className="assistant-field__label">{t("toolbar.language")}</span>
          <div className="assistant-field__chips">
            {LANGUAGE_CODES.map((code) => {
              const isActive = filters.languages.includes(code);
              return (
                <button
                  key={code}
                  type="button"
                  className={`assistant-chip ${isActive ? "is-active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => toggleLanguage(code)}
                >
                  {languageLabels[code]}
                </button>
              );
            })}
          </div>
        </div>

        <label className="assistant-field">
          <span className="assistant-field__label">{t("toolbar.yearFrom")}</span>
          <input
            type="number"
            inputMode="numeric"
            value={filters.yearFrom ?? ""}
            onChange={(event) => onFiltersChange({ ...filters, yearFrom: event.target.value })}
            min={0}
          />
        </label>

        <label className="assistant-field">
          <span className="assistant-field__label">{t("toolbar.yearTo")}</span>
          <input
            type="number"
            inputMode="numeric"
            value={filters.yearTo ?? ""}
            onChange={(event) => onFiltersChange({ ...filters, yearTo: event.target.value })}
            min={0}
          />
        </label>

        <label className="assistant-field">
          <span className="assistant-field__label">{t("toolbar.type")}</span>
          <select
            value={filters.type ?? ""}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                type: (event.target.value || undefined) as AssistantFilters["type"],
              })
            }
          >
            {typeOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="assistant-field assistant-toggle">
          <input
            type="checkbox"
            checked={Boolean(filters.strictCitations)}
            onChange={(event) => onFiltersChange({ ...filters, strictCitations: event.target.checked })}
          />
          <span className="assistant-field__label">{t("toolbar.strictCitations")}</span>
        </label>
      </div>
    </section>
  );
};

export default AssistantToolbar;

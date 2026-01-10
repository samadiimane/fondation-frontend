"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";
import { isRtlLocale } from "@/i18n/config";

const ResearchThemeClient = ({ category, slug }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const textAlign = isRtl ? "text-end" : "text-start";
  const t = useTranslations("library.researchThemes");
  const documentsCount = category?.counts?.documents ?? null;
  const headerTitle = category?.name || t("title");
  const headerDescription = category?.description || t("subtitle");

  const documentsContent = useMemo(
    () => ({
      toolbar: {
        title: t("documents.toolbar.title"),
        searching: t("documents.toolbar.searching"),
        refreshing: t("documents.toolbar.refreshing"),
        results: (total, page, totalPages) =>
          t("documents.toolbar.results", { count: total, page, totalPages }),
        noResults: t("documents.toolbar.noResults"),
        start: t("documents.toolbar.start"),
        viewGroupAria: t("documents.toolbar.viewGroupAria"),
        viewDetailed: t("documents.toolbar.viewDetailed"),
        viewCompact: t("documents.toolbar.viewCompact"),
        sortAria: t("toolbar.sortLabel"),
        sortOptions: [
          { value: "title_asc", label: t("toolbar.sortOptions.titleAsc") },
          { value: "title_desc", label: t("toolbar.sortOptions.titleDesc") },
          { value: "year_desc", label: t("toolbar.sortOptions.yearDesc") },
          { value: "year_asc", label: t("toolbar.sortOptions.yearAsc") },
        ],
      },
      list: {
        emptyTitle: t("documents.list.emptyTitle"),
        emptySubtitle: t("documents.list.emptyDescription"),
        errorTitle: t("documents.list.errorTitle"),
      },
      card: {
        metaAria: t("documents.card.metaAria"),
        pagesSuffix: t("documents.card.pagesSuffix"),
        details: t("documents.card.details"),
      },
      pagination: {
        aria: t("pagination.ariaLabel"),
        prev: t("pagination.previous"),
        next: t("pagination.next"),
        page: (page) => t("pagination.page", { page }),
      },
    }),
    [t],
  );

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader
        title={headerTitle}
        description={headerDescription}
        meta={
          documentsCount !== null ? (
            <span>{t("toolbar.summary", { count: documentsCount })}</span>
          ) : null
        }
      />

      <CategoryDocumentsExplorer
        categorySlug={slug}
        includeDescendants
        toolbarNamespace="library.researchThemes.toolbar"
        content={documentsContent}
        textAlign={textAlign}
      />
    </section>
  );
};

export default ResearchThemeClient;

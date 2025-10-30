"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";

const PublicationsClient = ({ category }) => {
  const t = useTranslations("library.category");
  const slug = category?.slug ?? "publications";
  const documentsCount = category?.counts?.documents ?? null;

  const typeOptions = useMemo(
    () => [
      { value: "book", label: t("toolbar.typeOptions.book") },
      { value: "article", label: t("toolbar.typeOptions.article") },
      { value: "thesis", label: t("toolbar.typeOptions.thesis") },
      { value: "report", label: t("toolbar.typeOptions.report") },
    ],
    [t],
  );

  return (
    <>
      <CategoryHeader
        title={category?.name ?? t("breadcrumbs.publications")}
        description={category?.description}
        meta={
          documentsCount !== null ? (
            <span>{t("toolbar.summary", { count: documentsCount })}</span>
          ) : null
        }
      />

      <CategoryDocumentsExplorer
        categorySlug={slug}
        includeDescendants={false}
        defaultFilters={{
          typeFilter: {
            options: typeOptions,
            multiple: true,
          },
        }}
      />
    </>
  );
};

export default PublicationsClient;

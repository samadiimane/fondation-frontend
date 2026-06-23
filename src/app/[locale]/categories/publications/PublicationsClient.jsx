"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";
import { isRtlLocale } from "@/i18n/config";
import { getDocumentTypeLabel } from "@/lib/documentTypes";

const PublicationsClient = ({ category, showHeader = true }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const textAlign = isRtl ? "text-end" : "text-start";
  const t = useTranslations("library.publications");
  const tToolbar = useTranslations("library.categories.toolbar");
  const tTypes = useTranslations("shared.documentTypes");
  const slug = category?.slug ?? "publications";
  const documentsCount = category?.counts?.documents ?? null;

  const typeOptions = useMemo(
    () => [
      { value: "", label: tToolbar("typeOptions.all") },
      { value: "book", label: getDocumentTypeLabel("book", tTypes, tToolbar("typeOptions.book")) },
      { value: "article", label: getDocumentTypeLabel("article", tTypes, tToolbar("typeOptions.article")) },
      { value: "thesis", label: getDocumentTypeLabel("thesis", tTypes, tToolbar("typeOptions.thesis")) },
      { value: "report", label: getDocumentTypeLabel("report", tTypes, tToolbar("typeOptions.report")) },
    ],
    [tToolbar, tTypes],
  );
  const defaultFilters = useMemo(
    () => ({
      typeFilter: {
        options: typeOptions,
        multiple: false,
        value: "",
      },
    }),
    [typeOptions],
  );

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      {showHeader ? (
        <CategoryHeader
          title={t("title")}
          description={t("subtitle")}
          meta={
            documentsCount !== null ? (
              <span>{tToolbar("resultsSummary", { count: documentsCount })}</span>
            ) : null
          }
        />
      ) : null}

      <CategoryDocumentsExplorer
        categorySlug={slug}
        includeDescendants={false}
        defaultFilters={defaultFilters}
        textAlign={textAlign}
      />
    </section>
  );
};

export default PublicationsClient;

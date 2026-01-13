"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryDocumentsExplorer from "@/components/category/CategoryDocumentsExplorer";
import { isRtlLocale } from "@/i18n/config";

const PublicationsClient = ({ category }) => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const textAlign = isRtl ? "text-end" : "text-start";
  const t = useTranslations("library.publications");
  const tToolbar = useTranslations("library.categories.toolbar");
  const slug = category?.slug ?? "publications";
  const documentsCount = category?.counts?.documents ?? null;

  const typeOptions = useMemo(
    () => [
      { value: "", label: tToolbar("typeOptions.all") },
      { value: "book", label: tToolbar("typeOptions.book") },
      { value: "article", label: tToolbar("typeOptions.article") },
      { value: "thesis", label: tToolbar("typeOptions.thesis") },
      { value: "report", label: tToolbar("typeOptions.report") },
    ],
    [tToolbar],
  );

  return (
    <section dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <CategoryHeader
        title={t("title")}
        description={t("subtitle")}
        meta={
          documentsCount !== null ? (
            <span>{tToolbar("resultsSummary", { count: documentsCount })}</span>
          ) : null
        }
      />

      <CategoryDocumentsExplorer
        categorySlug={slug}
        includeDescendants={false}
        defaultFilters={{
          typeFilter: {
            options: typeOptions,
            multiple: false,
            value: "",
          },
        }}
        textAlign={textAlign}
      />
    </section>
  );
};

export default PublicationsClient;

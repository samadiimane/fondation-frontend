"use client";

import {memo, useMemo} from "react";
import {Link} from "@/i18n/navigation";
import {useLocale, useTranslations} from "next-intl";
import {getFirstAuthor} from "@/lib/authors";
import {getDocumentTypeLabel} from "@/lib/documentTypes";

const formatTypeClass = (type = "") => type.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const DocumentCard = ({document, viewMode, content}) => {
  const locale = useLocale();
  const tTypes = useTranslations("shared.documentTypes");
  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale || undefined);
    } catch {
      return new Intl.NumberFormat("en");
    }
  }, [locale]);

  const formatIcon = (() => {
    const format = document.format ?? document.type;
    switch ((format || "").toLowerCase()) {
      case "pdf":
        return "fa-solid fa-file-pdf";
      case "digital archive":
        return "fa-solid fa-database";
      case "epub":
        return "fa-solid fa-book";
      default:
        return "fa-solid fa-file-lines";
    }
  })();

  const firstAuthor = getFirstAuthor(document.authors, locale);
  const fallbackAuthor =
    !firstAuthor && document.author
      ? {name: document.author, affiliation: document.affiliation ?? null}
      : null;
  const authorLine = firstAuthor ?? fallbackAuthor;

  const typeClass = formatTypeClass(document.type);
  const typeLabel = document.type ? getDocumentTypeLabel(document.type, tTypes) : "";
  const abstract = document.abstract || "";
  const trimmedAbstract = abstract.length > 320 ? `${abstract.slice(0, 317)}...` : abstract;
  const categoryName = document.primary_category?.name ?? document.primaryCategory?.name ?? "";
  const language = (document.language || document.lang || "").toString();
  const pagesValue = Number(document.pages);
  const formattedPages = Number.isFinite(pagesValue) ? numberFormatter.format(pagesValue) : document.pages;
  const yearValue = Number(document.year);
  const formattedYear = Number.isFinite(yearValue) ? numberFormatter.format(yearValue) : document.year;

  return (
    <article className={`document-card ${viewMode === "compact" ? "document-card--compact" : ""}`}>
      <header className="document-card__header">
        <div className="document-card__heading">
          <h3 className="document-card__title">{document.title}</h3>
          {authorLine && (
            <p className="document-card__author">
              <span>{authorLine.name}</span>
              {authorLine.affiliation && (
                <span className="document-card__author-affiliation"> - {authorLine.affiliation}</span>
              )}
            </p>
          )}
        </div>
        <div className="document-card__badges" aria-label={content.card.metaAria}>
          <div className="document-card__meta">
            {language && (
              <span className="document-card__language">
                <i className="fa-regular fa-message-lines" aria-hidden="true"></i>
                {language.toUpperCase()}
              </span>
            )}
            {document.pages && (
              <span className="document-card__pages">
                {formattedPages} {content.card.pagesSuffix}
              </span>
            )}
          </div>
          {document.type && (
            <span className={`document-card__badge ${typeClass}`}>
              <i className={formatIcon} aria-hidden="true"></i>
              {typeLabel || document.type}
            </span>
          )}
          {categoryName && (
            <span className="document-card__badge">
              <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
              {categoryName}
            </span>
          )}
          {document.year && (
            <span className="document-card__badge">
              <i className="fa-regular fa-calendar" aria-hidden="true"></i>
              {formattedYear}
            </span>
          )}
        </div>
      </header>

      {trimmedAbstract && <p className="document-card__abstract">{trimmedAbstract}</p>}

      <footer className="document-card__actions">
        <Link href={`/library/${document.id}`} className="document-card__action document-card__action--link">
          <i className="fa-solid fa-arrow-right flip-x" aria-hidden="true"></i>
          {content.card.details}
        </Link>
      </footer>
    </article>
  );
};

export default memo(DocumentCard);

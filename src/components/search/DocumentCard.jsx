"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";

const formatTypeClass = (type = "") => type.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const DocumentCard = ({ document, viewMode }) => {
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

  const typeClass = formatTypeClass(document.type);
  const abstract = document.abstract || "";
  const trimmedAbstract = abstract.length > 320 ? `${abstract.slice(0, 317)}...` : abstract;
  const categoryName = document.primary_category?.name ?? document.primaryCategory?.name ?? "";
  const language = (document.language || document.lang || "").toString();

  return (
    <article className={`document-card ${viewMode === "compact" ? "document-card--compact" : ""}`}>
      <header className="document-card__header">
        <h3 className="document-card__title">{document.title}</h3>
        <div className="document-card__badges" aria-label="Document metadata">
          <div className="document-card__meta">
            {document.authors && <span className="document-card__author">{document.authors}</span>}
            {!document.authors && document.author && <span className="document-card__author">{document.author}</span>}
            {language && (
              <span className="document-card__language">
                <i className="fa-regular fa-message-lines" aria-hidden="true"></i>
                {language.toUpperCase()}
              </span>
            )}
            {document.pages && (
              <span className="document-card__pages">
                {document.pages} pages
              </span>
            )}
          </div>
          {document.type && (
            <span className={`document-card__badge ${typeClass}`}>
              <i className={formatIcon} aria-hidden="true"></i>
              {document.type}
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
              {document.year}
            </span>
          )}
        </div>
      </header>



      {trimmedAbstract && <p className="document-card__abstract">{trimmedAbstract}</p>}

      <footer className="document-card__actions">
        <button type="button" className="document-card__action" disabled>
          <i className="fa-solid fa-eye" aria-hidden="true"></i>
          Preview
        </button>
        <button type="button" className="document-card__action" disabled>
          <i className="fa-solid fa-download" aria-hidden="true"></i>
          Download
        </button>
        <Link href={`/library/${document.id}`} className="document-card__action document-card__action--link">
          <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          Details
        </Link>
      </footer>
    </article>
  );
};

export default memo(DocumentCard);


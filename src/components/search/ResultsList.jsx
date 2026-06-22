"use client";

import {memo} from "react";
import Skeleton from "@/components/Skeleton";
import DocumentCard from "./DocumentCard";

const ResultsList = ({items, loading, error, hasLoadedOnce, viewMode, content, textAlign}) => {
  const hasError = Boolean(error);

  return (
    <div className={`results-grid ${viewMode}`}>
      {loading && !hasLoadedOnce &&
        Array.from({length: 3}).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="document-card skeleton-card"
            style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}
          >
            <Skeleton style={{width: "60%", height: "1.1rem"}} />
            <Skeleton style={{width: "40%", height: "0.9rem"}} />
            <Skeleton style={{width: "100%", height: "0.9rem"}} />
            <Skeleton style={{width: "80%", height: "0.9rem"}} />
          </div>
        ))}

      {!hasError &&
        items.map((document) => (
          <DocumentCard key={document.id ?? document.title} document={document} viewMode={viewMode} content={content} />
        ))}

      {!loading && hasLoadedOnce && items.length === 0 && !hasError && (
        <div className="document-card document-card--empty">
          <div className="document-card__empty">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <h4 className={textAlign}>{content.list.emptyTitle}</h4>
            <p className={textAlign}>{content.list.emptySubtitle}</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="document-card document-card--error" role="status" aria-live="polite">
          <div className="document-card__empty">
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            <h4 className={textAlign}>{content.unavailable.title}</h4>
            <p className={textAlign}>{content.unavailable.message}</p>
            {content.unavailable.retry ? (
              <p className={textAlign}>{content.unavailable.retry}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ResultsList);

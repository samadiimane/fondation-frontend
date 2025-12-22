"use client";

import {memo} from "react";
import Skeleton from "@/components/Skeleton";
import DocumentCard from "./DocumentCard";

const ResultsList = ({items, loading, error, hasLoadedOnce, viewMode, content, textAlign}) => (
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

    {items.map((document) => (
      <DocumentCard key={document.id ?? document.title} document={document} viewMode={viewMode} content={content} />
    ))}

    {!loading && hasLoadedOnce && items.length === 0 && !error && (
      <div className="document-card document-card--empty">
        <div className="document-card__empty">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <h4 className={textAlign}>{content.list.emptyTitle}</h4>
          <p className={textAlign}>{content.list.emptySubtitle}</p>
        </div>
      </div>
    )}

    {error && (
      <div className="document-card document-card--error" role="alert">
        <div className="document-card__empty">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <h4 className={textAlign}>{content.list.errorTitle}</h4>
          <p>{error}</p>
        </div>
      </div>
    )}
  </div>
);

export default memo(ResultsList);

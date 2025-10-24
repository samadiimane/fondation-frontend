"use client";

import { useState } from "react";
import { getDocumentFileLink } from "@/lib/api";

const DocumentDownloadButton = ({ documentId, strings, tone = "primary" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await getDocumentFileLink(documentId);
      const url = payload?.url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setError(strings.error);
      }
    } catch (err) {
      setError(strings.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-download">
      <button
        type="button"
        className={`document-download__button document-download__button--${tone}`}
        onClick={handleClick}
        disabled={loading}
      >
        <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
        <span>{loading ? strings.loading : strings.cta}</span>
      </button>
      {error && <p className="document-download__error">{error}</p>}
    </div>
  );
};

export default DocumentDownloadButton;

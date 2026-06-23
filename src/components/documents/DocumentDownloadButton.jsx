"use client";

import { useState } from "react";
import { getDocumentFileLink } from "@/lib/api";

const DocumentDownloadButton = ({ documentId, strings, tone = "primary" }) => {
  const [status, setStatus] = useState("idle");

  const handleClick = async () => {
    setStatus("loading");

    try {
      const payload = await getDocumentFileLink(documentId);
      const url = payload?.url;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "error") {
    return (
      <div className="document-download document-download--unavailable" role="alert">
        <p>{strings.error}</p>
      </div>
    );
  }

  return (
    <div className="document-download">
      <button
        type="button"
        className={`document-download__button document-download__button--${tone}`}
        onClick={handleClick}
        disabled={status === "loading"}
      >
        <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
        <span>{status === "loading" ? strings.loading : strings.cta}</span>
      </button>
    </div>
  );
};

export default DocumentDownloadButton;

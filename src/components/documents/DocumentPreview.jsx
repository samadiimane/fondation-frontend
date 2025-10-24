"use client";

import { useEffect, useState } from "react";
import { getDocumentFileLink } from "@/lib/api";

const DocumentPreview = ({ documentId, strings }) => {
  const [status, setStatus] = useState("idle");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const payload = await getDocumentFileLink(documentId);
        const url = payload?.url ?? null;
        if (!mounted) return;
        if (url) {
          setPreviewUrl(url);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        if (mounted) {
          setStatus("error");
        }
      }
    }, 400);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [documentId]);

  if (status === "loading") {
    return (
      <div className="document-preview document-preview--loading" role="status" aria-live="polite">
        <p>{strings.loading}</p>
      </div>
    );
  }

  if (status !== "ready" || !previewUrl) {
    return (
      <div className="document-preview document-preview--fallback">
        <i className="fa-regular fa-file-pdf" aria-hidden="true" />
        <p>{strings.unavailable}</p>
        <p className="document-preview__hint">{strings.hint}</p>
      </div>
    );
  }

  return (
    <div className="document-preview document-preview--ready">
      <object
        data={previewUrl}
        type="application/pdf"
        aria-label={strings.ariaLabel}
        className="document-preview__embed"
      >
        <iframe src={previewUrl} title={strings.ariaLabel} className="document-preview__embed" />
      </object>
    </div>
  );
};

export default DocumentPreview;

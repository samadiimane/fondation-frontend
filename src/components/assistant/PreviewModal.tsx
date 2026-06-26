"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { NormalizedSource } from "@/lib/ai/assistantClient";

type PreviewModalProps = {
  citation: NormalizedSource | null;
  onClose: () => void;
};

const PreviewModal = ({ citation, onClose }: PreviewModalProps) => {
  const t = useTranslations("assistant");

  useEffect(() => {
    if (!citation) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [citation, onClose]);

  if (!citation || !citation.snippet) {
    return null;
  }

  const title = citation.title || citation.documentId || t("sources.untitled");

  return (
    <div className="assistant-modal" role="dialog" aria-modal="true" aria-labelledby="assistant-preview-title">
      <div className="assistant-modal__card">
        <div className="assistant-modal__header">
          <div>
            <h2 id="assistant-preview-title">{title}</h2>
            {citation.page ? <p>{`${t("sources.page")} ${citation.page}`}</p> : null}
          </div>
          <button type="button" className="assistant-modal__close" onClick={onClose} aria-label={t("actions.close")}>
            &times;
          </button>
        </div>
        <p className="assistant-modal__snippet">{citation.snippet}</p>
      </div>
    </div>
  );
};

export default PreviewModal;

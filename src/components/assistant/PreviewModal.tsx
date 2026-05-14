"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Citation } from "@/lib/ai/mockClient";

type PreviewModalProps = {
  citation: Citation | null;
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

  if (!citation) {
    return null;
  }

  return (
    <div className="assistant-modal" role="dialog" aria-modal="true" aria-label={t("citation.preview")}>
      <div className="assistant-modal__card">
        <div className="assistant-modal__header">
          <div>
            <h3>{citation.title}</h3>
            {citation.page ? <p>p.{citation.page}</p> : null}
          </div>
          <button type="button" className="assistant-modal__close" onClick={onClose} aria-label={t("actions.close")}>
            &times;
          </button>
        </div>
        <p>{citation.snippet}</p>
      </div>
    </div>
  );
};

export default PreviewModal;

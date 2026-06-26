"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NormalizedSource } from "@/lib/ai/assistantClient";

type SourcesPanelProps = {
  sources: NormalizedSource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (citation: NormalizedSource) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
};

const SourcesPanel = forwardRef<HTMLDivElement, SourcesPanelProps>(
  ({ sources, selectedId, onSelect, onPreview, isOpen, onToggle }, ref) => {
    const t = useTranslations("assistant");
    const itemRefs = useRef(new Map<string, HTMLElement>());

    useEffect(() => {
      if (!selectedId) return;
      const node = itemRefs.current.get(selectedId);
      node?.scrollIntoView({ block: "nearest" });
    }, [selectedId, sources, isOpen]);

    const hasSources = sources.length > 0;

    return (
      <>
        <button
          type="button"
          className="assistant-sources__toggle"
          onClick={() => onToggle(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="assistant-sources-panel"
        >
          {t("sources.title")}
        </button>

        {isOpen && <div className="assistant-sources__backdrop" onClick={() => onToggle(false)} />}

        <aside
          className={`assistant-sources ${isOpen ? "is-open" : ""}`}
          ref={ref}
          tabIndex={-1}
          id="assistant-sources-panel"
          aria-label={t("sources.title")}
        >
          <h2 className="assistant-sources__title">{t("sources.title")}</h2>
          {!hasSources && <p className="assistant-sources__empty">{t("sources.empty")}</p>}

          {hasSources &&
            sources.map((source) => {
              const isActive = source.id === selectedId;
              const title = source.title || source.documentId || t("sources.untitled");
              const canPreview = Boolean(source.snippet);

              return (
                <article
                  key={source.id}
                  ref={(node) => {
                    if (!node) {
                      itemRefs.current.delete(source.id);
                      return;
                    }
                    itemRefs.current.set(source.id, node);
                  }}
                  className={`assistant-source ${isActive ? "is-active" : ""}`}
                >
                  <div className="assistant-source__title">
                    {source.documentId ? (
                      <Link href={`/library/${source.documentId}`}>{title}</Link>
                    ) : (
                      <span>{title}</span>
                    )}
                    {source.page ? ` · ${t("sources.page")} ${source.page}` : ""}
                  </div>

                  {source.snippet ? <p className="assistant-source__snippet">{source.snippet}</p> : null}

                  <div className="assistant-source__badges">
                    {source.year && <span className="assistant-badge">{source.year}</span>}
                    {source.language && <span className="assistant-badge">{source.language.toUpperCase()}</span>}
                    {source.type && <span className="assistant-badge">{source.type}</span>}
                    {source.journal && <span className="assistant-badge">{source.journal}</span>}
                    {source.issue && <span className="assistant-badge">{source.issue}</span>}
                    {canPreview ? (
                      <button
                        type="button"
                        className="assistant-chip"
                        onClick={() => {
                          onSelect(source.id);
                          onPreview(source);
                        }}
                      >
                        {t("citation.preview")}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
        </aside>
      </>
    );
  },
);

SourcesPanel.displayName = "SourcesPanel";

export default SourcesPanel;

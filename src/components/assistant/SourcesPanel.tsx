"use client";

import { forwardRef, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Citation } from "@/lib/ai/mockClient";

type SourcesPanelProps = {
  sources: Citation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (citation: Citation) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
};

const SourcesPanel = forwardRef<HTMLDivElement, SourcesPanelProps>(
  ({ sources, selectedId, onSelect, onPreview, isOpen, onToggle }, ref) => {
    const t = useTranslations("assistant");
    const itemRefs = useRef(new Map<string, HTMLDivElement>());

    useEffect(() => {
      if (!selectedId) return;
      const node = itemRefs.current.get(selectedId);
      if (node) {
        node.scrollIntoView({ block: "nearest" });
      }
    }, [selectedId, sources, isOpen]);

    const hasSources = sources.length > 0;

    const toggleLabel = t("sources.title");

    return (
      <>
        <button
          type="button"
          className="assistant-sources__toggle"
          onClick={() => onToggle(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="assistant-sources-panel"
        >
          {toggleLabel}
        </button>

        {isOpen && <div className="assistant-sources__backdrop" onClick={() => onToggle(false)} />}

        <aside
          className={`assistant-sources ${isOpen ? "is-open" : ""}`}
          ref={ref}
          tabIndex={-1}
          id="assistant-sources-panel"
          aria-label={t("sources.title")}
        >
          <h5 className="assistant-sources__title">{t("sources.title")}</h5>
          {!hasSources && <p>{t("sources.empty")}</p>}

          {hasSources &&
            sources.map((source) => {
              const isActive = source.id === selectedId;
              return (
                <div
                  key={source.id}
                  ref={(node) => {
                    if (!node) {
                      itemRefs.current.delete(source.id);
                      return;
                    }
                    itemRefs.current.set(source.id, node);
                  }}
                  className={`assistant-source ${isActive ? "is-active" : ""}`}
                  onClick={() => {
                    onSelect(source.id);
                    onPreview(source);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(source.id);
                      onPreview(source);
                    }
                  }}
                >
                  <div className="assistant-source__title">
                    <Link href={`/documents/${source.docId}`} onClick={(event) => event.stopPropagation()}>
                      {source.title}
                    </Link>
                    {source.page ? ` · p.${source.page}` : ""}
                  </div>
                  <p className="assistant-source__snippet">{source.snippet}</p>
                  <div className="assistant-source__badges">
                    {source.year && <span className="assistant-badge">{source.year}</span>}
                    {source.lang && <span className="assistant-badge">{source.lang.toUpperCase()}</span>}
                    {source.type && <span className="assistant-badge">{source.type}</span>}
                    <button
                      type="button"
                      className="assistant-chip"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(source.id);
                        onPreview(source);
                      }}
                    >
                      {t("citation.preview")}
                    </button>
                  </div>
                </div>
              );
            })}
        </aside>
      </>
    );
  },
);

SourcesPanel.displayName = "SourcesPanel";

export default SourcesPanel;

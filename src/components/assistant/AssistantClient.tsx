"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ChatMessages from "./ChatMessages";
import SourcesPanel from "./SourcesPanel";
import PreviewModal from "./PreviewModal";
import { isRtlLocale } from "@/i18n/config";
import { mockClient, type AssistantFilters, type AssistantMessage, type Citation } from "@/lib/ai/mockClient";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const DEFAULT_FILTERS: AssistantFilters = {
  scope: "all",
  languages: [],
  yearFrom: "",
  yearTo: "",
  type: undefined,
  strictCitations: false,
};

const AssistantClient = () => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("assistant");

  const [filters] = useState<AssistantFilters>(DEFAULT_FILTERS);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [previewCitation, setPreviewCitation] = useState<Citation | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [liveText, setLiveText] = useState("");
  const lastPromptRef = useRef<string>("");
  const layoutRef = useRef<HTMLDivElement | null>(null);

  const headerTitle = t("header.title");
  const titleSplitIndex = headerTitle.indexOf(" ");
  const titleLead = titleSplitIndex > 0 ? headerTitle.slice(0, titleSplitIndex) : headerTitle;
  const titleRest = titleSplitIndex > 0 ? headerTitle.slice(titleSplitIndex + 1) : "";

  useEffect(() => {
    let active = true;
    mockClient.suggestions(locale).then((items) => {
      if (!active) return;
      setSuggestions(items);
    });
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    const updateLayoutHeight = () => {
      if (!layoutRef.current) return;
      const rect = layoutRef.current.getBoundingClientRect();
      const available = Math.max(320, window.innerHeight - rect.top - 16);
      layoutRef.current.style.setProperty("--assistant-layout-height", `${available}px`);
    };

    updateLayoutHeight();
    window.addEventListener("resize", updateLayoutHeight);
    return () => window.removeEventListener("resize", updateLayoutHeight);
  }, [error]);

  const sources = useMemo(() => {
    const seen = new Set<string>();
    const ordered: Citation[] = [];
    messages.forEach((message) => {
      (message.citations || []).forEach((citation) => {
        if (!seen.has(citation.id)) {
          seen.add(citation.id);
          ordered.push(citation);
        }
      });
    });
    return ordered;
  }, [messages]);

  const handleExampleClick = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleCopyMessage = useCallback(async (message: AssistantMessage) => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 1500);
    } catch {
      setCopiedMessageId(message.id);
      setTimeout(() => setCopiedMessageId(null), 1500);
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmedInput = input.trim();
    const prompt = trimmedInput || (error ? lastPromptRef.current : "");
    if (!prompt || isStreaming) return;

    const userMessage: AssistantMessage = {
      id: createId(),
      role: "user",
      content: prompt,
    };
    const assistantId = createId();
    const assistantMessage: AssistantMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const contextMessages = [...messages, userMessage];
    setMessages([...contextMessages, assistantMessage]);
    setInput("");
    setIsStreaming(true);
    setError(null);
    setLiveText("");
    setSelectedCitationId(null);
    lastPromptRef.current = prompt;

    let accumulated = "";
    try {
      for await (const chunk of mockClient.chat({ messages: contextMessages, filters, locale })) {
        if (chunk.type === "delta") {
          accumulated = accumulated ? `${accumulated} ${chunk.text}` : chunk.text;
          setLiveText(accumulated);
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId ? { ...message, content: accumulated } : message,
            ),
          );
        }

        if (chunk.type === "final") {
          accumulated = chunk.text;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: accumulated, citations: chunk.citations, bibtex: chunk.bibtex }
                : message,
            ),
          );
          setLiveText(accumulated);
        }
      }
    } catch (err) {
      console.error(err);
      setError(t("error.title"));
    } finally {
      setIsStreaming(false);
    }
  }, [filters, input, isStreaming, locale, messages, t, error]);

  return (
    <main className="assistant-page" dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className="container">
        <div className="assistant-hero">
            <h3 className="assistant-hero__title title-animation_inner">
              <span>{titleLead}</span>
              {titleRest ? ` ${titleRest}` : ""}
            </h3>
        </div>

        {error && (
          <div role="alert" className="assistant-message">
            <p>{error}</p>
            <button type="button" className="assistant-chip" onClick={handleSend}>
              {t("error.retry")}
            </button>
          </div>
        )}

        <div className="assistant-layout" ref={layoutRef}>
          <ChatMessages
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isStreaming={isStreaming}
            suggestions={suggestions}
            onExampleClick={handleExampleClick}
            onCopyMessage={handleCopyMessage}
            copiedMessageId={copiedMessageId}
            liveText={liveText}
          />
          <SourcesPanel
            sources={sources}
            selectedId={selectedCitationId}
            onSelect={setSelectedCitationId}
            onPreview={setPreviewCitation}
            isOpen={sourcesOpen}
            onToggle={setSourcesOpen}
          />
        </div>
      </div>

      <PreviewModal citation={previewCitation} onClose={() => setPreviewCitation(null)} />
    </main>
  );
};

export default AssistantClient;

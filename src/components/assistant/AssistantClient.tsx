"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ChatMessages from "./ChatMessages";
import SourcesPanel from "./SourcesPanel";
import PreviewModal from "./PreviewModal";
import { isRtlLocale } from "@/i18n/config";
import {
  askResearchAssistant,
  localeToAiLang,
  type AssistantMessage,
  type NormalizedSource,
} from "@/lib/ai/assistantClient";

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const safeArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const AssistantClient = () => {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const t = useTranslations("assistant");

  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [previewCitation, setPreviewCitation] = useState<NormalizedSource | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [liveText, setLiveText] = useState("");
  const lastPromptRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const updateWorkspaceHeight = () => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const available = Math.max(520, window.innerHeight - rect.top - 24);
      workspaceRef.current.style.setProperty("--assistant-workspace-height", `${available}px`);
    };

    updateWorkspaceHeight();
    window.addEventListener("resize", updateWorkspaceHeight);
    window.visualViewport?.addEventListener("resize", updateWorkspaceHeight);
    return () => {
      window.removeEventListener("resize", updateWorkspaceHeight);
      window.visualViewport?.removeEventListener("resize", updateWorkspaceHeight);
    };
  }, []);

  const suggestions = useMemo(() => safeArray<string>(t.raw("empty.examples")), [t]);

  const sources = useMemo(() => {
    const seen = new Set<string>();
    const ordered: NormalizedSource[] = [];
    messages.forEach((message) => {
      (message.sources || []).forEach((citation) => {
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
    if (!prompt || isLoading) return;

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
    setIsLoading(true);
    setError(null);
    setLiveText(t("chat.loading"));
    setSelectedCitationId(null);
    lastPromptRef.current = prompt;

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const result = await askResearchAssistant({
        question: prompt,
        lang: localeToAiLang(locale),
        locale,
        signal: controller.signal,
      });

      if (!mountedRef.current) {
        return;
      }

      const answer = result.answer || t("error.noAnswer");
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId ? { ...message, content: answer, sources: result.sources } : message,
        ),
      );
      setLiveText(answer);
    } catch (err) {
      if (!mountedRef.current) {
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("Research assistant request failed.");
      }

      const unavailable = t("error.unavailable");
      setError(unavailable);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId ? { ...message, content: unavailable, sources: [] } : message,
        ),
      );
      setLiveText(unavailable);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [input, isLoading, locale, messages, t, error]);

  return (
    <main className="assistant-page" dir={isRtl ? "rtl" : "ltr"} lang={locale}>
      <div className="assistant-page__container" ref={workspaceRef}>
        <div className="assistant-hero">
          <h1 className="assistant-hero__title title-animation_inner">
            <span className="assistant-hero__heading">{t("header.title")}</span>
            <span className="assistant-hero__separator" aria-hidden="true">:</span>
            <span className="assistant-hero__description">{t("header.subtitle")}</span>
          </h1>
        </div>

        {error && (
          <div role="alert" className="assistant-alert">
            <p>{error}</p>
            <button type="button" className="assistant-chip" onClick={handleSend}>
              {t("error.retry")}
            </button>
          </div>
        )}

        <div className="assistant-layout">
          <ChatMessages
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
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

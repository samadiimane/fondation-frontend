"use client";

import { useCallback, useEffect, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { AssistantMessage } from "@/lib/ai/assistantClient";

type ChatMessagesProps = {
  messages: AssistantMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  suggestions: string[];
  onExampleClick: (value: string) => void;
  onCopyMessage: (message: AssistantMessage) => void;
  copiedMessageId: string | null;
  liveText: string;
};

const ChatMessages = ({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  suggestions,
  onExampleClick,
  onCopyMessage,
  copiedMessageId,
  liveText,
}: ChatMessagesProps) => {
  const t = useTranslations("assistant");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSend();
    },
    [onSend],
  );

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <section className="assistant-chat">
      <div className="sr-only" aria-live="polite">
        {liveText}
      </div>

      {messages.length === 0 ? (
        <div className="assistant-empty">
          <p className="assistant-hero__subtitle">{t("empty.examplesTitle")}</p>
          <div className="assistant-examples">
            {suggestions.map((example) => (
              <button
                key={example}
                type="button"
                className="assistant-example"
                onClick={() => onExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="assistant-messages">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const showLoading = isAssistant && !message.content && isLoading;
            return (
              <article
                key={message.id}
                className={`assistant-message ${isAssistant ? "assistant-message--assistant" : "assistant-message--user"}`}
              >
                <p className="assistant-message__content">
                  {showLoading ? t("chat.loading") : message.content}
                </p>

                {isAssistant && message.content && (
                  <button
                    type="button"
                    className="assistant-message__copy"
                    onClick={() => onCopyMessage(message)}
                    aria-label={copiedMessageId === message.id ? t("actions.copied") : t("actions.copy")}
                  >
                    <i
                      className={copiedMessageId === message.id ? "fa-solid fa-check" : "fa-regular fa-copy"}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </article>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form className="assistant-input" onSubmit={handleSubmit}>
        <label className="assistant-input__field">
          <span className="sr-only">{t("chat.label")}</span>
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={t("chat.placeholder")}
            disabled={isLoading}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                onSend();
              }
            }}
          />
        </label>
        <button type="submit" disabled={!input.trim() || isLoading}>
          {t("chat.send")}
        </button>
      </form>
    </section>
  );
};

export default ChatMessages;

export type AssistantRole = "user" | "assistant";

export type NormalizedSource = {
  id: string;
  title?: string;
  snippet?: string;
  documentId?: string;
  journal?: string;
  issue?: string;
  year?: string;
  page?: string;
  language?: string;
  type?: string;
  score?: string;
};

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  sources?: NormalizedSource[];
};

export type AssistantFilters = {
  scope: "all" | "section" | "category" | "journal" | "collection";
  languages: string[];
  yearFrom?: string;
  yearTo?: string;
  type?: "article" | "manuscript" | "issue" | "collection";
  strictCitations?: boolean;
};

export type AssistantResponse = {
  answer: string;
  sources: NormalizedSource[];
};

export class AssistantApiError extends Error {
  code: "missing_api_base" | "request_failed" | "malformed_response" | "aborted";

  constructor(code: AssistantApiError["code"]) {
    super(code);
    this.name = "AssistantApiError";
    this.code = code;
  }
}

const SOURCE_KEYS = ["sources", "citations", "documents", "context"] as const;
const ANSWER_KEYS = ["answer", "response", "message", "text"] as const;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const localeToAiLang = (locale: string) => {
  const normalized = locale?.toLowerCase();
  const map: Record<string, "AR" | "FR" | "EN" | "ES"> = {
    ar: "AR",
    fr: "FR",
    en: "EN",
    es: "ES",
  };

  return map[normalized] ?? "EN";
};

const getPublicApiBaseUrl = () => trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL || "");

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
};

const pickLocalizedString = (value: unknown, locale: string) => {
  if (typeof value === "string") {
    return value.trim() || undefined;
  }

  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  return pickString(
    record[locale],
    record[locale?.toLowerCase()],
    record.ar,
    record.fr,
    record.en,
    record.es,
  );
};

const pickAnswer = (payload: unknown, locale: string): string => {
  const record = asRecord(payload);
  if (!record) {
    return "";
  }

  for (const key of ANSWER_KEYS) {
    const direct = pickLocalizedString(record[key], locale);
    if (direct) {
      return direct;
    }
  }

  const nested = asRecord(record.data) || asRecord(record.result);
  if (!nested) {
    return "";
  }

  for (const key of ANSWER_KEYS) {
    const value = pickLocalizedString(nested[key], locale);
    if (value) {
      return value;
    }
  }

  return "";
};

const pickSourcesPayload = (payload: unknown): unknown[] => {
  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  for (const key of SOURCE_KEYS) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }

    const nested = asRecord(value);
    if (nested && Array.isArray(nested.items)) {
      return nested.items;
    }
    if (nested && Array.isArray(nested.sources)) {
      return nested.sources;
    }
  }

  const nested = asRecord(record.data) || asRecord(record.result);
  return nested ? pickSourcesPayload(nested) : [];
};

const normalizeSource = (source: unknown, index: number, locale: string): NormalizedSource | null => {
  if (typeof source === "string") {
    const snippet = source.trim();
    return snippet ? { id: `source-${index + 1}`, snippet } : null;
  }

  const record = asRecord(source);
  if (!record) {
    return null;
  }

  const documentId = pickString(
    record.documentId,
    record.document_id,
    record.docId,
    record.doc_id,
    record.document,
  );
  const title = pickLocalizedString(record.title, locale) || pickString(record.name, record.label);
  const snippet = pickLocalizedString(record.snippet, locale) ||
    pickLocalizedString(record.excerpt, locale) ||
    pickLocalizedString(record.quote, locale) ||
    pickLocalizedString(record.passage, locale) ||
    pickLocalizedString(record.content, locale) ||
    pickLocalizedString(record.text, locale);

  const normalized: NormalizedSource = {
    id: pickString(record.id, record.source_id, record.sourceId, documentId, `source-${index + 1}`) || `source-${index + 1}`,
    title,
    snippet,
    documentId,
    journal: pickString(record.journal, record.journal_title, record.journalTitle),
    issue: pickString(record.issue, record.issue_number, record.issueNumber),
    year: pickString(record.year, record.publication_year, record.publicationYear),
    page: pickString(record.page, record.pages, record.page_number, record.pageNumber),
    language: pickString(record.language, record.lang),
    type: pickString(record.type, record.document_type, record.documentType),
    score: pickString(record.score),
  };

  if (!normalized.title && !normalized.snippet && !normalized.documentId) {
    return null;
  }

  return normalized;
};

export const normalizeAssistantResponse = (payload: unknown, locale: string): AssistantResponse => ({
  answer: pickAnswer(payload, locale),
  sources: pickSourcesPayload(payload)
    .map((source, index) => normalizeSource(source, index, locale))
    .filter((source): source is NormalizedSource => Boolean(source)),
});

export const askResearchAssistant = async ({
  question,
  lang,
  locale,
  signal,
}: {
  question: string;
  lang: string;
  locale: string;
  signal?: AbortSignal;
}): Promise<AssistantResponse> => {
  const apiBase = getPublicApiBaseUrl();
  if (!apiBase) {
    throw new AssistantApiError("missing_api_base");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30_000);

  const abort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", abort, { once: true });
    }
  }

  try {
    const response = await fetch(`${apiBase}/v1/ai/chat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        lang,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AssistantApiError("request_failed");
    }

    const payload = await response.json().catch(() => {
      throw new AssistantApiError("malformed_response");
    });

    return normalizeAssistantResponse(payload, locale);
  } catch (error) {
    if (controller.signal.aborted || signal?.aborted) {
      throw new AssistantApiError("aborted");
    }
    if (error instanceof AssistantApiError) {
      throw error;
    }
    throw new AssistantApiError("request_failed");
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
};

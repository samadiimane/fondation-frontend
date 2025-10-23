const rawBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASEPATH ||
  "";

const API_BASE = rawBase.replace(/\/+$/, "");
const CACHE_TTL = 30_000;

const responseCache = new Map();
let warnedMissingBase = false;

const ensureBaseUrl = () => {
  if (!API_BASE) {
    if (!warnedMissingBase && typeof window !== "undefined") {
      console.error(
        "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local (e.g. http://127.0.0.1:8000)."
      );
      warnedMissingBase = true;
    }
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }
  return API_BASE;
};

export const apiCache = responseCache;

export const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === "") return;
        searchParams.append(key, String(item));
      });
      return;
    }
    if (value === "") return;
    searchParams.append(key, String(value));
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const readCache = (key) => {
  const cached = responseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return cached.data;
};

const writeCache = (key, data) => {
  responseCache.set(key, {
    timestamp: Date.now(),
    data: typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data)),
  });
};

const shouldSkipCache = (signal, noCache) => noCache || (signal && signal.aborted);

export const apiFetch = async (path, { params, signal, noCache } = {}) => {
  const base = ensureBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const query = buildQuery(params);
  const url = `${base}${normalizedPath}${query}`;

  if (!shouldSkipCache(signal, noCache)) {
    const cached = readCache(url);
    if (cached) {
      return typeof structuredClone === "function" ? structuredClone(cached) : JSON.parse(JSON.stringify(cached));
    }
  }

  const controller = new AbortController();
  const compositeSignal = controller.signal;
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  const fetchOnce = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: compositeSignal,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = new Error(`API error ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  };

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const data = await fetchOnce();
      if (!shouldSkipCache(signal, noCache) && !compositeSignal.aborted) {
        writeCache(url, data);
      }
      return data;
    } catch (error) {
      if (compositeSignal.aborted || error.name === "AbortError") {
        throw error;
      }
      const status = error.status;
      if (status && status >= 400 && status < 500) {
        throw error;
      }
      if (attempt >= 1) {
        throw error;
      }
      attempt += 1;
    }
  }
};

const parseKeywords = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
};

const toNumber = (value) => {
  if (value === undefined || value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeDocument = (doc = {}) => ({
  id: doc.id,
  title: doc.title ?? "Untitled document",
  author: doc.authors ?? doc.author ?? "",
  authors: doc.authors ?? null,
  year: doc.year ?? null,
  type: doc.type ?? "",
  format: doc.format ?? doc.type ?? "",
  abstract: doc.abstract ?? "",
  language: doc.lang ?? doc.language ?? "",
  pages: doc.pages ?? null,
  collectionId: doc.collection_id ?? null,
  fullTextAvailable: Boolean(doc.file_key),
  openAccess: doc.open_access ?? doc.openAccess ?? null,
  citations: doc.citations ?? null,
  downloadCount: doc.download_count ?? doc.downloadCount ?? null,
  bookmarkCount: doc.bookmark_count ?? doc.bookmarkCount ?? null,
  keywords: parseKeywords(doc.keywords),
  fileKey: doc.file_key ?? null,
  primaryCategory: doc.primary_category ?? null,
  identifiers: {
    doi: doc.doi ?? null,
    isbn: doc.isbn ?? null,
    issn: doc.issn ?? null,
  },
  doi: doc.doi ?? null,
  isbn: doc.isbn ?? null,
  issn: doc.issn ?? null,
  createdAt: doc.created_at ?? null,
  raw: doc,
});

const resolvePaginatedDocuments = (payload = {}) => {
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.documents)
        ? payload.documents
        : [];

  const page = Number(payload.page) || 1;
  const pageSize = Number(payload.page_size ?? payload.pageSize) || items.length || 20;
  const hasNext =
    typeof payload.has_next === "boolean"
      ? payload.has_next
      : payload.next !== undefined
        ? Boolean(payload.next)
        : items.length === pageSize;

  return {
    documents: items.map(normalizeDocument),
    raw: payload,
    page,
    pageSize,
    hasNext,
  };
};

export const getDocuments = async ({ q, page = 1, pageSize = 20, signal } = {}) => {
  const payload = await apiFetch("/v1/documents", {
    params: {
      q,
      page,
      page_size: pageSize,
    },
    signal,
  });
  return resolvePaginatedDocuments(payload);
};

export const getDocument = async (id, { signal } = {}) => {
  if (!id) {
    throw new Error("Document id is required");
  }
  const payload = await apiFetch(`/v1/documents/${id}`, { signal });
  return normalizeDocument(payload);
};

export const getCollections = async ({ signal } = {}) => {
  const payload = await apiFetch("/v1/collections", { signal });
  const collections = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name ?? "Untitled collection",
    description: collection.description ?? "",
  }));
};

const normalizeJournal = (payload = {}) => {
  if (!payload) {
    return {
      id: null,
      slug: "",
      name: "Untitled journal",
      issn: null,
      publisher: "",
      description: "",
      foundedYear: null,
      country: null,
      language: null,
      website: null,
      coverImage: null,
      counts: { issues: 0, documents: 0 },
      hasCounts: false,
      raw: payload,
    };
  }

  const base = payload.journal ?? payload;
  const counts = payload.counts ?? {};

  return {
    id: base.id ?? null,
    slug: base.slug ?? "",
    name: base.name ?? "Untitled journal",
    issn: base.issn ?? null,
    publisher: base.publisher ?? "",
    description: base.description ?? "",
    foundedYear: toNumber(base.founded_year ?? base.foundedYear),
    country: base.country ?? null,
    language: base.language ?? base.lang ?? null,
    website: base.website ?? base.url ?? null,
    coverImage: base.cover_image ?? base.coverImage ?? null,
    counts: {
      issues:
        toNumber(counts.issues ?? base.issue_count ?? base.issues_count ?? base.issues) ?? 0,
      documents:
        toNumber(counts.documents ?? base.document_count ?? base.documents_count ?? base.documents) ??
        0,
    },
    hasCounts: Boolean(payload.counts) || Boolean(base.issue_count ?? base.issues_count),
    raw: payload,
  };
};

const resolvePaginatedJournals = (payload = {}) => {
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  const page = Number(payload.page) || 1;
  const pageSize = Number(payload.page_size ?? payload.pageSize) || items.length || 20;
  const hasNext =
    typeof payload.has_next === "boolean"
      ? payload.has_next
      : payload.next !== undefined
        ? Boolean(payload.next)
        : items.length === pageSize;

  return {
    journals: items.map((item) => normalizeJournal(item)),
    raw: payload,
    page,
    pageSize,
    hasNext,
    total: Number(payload.total ?? items.length) || items.length,
  };
};

const normalizeIssue = (issue = {}) => ({
  id: issue.id ?? null,
  slug: issue.slug ?? issue.identifier ?? null,
  journalId: issue.journal_id ?? issue.journalId ?? null,
  title: issue.title ?? `Issue ${issue.number ?? ""}`.trim(),
  year: toNumber(issue.year),
  volume: toNumber(issue.volume),
  number: toNumber(issue.number),
  sequence: toNumber(issue.sequence),
  issueDate: issue.issue_date ?? issue.issueDate ?? issue.published_at ?? null,
  publishedAt: issue.published_at ?? null,
  coverImage: issue.cover_image ?? issue.coverImage ?? null,
  documentsCount: toNumber(issue.documents_count ?? issue.document_count),
  description: issue.description ?? "",
  raw: issue,
});

const resolvePaginatedIssues = (payload = {}) => {
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  const page = Number(payload.page) || 1;
  const pageSize = Number(payload.page_size ?? payload.pageSize) || items.length || 20;
  const hasNext =
    typeof payload.has_next === "boolean"
      ? payload.has_next
      : payload.next !== undefined
        ? Boolean(payload.next)
        : items.length === pageSize;

  return {
    issues: items.map((item) => normalizeIssue(item)),
    raw: payload,
    page,
    pageSize,
    hasNext,
    total: Number(payload.total ?? items.length) || items.length,
  };
};

export const getJournals = async ({ page = 1, pageSize = 20, q, signal } = {}) => {
  const payload = await apiFetch("/v1/journals", {
    params: {
      page,
      page_size: pageSize,
      q,
    },
    signal,
  });
  return resolvePaginatedJournals(payload);
};

export const getJournal = async (slug, { signal } = {}) => {
  if (!slug) {
    throw new Error("Journal slug is required");
  }
  const payload = await apiFetch(`/v1/journals/${slug}`, { signal });
  return normalizeJournal(payload);
};

export const getJournalIssues = async (
  slug,
  { page = 1, pageSize = 20, signal } = {}
) => {
  if (!slug) {
    throw new Error("Journal slug is required");
  }
  const payload = await apiFetch(`/v1/journals/${slug}/issues`, {
    params: {
      page,
      page_size: pageSize,
    },
    signal,
  });
  return resolvePaginatedIssues(payload);
};

export const getJournalWithIssues = async (slug, options = {}) => {
  const { page, pageSize, signal } = options;
  const [journal, issues] = await Promise.all([
    getJournal(slug, { signal }),
    getJournalIssues(slug, { page, pageSize, signal }),
  ]);
  return { journal, issues };
};

export const getCollectionDocuments = async (collectionId, { page = 1, pageSize = 20, signal } = {}) => {
  if (!collectionId) {
    throw new Error("Collection id is required");
  }
  const payload = await apiFetch(`/v1/collections/${collectionId}/documents`, {
    params: {
      page,
      page_size: pageSize,
    },
    signal,
    noCache: true,
  });
  return resolvePaginatedDocuments(payload);
};

// src/lib/api.js
export async function getDocumentFileLink(id) {
  return apiFetch(`/v1/${id}/file`);
}


export default {
  apiFetch,
  buildQuery,
  getDocument,
  getDocuments,
  getJournals,
  getJournal,
  getJournalIssues,
  getJournalWithIssues,
  getDocumentFileLink,
  getCollections,
  getCollectionDocuments,
};

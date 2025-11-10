const rawBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASEPATH ||
  "";

const API_BASE = rawBase.replace(/\/+$/, "");
const CACHE_TTL = 30_000;
const AUTH_TOKEN_STORAGE_KEY = "akt.auth.token";
const AUTH_EVENT_NAME = "akt:auth-change";

const responseCache = new Map();
let warnedMissingBase = false;
let authToken = null;

const isBrowser = typeof window !== "undefined";

const emitAuthEvent = () => {
  if (!isBrowser || typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }
  const event =
    typeof window.CustomEvent === "function"
      ? new window.CustomEvent(AUTH_EVENT_NAME)
      : new Event(AUTH_EVENT_NAME);
  window.dispatchEvent(event);
};

export const setStoredToken = (token) => {
  authToken = token || null;
  if (isBrowser) {
    try {
      if (authToken) {
        window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
      } else {
        window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Unable to access localStorage for auth token", error);
    }
    emitAuthEvent();
  }
  return authToken;
};

export const clearStoredToken = () => setStoredToken(null);

export const getStoredToken = () => {
  if (authToken) {
    return authToken;
  }
  if (!isBrowser) {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    authToken = stored || null;
    return authToken;
  } catch {
    return null;
  }
};

const base64Decode = (segment) => {
  if (!segment) return "";
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  if (typeof globalThis !== "undefined" && typeof globalThis.atob === "function") {
    return globalThis.atob(padded);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }
  throw new Error("No base64 decoder available");
};

export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const decoded = base64Decode(parts[1]);
    return JSON.parse(decoded);
  } catch (error) {
    console.warn("Failed to decode JWT payload", error);
    return null;
  }
};

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
const normalizeEmail = (value) => (typeof value === "string" ? value : String(value ?? "")).trim().toLowerCase();

export const apiFetch = async (
  path,
  { params, signal, noCache, method = "GET", headers = {}, body } = {},
) => {
  const base = ensureBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const query = buildQuery(params);
  const url = `${base}${normalizedPath}${query}`;

  const finalMethod = typeof method === "string" ? method.toUpperCase() : "GET";
  const hasBody = body !== undefined && body !== null;
  const skipCache = shouldSkipCache(signal, noCache);
  const canUseCache = !skipCache && finalMethod === "GET" && !hasBody;

  if (canUseCache) {
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

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };
  const token = getStoredToken();
  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const requestInit = {
    method: finalMethod,
    headers: requestHeaders,
    signal: compositeSignal,
    cache: "no-store",
  };

  if (finalMethod !== "GET") {
    if (hasBody) {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      const isBlob = typeof Blob !== "undefined" && body instanceof Blob;
      if (isFormData || isBlob) {
        requestInit.body = body;
      } else if (typeof body === "string") {
        requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
        requestInit.body = body;
      } else {
        requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
        requestInit.body = JSON.stringify(body);
      }
    }
  }

  const parseSuccess = (response) => {
    if (response.status === 204) {
      return Promise.resolve(null);
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    return response.text();
  };

  const fetchOnce = async () => {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredToken();
      }
      let errorPayload = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          errorPayload = await response.json();
        } catch {
          errorPayload = null;
        }
      } else {
        try {
          const text = await response.text();
          errorPayload = text ? { detail: text } : null;
        } catch {
          errorPayload = null;
        }
      }
      const message =
        errorPayload?.detail ||
        errorPayload?.message ||
        errorPayload?.error ||
        `API error ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = errorPayload;
      throw error;
    }

    return parseSuccess(response);
  };

  let attempt = 0;
  const maxRetries = finalMethod === "GET" ? 1 : 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const data = await fetchOnce();
      if (canUseCache && !compositeSignal.aborted) {
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
      if (attempt >= maxRetries) {
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

const clampString = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const normalizeCategory = (category = {}) => ({
  id: category.id ?? null,
  slug: category.slug ?? "",
  name: category.name ?? "",
  kind: category.kind ?? "",
  parentId: category.parent_id ?? null,
  description: category.description ?? "",
  linkedJournal: category.linked_journal
    ? {
        id: category.linked_journal.id ?? null,
        slug: category.linked_journal.slug ?? "",
        name: category.linked_journal.name ?? "",
      }
    : null,
  counts:
    category.counts && typeof category.counts === "object"
      ? {
          documents: toNumber(category.counts.documents),
        }
      : null,
  raw: category,
});

const normalizeDocument = (doc = {}) => {
  const rawAuthors = doc.authors ?? null;
  const authors =
    Array.isArray(rawAuthors) ? rawAuthors : rawAuthors ? [rawAuthors] : null;

  return {
    id: doc.id,
    title: doc.title ?? "Untitled document",
    author: typeof doc.author === "string" ? doc.author : "",
    authors,
    year: doc.year ?? null,
    type: doc.type ?? "",
    format: doc.format ?? doc.type ?? "",
    abstract: doc.abstract ?? "",
    language: doc.lang ?? doc.language ?? "",
    pages: doc.pages ?? null,
    collectionId: doc.collection_id ?? null,
    journalId: doc.journal_id ?? doc.journalId ?? null,
    issueId: doc.issue_id ?? doc.issueId ?? null,
    startPage: doc.start_page ?? doc.page_start ?? null,
    endPage: doc.end_page ?? doc.page_end ?? null,
    fullTextAvailable: Boolean(doc.file_key),
    openAccess: doc.open_access ?? doc.openAccess ?? null,
    citations: doc.citations ?? null,
    downloadCount: doc.download_count ?? doc.downloadCount ?? null,
    bookmarkCount: doc.bookmark_count ?? doc.bookmarkCount ?? null,
    keywords: parseKeywords(doc.keywords),
    fileKey: doc.file_key ?? null,
    primaryCategory: doc.primary_category ?? doc.primaryCategory ?? null,
    categorySlug: doc.category_slug ?? doc.categorySlug ?? null,
    category: doc.category ?? null,
    coverImage:
      doc.cover_image_url ??
      doc.cover_image ??
      doc.coverImage ??
      doc.lead_image ??
      doc.leadImage ??
      null,
    identifiers: {
      doi: doc.doi ?? null,
      isbn: doc.isbn ?? null,
      issn: doc.issn ?? null,
    },
    doi: doc.doi ?? null,
    isbn: doc.isbn ?? null,
    issn: doc.issn ?? null,
    createdAt: doc.created_at ?? null,
    updatedAt: doc.updated_at ?? null,
    journal:
      doc.journal && typeof doc.journal === "object"
        ? {
            id: doc.journal.id ?? null,
            name: doc.journal.name ?? "",
            slug: doc.journal.slug ?? null,
            issn: doc.journal.issn ?? null,
          }
        : null,
    issue:
      doc.issue && typeof doc.issue === "object"
        ? {
            id: doc.issue.id ?? null,
            title: doc.issue.title ?? "",
            year: doc.issue.year ?? null,
            volume: doc.issue.volume ?? null,
            number: doc.issue.number ?? null,
          }
        : null,
    raw: doc,
  };
};

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

const resolvePaginatedCategories = (payload = {}) => {
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
    categories: items.map((item) => normalizeCategory(item)),
    raw: payload,
    page,
    pageSize,
    hasNext,
    total: Number(payload.total ?? items.length) || items.length,
  };
};

/**
 * Search documents using the /v1/search/documents endpoint.
 * @param {Object} [params]
 * @param {string} [params.q]
 * @param {string} [params.category]
 * @param {string} [params.categorySlug]
 * @param {string} [params.slug]
 * @param {Array<string>|string} [params.lang]
 * @param {Array<string>|string} [params.type]
 * @param {number} [params.yearFrom]
 * @param {number} [params.yearTo]
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=20]
 * @param {string} [params.sort]
 * @param {boolean} [params.includeDescendants=false]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<{documents: Array, raw: any, page: number, pageSize: number, hasNext: boolean}>}
 */
export const searchDocuments = async ({
  q,
  category,
  categorySlug,
  slug,
  lang,
  type,
  yearFrom,
  yearTo,
  page = 1,
  pageSize = 20,
  sort,
  includeDescendants = false,
  author,
  signal,
} = {}) => {
  const resolvedPage = Math.max(Number(page) || 1, 1);
  const resolvedPageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const params = {
    q,
    page: resolvedPage,
    page_size: resolvedPageSize,
    sort: sort || undefined,
    category: category ?? categorySlug ?? slug ?? undefined,
    include_descendants: includeDescendants ? "true" : undefined,
  };

  if (lang !== undefined) {
    params.lang = lang;
  }
  if (type !== undefined) {
    params.type = type;
  }
  if (yearFrom !== undefined && yearFrom !== null) {
    params.year_from = yearFrom;
  }
  if (yearTo !== undefined && yearTo !== null) {
    params.year_to = yearTo;
  }
  const authorValue = typeof author === "string" ? author.trim() : "";
  if (authorValue) {
    params.author = authorValue;
  }

  const payload = await apiFetch("/v1/search/documents", {
    params,
    signal,
  });
  return resolvePaginatedDocuments(payload);
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

const normalizeEventBase = (raw = {}, fallbackTitle = "Untitled event") => ({
  id: raw.id ?? null,
  slug: clampString(raw.slug) || "",
  type: raw.type ?? "",
  title: clampString(raw.title) || fallbackTitle,
  summary: clampString(raw.summary) || "",
  startDate: raw.start_date ?? raw.startDate ?? null,
  endDate: raw.end_date ?? raw.endDate ?? null,
  location: clampString(raw.location) || null,
  coverImageUrl: raw.cover_image_url ?? raw.coverImageUrl ?? null,
  raw,
});

const normalizeSeminarDetails = (details = {}) => ({
  speakers: Array.isArray(details.speakers)
    ? details.speakers
        .map((item) => ({
          name: clampString(item?.name) || "",
          role: clampString(item?.role) || null,
          affiliation: clampString(item?.affiliation) || null,
        }))
        .filter((speaker) => speaker.name)
    : [],
  agenda: Array.isArray(details.agenda)
    ? details.agenda
        .map((item) => ({
          title: clampString(item?.title) || "",
          time: clampString(item?.time) || null,
          speaker: clampString(item?.speaker) || null,
        }))
        .filter((entry) => entry.title)
    : [],
  media: Array.isArray(details.media)
    ? details.media.filter((entry) => typeof entry === "string" && entry.trim().length > 0)
    : [],
});

const normalizeAwardDetails = (details = {}) => ({
  awardYear: toNumber(details.award_year ?? details.awardYear),
  discipline: clampString(details.discipline) || null,
  notes: clampString(details.notes) || null,
  winners: Array.isArray(details.winners)
    ? details.winners
        .map((winner) => ({
          id: winner?.id ?? null,
          rank: toNumber(winner?.rank),
          winnerName: clampString(winner?.winner_name ?? winner?.winnerName) || "",
          workTitle: clampString(winner?.work_title ?? winner?.workTitle) || null,
          affiliation: clampString(winner?.affiliation) || null,
          notes: clampString(winner?.notes) || null,
        }))
        .filter((winner) => winner.winnerName)
    : [],
});

const normalizeExhibitionDetails = (details = {}) => ({
  venue: clampString(details.venue) || null,
  curator: clampString(details.curator) || null,
  gallery: Array.isArray(details.gallery)
    ? details.gallery.filter((entry) => typeof entry === "string" && entry.trim().length > 0)
    : [],
});

const resolvePaginatedEvents = (payload = {}) => {
  const items = Array.isArray(payload.items)
    ? payload.items.map((item) => normalizeEventBase(item))
    : [];
  const page = Number(payload.page ?? 1) || 1;
  const pageSize = Number((payload.page_size ?? payload.pageSize ?? items.length) || 1) || 1;
  const total = Number(payload.total ?? items.length) || 0;
  const hasNext =
    typeof payload.has_next === "boolean"
      ? payload.has_next
      : typeof payload.hasNext === "boolean"
        ? payload.hasNext
        : page * pageSize < total;
  return { items, total, page, pageSize, hasNext, raw: payload };
};

const normalizeEventDetail = (payload = {}) => {
  if (!payload) {
    return null;
  }
  const base = normalizeEventBase(payload);
  const body = clampString(payload.body) || null;
  const detailsPayload = payload.details ?? null;
  let details = null;

  if (detailsPayload && typeof detailsPayload === "object") {
    const kind = detailsPayload.kind ?? detailsPayload.type ?? base.type;
    if (kind === "seminar") {
      details = { kind: "seminar", ...normalizeSeminarDetails(detailsPayload) };
    } else if (kind === "award") {
      details = { kind: "award", ...normalizeAwardDetails(detailsPayload) };
    } else if (kind === "exhibition") {
      details = { kind: "exhibition", ...normalizeExhibitionDetails(detailsPayload) };
    }
  }

  return { ...base, body, details, raw: payload };
};

export const getEvents = async ({ type, page = 1, pageSize = 12, signal } = {}) => {
  const params = {
    page: Math.max(Number(page) || 1, 1),
    page_size: Math.min(Math.max(Number(pageSize) || 12, 1), 100),
  };
  if (type && type !== "all") {
    params.type = type;
  }
  const payload = await apiFetch("/v1/events", { params, signal });
  return resolvePaginatedEvents(payload);
};

export const getEvent = async (slug, { signal } = {}) => {
  if (!slug) {
    throw new Error("Event slug is required");
  }
  try {
    const payload = await apiFetch(`/v1/events/${slug}`, { signal });
    return normalizeEventDetail(payload);
  } catch (error) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
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
    name: clampString(base.name) || "Untitled journal",
    issn: clampString(base.issn) || null,
    publisher: clampString(base.publisher) || "",
    description: clampString(base.description) || "",
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
    createdAt: base.created_at ?? null,
    updatedAt: base.updated_at ?? null,
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
  title: clampString(issue.title) || `Issue ${issue.number ?? ""}`.trim(),
  year: toNumber(issue.year),
  volume: toNumber(issue.volume),
  number: toNumber(issue.number),
  sequence: toNumber(issue.sequence),
  issueDate: issue.issue_date ?? issue.issueDate ?? issue.published_at ?? null,
  publishedAt: issue.published_at ?? null,
  coverImage: issue.cover_image ?? issue.coverImage ?? null,
  documentsCount: toNumber(issue.documents_count ?? issue.document_count ?? issue.documents),
  counts: {
    documents: toNumber(issue.documents_count ?? issue.document_count ?? issue.documents) ?? 0,
  },
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

export const getJournals = async ({
  page = 1,
  pageSize = 20,
  q,
  signal,
} = {}) => {
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
  {
    page = 1,
    pageSize = 20,
    signal,
  } = {}
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

export const getIssueArticles = async (
  slug,
  issueId,
  {
    page = 1,
    pageSize = 20,
    signal,
  } = {}
) => {
  if (!slug || !issueId) {
    throw new Error("Issue articles request requires journal slug and issue id");
  }
  const payload = await apiFetch(`/v1/journals/${slug}/issues/${issueId}/articles`, {
    params: {
      page,
      page_size: pageSize,
    },
    signal,
  });
  return resolvePaginatedDocuments(payload);
};

/**
 * Fetch a single category by slug.
 * @param {string} slug
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<object|null>}
 */
export const getCategory = async (slug, { signal } = {}) => {
  if (!slug) {
    return null;
  }
  try {
    const payload = await apiFetch(`/v1/categories/${slug}`, { signal });
    const normalized = normalizeCategory(payload?.category ?? payload ?? {});
    const counts =
      payload?.counts && typeof payload.counts === "object"
        ? { documents: toNumber(payload.counts.documents) }
        : normalized.counts;
    return counts ? { ...normalized, counts } : normalized;
  } catch (error) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
};

const fetchCategoryChildrenLegacy = async (slug, { kind, signal } = {}) => {
  const payload = await apiFetch("/v1/categories", {
    params: {
      parent: slug,
      parent_slug: slug,
      kind,
      page_size: 100,
    },
    signal,
  });
  const items = Array.isArray(payload?.items) ? payload.items : [];
  return items.map((item) => normalizeCategory(item));
};

/**
 * Fetch immediate children for a category slug.
 * @param {string} slug
 * @param {{ kind?: string, withCounts?: boolean, signal?: AbortSignal }} [options]
 * @returns {Promise<Array<object>>}
 */
export const getCategoryChildren = async (
  slug,
  { kind, withCounts = false, signal } = {},
) => {
  if (!slug) {
    return [];
  }
  try {
    const payload = await apiFetch(`/v1/categories/${slug}/children`, {
      params: {
        kind,
        with_counts: withCounts ? "true" : undefined,
      },
      signal,
    });
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return items.map((item) => {
      const normalized = normalizeCategory(item);
      if (normalized.counts) {
        return normalized;
      }
      const counts =
        item?.counts && typeof item.counts === "object"
          ? { documents: toNumber(item.counts.documents) }
          : null;
      return counts ? { ...normalized, counts } : normalized;
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }
    if (error?.status === 404) {
      return [];
    }
    try {
      return await fetchCategoryChildrenLegacy(slug, { kind, signal });
    } catch (legacyError) {
      if (legacyError?.status === 404) {
        return [];
      }
      throw legacyError;
    }
  }
};

export const getCategories = async ({
  kind,
  parentSlug,
  page = 1,
  pageSize = 50,
  signal,
} = {}) => {
  const payload = await apiFetch("/v1/categories", {
    params: {
      kind,
      parent_slug: parentSlug,
      page,
      page_size: pageSize,
    },
    signal,
  });
  return resolvePaginatedCategories(payload);
};

const persistAuthResponse = (payload) => {
  const token = payload?.access_token || payload?.token;
  if (token) {
    setStoredToken(token);
  }
  return payload;
};

export const login = async (email, password) => {
  const payload = await apiFetch("/v1/auth/login", {
    method: "POST",
    body: {
      email: normalizeEmail(email),
      password,
    },
    noCache: true,
  });
  return persistAuthResponse(payload);
};

export const loginWithGoogle = async (idToken) => {
  const payload = await apiFetch("/v1/auth/google", {
    method: "POST",
    body: { id_token: idToken },
    noCache: true,
  });
  return persistAuthResponse(payload);
};

export const signup = async (email, password) => {
  await apiFetch("/v1/auth/signup", {
    method: "POST",
    body: {
      email: normalizeEmail(email),
      password,
    },
    noCache: true,
  });
  return login(email, password);
};


export default {
  apiFetch,
  buildQuery,
  getDocument,
  getDocuments,
  searchDocuments,
  getCategory,
  getCategoryChildren,
  getJournals,
  getJournal,
  getJournalIssues,
  getJournalWithIssues,
  getDocumentFileLink,
  getCollections,
  getCollectionDocuments,
  getIssueArticles,
  getCategories,
  login,
  signup,
  loginWithGoogle,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  decodeJwtPayload,
};

export { AUTH_TOKEN_STORAGE_KEY, AUTH_EVENT_NAME };

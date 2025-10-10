const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE;
const API_BASE = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : undefined;
let hasLoggedMissingBase = false;

const ensureBaseUrl = () => {
  if (!API_BASE) {
    if (!hasLoggedMissingBase && process.env.NODE_ENV !== 'production') {
      console.error(
        'NEXT_PUBLIC_API_BASE is not set. Add it to .env.local so the eLibrary pages can reach the backend.'
      );
      hasLoggedMissingBase = true;
    }
    throw new Error('Missing NEXT_PUBLIC_API_BASE');
  }
  return API_BASE;
};

const buildUrl = (path, searchParams) => {
  const base = ensureBaseUrl();
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
};

const request = async (path, { searchParams, cache = 'force-cache', next } = {}) => {
  const url = buildUrl(path, searchParams);
  const init = {
    headers: {
      Accept: 'application/json',
    },
    cache,
  };

  if (typeof window === 'undefined' && next) {
    init.next = next;
  }

  const response = await fetch(url.toString(), init);

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json();
};

const parseKeywords = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeDocument = (doc = {}) => ({
  id: doc.id,
  title: doc.title ?? 'Untitled document',
  author: doc.authors ?? doc.author ?? '',
  authors: doc.authors ?? null,
  year: doc.year ?? null,
  type: doc.type ?? '',
  format: doc.format ?? doc.type ?? '',
  abstract: doc.abstract ?? '',
  language: doc.lang ?? doc.language ?? '',
  pages: doc.pages ?? null,
  collectionId: doc.collection_id ?? null,
  fullTextAvailable: Boolean(doc.file_key),
  openAccess: doc.open_access ?? doc.openAccess ?? null,
  citations: doc.citations ?? null,
  downloadCount: doc.download_count ?? doc.downloadCount ?? null,
  bookmarkCount: doc.bookmark_count ?? doc.bookmarkCount ?? null,
  keywords: parseKeywords(doc.keywords),
  fileKey: doc.file_key ?? null,
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

const resolveDocumentsPayload = (payload) => {
  const results = Array.isArray(payload) ? payload : payload?.results ?? [];
  const page = Number(payload?.page) || 1;
  const pageSize = Number(payload?.page_size ?? payload?.pageSize) || results.length || 20;
  const hasNextExplicit =
    typeof payload?.has_next === 'boolean'
      ? payload.has_next
      : payload?.next !== undefined
        ? Boolean(payload.next)
        : null;

  const documents = results.map(normalizeDocument);

  return {
    documents,
    page,
    pageSize,
    hasNext: hasNextExplicit ?? documents.length === pageSize,
  };
};

export const getDocuments = async ({ q, page = 1, pageSize = 20 } = {}) => {
  const payload = await request('/v1/documents', {
    searchParams: {
      q,
      page,
      page_size: pageSize,
    },
    cache: 'no-store',
  });

  return resolveDocumentsPayload(payload);
};

export const getDocument = async (id) => {
  if (!id) {
    throw new Error('Document id is required');
  }

  const payload = await request(`/v1/documents/${id}`, {
    cache: 'force-cache',
    next: { revalidate: 300 },
  });

  return normalizeDocument(payload);
};

export const getCollections = async () => {
  const payload = await request('/v1/collections', {
    cache: 'force-cache',
    next: { revalidate: 60 },
  });

  const collections = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name ?? 'Untitled collection',
    description: collection.description ?? '',
  }));
};

export const getCollectionDocuments = async (collectionId, { page = 1, pageSize = 20 } = {}) => {
  if (!collectionId) {
    throw new Error('Collection id is required');
  }

  const payload = await request(`/v1/collections/${collectionId}/documents`, {
    searchParams: {
      page,
      page_size: pageSize,
    },
    cache: 'no-store',
  });

  return resolveDocumentsPayload(payload);
};

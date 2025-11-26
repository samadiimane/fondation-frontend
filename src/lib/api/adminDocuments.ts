"use client";

import {apiFetch} from "@/lib/api";
import {CategoryKind} from "@/lib/api/adminCategories";

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export type AdminDocumentType =
  | "book"
  | "article"
  | "thesis"
  | "report"
  | "manuscript"
  | "archive_item"
  | "site_record"
  | "other";

export type AdminDocumentAuthorRef = {
  id: number;
  name_ar: string;
  name_lat: string | null;
};

export type AdminDocumentPrimaryCategory = {
  id: number;
  slug: string;
  name: string;
  kind: CategoryKind;
};

export type AdminDocumentJournalRef = {
  id: number;
  slug: string;
  name: string;
};

export type AdminDocumentIssueRef = {
  id: number;
  year: number | null;
  volume: number | null;
  number: number | null;
  title: string | null;
};

export type AdminDocumentListItem = {
  id: number;
  title: string;
  type: AdminDocumentType;
  lang: string;
  year: number | null;
  pages: number | null;
  primary_category: AdminDocumentPrimaryCategory | null;
  journal: AdminDocumentJournalRef | null;
  issue: AdminDocumentIssueRef | null;
  authors: AdminDocumentAuthorRef[];
  created_at: string;
  updated_at: string;
  status: string | null;
  file_key?: string | null;
};

export type AdminDocumentDetail = AdminDocumentListItem & {
  doi: string | null;
  isbn: string | null;
  issn: string | null;
  abstract: string | null;
  cover_image_url: string | null;
  start_page: number | null;
  end_page: number | null;
  file_key?: string | null;
};

export type AdminDocumentApiErrorShape = {
  userMessage: string;
  status?: number;
  code: string;
};

export class AdminDocumentApiError extends Error implements AdminDocumentApiErrorShape {
  userMessage: string;
  status?: number;
  code: string;

  constructor({userMessage, status, code}: AdminDocumentApiErrorShape) {
    super(userMessage);
    this.name = "AdminDocumentApiError";
    this.userMessage = userMessage;
    this.status = status;
    this.code = code;
  }
}

const BASE_PATH = "/v1/admin/documents";

export const qkAdminDocs = {
  root: ["admin:documents"] as const,
  list: (params: Record<string, unknown> = {}) => [...qkAdminDocs.root, "list", params] as const,
  detail: (id: number) => [...qkAdminDocs.root, "detail", id] as const,
};

const mapToDocumentError = (error: any): AdminDocumentApiError => {
  if (error?.name === "AbortError") {
    throw error;
  }
  if (error instanceof AdminDocumentApiError) {
    return error;
  }

  const status = typeof error?.status === "number" ? error.status : undefined;
  const detailSource = error?.payload?.detail ?? error?.payload ?? error;
  const userMessage =
    (typeof detailSource === "object" && detailSource !== null
      ? detailSource.user_message ?? detailSource.userMessage
      : undefined) ||
    (typeof detailSource === "string" ? detailSource : undefined) ||
    "Unable to complete the request.";

  const code =
    (typeof detailSource === "object" && detailSource !== null && typeof detailSource.code === "string"
      ? detailSource.code
      : undefined) || (status ? `HTTP_${status}` : "NETWORK_ERROR");

  return new AdminDocumentApiError({userMessage, status, code});
};

const normalizeAuthor = (payload: any): AdminDocumentAuthorRef => ({
  id: Number(payload?.id ?? 0),
  name_ar: payload?.name_ar ?? payload?.full_name_ar ?? "",
  name_lat: payload?.name_lat ?? payload?.full_name_lat ?? null,
});

const normalizePrimaryCategory = (payload: any): AdminDocumentPrimaryCategory => ({
  id: Number(payload?.id ?? 0),
  slug: payload?.slug ?? "",
  name: payload?.name ?? "",
  kind: payload?.kind ?? "topic",
});

const normalizeJournal = (payload: any): AdminDocumentJournalRef => ({
  id: Number(payload?.id ?? 0),
  slug: payload?.slug ?? "",
  name: payload?.name ?? "",
});

const normalizeIssue = (payload: any): AdminDocumentIssueRef => ({
  id: Number(payload?.id ?? 0),
  year: payload?.year ?? null,
  volume: payload?.volume ?? null,
  number: payload?.number ?? null,
  title: payload?.title ?? null,
});

const normalizeListItem = (payload: any): AdminDocumentListItem => ({
  id: Number(payload?.id ?? 0),
  title: payload?.title ?? "",
  type: payload?.type ?? "other",
  lang: payload?.lang ?? "",
  year: payload?.year ?? null,
  pages: payload?.pages ?? null,
  primary_category: payload?.primary_category ? normalizePrimaryCategory(payload.primary_category) : null,
  journal: payload?.journal ? normalizeJournal(payload.journal) : null,
  issue: payload?.issue ? normalizeIssue(payload.issue) : null,
  authors: Array.isArray(payload?.authors) ? payload.authors.map(normalizeAuthor) : [],
  created_at: payload?.created_at ?? "",
  updated_at: payload?.updated_at ?? "",
  status: payload?.status ?? null,
  file_key: payload?.file_key ?? null,
});

const normalizeDetail = (payload: any): AdminDocumentDetail => ({
  ...normalizeListItem(payload),
  doi: payload?.doi ?? null,
  isbn: payload?.isbn ?? null,
  issn: payload?.issn ?? null,
  abstract: payload?.abstract ?? null,
  cover_image_url: payload?.cover_image_url ?? null,
  start_page: payload?.start_page ?? null,
  end_page: payload?.end_page ?? null,
});

const normalizePaginated = (payload: any): Paginated<AdminDocumentListItem> => ({
  items: Array.isArray(payload?.items) ? payload.items.map(normalizeListItem) : [],
  total: Number(payload?.total ?? 0),
  page: Number(payload?.page ?? 1),
  pageSize: Number(payload?.page_size ?? payload?.pageSize ?? 20),
  hasNext: Boolean(payload?.has_next ?? payload?.hasNext ?? false),
});

export type ListAdminDocumentsParams = {
  q?: string;
  type?: AdminDocumentType;
  lang?: string;
  yearMin?: number;
  yearMax?: number;
  categorySlug?: string;
  journalId?: number;
  issueId?: number;
  status?: "active" | "deleted" | "all";
  sort?: "created_at desc" | "created_at asc" | "updated_at desc" | "updated_at asc" | "year desc" | "year asc" | "title asc" | "title desc";
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
};

export const listAdminDocuments = async ({
  q,
  type,
  lang,
  yearMin,
  yearMax,
  categorySlug,
  journalId,
  issueId,
  status = "active",
  sort = "created_at desc",
  page = 1,
  pageSize = 20,
  signal,
}: ListAdminDocumentsParams = {}): Promise<Paginated<AdminDocumentListItem>> => {
  try {
    const payload = await apiFetch(BASE_PATH, {
      signal,
      params: {
        q: q?.trim() || undefined,
        type,
        lang: lang?.trim() || undefined,
        year_min: yearMin,
        year_max: yearMax,
        category_slug: categorySlug?.trim() || undefined,
        journal_id: journalId,
        issue_id: issueId,
        status,
        sort,
        page,
        page_size: pageSize,
      },
    });
    return normalizePaginated(payload);
  } catch (error) {
    throw mapToDocumentError(error);
  }
};

export const getAdminDocument = async (
  id: number,
  {signal}: {signal?: AbortSignal} = {},
): Promise<AdminDocumentDetail> => {
  try {
    const payload = await apiFetch(`${BASE_PATH}/${id}`, {signal});
    return normalizeDetail(payload);
  } catch (error) {
    throw mapToDocumentError(error);
  }
};

export type AdminDocumentCreateInput = {
  title: string;
  abstract?: string | null;
  type?: AdminDocumentType | null;
  lang: string;
  year?: number | null;
  pages?: number | null;
  doi?: string | null;
  isbn?: string | null;
  issn?: string | null;
  primary_category_id?: number | null;
  journal_id?: number | null;
  issue_id?: number | null;
  cover_image_url?: string | null;
  start_page?: number | null;
  end_page?: number | null;
  author_ids?: number[] | null;
  file_key?: string | null;
};

export type AdminDocumentUpdateInput = Partial<AdminDocumentCreateInput>;

const sanitizePayload = (payload: AdminDocumentCreateInput | AdminDocumentUpdateInput) => {
  const copy: Record<string, unknown> = {...payload};
  Object.entries(copy).forEach(([key, value]) => {
    if (value === undefined) {
      delete copy[key];
    }
  });
  return copy;
};

export const createAdminDocument = async (
  payload: AdminDocumentCreateInput,
): Promise<AdminDocumentDetail> => {
  try {
    const body = sanitizePayload(payload);
    const response = await apiFetch(BASE_PATH, {method: "POST", body});
    return normalizeDetail(response);
  } catch (error) {
    throw mapToDocumentError(error);
  }
};

export const updateAdminDocument = async (
  id: number,
  payload: AdminDocumentUpdateInput,
): Promise<AdminDocumentDetail> => {
    try {
      const body = sanitizePayload(payload);
      const response = await apiFetch(`${BASE_PATH}/${id}`, {method: "PATCH", body});
      return normalizeDetail(response);
    } catch (error) {
      throw mapToDocumentError(error);
    }
};

export const softDeleteAdminDocument = async (id: number): Promise<AdminDocumentDetail> => {
  try {
    const response = await apiFetch(`${BASE_PATH}/${id}/delete`, {method: "PATCH"});
    return normalizeDetail(response);
  } catch (error) {
    throw mapToDocumentError(error);
  }
};

export const restoreAdminDocument = async (id: number): Promise<AdminDocumentDetail> => {
  try {
    const response = await apiFetch(`${BASE_PATH}/${id}/restore`, {method: "PATCH"});
    return normalizeDetail(response);
  } catch (error) {
    throw mapToDocumentError(error);
  }
};

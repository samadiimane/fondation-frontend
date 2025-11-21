"use client";

import {apiFetch} from "@/lib/api";

const BASE_PATH = "/v1/admin/journals";

export type AdminJournal = {
  id: number;
  name: string;
  slug: string;
  issn: string | null;
  description: string | null;
  publisher: string | null;
  cover_image_url: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type AdminJournalListItem = AdminJournal & {
  issues_count: number;
  articles_count: number;
};

export type AdminJournalListResponse = {
  items: AdminJournalListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export type AdminJournalCreateInput = {
  name: string;
  slug?: string;
  issn?: string;
  description?: string;
  publisher?: string;
  cover_image_url?: string;
};

export type AdminJournalUpdateInput = Partial<Omit<AdminJournalCreateInput, "name">> & {
  name?: string;
};

export type AdminJournalApiErrorShape = {
  userMessage: string;
  code: string;
  status?: number;
};

export type PresignUploadResponse = {
  uploadUrl: string;
  publicUrl: string;
  key?: string;
  headers?: Record<string, string>;
};

export class AdminJournalApiError extends Error implements AdminJournalApiErrorShape {
  userMessage: string;
  code: string;
  status?: number;

  constructor({userMessage, code, status}: AdminJournalApiErrorShape) {
    super(userMessage);
    this.name = "AdminJournalApiError";
    this.userMessage = userMessage;
    this.code = code;
    this.status = status;
  }
}

const normalizeJournal = (payload: any): AdminJournalListItem => ({
  id: Number(payload?.id ?? 0),
  name: String(payload?.name ?? ""),
  slug: String(payload?.slug ?? ""),
  issn: payload?.issn ?? null,
  description: payload?.description ?? null,
  publisher: payload?.publisher ?? null,
  cover_image_url: payload?.cover_image_url ?? null,
  created_at: String(payload?.created_at ?? ""),
  deleted_at: payload?.deleted_at ?? null,
  issues_count: Number(payload?.issues_count ?? 0),
  articles_count: Number(payload?.articles_count ?? 0),
});

const normalizePaginated = (payload: any): AdminJournalListResponse => ({
  items: Array.isArray(payload?.items) ? payload.items.map(normalizeJournal) : [],
  total: Number(payload?.total ?? 0),
  page: Number(payload?.page ?? 1),
  pageSize: Number(payload?.page_size ?? payload?.pageSize ?? 20),
  hasNext: Boolean(payload?.has_next ?? payload?.hasNext ?? false),
});

const sanitizeOptional = (value?: string | null): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const pruneUndefined = <T extends Record<string, unknown>>(record: T): Partial<T> => {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as Partial<T>;
};

const mapToJournalError = (error: any): AdminJournalApiError => {
  if (error?.name === "AbortError") {
    throw error;
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
    (typeof detailSource === "object" && detailSource !== null ? detailSource.code : undefined) ||
    (status ? `HTTP_${status}` : "NETWORK_ERROR");

  return new AdminJournalApiError({userMessage, code, status});
};

export type AdminIssueListItem = {
  id: number;
  journal_id: number;
  volume: number | null;
  number: number | null;
  year: number | null;
  title: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  articles_count: number;
  created_at: string;
};

export type AdminIssueListResponse = {
  items: AdminIssueListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export const qkJournalIssues = (journalId: number, params: Record<string, unknown>) =>
  ["admin:journals:issues", journalId, params] as const;

export type ListJournalIssuesParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  year?: number;
  sort?: "year_desc" | "year_asc" | "number_desc" | "number_asc" | "created_desc" | "created_asc";
  signal?: AbortSignal;
};

export type AdminIssueCreate = {
  title?: string;
  year?: number;
  number?: number;
  volume?: number;
  published_at?: string | null;
};

export type AdminIssueUpdate = Partial<AdminIssueCreate>;

export const listJournalIssues = async (
  journalId: number,
  {
    page = 1,
    pageSize = 20,
    q,
    year,
    sort = "year_desc",
    signal,
  }: ListJournalIssuesParams = {},
): Promise<AdminIssueListResponse> => {
  try {
    const payload: any = await apiFetch(`/v1/admin/journals/${journalId}/issues`, {
      signal,
      params: {
        page,
        page_size: pageSize,
        q: q?.trim() || undefined,
        year,
        sort,
      },
    });
    return {
      items: Array.isArray(payload?.items)
        ? payload.items.map((item: any) => ({
            id: Number(item?.id ?? 0),
            journal_id: Number(item?.journal_id ?? journalId),
            volume: item?.volume ?? null,
            number: item?.number ?? null,
            year: item?.year ?? null,
            title: item?.title ?? null,
            cover_image_url: item?.cover_image_url ?? null,
            published_at: item?.published_at ?? null,
            articles_count: Number(item?.articles_count ?? 0),
            created_at: String(item?.created_at ?? ""),
          }))
        : [],
      total: Number(payload?.total ?? 0),
      page: Number(payload?.page ?? 1),
      pageSize: Number(payload?.page_size ?? payload?.pageSize ?? pageSize),
      hasNext: Boolean(payload?.has_next ?? payload?.hasNext ?? false),
    };
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const createJournalIssue = async (
  journalId: number,
  payload: AdminIssueCreate,
): Promise<AdminIssueListItem> => {
  try {
    const response = await apiFetch(`/v1/admin/journals/${journalId}/issues`, {
      method: "POST",
      body: payload,
    });
    return normalizeIssueResponse(response, journalId);
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const updateIssue = async (
  issueId: number,
  patch: AdminIssueUpdate,
): Promise<AdminIssueListItem> => {
  try {
    const response = await apiFetch(`/v1/admin/issues/${issueId}`, {
      method: "PATCH",
      body: patch,
    });
    return normalizeIssueResponse(response);
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const deleteIssue = async (issueId: number): Promise<void> => {
  try {
    await apiFetch(`/v1/admin/issues/${issueId}`, {method: "DELETE"});
  } catch (error) {
    throw mapToJournalError(error);
  }
};

const normalizeIssueResponse = (payload: any, fallbackJournalId?: number): AdminIssueListItem => ({
  id: Number(payload?.id ?? 0),
  journal_id: Number(payload?.journal_id ?? fallbackJournalId ?? 0),
  volume: payload?.volume ?? null,
  number: payload?.number ?? null,
  year: payload?.year ?? null,
  title: payload?.title ?? null,
  cover_image_url: payload?.cover_image_url ?? null,
  published_at: payload?.published_at ?? null,
  articles_count: Number(payload?.articles_count ?? 0),
  created_at: String(payload?.created_at ?? payload?.createdAt ?? ""),
});

export const presignUpload = async (contentType: string): Promise<PresignUploadResponse> => {
  try {
    const payload: any = await apiFetch("/v1/uploads/presign", {
      method: "POST",
      body: {content_type: contentType},
    });

    const uploadUrl: string =
      payload?.upload_url || payload?.url || payload?.put_url || payload?.signed_url || "";
    if (!uploadUrl) {
      throw new AdminJournalApiError({
        userMessage: "Upload URL missing.",
        code: "PRESIGN_INVALID",
        status: 500,
      });
    }
    const publicUrl: string =
      payload?.public_url ||
      (payload?.cdn_base && payload?.key ? `${payload.cdn_base}/${payload.key}` : undefined) ||
      uploadUrl.split("?")[0];

    return {
      uploadUrl,
      publicUrl,
      key: payload?.key,
      headers: payload?.headers,
    };
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export type ListJournalsParams = {
  q?: string;
  status?: "active" | "deleted" | "all";
  page?: number;
  pageSize?: number;
  sort?: "name" | "created_at";
  signal?: AbortSignal;
};

const ADMIN_JOURNALS_KEY = "admin:journals:list" as const;

export const ADMIN_JOURNALS_QUERY_KEYS = {
  list: (params: Omit<ListJournalsParams, "signal"> = {}) =>
    [ADMIN_JOURNALS_KEY, params] as const,
};

export const listJournals = async ({
  q,
  status = "active",
  page = 1,
  pageSize = 20,
  sort = "name",
  signal,
}: ListJournalsParams = {}): Promise<AdminJournalListResponse> => {
  try {
    const payload = await apiFetch(BASE_PATH, {
      signal,
      params: {
        q: q?.trim().length ? q.trim() : undefined,
        status,
        page,
        page_size: pageSize,
        sort,
      },
    });
    return normalizePaginated(payload);
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const createJournal = async (
  payload: AdminJournalCreateInput,
): Promise<AdminJournalListItem> => {
  try {
    const body = pruneUndefined({
      name: payload.name.trim(),
      slug: sanitizeOptional(payload.slug),
      issn: sanitizeOptional(payload.issn),
      description: sanitizeOptional(payload.description),
      publisher: sanitizeOptional(payload.publisher),
      cover_image_url: sanitizeOptional(payload.cover_image_url),
    });
    const response = await apiFetch(BASE_PATH, {
      method: "POST",
      body,
    });
    return normalizeJournal(response);
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const updateJournal = async (
  id: number,
  payload: AdminJournalUpdateInput,
): Promise<AdminJournalListItem> => {
  try {
    const body = pruneUndefined({
      name: sanitizeOptional(payload.name),
      slug: sanitizeOptional(payload.slug),
      issn: sanitizeOptional(payload.issn),
      description: sanitizeOptional(payload.description),
      publisher: sanitizeOptional(payload.publisher),
      cover_image_url: sanitizeOptional(payload.cover_image_url),
    });
    const response = await apiFetch(`${BASE_PATH}/${id}`, {
      method: "PATCH",
      body,
    });
    return normalizeJournal(response);
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const softDeleteJournal = async (id: number): Promise<void> => {
  try {
    await apiFetch(`${BASE_PATH}/${id}/soft-delete`, {method: "PATCH"});
  } catch (error) {
    throw mapToJournalError(error);
  }
};

export const restoreJournal = async (id: number): Promise<void> => {
  try {
    await apiFetch(`${BASE_PATH}/${id}/restore`, {method: "PATCH"});
  } catch (error) {
    throw mapToJournalError(error);
  }
};

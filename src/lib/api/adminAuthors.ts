"use client";

import {apiFetch} from "@/lib/api";

const BASE_PATH = "/v1/admin/authors";

export const ADMIN_AUTHORS_QUERY_KEYS = {
  all: ["admin:authors"] as const,
  list: (params: Record<string, unknown>) => ["admin:authors:list", params] as const,
};

export type AuthorListItem = {
  id: number;
  name_ar: string;
  name_latin: string;
  affiliation: string | null;
  slug: string;
  created_at: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export type CreateAuthorInput = {
  name_latin: string;
  name_ar?: string | null;
  affiliation?: string | null;
};

export type AdminAuthorApiErrorCode =
  | "SESSION_EXPIRED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class AdminAuthorApiError extends Error {
  userMessage: string;
  code: AdminAuthorApiErrorCode;
  status?: number;

  constructor({
    message,
    code,
    status,
  }: {
    message: string;
    code: AdminAuthorApiErrorCode;
    status?: number;
  }) {
    super(message);
    this.userMessage = message;
    this.code = code;
    this.status = status;
    this.name = "AdminAuthorApiError";
  }
}

const mapToAuthorError = (error: any): AdminAuthorApiError => {
  if (error instanceof AdminAuthorApiError) {
    return error;
  }
  if (error?.name === "AbortError") {
    throw error;
  }

  const status = typeof error?.status === "number" ? error.status : undefined;
  const detail = error?.payload?.detail ?? error?.payload ?? error?.message;
  const userMessage =
    (typeof detail === "object" && detail !== null ? detail.user_message : undefined) ||
    (typeof detail === "string" ? detail : undefined) ||
    "Unable to complete the request.";

  let code: AdminAuthorApiErrorCode = "UNKNOWN";
  if (!status) {
    code = "NETWORK_ERROR";
  } else if (status === 401) {
    code = "SESSION_EXPIRED";
  } else if (status === 403) {
    code = "FORBIDDEN";
  } else if (status === 409) {
    code = "CONFLICT";
  }

  return new AdminAuthorApiError({message: userMessage, code, status});
};

const normalizeAuthor = (payload: any): AuthorListItem => ({
  id: Number(payload.id),
  name_ar: payload.name_ar ?? "",
  name_latin: payload.name_latin ?? "",
  affiliation: payload.affiliation ?? null,
  slug: payload.slug ?? "",
  created_at: payload.created_at ?? "",
});

const normalizePaginated = (payload: any): Paginated<AuthorListItem> => ({
  items: Array.isArray(payload.items) ? payload.items.map(normalizeAuthor) : [],
  total: Number(payload.total ?? 0),
  page: Number(payload.page ?? 1),
  pageSize: Number(payload.page_size ?? payload.pageSize ?? 20),
  hasNext: Boolean(payload.has_next ?? payload.hasNext ?? false),
});

type ListAuthorsOptions = {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "name" | "created_at";
  signal?: AbortSignal;
};

export const listAuthors = async ({
  q,
  page = 1,
  pageSize = 20,
  sort = "name",
  signal,
}: ListAuthorsOptions = {}): Promise<Paginated<AuthorListItem>> => {
  try {
    const payload = await apiFetch(BASE_PATH, {
      signal,
      params: {
        q: q && q.trim().length ? q.trim() : undefined,
        page,
        page_size: pageSize,
        sort,
      },
    });
    return normalizePaginated(payload);
  } catch (error) {
    throw mapToAuthorError(error);
  }
};

export const createAuthor = async (payload: CreateAuthorInput): Promise<AuthorListItem> => {
  try {
    const body = {
      name_latin: payload.name_latin,
      name_ar: payload.name_ar?.trim() || undefined,
      affiliation: payload.affiliation?.trim() || undefined,
    };
    const response = await apiFetch(BASE_PATH, {
      method: "POST",
      body,
    });
    return normalizeAuthor(response);
  } catch (error) {
    throw mapToAuthorError(error);
  }
};


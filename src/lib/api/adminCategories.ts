"use client";

import {apiFetch} from "@/lib/api";

const BASE_PATH = "/v1/admin/categories";

export const CATEGORY_TREE_QUERY_KEY = ["admin:categories:tree"] as const;
export const CATEGORY_CHILDREN_QUERY_KEY = ["admin:categories:children"] as const;
export const CATEGORY_LIST_QUERY_KEY = ["admin:categories:list"] as const;

export type CategoryKind = "section" | "journal" | "archive_collection" | "topic";

export type AdminCategoryItem = {
  id: number;
  name: string;
  slug: string;
  kind: CategoryKind;
  parent_id: number | null;
  journal_id?: number | null;
};

export type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  kind: CategoryKind;
  parent_id: number | null;
  order: number | null;
  document_count?: number | null;
  children?: CategoryNode[];
};

export type CategoryPathFragment = {
  id: number;
  slug: string;
  name: string;
};

export type CategoryListItem = {
  id: number;
  name: string;
  slug: string;
  kind: CategoryKind;
  parent_id: number | null;
  order: number | null;
  document_count: number;
  created_at: string;
  path: CategoryPathFragment[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export type CreateCategoryInput = {
  name: string;
  slug?: string | null;
  kind: CategoryKind;
  parent_id?: number | null;
  order?: number | null;
};

export type UpdateCategoryInput = {
  name?: string;
  slug?: string | null;
  parent_id?: number | null;
  order?: number | null;
};

export type ReorderItem = {
  id: number;
  order: number;
};

export type ReorderCategoriesInput = {
  parentId?: number | null;
  items: ReorderItem[];
};

export type AdminCategoryApiErrorCode =
  | "SESSION_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class AdminCategoryApiError extends Error {
  userMessage: string;
  code: AdminCategoryApiErrorCode;
  status?: number;
  payload?: unknown;

  constructor({
    message,
    code,
    status,
    payload,
  }: {
    message: string;
    code: AdminCategoryApiErrorCode;
    status?: number;
    payload?: unknown;
  }) {
    super(message);
    this.userMessage = message;
    this.code = code;
    this.status = status;
    this.payload = payload;
    this.name = "AdminCategoryApiError";
  }
}

const mapToCategoryError = (error: any): AdminCategoryApiError => {
  if (error instanceof AdminCategoryApiError) {
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
    "Request failed. Please try again.";
  let code: AdminCategoryApiErrorCode = "UNKNOWN";
  if (!status) {
    code = "NETWORK_ERROR";
  } else if (status === 401) {
    code = "SESSION_EXPIRED";
  } else if (status === 403) {
    code = "FORBIDDEN";
  } else if (status === 404) {
    code = "NOT_FOUND";
  } else if (status === 409) {
    code = "CONFLICT";
  }
  return new AdminCategoryApiError({message: userMessage, code, status, payload: error?.payload});
};

const normalizeNode = (payload: any): CategoryNode => ({
  id: Number(payload.id),
  name: payload.name ?? "",
  slug: payload.slug ?? "",
  kind: payload.kind,
  parent_id: payload.parent_id ?? null,
  order: payload.order ?? payload.order_index ?? null,
  document_count:
    typeof payload.document_count === "number" ? payload.document_count : payload.documentCount ?? null,
  children: Array.isArray(payload.children) ? payload.children.map(normalizeNode) : undefined,
});

const normalizeCategory = (p: any): AdminCategoryItem => ({
  id: Number(p?.id ?? 0),
  name: p?.name ?? "",
  slug: p?.slug ?? "",
  kind: p?.kind ?? "topic",
  parent_id: p?.parent_id ?? null,
  journal_id: p?.journal_id ?? null,
});

const normalizeListItem = (payload: any): CategoryListItem => ({
  id: Number(payload.id),
  name: payload.name ?? "",
  slug: payload.slug ?? "",
  kind: payload.kind,
  parent_id: payload.parent_id ?? null,
  order: payload.order ?? payload.order_index ?? null,
  document_count: Number(payload.document_count ?? payload.documentCount ?? 0),
  created_at: payload.created_at ?? "",
  path: Array.isArray(payload.path)
    ? payload.path.map((fragment: any) => ({
        id: Number(fragment.id),
        slug: fragment.slug ?? "",
        name: fragment.name ?? "",
      }))
    : [],
});

const normalizePaginated = <T>(payload: any, mapItem: (item: any) => T): Paginated<T> => ({
  items: Array.isArray(payload.items) ? payload.items.map(mapItem) : [],
  total: Number(payload.total ?? 0),
  page: Number(payload.page ?? 1),
  pageSize: Number(payload.page_size ?? payload.pageSize ?? 20),
  hasNext: Boolean(payload.has_next ?? payload.hasNext ?? false),
});

export const getCategoryTree = async ({
  kind,
  maxDepth = 2,
  includeCounts = true,
  signal,
}: {
  kind?: CategoryKind | null;
  maxDepth?: number;
  includeCounts?: boolean;
  signal?: AbortSignal;
}): Promise<CategoryNode[]> => {
  try {
    const payload = await apiFetch(`${BASE_PATH}/tree`, {
      signal,
      params: {
        kind: kind ?? undefined,
        max_depth: maxDepth,
        include_counts: includeCounts,
      },
    });
    return Array.isArray(payload) ? payload.map(normalizeNode) : [];
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const getCategoryChildren = async ({
  parentId,
  signal,
}: {
  parentId: number;
  signal?: AbortSignal;
}): Promise<AdminCategoryItem[]> => {
  try {
    const payload: any = await apiFetch(`${BASE_PATH}/children/${parentId}`, {signal});
    const raw = Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];
    return raw.map(normalizeCategory);
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const listCategories = async ({
  q,
  kind,
  parentId,
  page = 1,
  pageSize = 50,
  sort = "name",
  signal,
}: {
  q?: string;
  kind?: string;
  parentId?: number | null;
  page?: number;
  pageSize?: number;
  sort?: string;
  signal?: AbortSignal;
}): Promise<{items: AdminCategoryItem[]; [key: string]: any}> => {
  try {
    const payload: any = await apiFetch(`${BASE_PATH}/list`, {
      signal,
      params: {
        q: q?.trim() || undefined,
        kind,
        parent_id: parentId ?? undefined,
        page,
        page_size: pageSize,
        sort,
      },
    });
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return {
      ...payload,
      items: items.map(normalizeCategory),
    };
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const createCategory = async (payload: CreateCategoryInput): Promise<CategoryNode> => {
  try {
    const data = await apiFetch(BASE_PATH, {
      method: "POST",
      body: {
        name: payload.name,
        slug: payload.slug ?? undefined,
        kind: payload.kind,
        parent_id: payload.parent_id ?? null,
        order: payload.order ?? null,
      },
    });
    return normalizeNode(data);
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const updateCategory = async ({
  id,
  patch,
}: {
  id: number;
  patch: UpdateCategoryInput;
}): Promise<CategoryNode> => {
  try {
    const body: Record<string, unknown> = {};
    if (patch.name !== undefined) body.name = patch.name;
    if (patch.slug !== undefined) body.slug = patch.slug;
    if (patch.parent_id !== undefined) body.parent_id = patch.parent_id;
    if (patch.order !== undefined) body.order = patch.order;
    const data = await apiFetch(`${BASE_PATH}/${id}`, {
      method: "PATCH",
      body,
    });
    return normalizeNode(data);
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const reorderCategories = async ({parentId, items}: ReorderCategoriesInput): Promise<void> => {
  try {
    await apiFetch(`${BASE_PATH}/reorder`, {
      method: "PATCH",
      body: {
        parent_id: parentId ?? null,
        items,
      },
    });
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

/**
 * Move a category to a new parent/order.
 *
 * @example
 * ```ts
 * await moveCategory(42, { parentId: 7, order: 0 });
 * ```
 */
export const moveCategory = async (
  id: number,
  {parentId, order}: {parentId?: number | null; order?: number | null},
): Promise<CategoryNode> => {
  try {
    const data = await apiFetch(`${BASE_PATH}/${id}/move`, {
      method: "PATCH",
      body: {
        parent_id: parentId ?? null,
        order: order ?? null,
      },
    });
    return normalizeNode(data);
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await apiFetch(`${BASE_PATH}/${id}`, {method: "DELETE"});
  } catch (error) {
    throw mapToCategoryError(error);
  }
};

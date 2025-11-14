"use client";

import {apiFetch} from "@/lib/api";

type EndpointStatus = "unknown" | "enabled" | "disabled";

export type AdminUserRecord = {
  id: number | string | null;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string | null;
};

export type AdminUsersListResponse = {
  items: AdminUserRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminApiErrorCode =
  | "SESSION_EXPIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "NOT_SUPPORTED"
  | "UNKNOWN";

export class AdminApiError extends Error {
  userMessage: string;
  code: AdminApiErrorCode;
  status?: number;
  isAdminApiError = true;

  constructor({
    userMessage,
    code,
    status,
  }: {
    userMessage: string;
    code: AdminApiErrorCode;
    status?: number;
  }) {
    super(userMessage);
    this.userMessage = userMessage;
    this.code = code;
    this.status = status;
    this.name = "AdminApiError";
  }
}

type ListUsersInput = {
  page?: number;
  pageSize?: number;
  role?: string;
  q?: string;
  signal?: AbortSignal;
};

type CreateUserInput = {
  email: string;
  password: string;
  roles?: string[];
  signal?: AbortSignal;
};

type SetUserActiveInput = {
  userId: number | string;
  is_active: boolean;
  signal?: AbortSignal;
};

type SetUserRolesInput = {
  userId: number | string;
  roles: string[];
  currentRoles?: string[];
  signal?: AbortSignal;
};

const DEFAULT_ADMIN_ROLE = "researcher";
const MAX_PAGE_SIZE = 100;

const friendlyMessages = {
  sessionExpired: "Session expired.",
  notAuthorized: "Not authorized for this action.",
  network: "Network issue, please retry.",
  notFound: "Resource not found.",
  notSupported: "This action is not supported right now.",
  default: "Request failed. Please try again.",
};

const endpointSupport: Record<"users" | "roles" | "active", EndpointStatus> = {
  users: "unknown",
  roles: "unknown",
  active: "unknown",
};

const sanitizeRolesInput = (roles?: string[]) => {
  if (!roles) return [];
  return roles
    .filter((role) => typeof role === "string")
    .map((role) => role.trim().toLowerCase())
    .filter((role) => role.length > 0);
};

const normalizeRoleValue = (role: unknown) => {
  if (!role) return "";
  if (typeof role === "string") {
    return role.trim().toLowerCase();
  }
  if (typeof role === "object" && role !== null) {
    const value = (role as {role?: string}).role;
    if (typeof value === "string") {
      return value.trim().toLowerCase();
    }
  }
  return "";
};

const normalizeAdminUser = (payload: any = {}): AdminUserRecord => {
  const rawRoles = Array.isArray(payload.roles) ? payload.roles : [];
  return {
    id: payload.id ?? payload.user_id ?? payload.userId ?? null,
    email: typeof payload.email === "string" ? payload.email : "",
    is_active: Boolean(
      payload.is_active ?? payload.isActive ?? payload.active ?? true,
    ),
    roles: rawRoles.map((role) => normalizeRoleValue(role)).filter(Boolean),
    created_at: payload.created_at ?? payload.createdAt ?? payload.created ?? null,
  };
};

const resolveAdminUsersPage = (
  payload: any = {},
  defaults: {page: number; pageSize: number},
): AdminUsersListResponse => {
  const fallbackPage = defaults.page;
  const fallbackPageSize = defaults.pageSize;
  const itemsPayload = Array.isArray(payload.items) ? payload.items : [];
  const page = Number(payload.page ?? fallbackPage) || fallbackPage;
  const pageSize =
    Number(payload.page_size ?? payload.pageSize ?? fallbackPageSize) || fallbackPageSize;
  const total = Number(payload.total ?? itemsPayload.length) || 0;
  return {
    items: itemsPayload.map((item: any) => normalizeAdminUser(item)),
    total,
    page,
    pageSize,
  };
};

const buildLegacyAdminUsersPage = (
  users: any[],
  {page, pageSize, q, role}: {page: number; pageSize: number; q: string; role: string},
): AdminUsersListResponse => {
  const normalizedUsers = Array.isArray(users) ? users.map((item) => normalizeAdminUser(item)) : [];
  const query = q.toLowerCase();
  const roleFilter = role.toLowerCase();

  const filtered = normalizedUsers.filter((user) => {
    const matchesQuery = query ? user.email.toLowerCase().includes(query) : true;
    const matchesRole = roleFilter === "all" ? true : user.roles.includes(roleFilter);
    return matchesQuery && matchesRole;
  });

  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(Math.min(pageSize, MAX_PAGE_SIZE), 1);
  const offset = (safePage - 1) * safePageSize;
  const paged = filtered.slice(offset, offset + safePageSize);

  return {
    items: paged,
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize,
  };
};

const fetchLegacyUsers = async ({
  page,
  pageSize,
  q,
  role,
  signal,
}: {
  page: number;
  pageSize: number;
  q: string;
  role: string;
  signal?: AbortSignal;
}) => {
  const payload = await apiFetch("/v1/auth/users", {
    signal,
    noCache: true,
  });
  return buildLegacyAdminUsersPage(payload || [], {page, pageSize, q, role});
};

const legacyCreateUser = async ({
  email,
  password,
  roles,
  signal,
}: CreateUserInput): Promise<AdminUserRecord> => {
  const payload = await apiFetch("/v1/auth/signup", {
    method: "POST",
    body: {email, password},
    signal,
    noCache: true,
  });
  const normalizedRoles = sanitizeRolesInput(roles?.length ? roles : [DEFAULT_ADMIN_ROLE]);
  const userId = payload?.user?.id ?? payload?.id;

  if (userId !== undefined && userId !== null) {
    for (const role of normalizedRoles) {
      await addUserRoleRequest(userId, role, signal);
    }
  }

  return normalizeAdminUser({
    ...(payload?.user ?? payload ?? {}),
    id: userId,
    roles: normalizedRoles,
  });
};

const isMissingEndpointError = (error: any) => {
  const status = error?.status;
  return status === 404 || status === 405 || status === 501;
};

const markEndpointDisabled = (key: keyof typeof endpointSupport) => {
  endpointSupport[key] = "disabled";
};

const markEndpointEnabled = (key: keyof typeof endpointSupport) => {
  endpointSupport[key] = "enabled";
};

const mapToAdminError = (error: any, fallbackMessage: string) => {
  if (!error) {
    return new AdminApiError({
      userMessage: friendlyMessages.default,
      code: "UNKNOWN",
    });
  }

  if (error.name === "AbortError") {
    throw error;
  }

  if (error instanceof AdminApiError) {
    return error;
  }

  const status = error.status ?? null;
  if (status === 401) {
    return new AdminApiError({
      userMessage: friendlyMessages.sessionExpired,
      code: "SESSION_EXPIRED",
      status,
    });
  }
  if (status === 403) {
    return new AdminApiError({
      userMessage: friendlyMessages.notAuthorized,
      code: "FORBIDDEN",
      status,
    });
  }
  if (status === 404) {
    return new AdminApiError({
      userMessage: friendlyMessages.notFound,
      code: "NOT_FOUND",
      status,
    });
  }
  if (status && status >= 500) {
    return new AdminApiError({
      userMessage: friendlyMessages.default,
      code: "UNKNOWN",
      status,
    });
  }
  if (error.name === "TypeError" || error.code === "ECONNREFUSED") {
    return new AdminApiError({
      userMessage: friendlyMessages.network,
      code: "NETWORK_ERROR",
    });
  }

  return new AdminApiError({
    userMessage: fallbackMessage || friendlyMessages.default,
    code: "UNKNOWN",
    status: error.status,
  });
};

const readSearchQuery = (value?: string | null) => (value ?? "").trim();
const clampPageSize = (value?: number) => Math.max(Math.min(value ?? 20, MAX_PAGE_SIZE), 1);

export const listUsers = async ({
  page = 1,
  pageSize = 20,
  role = "all",
  q = "",
  signal,
}: ListUsersInput): Promise<AdminUsersListResponse> => {
  const normalizedRole = role === "" ? "all" : role;
  const safePage = Math.max(page, 1);
  const safePageSize = clampPageSize(pageSize);
  const trimmedQuery = readSearchQuery(q);

  if (endpointSupport.users !== "disabled") {
    try {
      const payload = await apiFetch("/v1/admin/users", {
        params: {
          page: safePage,
          page_size: safePageSize,
          role: normalizedRole !== "all" ? normalizedRole : undefined,
          q: trimmedQuery || undefined,
        },
        signal,
        noCache: true,
      });
      markEndpointEnabled("users");
      return resolveAdminUsersPage(payload, {page: safePage, pageSize: safePageSize});
    } catch (error) {
      if (isMissingEndpointError(error)) {
        markEndpointDisabled("users");
      } else {
        throw mapToAdminError(error, friendlyMessages.default);
      }
    }
  }

  try {
    return await fetchLegacyUsers({
      page: safePage,
      pageSize: safePageSize,
      role: normalizedRole,
      q: trimmedQuery,
      signal,
    });
  } catch (error) {
    throw mapToAdminError(error, friendlyMessages.default);
  }
};

export const createUser = async (input: CreateUserInput): Promise<AdminUserRecord> => {
  const {email, password, roles, signal} = input;
  if (endpointSupport.users !== "disabled") {
    try {
      const payload = await apiFetch("/v1/admin/users", {
        method: "POST",
        body: {
          email,
          password,
          roles: sanitizeRolesInput(roles?.length ? roles : [DEFAULT_ADMIN_ROLE]),
        },
        signal,
        noCache: true,
      });
      markEndpointEnabled("users");
      return normalizeAdminUser(payload);
    } catch (error) {
      if (isMissingEndpointError(error)) {
        markEndpointDisabled("users");
      } else {
        throw mapToAdminError(error, friendlyMessages.default);
      }
    }
  }

  try {
    return await legacyCreateUser(input);
  } catch (error) {
    throw mapToAdminError(error, friendlyMessages.default);
  }
};

export const setUserActive = async ({
  userId,
  is_active,
  signal,
}: SetUserActiveInput): Promise<AdminUserRecord> => {
  try {
    const payload = await apiFetch(`/v1/admin/users/${userId}/active`, {
      method: "PATCH",
      body: {is_active},
      signal,
      noCache: true,
    });
    markEndpointEnabled("active");
    return normalizeAdminUser(payload);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      markEndpointDisabled("active");
      throw new AdminApiError({
        userMessage: friendlyMessages.notSupported,
        code: "NOT_SUPPORTED",
      });
    }
    throw mapToAdminError(error, friendlyMessages.default);
  }
};

const fetchUserSnapshot = async (
  userId: number | string,
  signal?: AbortSignal,
): Promise<AdminUserRecord> => {
  if (endpointSupport.users !== "disabled") {
    try {
      const payload = await apiFetch(`/v1/admin/users/${userId}`, {
        signal,
        noCache: true,
      });
      markEndpointEnabled("users");
      return normalizeAdminUser(payload);
    } catch (error) {
      if (isMissingEndpointError(error)) {
        markEndpointDisabled("users");
      } else {
        throw mapToAdminError(error, friendlyMessages.default);
      }
    }
  }

  try {
    const payload = await apiFetch(`/v1/auth/users/${userId}`, {
      signal,
      noCache: true,
    });
    return normalizeAdminUser(payload);
  } catch (error) {
    throw mapToAdminError(error, friendlyMessages.default);
  }
};

const addUserRoleRequest = async (userId: number | string, role: string, signal?: AbortSignal) => {
  if (userId === undefined || userId === null) {
    throw new AdminApiError({
      userMessage: friendlyMessages.default,
      code: "UNKNOWN",
    });
  }

  const requestConfig = {
    method: "POST",
    body: {role},
    signal,
    noCache: true,
  } as const;

  if (endpointSupport.roles !== "disabled") {
    try {
      await apiFetch(`/v1/admin/users/${userId}/roles`, requestConfig);
      markEndpointEnabled("roles");
      return;
    } catch (error) {
      if (isMissingEndpointError(error)) {
        markEndpointDisabled("roles");
      } else {
        throw error;
      }
    }
  }

  await apiFetch(`/v1/auth/users/${userId}/roles`, requestConfig);
};

const removeUserRoleRequest = async (
  userId: number | string,
  role: string,
  signal?: AbortSignal,
) => {
  if (userId === undefined || userId === null) {
    throw new AdminApiError({
      userMessage: friendlyMessages.default,
      code: "UNKNOWN",
    });
  }

  const encodedRole = encodeURIComponent(role);
  const requestConfig = {
    method: "DELETE",
    signal,
    noCache: true,
  } as const;

  if (endpointSupport.roles !== "disabled") {
    try {
      await apiFetch(`/v1/admin/users/${userId}/roles/${encodedRole}`, requestConfig);
      markEndpointEnabled("roles");
      return;
    } catch (error) {
      if (isMissingEndpointError(error)) {
        markEndpointDisabled("roles");
      } else {
        throw error;
      }
    }
  }

  await apiFetch(`/v1/auth/users/${userId}/roles/${encodedRole}`, requestConfig);
};

const replaceUserRolesAdminRequest = async (
  userId: number | string,
  roles: string[],
  signal?: AbortSignal,
): Promise<AdminUserRecord | null> => {
  if (endpointSupport.roles === "disabled") {
    return null;
  }

  try {
    const payload = await apiFetch(`/v1/admin/users/${userId}/roles`, {
      method: "PATCH",
      body: {roles},
      signal,
      noCache: true,
    });
    markEndpointEnabled("roles");
    return normalizeAdminUser(payload);
  } catch (error) {
    if (isMissingEndpointError(error)) {
      markEndpointDisabled("roles");
      return null;
    }
    throw mapToAdminError(error, friendlyMessages.default);
  }
};

const rollbackRoleChanges = async (
  userId: number | string,
  added: string[],
  removed: string[],
  signal?: AbortSignal,
) => {
  for (const role of added) {
    try {
      await removeUserRoleRequest(userId, role, signal);
    } catch {
      // Best-effort rollback.
    }
  }
  for (const role of removed) {
    try {
      await addUserRoleRequest(userId, role, signal);
    } catch {
      // Best-effort rollback.
    }
  }
};

export const setUserRoles = async ({
  userId,
  roles,
  currentRoles,
  signal,
}: SetUserRolesInput): Promise<AdminUserRecord> => {
  const sanitizedRoles = sanitizeRolesInput(roles);
  const targetRoles = sanitizedRoles.length > 0 ? sanitizedRoles : [DEFAULT_ADMIN_ROLE];
  let fetchedSnapshot: AdminUserRecord | null = null;

  const adminReplacementResult = await replaceUserRolesAdminRequest(userId, targetRoles, signal);
  if (adminReplacementResult) {
    return adminReplacementResult;
  }

  const ensureSnapshot = async () => {
    if (!fetchedSnapshot) {
      fetchedSnapshot = await fetchUserSnapshot(userId, signal);
    }
    return fetchedSnapshot;
  };

  const baselineRoles = currentRoles
    ? sanitizeRolesInput(currentRoles)
    : (await ensureSnapshot()).roles;

  const rolesToAdd = targetRoles.filter((role) => !baselineRoles.includes(role));
  const rolesToRemove = baselineRoles.filter((role) => !targetRoles.includes(role));

  if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
    const snapshot =
      currentRoles !== undefined
        ? normalizeAdminUser({
            id: userId,
            roles: targetRoles,
          })
        : await fetchUserSnapshot(userId, signal);
    return {
      ...snapshot,
      roles: targetRoles,
    };
  }

  const appliedAdds: string[] = [];
  const appliedRemovals: string[] = [];

  try {
    for (const role of rolesToAdd) {
      await addUserRoleRequest(userId, role, signal);
      appliedAdds.push(role);
    }
    for (const role of rolesToRemove) {
      await removeUserRoleRequest(userId, role, signal);
      appliedRemovals.push(role);
    }
  } catch (error) {
    await rollbackRoleChanges(userId, appliedAdds, appliedRemovals, signal);
    throw mapToAdminError(error, friendlyMessages.default);
  }

  const snapshot =
    currentRoles !== undefined
      ? normalizeAdminUser({
          id: userId,
          roles: targetRoles,
        })
      : await ensureSnapshot().catch(() =>
          normalizeAdminUser({id: userId, roles: targetRoles}),
        );

  return {
    ...snapshot,
    roles: targetRoles,
  };
};

"use client";

import {apiFetch} from "@/lib/api";

export const ADMIN_CAPABILITIES_QUERY_KEY = ["admin:capabilities"] as const;
const ADMIN_CAPABILITIES_PATH = "/v1/admin/capabilities";

export type AdminCapabilities = {
  users: {
    list: boolean;
    create: boolean;
    roles: {
      add: boolean;
      remove: boolean;
      replace: boolean;
    };
    activate: boolean;
  };
  documents: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    restore: boolean;
    presign: boolean;
  };
  categories: {
    treeRead: boolean;
    treeWrite: boolean;
    reorder: boolean;
  };
  authors: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    softDelete: boolean;
    restore: boolean;
  };
  journals: {
    list: boolean;
    create: boolean;
    update: boolean;
    softDelete: boolean;
    restore: boolean;
    coverPresign: boolean;
  };
  collections: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    assignDocs: boolean;
    coverPresign: boolean;
  };
  events: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  uploads: {
    presign: boolean;
  };
};

type FetchAdminCapabilitiesOptions = {
  signal?: AbortSignal;
};

export const getAdminCapabilities = async (
  options: FetchAdminCapabilitiesOptions = {},
): Promise<AdminCapabilities> => {
  const {signal} = options;
  return apiFetch(ADMIN_CAPABILITIES_PATH, {signal}) as Promise<AdminCapabilities>;
};

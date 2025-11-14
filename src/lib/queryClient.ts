"use client";

import {QueryClient, type QueryClientConfig} from "@tanstack/react-query";

const THIRTY_SECONDS = 30_000;
const DEFAULT_QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: THIRTY_SECONDS,
      gcTime: THIRTY_SECONDS * 4,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
};

const createQueryClient = () => new QueryClient(DEFAULT_QUERY_CLIENT_CONFIG);

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Always create a new instance per request on the server to avoid leaking state.
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
};

export const queryClientConfig = DEFAULT_QUERY_CLIENT_CONFIG;


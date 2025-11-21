declare module "@/lib/api" {
  export type ApiFetchOptions = {
    params?: Record<string, unknown>;
    signal?: AbortSignal;
    noCache?: boolean;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  };

  export function apiFetch<T = unknown>(path: string, options?: ApiFetchOptions): Promise<T>;
}

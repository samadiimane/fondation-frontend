const trimTrailingSlash = (value = "") => String(value || "").replace(/\/+$/, "");

const getPublicApiBaseUrl = () =>
  trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_BASEPATH ||
      ""
  );

export const getBrowserApiBaseUrl = () => getPublicApiBaseUrl();

export const getServerApiBaseUrl = () =>
  trimTrailingSlash(process.env.INTERNAL_API_BASE_URL || getPublicApiBaseUrl());

export const getApiBaseUrl = () =>
  typeof window === "undefined" ? getServerApiBaseUrl() : getBrowserApiBaseUrl();


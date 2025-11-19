"use client";

import {useQuery} from "@tanstack/react-query";

import {
  ADMIN_CAPABILITIES_QUERY_KEY,
  getAdminCapabilities,
  type AdminCapabilities,
} from "@/lib/api/adminCapabilities";

type UseAdminCapabilitiesResult = {
  data: AdminCapabilities | undefined;
  isLoading: boolean;
  isError: boolean;
};

const CAPABILITIES_STALE_TIME = 5 * 60_000;

export const useAdminCapabilities = (): UseAdminCapabilitiesResult => {
  const query = useQuery({
    queryKey: ADMIN_CAPABILITIES_QUERY_KEY,
    queryFn: ({signal}) => getAdminCapabilities({signal}),
    staleTime: CAPABILITIES_STALE_TIME,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export default useAdminCapabilities;

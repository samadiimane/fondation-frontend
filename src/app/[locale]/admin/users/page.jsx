"use client";

import {useCallback, useEffect, useMemo} from "react";
import {useTranslations} from "next-intl";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import AdminUsersToolbar from "@/components/admin/users/AdminUsersToolbar";
import UsersTable from "@/components/admin/users/UsersTable";
import {createUser, listUsers, setUserActive, setUserRoles} from "@/lib/api/admin";
import useNotify from "@/hooks/useNotify";
import useAuth from "@/hooks/useAuth";

const PAGE_SIZE = 20;
const BASE_QUERY_KEY = ["admin-users"];

const parsePage = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
};

const AdminUsersPage = () => {
  const t = useTranslations("admin.users");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const {logout} = useAuth();

  const query = searchParams.get("q") ?? "";
  const role = searchParams.get("role") ?? "all";
  const page = parsePage(searchParams.get("page"));

  const listQueryKey = useMemo(
    () => [...BASE_QUERY_KEY, {page, pageSize: PAGE_SIZE, role, q: query}],
    [page, role, query],
  );

  const updateUrl = useCallback(
    ({nextQuery, nextRole, nextPage}) => {
      const params = new URLSearchParams();
      if (nextQuery) {
        params.set("q", nextQuery);
      }
      if (nextRole && nextRole !== "all") {
        params.set("role", nextRole);
      }
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }
      const search = params.toString();
      const target = search ? `${pathname}?${search}` : pathname;
      router.replace(target, {scroll: false});
    },
    [pathname, router],
  );

  const handleApiError = useCallback(
    (error, fallbackKey = "toast.error") => {
      notify.handleError(error, t(fallbackKey), {
        sessionExpiredMessage: t("toast.sessionExpired", {defaultMessage: "Session expired."}),
        forbiddenMessage: t("toast.notAuthorized", {defaultMessage: "Not authorized for this action."}),
        networkMessage: t("toast.networkError", {defaultMessage: "Network problem, please retry."}),
        onSessionExpired: () => logout?.(),
      });
    },
    [logout, notify, t],
  );

  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: ({signal}) => listUsers({page, pageSize: PAGE_SIZE, role, q: query, signal}),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (listQuery.error) {
      handleApiError(listQuery.error, "errorLoading");
    }
  }, [handleApiError, listQuery.error]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({queryKey: BASE_QUERY_KEY});
      const previous = queryClient.getQueryData(listQueryKey);
      let tempId = null;

      if (page === 1 && previous) {
        tempId = `temp-${Date.now()}`;
        const optimisticUser = {
          id: tempId,
          email: variables.email,
          is_active: true,
          roles: variables.roles ?? ["researcher"],
          created_at: new Date().toISOString(),
        };
        const nextItems = [optimisticUser, ...previous.items];
        if (nextItems.length > PAGE_SIZE) {
          nextItems.pop();
        }
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: nextItems,
          total: previous.total + 1,
        });
      }

      return {previous, tempId};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      handleApiError(error);
    },
    onSuccess: (result, _variables, context) => {
      if (context?.tempId) {
        queryClient.setQueryData(listQueryKey, (current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((item) => (item.id === context.tempId ? result : item)),
          };
        });
      }
      notify.success(t("toast.created"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: BASE_QUERY_KEY});
    },
  });

  const setUserActiveMutation = useMutation({
    mutationFn: setUserActive,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({queryKey: BASE_QUERY_KEY});
      const previous = queryClient.getQueryData(listQueryKey);
      if (previous) {
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: previous.items.map((item) =>
            item.id === variables.userId ? {...item, is_active: variables.is_active} : item,
          ),
        });
      }
      return {previous};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      handleApiError(error);
    },
    onSuccess: (_result, variables) => {
      notify.success(
        variables.is_active ? t("toast.activated") : t("toast.deactivated"),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: BASE_QUERY_KEY});
    },
  });

  const setUserRolesMutation = useMutation({
    mutationFn: setUserRoles,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({queryKey: BASE_QUERY_KEY});
      const previous = queryClient.getQueryData(listQueryKey);
      if (previous) {
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: previous.items.map((item) =>
            item.id === variables.userId ? {...item, roles: variables.roles} : item,
          ),
        });
      }
      return {previous};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      handleApiError(error);
    },
    onSuccess: () => {
      notify.success(t("toast.rolesUpdated"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: BASE_QUERY_KEY});
    },
  });

  const handleQueryChange = useCallback(
    (value) => {
      const normalized = value ?? "";
      if (normalized === query) return;
      updateUrl({nextQuery: normalized, nextRole: role, nextPage: 1});
    },
    [query, role, updateUrl],
  );

  const handleRoleChange = useCallback(
    (value) => {
      const nextRole = value || "all";
      if (nextRole === role) return;
      updateUrl({nextQuery: query, nextRole, nextPage: 1});
    },
    [query, role, updateUrl],
  );

  const handlePageChange = useCallback(
    (nextPage) => {
      const parsed = parsePage(nextPage);
      if (parsed === page) return;
      updateUrl({nextQuery: query, nextRole: role, nextPage: parsed});
    },
    [page, query, role, updateUrl],
  );

  const handleCreateUser = useCallback(
    async (payload) => {
      await createUserMutation.mutateAsync(payload);
    },
    [createUserMutation],
  );

  const handleToggleActive = useCallback(
    (payload) => setUserActiveMutation.mutateAsync(payload),
    [setUserActiveMutation],
  );

  const handleSetUserRoles = useCallback(
    (payload) => setUserRolesMutation.mutateAsync(payload),
    [setUserRolesMutation],
  );

  const total = listQuery.data?.total ?? 0;
  const currentPageSize = listQuery.data?.pageSize ?? PAGE_SIZE;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm uppercase text-primary/80">{t("title")}</p>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{t("title")}</h1>
        <p className="text-[15px] text-muted-foreground">{t("description")}</p>
      </header>
      <AdminUsersToolbar
        query={query}
        role={role}
        total={total}
        onQueryChange={handleQueryChange}
        onRoleChange={handleRoleChange}
        onCreateUser={handleCreateUser}
        isCreatingUser={createUserMutation.isPending}
        isRefreshing={listQuery.isFetching && !listQuery.isLoading}
      />
      <UsersTable
        data={listQuery.data}
        isLoading={listQuery.isLoading}
        isFetching={listQuery.isFetching}
        error={listQuery.error}
        onRetry={() => listQuery.refetch()}
        page={page}
        pageSize={currentPageSize}
        onPageChange={handlePageChange}
        onToggleActive={handleToggleActive}
        onSetUserRoles={handleSetUserRoles}
        activationPendingId={
          setUserActiveMutation.isPending ? setUserActiveMutation.variables?.userId : null
        }
        rolesPendingUserId={
          setUserRolesMutation.isPending ? setUserRolesMutation.variables?.userId : null
        }
      />
    </div>
  );
};

export default AdminUsersPage;

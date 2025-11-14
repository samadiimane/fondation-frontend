"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AdminUsersToolbar from "@/components/admin/users/AdminUsersToolbar";
import UsersTable from "@/components/admin/users/UsersTable";
import { getAdminUsers } from "@/lib/api";

const PAGE_SIZE = 20;

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

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [role, setRole] = useState(searchParams.get("role") ?? "all");
  const [page, setPage] = useState(parsePage(searchParams.get("page")));

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateUrl = useCallback(
    ({ nextQuery, nextRole, nextPage }) => {
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
      router.replace(target, { scroll: false });
    },
    [pathname, router],
  );

  const fetchUsers = useCallback(
    async ({ signal }) => {
      const payload = await getAdminUsers({
        q: query,
        role,
        page,
        pageSize: PAGE_SIZE,
        signal,
      });
      setData(payload);
    },
    [page, query, role],
  );

  useEffect(() => {
    const paramsQuery = searchParams.get("q") ?? "";
    const paramsRole = searchParams.get("role") ?? "all";
    const paramsPage = parsePage(searchParams.get("page"));

    if (paramsQuery !== query) {
      setQuery(paramsQuery);
    }
    if (paramsRole !== role) {
      setRole(paramsRole);
    }
    if (paramsPage !== page) {
      setPage(paramsPage);
    }
  }, [searchParams, query, role, page]);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    setIsLoading(true);
    setError(null);
    fetchUsers({ signal: controller.signal })
      .catch((err) => {
        if (controller.signal.aborted || !mounted) return;
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
        setIsRefreshing(false);
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchUsers]);

  const handleRefetch = useCallback(
    async ({ soft } = {}) => {
      const controller = new AbortController();
      if (soft) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      try {
        await fetchUsers({ signal: controller.signal });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (soft) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [fetchUsers],
  );

  const handleQueryChange = useCallback(
    (value) => {
      const normalized = value ?? "";
      if (normalized === query) return;
      setQuery(normalized);
      setPage(1);
      updateUrl({ nextQuery: normalized, nextRole: role, nextPage: 1 });
    },
    [query, role, updateUrl],
  );

  const handleRoleChange = useCallback(
    (value) => {
      const nextRole = value || "all";
      if (nextRole === role) return;
      setRole(nextRole);
      setPage(1);
      updateUrl({ nextQuery: query, nextRole, nextPage: 1 });
    },
    [query, role, updateUrl],
  );

  const handlePageChange = useCallback(
    (nextPage) => {
      const parsed = parsePage(nextPage);
      if (parsed === page) return;
      setPage(parsed);
      updateUrl({ nextQuery: query, nextRole: role, nextPage: parsed });
    },
    [page, query, role, updateUrl],
  );

  const handleUserCreated = useCallback(() => {
    setPage(1);
    updateUrl({ nextQuery: query, nextRole: role, nextPage: 1 });
    handleRefetch({ soft: false });
  }, [handleRefetch, query, role, updateUrl]);

  const total = data?.total ?? 0;
  const currentPageSize = data?.pageSize ?? PAGE_SIZE;

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
        onUserCreated={handleUserCreated}
        isRefreshing={isRefreshing && !isLoading}
      />
      <UsersTable
        data={data}
        isLoading={isLoading}
        error={error}
        onRetry={() => handleRefetch({ soft: false })}
        onRefetch={handleRefetch}
        page={page}
        pageSize={currentPageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminUsersPage;

"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import AdminGuard from "@/components/auth/AdminGuard";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {addUserRole, getAdminUsers, removeUserRole} from "@/lib/api";

const UsersPanel = () => {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionState, setActionState] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const formatRoles = useCallback(
    (user) => {
      const list = Array.isArray(user?.roles) ? user.roles : [];
      const values = list
        .map((role) => {
          if (!role) return null;
          if (typeof role === "string") return role;
          return role.role ?? null;
        })
        .filter(Boolean);
      return values.length ? values.join(", ") : t("rolesFallback");
    },
    [t],
  );

  const formatDate = useCallback(
    (value) => {
      if (!value) return "—";
      try {
        const formatter = new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "short",
        });
        return formatter.format(new Date(value));
      } catch {
        return value;
      }
    },
    [locale],
  );

  const loadingNode = useMemo(
    () => (
      <Card className='border-dashed'>
        <CardContent className='pt-6'>
          <Skeleton className='h-24 rounded-2xl' aria-label={t("loading")} />
        </CardContent>
      </Card>
    ),
    [t],
  );

  const isAdmin = (user) => {
    const list = Array.isArray(user?.roles) ? user.roles : [];
    return list.some((role) =>
      typeof role === "string" ? role === "admin" : role?.role === "admin"
    );
  };

  const handleRoleChange = async (user, promote) => {
    if (!user?.id) return;
    setActionState((prev) => ({
      ...prev,
      [user.id]: { loading: true, error: null },
    }));
    try {
      if (promote) {
        await addUserRole(user.id, "admin");
      } else {
        await removeUserRole(user.id, "admin");
      }
      await fetchUsers();
      setActionState((prev) => ({
        ...prev,
        [user.id]: { loading: false, error: null },
      }));
    } catch (err) {
      setActionState((prev) => ({
        ...prev,
        [user.id]: {
          loading: false,
          error: err?.message || t("actionError"),
        },
      }));
    }
  };

  const renderAction = (user) => {
    const admin = isAdmin(user);
    const state = actionState[user.id] ?? { loading: false, error: null };
    if (!Button) {
      return (
        <button
          type='button'
          disabled={state.loading}
          onClick={() => handleRoleChange(user, !admin)}
          className='rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold'
        >
          {admin ? t("removeAdmin") : t("makeAdmin")}
        </button>
      );
    }
    return (
      <Button
        size='sm'
        variant={admin ? "destructive" : "outline"}
        disabled={state.loading}
        onClick={() => handleRoleChange(user, !admin)}
      >
        {admin ? t("removeAdmin") : t("makeAdmin")}
      </Button>
    );
  };

  const fallbackTable = (items) => (
    <div className='overflow-x-auto rounded-2xl border border-neutral-200'>
      <table className='w-full caption-bottom text-sm' aria-label={t("ariaLabel")}>
        <thead className='bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500'>
          <tr>
            <th className='px-4 py-3'>{t("columns.email")}</th>
            <th className='px-4 py-3'>{t("columns.roles")}</th>
            <th className='px-4 py-3'>{t("columns.created")}</th>
            <th className='px-4 py-3'>{t("columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id} className='border-b last:border-0'>
              <td className='px-4 py-3'>{user.email}</td>
              <td className='px-4 py-3 text-neutral-600 dark:text-neutral-300'>{formatRoles(user)}</td>
              <td className='px-4 py-3 text-neutral-600 dark:text-neutral-300'>{formatDate(user.created_at)}</td>
              <td className='px-4 py-3'>
                <div className='space-y-1'>
                  {renderAction(user)}
                  {actionState[user.id]?.error && (
                    <p className='text-xs text-red-600'>{actionState[user.id].error}</p>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTable = (items) => {
    if (!Table || !TableHeader) {
      return fallbackTable(items);
    }
    return (
      <Table aria-label={t("ariaLabel")}>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.email")}</TableHead>
            <TableHead>{t("columns.roles")}</TableHead>
            <TableHead>{t("columns.created")}</TableHead>
            <TableHead>{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((user) => (
            <TableRow key={user.id}>
              <TableCell className='font-medium'>{user.email}</TableCell>
              <TableCell>{formatRoles(user)}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className='space-y-1'>
                {renderAction(user)}
                {actionState[user.id]?.error && (
                  <p className='text-xs text-red-600'>{actionState[user.id].error}</p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return loadingNode;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-300'>
            <p>{error?.message || t("error")}</p>
            <button
              type='button'
              onClick={fetchUsers}
              className='inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800'
            >
              {t("retry")}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!users.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>{t("empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>{renderTable(users)}</CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const t = useTranslations("admin");

  return (
    <div className='container mx-auto flex flex-col gap-6 px-4 py-10'>
      <header>
        <h1 className='text-3xl font-semibold text-neutral-900 dark:text-neutral-50'>{t("dashboardTitle")}</h1>
        <p className='mt-2 max-w-3xl text-neutral-600 dark:text-neutral-300'>{t("dashboardDescription")}</p>
      </header>
      <UsersPanel />
    </div>
  );
};

const AdminPage = () => (
  <AdminGuard>
    <AdminDashboard />
  </AdminGuard>
);

export default AdminPage;

"use client";

import {useEffect, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {getAdminUsers} from "@/lib/api";

const UsersInner = () => {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminUsers();
        if (!mounted) return;
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const formatRoles = (roles) => {
    const flat = Array.isArray(roles)
      ? roles
          .map((role) => {
            if (!role) return null;
            if (typeof role === "string") return role;
            return role.role ?? null;
          })
          .filter(Boolean)
      : [];
    return flat.length ? flat.join(", ") : t("rolesFallback");
  };

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat(locale, {dateStyle: "medium", timeStyle: "short"}).format(new Date(value));
    } catch {
      return value;
    }
  };

  return (
    <Card className='rounded-2xl border bg-card shadow-md'>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {loading ? (
          <div className='space-y-3'>
            {Array.from({length: 4}).map((_, idx) => (
              <Skeleton key={idx} className='h-10 w-full rounded-lg' />
            ))}
          </div>
        ) : error ? (
          <div className='rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {error?.message || t("error")}
          </div>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-border'>
            <Table className='w-full text-sm' aria-label={t("ariaLabel")}>
              <TableHeader className='bg-muted/40'>
                <TableRow>
                  <TableHead>{t("columns.email")}</TableHead>
                  <TableHead>{t("columns.roles")}</TableHead>
                  <TableHead>{t("columns.created")}</TableHead>
                  <TableHead>{t("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='[&_tr:hover]:bg-muted/30'>
                {users.length ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.email}</TableCell>
                      <TableCell>{formatRoles(user.roles)}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <Button size='sm' variant='outline' disabled className='cursor-not-allowed opacity-60'>
                          {t("manageRoles")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>
                      {t("empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminUsersPage = () => (
  <div className='flex flex-col gap-6'>
    <UsersInner />
  </div>
);

export default AdminUsersPage;

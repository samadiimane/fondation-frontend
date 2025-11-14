"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { setUserActive } from "@/lib/api";
import ManageRolesDialog from "./ManageRolesDialog";
import { Check, Copy, MoreHorizontal } from "lucide-react";

const coerceRoleKey = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim().toLowerCase();
  if (typeof value === "object") {
    if (typeof value.value === "string") return value.value.trim().toLowerCase();
    if (typeof value.role === "string") return value.role.trim().toLowerCase();
    return coerceRoleKey(value.role);
  }
  return "";
};

const formatRole = (t, value) => {
  const key = coerceRoleKey(value);
  if (!key) {
    return typeof value === "string" ? value : "";
  }
  try {
    return t(`role.${key}`);
  } catch {
    return key;
  }
};

const normalizeRoleList = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles.map((role) => {
    return coerceRoleKey(role);
  }).filter(Boolean);
};

const UsersTable = ({
  data,
  isLoading,
  error,
  onRetry,
  onRefetch,
  page,
  pageSize,
  onPageChange,
}) => {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const { toast } = useToast();
  const [rolesDialogUser, setRolesDialogUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [statusPending, setStatusPending] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 1)));

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const handleCopy = async (user) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      toast({
        description: t("toast.error"),
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard?.writeText(user.email);
      setCopiedId(user.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast({
        description: t("toast.error"),
        variant: "destructive",
      });
    }
  };

  const openStatusDialog = (user, nextStatus) => {
    setConfirmDialog({ user, nextStatus });
  };

  const closeStatusDialog = () => setConfirmDialog(null);

  const handleStatusChange = async () => {
    if (!confirmDialog?.user) return;
    const { user, nextStatus } = confirmDialog;
    setStatusPending((prev) => ({ ...prev, [user.id]: nextStatus }));
    try {
      await setUserActive(user.id, nextStatus);
      toast({
        description: nextStatus ? t("toast.activated") : t("toast.deactivated"),
      });
      await onRefetch?.({ soft: true });
      setStatusPending((prev) => {
        const clone = { ...prev };
        delete clone[user.id];
        return clone;
      });
      setConfirmDialog(null);
    } catch (error) {
      setStatusPending((prev) => {
        const clone = { ...prev };
        delete clone[user.id];
        return clone;
      });
      toast({
        description: error?.message || t("toast.error"),
        variant: "destructive",
      });
      setConfirmDialog(null);
    }
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    onPageChange?.(nextPage);
  };

  const renderSkeletonRows = () =>
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {Array.from({ length: 5 }).map((__, cellIndex) => (
          <TableCell key={`s-${index}-${cellIndex}`}>
            <Skeleton className="h-6 w-full rounded-md" />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={5} className="py-10 text-center text-[15px] text-muted-foreground">
        {t("empty")}
      </TableCell>
    </TableRow>
  );

  const renderRows = () =>
    items.map((user) => {
      const roleValues = normalizeRoleList(user.roles);
      const isActive = statusPending[user.id] ?? Boolean(user.is_active ?? user.isActive);
      return (
        <TableRow key={user.id} className="text-[15px]">
          <TableCell className="max-w-[240px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[15px] text-foreground">{user.email}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleCopy(user)}
                aria-label={t("copyEmail")}
              >
                {copiedId === user.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              {roleValues.length ? (
                roleValues.map((role) => (
                  <Badge key={`${user.id}-${role}`} variant="secondary" className="capitalize">
                    {formatRole(t, role)}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={isActive ? "outline" : "destructive"} className="px-3 py-1 text-[13px]">
              {isActive ? t("status.active") : t("status.inactive")}
            </Badge>
          </TableCell>
          <TableCell>{formatDate(user.created_at ?? user.createdAt)}</TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-border p-1">
                <DropdownMenuItem onSelect={() => setRolesDialogUser(user)}>
                  {t("manageRoles")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => openStatusDialog(user, !isActive)}
                >
                  {isActive ? t("deactivate") : t("activate")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <>
      <Card className="rounded-3xl border bg-white shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-foreground">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && !isLoading ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-[15px] text-destructive">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>{t("errorLoading")}</p>
                <Button variant="outline" size="sm" onClick={onRetry}>
                  {t("retry")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Table className="text-[15px]">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[15px] font-semibold">{t("columns.email")}</TableHead>
                    <TableHead className="text-[15px] font-semibold">{t("columns.roles")}</TableHead>
                    <TableHead className="text-[15px] font-semibold">{t("columns.status")}</TableHead>
                    <TableHead className="text-[15px] font-semibold">{t("columns.created")}</TableHead>
                    <TableHead className="text-right text-[15px] font-semibold">{t("columns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? renderSkeletonRows() : items.length ? renderRows() : renderEmptyState()}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between text-[15px] text-muted-foreground">
            <span>
              {t("pagination.summary", {
                start: total === 0 ? 0 : (page - 1) * pageSize + 1,
                end: Math.min(page * pageSize, total),
                total,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                {t("pagination.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                {t("pagination.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ManageRolesDialog
        user={rolesDialogUser}
        open={Boolean(rolesDialogUser)}
        onOpenChange={(open) => {
          if (!open) setRolesDialogUser(null);
        }}
        onUpdated={() => onRefetch?.({ soft: true })}
      />

      <AlertDialog open={Boolean(confirmDialog)} onOpenChange={(open) => !open && closeStatusDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.nextStatus ? t("activate") : t("deactivate")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.nextStatus
                ? t("confirmActivate", { email: confirmDialog?.user?.email ?? "" })
                : t("confirmDeactivate", { email: confirmDialog?.user?.email ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              {confirmDialog?.nextStatus ? t("activate") : t("deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTable;

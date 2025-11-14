"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
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
import ManageRolesDialog from "./ManageRolesDialog";
import {Check, Copy} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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
  return roles.map((role) => coerceRoleKey(role)).filter(Boolean);
};

const UsersTable = ({
  data,
  isLoading,
  isFetching,
  error,
  onRetry,
  page,
  pageSize,
  onPageChange,
  onToggleActive,
  onSetUserRoles,
  activationPendingId,
  rolesPendingUserId,
}) => {
  const t = useTranslations("admin.users");
  const locale = useLocale();
  const [rolesDialogUser, setRolesDialogUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
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
      return;
    }
    try {
      await navigator.clipboard?.writeText(user.email);
      setCopiedId(user.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  const openStatusDialog = (user, nextStatus) => {
    setConfirmDialog({user, nextStatus});
  };

  const closeStatusDialog = () => setConfirmDialog(null);

  const handleStatusChange = async () => {
    if (!confirmDialog?.user) return;
    const {user, nextStatus} = confirmDialog;
    try {
      await onToggleActive?.({userId: user.id, is_active: nextStatus});
      setConfirmDialog(null);
    } catch {
      // errors handled upstream
    }
  };

  const handlePageChange = (nextPage) => {
    const parsed = Math.max(Number(nextPage) || 1, 1);
    if (parsed === page) return;
    onPageChange?.(parsed);
  };

  const renderSkeletonRows = () =>
    Array.from({length: 5}).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell colSpan={5}>
          <Skeleton className="h-10 w-full rounded-2xl" />
        </TableCell>
      </TableRow>
    ));

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={5}>
        <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
          <p>{t("empty.title", {defaultMessage: "No users match your filters."})}</p>
          <p className="text-xs">{t("empty.hint", {defaultMessage: "Try updating the search or role filter."})}</p>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderRows = () =>
    items.map((user) => {
      const roleValues = normalizeRoleList(user.roles);
      const isActive = Boolean(user.is_active ?? user.isActive);
      const isActivationPending = activationPendingId === user.id;
      const isRolesPending = rolesPendingUserId === user.id;

      return (
        <TableRow key={user.id} className="text-[15px] hover:bg-muted/40">
          <TableCell className="max-w-[240px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[15px] text-foreground">{user.email}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy(user)}
                    aria-label={t("copyEmail", {defaultMessage: "Copy email"})}
                  >
                    {copiedId === user.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copiedId === user.id
                    ? t("copied", {defaultMessage: "Copied"})
                    : t("copyEmail", {defaultMessage: "Copy email"})}
                </TooltipContent>
              </Tooltip>
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
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={isActive ? "outline" : "destructive"} className="px-3 py-1 text-[13px]">
                {isActive ? t("status.active") : t("status.inactive")}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openStatusDialog(user, !isActive)}
                disabled={isActivationPending}
              >
                {isActivationPending
                  ? t("working", {defaultMessage: "Working..."})
                  : isActive
                    ? t("deactivate")
                    : t("activate")}
              </Button>
            </div>
          </TableCell>
          <TableCell>{formatDate(user.created_at ?? user.createdAt)}</TableCell>
          <TableCell className="text-right">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRolesDialogUser(user)}
              disabled={isRolesPending}
            >
              {isRolesPending ? t("working", {defaultMessage: "Working..."}) : t("manageRoles")}
            </Button>
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
                <p>{error.userMessage || t("errorLoading")}</p>
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
          <div className="flex flex-col gap-2 text-[15px] text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span aria-live="polite">
              {t("pagination.summary", {
                start: total === 0 ? 0 : (page - 1) * pageSize + 1,
                end: Math.min(page * pageSize, total),
                total,
              })}
            </span>
            <div className="flex items-center gap-2">
              {isFetching && !isLoading ? (
                <span className="text-xs text-primary" aria-live="polite">
                  {t("refreshing")}
                </span>
              ) : null}
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
        onSubmitRoles={async ({userId, roles, currentRoles}) => {
          await onSetUserRoles?.({userId, roles, currentRoles});
        }}
        isSubmitting={rolesPendingUserId === rolesDialogUser?.id}
      />

      <AlertDialog open={Boolean(confirmDialog)} onOpenChange={(open) => !open && closeStatusDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.nextStatus ? t("activate") : t("deactivate")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.nextStatus
                ? t("confirmActivate", {email: confirmDialog?.user?.email ?? ""})
                : t("confirmDeactivate", {email: confirmDialog?.user?.email ?? ""})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              disabled={activationPendingId === confirmDialog?.user?.id}
            >
              {confirmDialog?.nextStatus ? t("activate") : t("deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTable;

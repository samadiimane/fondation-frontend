"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { replaceUserRoles } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { USER_ROLE_VALUES } from "./constants";

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  return roles
    .map((role) => {
      if (!role) return null;
      if (typeof role === "string") return role;
      if (typeof role === "object" && role.role) {
        return typeof role.role === "string" ? role.role : role.role?.role ?? null;
      }
      return null;
    })
    .filter(Boolean);
};

const ManageRolesDialog = ({ user, open, onOpenChange, onUpdated }) => {
  const t = useTranslations("admin.users");
  const { toast } = useToast();
  const [selectedRoles, setSelectedRoles] = useState(() => new Set(normalizeRoles(user?.roles)));
  const [submitting, setSubmitting] = useState(false);

  const roleList = useMemo(() => USER_ROLE_VALUES, []);

  useEffect(() => {
    if (open && user) {
      const nextRoles = normalizeRoles(user.roles);
      setSelectedRoles(new Set(nextRoles.length ? nextRoles : ["researcher"]));
    } else if (!open) {
      setSubmitting(false);
    }
  }, [open, user]);

  const toggleRole = (role) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  const canSubmit = selectedRoles.size > 0 && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id || selectedRoles.size === 0) return;
    setSubmitting(true);
    try {
      const currentRoles = normalizeRoles(user?.roles);
      await replaceUserRoles(
        user.id,
        Array.from(selectedRoles),
        {
          currentRoles,
          fallbackUser: user,
        },
      );
      toast({ description: t("toast.rolesUpdated") });
      onUpdated?.();
      onOpenChange?.(false);
    } catch (error) {
      toast({
        description: error?.message || t("toast.error"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t("manageRoles")}
          </DialogTitle>
          <DialogDescription id="manage-roles-description">
            {t("manageRolesDescription")}
          </DialogDescription>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <p className="text-[15px] font-medium text-foreground">{t("rolesLabel")}</p>
            <div className="flex flex-col gap-2">
              {roleList.map((role) => (
                <label key={role} className="flex items-center gap-2 text-sm font-medium capitalize">
                  <Checkbox
                    checked={selectedRoles.has(role)}
                    onCheckedChange={() => toggleRole(role)}
                    aria-label={t(`role.${role}`)}
                  />
                  <span>{t(`role.${role}`)}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? `${t("manageRoles")}…` : t("manageRoles")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageRolesDialog;

"use client";

import {useEffect, useMemo, useState} from "react";
import {useTranslations} from "next-intl";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {USER_ROLE_VALUES, DEFAULT_ROLE} from "./constants";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

const normalizeRoleValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim().toLowerCase();
  if (typeof value === "object" && typeof value.role === "string") {
    return value.role.trim().toLowerCase();
  }
  return "";
};

const normalizeRole = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return DEFAULT_ROLE;
  }
  const first = normalizeRoleValue(roles[0]);
  return first || DEFAULT_ROLE;
};

const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) return [];
  const normalized = roles
    .map((role) => normalizeRoleValue(role))
    .filter((role) => role.length > 0);
  return normalized.length > 0 ? normalized : [DEFAULT_ROLE];
};

const ManageRolesDialog = ({user, open, onOpenChange, onSubmitRoles, isSubmitting}) => {
  const t = useTranslations("admin.users");
  const [selectedRole, setSelectedRole] = useState(() => normalizeRole(user?.roles));
  const [baselineRoles, setBaselineRoles] = useState(() => normalizeRoles(user?.roles));

  const roleList = useMemo(() => USER_ROLE_VALUES, []);

  useEffect(() => {
    if (open && user) {
      setSelectedRole(normalizeRole(user.roles));
      setBaselineRoles(normalizeRoles(user.roles));
    }
  }, [open, user]);

  const canSubmit = Boolean(selectedRole && !isSubmitting);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id || !selectedRole) return;
    try {
      await onSubmitRoles?.({
        userId: user.id,
        roles: [selectedRole],
        currentRoles: baselineRoles,
      });
      onOpenChange?.(false);
    } catch {
      // Notification handled by caller.
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
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
              className="flex flex-col gap-2"
            >
              {roleList.map((role) => {
                const radioId = `manage-role-${role}`;
                return (
                  <div key={role} className="flex items-center gap-2 text-sm font-medium capitalize">
                    <RadioGroupItem
                      id={radioId}
                      value={role}
                      aria-label={t(`role.${role}`)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={radioId} className="cursor-pointer capitalize">
                      {t(`role.${role}`)}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? `${t("manageRoles")}…` : t("manageRoles")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageRolesDialog;

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DEFAULT_ROLE, USER_ROLE_VALUES } from "./constants";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AddUserDialog = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  const t = useTranslations("admin.users");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);

  const roleList = useMemo(() => USER_ROLE_VALUES, []);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setSelectedRole(DEFAULT_ROLE);
    }
  }, [open]);

  const canSubmit = Boolean(email.trim() && password.trim() && selectedRole && !isSubmitting);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      await onSubmit?.({
        email: email.trim(),
        password,
        roles: [selectedRole || DEFAULT_ROLE],
      });
      onOpenChange?.(false);
    } catch {
      // Notification handled by caller.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold text-foreground">{t("addUser")}</DialogTitle>
          <DialogDescription>
            {t("addUserDescription")}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-user-email" className="text-[15px] font-medium text-foreground">
              {t("email")}
            </Label>
            <Input
              id="admin-user-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="researcher@example.org"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-user-password" className="text-[15px] font-medium text-foreground">
              {t("password")}
            </Label>
            <Input
              id="admin-user-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-3">
            <p className="text-[15px] font-medium text-foreground">{t("rolesLabel")}</p>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
              className="grid gap-3"
            >
              {roleList.map((role) => {
                const radioId = `add-user-role-${role}`;
                return (
                  <div key={role} className="flex items-center gap-2 text-sm font-medium capitalize">
                    <RadioGroupItem id={radioId} value={role} aria-label={t(`role.${role}`)} />
                    <Label htmlFor={radioId} className="cursor-pointer text-sm font-medium capitalize">
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
              {isSubmitting ? `${t("create")}…` : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;

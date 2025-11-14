"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { createAdminUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_ROLE, USER_ROLE_VALUES } from "./constants";

const AddUserDialog = ({ open, onOpenChange, onCreated }) => {
  const t = useTranslations("admin.users");
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(() => new Set([DEFAULT_ROLE]));
  const [submitting, setSubmitting] = useState(false);

  const roleList = useMemo(() => USER_ROLE_VALUES, []);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setSelectedRoles(new Set([DEFAULT_ROLE]));
      setSubmitting(false);
    }
  }, [open]);

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

  const canSubmit = email.trim() && password.trim() && selectedRoles.size > 0 && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createAdminUser({
        email,
        password,
        roles: Array.from(selectedRoles),
      });
      toast({ description: t("toast.created") });
      onCreated?.();
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
      <DialogContent aria-describedby="add-user-description">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold text-foreground">{t("addUser")}</DialogTitle>
          <DialogDescription id="add-user-description">
            {t("addUserDescription")}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="admin-user-email" className="text-[15px] font-medium text-foreground">
              {t("email")}
            </label>
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
            <label htmlFor="admin-user-password" className="text-[15px] font-medium text-foreground">
              {t("password")}
            </label>
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
            <div className="flex flex-wrap gap-3">
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
              {submitting ? `${t("create")}…` : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;

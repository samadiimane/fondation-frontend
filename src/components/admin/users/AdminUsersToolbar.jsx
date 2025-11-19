"use client";

import {useEffect, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {Search, UserPlus} from "lucide-react";

import { ROLE_FILTER_OPTIONS } from "./constants";
import AddUserDialog from "./AddUserDialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

const AdminUsersToolbar = ({
  query,
  role,
  total,
  onQueryChange,
  onRoleChange,
  onCreateUser,
  isCreatingUser,
  isRefreshing,
  canCreateUsers = true,
}) => {
  const t = useTranslations("admin.users");
  const [searchValue, setSearchValue] = useState(query ?? "");
  const [addUserOpen, setAddUserOpen] = useState(false);

  const roleOptions = useMemo(() => ROLE_FILTER_OPTIONS, []);

  useEffect(() => {
    setSearchValue(query ?? "");
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchValue.trim();
      if (trimmed !== query) {
        onQueryChange?.(trimmed);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, onQueryChange, query]);

  useEffect(() => {
    if (!canCreateUsers) {
      setAddUserOpen(false);
    }
  }, [canCreateUsers]);

  const handleRoleChange = (value) => {
    if (value === role) return;
    onRoleChange?.(value);
  };

  return (
    <>
      <div className="sticky top-16 z-20">
        <div className="rounded-3xl border border-border bg-white/90 p-4 shadow backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="admin-users-search" className="text-[15px] font-medium text-muted-foreground">
                {t("searchPlaceholder")}
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-users-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-11 rounded-2xl border-slate-200 pl-10 text-[15px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:w-64">
              <Label htmlFor="admin-role-filter" className="text-[15px] font-medium text-muted-foreground">
                {t("filterRoleLabel")}
              </Label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger id="admin-role-filter" className="h-11 rounded-2xl border-slate-200 text-[15px]">
                  <SelectValue placeholder={t("role.all")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border bg-white shadow-lg">
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.translationKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end lg:items-center">
              {canCreateUsers ? (
                <Button
                  type="button"
                  onClick={() => setAddUserOpen(true)}
                  className="h-11 rounded-2xl px-5 text-[15px]"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("addUser")}
                </Button>
              ) : null}
            </div>
          </div>
          <div
            className="mt-3 flex items-center justify-between text-sm text-muted-foreground"
            aria-live="polite"
          >
            <p>
              {t("resultCount", {
                count: total,
              })}
            </p>
            {isRefreshing && <span className="text-xs text-primary">{t("refreshing")}</span>}
          </div>
        </div>
      </div>
      {canCreateUsers ? (
        <AddUserDialog
          open={addUserOpen}
          onOpenChange={setAddUserOpen}
          onSubmit={async (payload) => {
            await onCreateUser?.(payload);
          }}
          isSubmitting={isCreatingUser}
        />
      ) : null}
    </>
  );
};

export default AdminUsersToolbar;

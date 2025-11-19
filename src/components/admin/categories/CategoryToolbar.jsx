"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Search, Plus} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ParentSelect from "@/components/admin/categories/ParentSelect";

const DEFAULT_KIND = "section";

const CategoryToolbar = ({
  query,
  onQueryChange,
  kind,
  onKindChange,
  canCreate,
  isCreating,
  onCreateCategory,
  kindOptions,
}) => {
  const t = useTranslations("admin.categories");
  const [searchValue, setSearchValue] = useState(query);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    kind: kind && kind !== "all" ? kind : DEFAULT_KIND,
    parent_id: null,
    order: "",
  });
  const nameRef = useRef(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchValue !== query) {
        onQueryChange(searchValue);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [searchValue, query, onQueryChange]);

  useEffect(() => {
    if (!addOpen) {
      setForm({
        name: "",
        slug: "",
        kind: kind && kind !== "all" ? kind : DEFAULT_KIND,
        parent_id: null,
        order: "",
      });
    } else {
      nameRef.current?.focus();
    }
  }, [addOpen, kind]);

  const availableKinds = useMemo(() => kindOptions.filter((option) => option.value !== "all"), [kindOptions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      nameRef.current?.focus();
      return;
    }
    if (!form.kind) return;
    await onCreateCategory({
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      kind: form.kind,
      parent_id: form.parent_id,
      order: form.order ? Number(form.order) : undefined,
    });
    setAddOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-white/90 p-4 shadow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="categories-search">{t("toolbar.searchLabel")}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="categories-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t("toolbar.searchPlaceholder")}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-64">
            <Label>{t("toolbar.kindLabel")}</Label>
            <Select value={kind} onValueChange={onKindChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("toolbar.kindLabel")} />
              </SelectTrigger>
              <SelectContent>
                {kindOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end justify-end">
            <Button type="button" onClick={() => setAddOpen(true)} disabled={!canCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t("toolbar.addCategory")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="create-name">{t("fields.name")}</Label>
            <Input
              id="create-name"
              value={form.name}
              ref={nameRef}
              onChange={(event) => setForm((prev) => ({...prev, name: event.target.value}))}
              required
            />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-slug">{t("fields.slug")} ({t("fields.optional")})</Label>
              <Input
                id="create-slug"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({...prev, slug: event.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("fields.kind")}</Label>
              <Select
                value={form.kind}
                onValueChange={(value) => setForm((prev) => ({...prev, kind: value, parent_id: null}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("fields.kind")} />
                </SelectTrigger>
                <SelectContent>
                  {availableKinds.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ParentSelect
              value={form.parent_id}
              onChange={(next) => setForm((prev) => ({...prev, parent_id: next}))}
              kind={form.kind}
              disabled={!form.kind}
              label={t("fields.parent")}
            />
            <div className="space-y-2">
              <Label htmlFor="create-order">{t("fields.order")} ({t("fields.optional")})</Label>
              <Input
                id="create-order"
                type="number"
                value={form.order}
                onChange={(event) => setForm((prev) => ({...prev, order: event.target.value}))}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit" disabled={isCreating || !form.name.trim()}>
                {isCreating ? t("actions.working") : t("actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryToolbar;

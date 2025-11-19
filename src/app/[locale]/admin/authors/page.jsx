"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import useNotify from "@/hooks/useNotify";
import {ADMIN_AUTHORS_QUERY_KEYS, createAuthor, listAuthors} from "@/lib/api/adminAuthors";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const PAGE_SIZE = 20;

const sortOptions = [
  {value: "name", labelKey: "toolbar.sort.name"},
  {value: "created_at", labelKey: "toolbar.sort.created"},
];

const AdminAuthorsPage = () => {
  const t = useTranslations("admin.authors");
  const locale = useLocale();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const {data: capabilities} = useAdminCapabilities();

  const canList = capabilities?.authors?.list !== false;
  const canCreate = capabilities?.authors?.create !== false;

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name_latin: "",
    name_ar: "",
    affiliation: "",
  });
  const nameLatinRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      const nextValue = searchValue.trim();
      setDebouncedSearch((prev) => {
        if (prev !== nextValue) {
          setPage(1);
        }
        return nextValue;
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    if (dialogOpen) {
      requestAnimationFrame(() => nameLatinRef.current?.focus());
    } else {
      setForm({
        name_latin: "",
        name_ar: "",
        affiliation: "",
      });
    }
  }, [dialogOpen]);

  const listQueryKey = useMemo(
    () =>
      ADMIN_AUTHORS_QUERY_KEYS.list({
        q: debouncedSearch || undefined,
        page,
        pageSize: PAGE_SIZE,
        sort,
      }),
    [debouncedSearch, page, sort],
  );

  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: ({signal}) =>
      listAuthors({
        q: debouncedSearch || undefined,
        page,
        pageSize: PAGE_SIZE,
        sort,
        signal,
      }),
    keepPreviousData: true,
    enabled: canList,
  });

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale || "en", {dateStyle: "medium"});
    } catch {
      return new Intl.DateTimeFormat("en", {dateStyle: "medium"});
    }
  }, [locale]);

  const createMutation = useMutation({
    mutationFn: (payload) => createAuthor(payload),
    onMutate: async (payload) => {
      if (!canList) return undefined;
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previous = queryClient.getQueryData(listQueryKey);
      if (!previous) {
        return {previous: undefined, tempId: undefined};
      }
      const trimmedLatin = payload.name_latin.trim();
      const optimisticItem = {
        id: Date.now() * -1,
        name_latin: trimmedLatin,
        name_ar: payload.name_ar?.trim() || trimmedLatin,
        affiliation: payload.affiliation?.trim() || null,
        slug: `temp-${Math.abs(Date.now())}`,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData(listQueryKey, {
        ...previous,
        items: [optimisticItem, ...previous.items],
        total: previous.total + 1,
      });
      return {previous, tempId: optimisticItem.id};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      notify.handleError(error, t("toast.created.error"));
    },
    onSuccess: (item, _variables, context) => {
      queryClient.setQueryData(listQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((existing) => (existing.id === context?.tempId ? item : existing)),
        };
      });
      notify.success(t("toast.created.success"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: listQueryKey});
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name_latin: form.name_latin.trim(),
      name_ar: form.name_ar.trim() || undefined,
      affiliation: form.affiliation.trim() || undefined,
    };
    if (!payload.name_latin) {
      nameLatinRef.current?.focus();
      return;
    }
    try {
      await createMutation.mutateAsync(payload);
      setDialogOpen(false);
    } catch {
      // handled via notify
    }
  };

  const items = listQuery.data?.items ?? [];
  const isLoading = listQuery.isLoading || listQuery.isFetching;
  const hasNext = listQuery.data?.hasNext ?? false;
  const total = listQuery.data?.total ?? 0;

  if (!canList) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="rounded-3xl border bg-white shadow">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("capabilityDisabled")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm uppercase text-primary/80">{t("title")}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{t("subtitle")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>

      <Card className="rounded-3xl border bg-white shadow">
        <CardHeader className="gap-4 md:flex md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="author-search">{t("toolbar.search.label")}</Label>
            <Input
              id="author-search"
              type="search"
              className="rounded-2xl border-muted bg-muted/40"
              placeholder={t("toolbar.search.placeholder")}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 md:max-w-xs">
            <Label>{t("toolbar.sort.label")}</Label>
            <Select value={sort} onValueChange={(value) => setSort(value)}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder={t("toolbar.sort.label")} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setDialogOpen(true)} disabled={!canCreate}>
              {t("toolbar.add")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>{t("table.headers.nameLatin")}</TableHead>
                  <TableHead>{t("table.headers.nameArabic")}</TableHead>
                  <TableHead>{t("table.headers.affiliation")}</TableHead>
                  <TableHead>{t("table.headers.created")}</TableHead>
                  <TableHead className="text-right">{t("table.headers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !items.length ? (
                  Array.from({length: 4}).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : items.length ? (
                  items.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-semibold">{author.name_latin}</TableCell>
                      <TableCell className="text-muted-foreground">{author.name_ar || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{author.affiliation || "—"}</TableCell>
                      <TableCell>{dateFormatter.format(new Date(author.created_at))}</TableCell>
                      <TableCell className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                        {t("table.actions.placeholder")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                      {t("table.empty")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t("toolbar.resultsSummary", {total, page})}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isLoading}
              >
                {t("pagination.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isLoading || !hasNext}
              >
                {t("pagination.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dialog.add.title")}</DialogTitle>
            <DialogDescription>{t("dialog.add.description")}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="author-name-latin">{t("fields.nameLatin")}</Label>
              <Input
                id="author-name-latin"
                ref={nameLatinRef}
                value={form.name_latin}
                onChange={(event) => setForm((prev) => ({...prev, name_latin: event.target.value}))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-name-ar">{t("fields.nameArabic")}</Label>
              <Input
                id="author-name-ar"
                value={form.name_ar}
                onChange={(event) => setForm((prev) => ({...prev, name_ar: event.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-affiliation">{t("fields.affiliation")}</Label>
              <Input
                id="author-affiliation"
                value={form.affiliation}
                onChange={(event) => setForm((prev) => ({...prev, affiliation: event.target.value}))}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t("actions.creating") : t("actions.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAuthorsPage;

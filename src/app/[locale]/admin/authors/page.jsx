"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import useNotify from "@/hooks/useNotify";
import {
  ADMIN_AUTHORS_QUERY_KEYS,
  createAuthor,
  listAuthors,
  restoreAuthor,
  softDeleteAuthor,
} from "@/lib/api/adminAuthors";
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
import {Badge} from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

const sortOptions = [
  {value: "name", labelKey: "toolbar.sort.name"},
  {value: "created_at", labelKey: "toolbar.sort.created"},
];

const statusOptions = [
  {value: "active", labelKey: "toolbar.status.active"},
  {value: "deleted", labelKey: "toolbar.status.deleted"},
  {value: "all", labelKey: "toolbar.status.all"},
];

const AdminAuthorsPage = () => {
  const t = useTranslations("admin.authors");
  const tPagination = useTranslations("shared.pagination");
  const locale = useLocale();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const {data: capabilities} = useAdminCapabilities();

  const canList = capabilities?.authors?.list !== false;
  const canCreate = capabilities?.authors?.create !== false;
  const canSoftDelete = capabilities?.authors?.softDelete !== false;
  const canRestore = capabilities?.authors?.restore !== false;

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [statusFilter, setStatusFilter] = useState("active");
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
        status: statusFilter,
      }),
    [debouncedSearch, page, sort, statusFilter],
  );

  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: ({signal}) =>
      listAuthors({
        q: debouncedSearch || undefined,
        page,
        pageSize: PAGE_SIZE,
        sort,
        status: statusFilter,
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

  const isAuthorsQueryKey = useCallback(
    (key) => Array.isArray(key) && key[0] === ADMIN_AUTHORS_QUERY_KEYS.all[0],
    [],
  );

  const invalidateAuthors = useCallback(
    (opts) => {
      if (opts?.resetPage) {
        setPage(1);
      }
      queryClient.invalidateQueries({
        predicate: (query) => isAuthorsQueryKey(query.queryKey),
        refetchType: "all",
      });
      if (opts?.remove) {
        queryClient.removeQueries({
          predicate: (query) => isAuthorsQueryKey(query.queryKey),
          type: "inactive",
        });
      }
    },
    [isAuthorsQueryKey, queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (payload) => createAuthor(payload),
    onError: (error) => notify.handleError(error, t("toast.created.error")),
    onSuccess: () => {
      notify.success(t("toast.created.success"));
      invalidateAuthors();
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: (authorId) => softDeleteAuthor(authorId),
    onError: (error) => notify.handleError(error, t("toast.deleted.error")),
    onSuccess: () => {
      notify.success(t("toast.deleted.success"));
      invalidateAuthors();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (authorId) => restoreAuthor(authorId),
    onError: (error) => notify.handleError(error, t("toast.restored.error")),
    onSuccess: () => {
      notify.success(t("toast.restored.success"));
      invalidateAuthors();
    },
  });

  const handleSoftDelete = (authorId) => {
    if (!canSoftDelete) return;
    softDeleteMutation.mutate(authorId);
  };

  const handleRestore = (authorId) => {
    if (!canRestore) return;
    restoreMutation.mutate(authorId);
  };

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
        <CardHeader>
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr),auto]">
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <Label>{t("toolbar.status.label")}</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  invalidateAuthors({resetPage: true, remove: true});
                }}
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder={t("toolbar.status.label")} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end">
              <Button type="button" onClick={() => setDialogOpen(true)} disabled={!canCreate}>
                {t("toolbar.add")}
              </Button>
            </div>
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
                  items.map((author) => {
                    const isDeleted = Boolean(author.deleted_at);
                    const showDeletedBadge = isDeleted && statusFilter !== "active";
                    return (
                      <TableRow key={author.id}>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            <span>{author.name_latin}</span>
                            {showDeletedBadge ? (
                              <Badge variant="outline" className="text-xs">
                                {t("table.badge.deleted")}
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{author.name_ar || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{author.affiliation || "—"}</TableCell>
                        <TableCell>{dateFormatter.format(new Date(author.created_at))}</TableCell>
                        <TableCell className="text-right">
                          {isDeleted ? (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              disabled={!canRestore || restoreMutation.isPending}
                              onClick={() => handleRestore(author.id)}
                            >
                              {restoreMutation.isPending ? t("table.actions.restoring") : t("table.actions.restore")}
                            </Button>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button type="button" variant="destructive" size="sm" disabled={!canSoftDelete}>
                                  {t("table.actions.softDelete")}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t("table.actions.confirmTitle")}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t("table.actions.confirmDescription", {name: author.name_latin})}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleSoftDelete(author.id)}
                                    disabled={softDeleteMutation.isPending}
                                  >
                                    {softDeleteMutation.isPending
                                      ? t("table.actions.softDeleting")
                                      : t("table.actions.softDelete")}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
                {tPagination("previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isLoading || !hasNext}
              >
                {tPagination("next")}
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

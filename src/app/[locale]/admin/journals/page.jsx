"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  Archive,
  BadgeCheck,
  CalendarClock,
  Clock4,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  Pencil,
} from "lucide-react";

import AdminGuard from "@/components/auth/AdminGuard";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Textarea} from "@/components/ui/textarea";
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
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import useNotify from "@/hooks/useNotify";
import {
  ADMIN_JOURNALS_QUERY_KEYS,
  listJournalIssues,
  createJournal,
  createJournalIssue,
  listJournals,
  presignUpload,
  restoreJournal,
  updateIssue,
  softDeleteJournal,
  updateJournal,
  qkJournalIssues,
  deleteIssue,
} from "@/lib/api/adminJournals";

const PAGE_SIZE = 20;
const ADMIN_JOURNALS_KEY = ADMIN_JOURNALS_QUERY_KEYS.list({})[0];

const statusOptions = [
  {value: "active", icon: BadgeCheck},
  {value: "deleted", icon: Trash2},
  {value: "all", icon: Clock4},
];

const parsePage = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
};

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const JournalForm = ({
  t,
  form,
  setForm,
  mode,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  nameRef,
  fileInputRef,
  onFileChange,
  onUploadClick,
  uploading,
  uploadProgress,
  onRemoveCover,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => nameRef.current?.focus());
    } else {
      setShowAdvanced(false);
    }
  }, [nameRef, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? t("dialog.edit.title") : t("dialog.add.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" ? t("dialog.edit.description") : t("dialog.add.description")}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="journal-name">{t("fields.name")}</Label>
              <Input
                id="journal-name"
                ref={nameRef}
                value={form.name}
                onChange={(event) => setForm((prev) => ({...prev, name: event.target.value}))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal-issn">{t("fields.issn")}</Label>
              <Input
                id="journal-issn"
                value={form.issn}
                onChange={(event) => setForm((prev) => ({...prev, issn: event.target.value}))}
                placeholder="1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal-publisher">{t("fields.publisher")}</Label>
              <Input
                id="journal-publisher"
                value={form.publisher}
                onChange={(event) => setForm((prev) => ({...prev, publisher: event.target.value}))}
                placeholder={t("fields.publisherPlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="journal-description">{t("fields.description")}</Label>
            <Textarea
              id="journal-description"
              rows={4}
              value={form.description}
              onChange={(event) => setForm((prev) => ({...prev, description: event.target.value}))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="journal-cover">{t("fields.cover")}</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="journal-cover"
                value={form.cover_image_url}
                onChange={(event) => setForm((prev) => ({...prev, cover_image_url: event.target.value}))}
                placeholder="https://cdn.example.org/cover.jpg"
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <Button type="button" variant="outline" size="sm" onClick={onUploadClick} disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? `${uploadProgress}%` : t("actions.upload")}
                </Button>
                {form.cover_image_url ? (
                  <Button type="button" variant="ghost" size="sm" onClick={onRemoveCover}>
                    {t("actions.remove")}
                  </Button>
                ) : null}
              </div>
            </div>
            {uploading ? (
              <p className="text-xs text-muted-foreground">
                {t("status.uploading", {defaultMessage: "Uploading..."})} {uploadProgress}%
              </p>
            ) : null}
            {form.cover_image_url ? (
              <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-2">
                <img
                  src={form.cover_image_url}
                  alt={form.name || "Cover preview"}
                  className="h-14 w-14 rounded object-cover"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{t("preview.title", {defaultMessage: "Preview"})}</p>
                  <p className="break-all">{form.cover_image_url}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-md border border-dashed bg-muted/40 p-3">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-sm font-medium text-primary"
              onClick={() => setShowAdvanced((prev) => !prev)}
              aria-expanded={showAdvanced}
            >
              <span>{t("fields.advanced")}</span>
              <span className="text-xs text-muted-foreground">
                {showAdvanced ? t("fields.hide") : t("fields.show")}
              </span>
            </button>
            {showAdvanced ? (
              <div className="mt-3 space-y-2">
                <Label htmlFor="journal-slug">{t("fields.slug")}</Label>
                <Input
                  id="journal-slug"
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({...prev, slug: event.target.value}))}
                  placeholder="atlas-journal"
                />
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("actions.saving") : t("actions.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminJournalsPage = () => {
  const t = useTranslations("admin.journals");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const {data: capabilities} = useAdminCapabilities();

  const canList = capabilities?.journals?.list !== false;
  const canCreate = capabilities?.journals?.create !== false;
  const canUpdate = capabilities?.journals?.update !== false;
  const canSoftDelete = capabilities?.journals?.softDelete !== false;
  const canRestore = capabilities?.journals?.restore !== false;

  const initialSearch = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "active";
  const initialPage = parsePage(searchParams.get("page"));

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingJournal, setEditingJournal] = useState(null);
  const nameRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadXhrRef = useRef(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const issuesSearchRef = useRef(null);
  const [issuesParams, setIssuesParams] = useState({
    page: 1,
    pageSize: 20,
    q: "",
    year: undefined,
    sort: "year_desc",
  });
  const [issuesDebounced, setIssuesDebounced] = useState("");
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueDialogMode, setIssueDialogMode] = useState("create");
  const [editingIssue, setEditingIssue] = useState(null);
  const [issueForm, setIssueForm] = useState({
    title: "",
    year: "",
    number: "",
    volume: "",
    published_at: "",
  });
  const issueTitleRef = useRef(null);
  const [pendingIssueDelete, setPendingIssueDelete] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    issn: "",
    description: "",
    publisher: "",
    cover_image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateUrl = useCallback(
    ({q = debouncedSearch, status = statusFilter, page: nextPage = page}) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status && status !== "active") params.set("status", status);
      if (nextPage > 1) params.set("page", String(nextPage));
      const search = params.toString();
      const target = search ? `${pathname}?${search}` : pathname;
      router.replace(target, {scroll: false});
    },
    [debouncedSearch, page, pathname, router, statusFilter],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const nextValue = searchValue.trim();
      setDebouncedSearch((prev) => {
        if (prev !== nextValue) {
          setPage(1);
          updateUrl({q: nextValue, status: statusFilter, page: 1});
        }
        return nextValue;
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, statusFilter, updateUrl]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setIssuesDebounced(issuesParams.q?.trim() || "");
    }, 300);
    return () => clearTimeout(handler);
  }, [issuesParams.q]);

  useEffect(() => {
    if (issuesOpen) {
      requestAnimationFrame(() => issuesSearchRef.current?.focus());
    }
  }, [issuesOpen]);

  useEffect(() => {
    setSearchValue(initialSearch);
    setDebouncedSearch(initialSearch);
    setStatusFilter(initialStatus);
    setPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch, initialStatus, initialPage, pathname]);

  const listQueryKey = useMemo(
    () =>
      ADMIN_JOURNALS_QUERY_KEYS.list({
        q: debouncedSearch || undefined,
        status: statusFilter,
        page,
        pageSize: PAGE_SIZE,
        sort: "name",
      }),
    [debouncedSearch, page, statusFilter],
  );

  const invalidateJournals = useCallback(
    () => queryClient.invalidateQueries({queryKey: [ADMIN_JOURNALS_KEY], exact: false}),
    [queryClient],
  );

  const handleApiError = useCallback(
    (error, fallbackKey = "toast.error") => {
      notify.handleError(error, t(fallbackKey), {forbiddenMessage: t("toast.forbidden")});
      if (error?.status >= 400 && error?.status < 500) {
        nameRef.current?.focus();
      }
    },
    [notify, t],
  );

  const listQuery = useQuery({
    enabled: canList,
    queryKey: listQueryKey,
    queryFn: ({signal}) =>
      listJournals({
        q: debouncedSearch || undefined,
        status: statusFilter,
        page,
        pageSize: PAGE_SIZE,
        sort: "name",
        signal,
      }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (listQuery.error && listQuery.error?.name !== "AbortError") {
      handleApiError(listQuery.error, "toast.error");
    }
  }, [handleApiError, listQuery.error]);

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      slug: "",
      issn: "",
      description: "",
      publisher: "",
      cover_image_url: "",
    });
    setEditingJournal(null);
    setDialogMode("create");
  }, []);

  const prefetchedForm = (journal) => ({
    name: journal?.name ?? "",
    slug: journal?.slug ?? "",
    issn: journal?.issn ?? "",
    description: journal?.description ?? "",
    publisher: journal?.publisher ?? "",
    cover_image_url: journal?.cover_image_url ?? "",
  });

  const createMutation = useMutation({
    mutationFn: createJournal,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({queryKey: [ADMIN_JOURNALS_KEY]});
      const previous = queryClient.getQueryData(listQueryKey);
      let tempId = null;

      if (previous && statusFilter === "active" && page === 1) {
        tempId = `temp-${Date.now()}`;
        const optimistic = {
          id: tempId,
          name: variables.name,
          slug: variables.slug || variables.name,
          issn: variables.issn || null,
          description: variables.description || null,
          publisher: variables.publisher || null,
          cover_image_url: variables.cover_image_url || null,
          created_at: new Date().toISOString(),
          deleted_at: null,
          issues_count: 0,
          articles_count: 0,
        };
        const nextItems = [optimistic, ...previous.items].slice(0, PAGE_SIZE);
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: nextItems,
          total: previous.total + 1,
        });
      }

      return {previous, tempId};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      handleApiError(error, "toast.createError");
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(listQueryKey, (prev) => {
        if (!prev) return prev;
        const nextItems = [...prev.items];
        if (context?.tempId) {
          const idx = nextItems.findIndex((item) => item.id === context.tempId);
          if (idx >= 0) {
            nextItems[idx] = data;
          } else {
            nextItems.unshift(data);
          }
        } else if (statusFilter === "active" && page === 1) {
          nextItems.unshift(data);
        }
        return {...prev, items: nextItems.slice(0, PAGE_SIZE)};
      });
      setDialogOpen(false);
      resetForm();
      notify.success(t("toast.created"));
    },
    onSettled: async () => {
      await invalidateJournals();
      queryClient.refetchQueries({queryKey: listQueryKey, exact: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({id, patch}) => updateJournal(id, patch),
    onMutate: async ({id, patch}) => {
      await queryClient.cancelQueries({queryKey: [ADMIN_JOURNALS_KEY]});
      const previous = queryClient.getQueryData(listQueryKey);
      if (previous) {
        const updatedItems = previous.items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...patch,
              }
            : item,
        );
        queryClient.setQueryData(listQueryKey, {...previous, items: updatedItems});
      }
      return {previous};
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      handleApiError(error, "toast.updateError");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(listQueryKey, (prev) => {
        if (!prev) return prev;
        const items = prev.items.map((item) => (item.id === data.id ? data : item));
        return {...prev, items};
      });
      setDialogOpen(false);
      resetForm();
      notify.success(t("toast.updated"));
    },
    onSettled: async () => {
      await invalidateJournals();
      queryClient.refetchQueries({queryKey: listQueryKey, exact: true});
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: softDeleteJournal,
    onMutate: async (id) => {
      await queryClient.cancelQueries({queryKey: [ADMIN_JOURNALS_KEY]});
      const previous = queryClient.getQueryData(listQueryKey);
      if (previous) {
        const filtered = previous.items.filter((item) => item.id !== id);
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: filtered,
          total: Math.max(0, previous.total - 1),
        });
      }
      return {previous};
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listQueryKey, context.previous);
      handleApiError(error, "toast.deleteError");
    },
    onSuccess: () => {
      notify.success(t("toast.deleted"));
      setPendingDelete(null);
    },
    onSettled: async () => {
      await invalidateJournals();
      queryClient.refetchQueries({queryKey: listQueryKey, exact: true});
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreJournal,
    onMutate: async (id) => {
      await queryClient.cancelQueries({queryKey: [ADMIN_JOURNALS_KEY]});
      const previous = queryClient.getQueryData(listQueryKey);
      if (previous) {
        const target = previous.items.find((item) => item.id === id);
        const remaining = previous.items.filter((item) => item.id !== id);
        const restored =
          target && {
            ...target,
            deleted_at: null,
          };
        const nextItems =
          restored && statusFilter !== "active" && page !== 1
            ? remaining
            : restored
            ? [restored, ...remaining]
            : remaining;
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: nextItems.slice(0, PAGE_SIZE),
          total: restored ? previous.total + (statusFilter === "deleted" ? -1 : 0) : previous.total,
        });
      }
      return {previous};
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listQueryKey, context.previous);
      handleApiError(error, "toast.restoreError");
    },
    onSuccess: () => {
      notify.success(t("toast.restored"));
    },
    onSettled: async () => {
      await invalidateJournals();
      queryClient.refetchQueries({queryKey: listQueryKey, exact: true});
    },
  });

  const handleOpenCreate = () => {
    resetForm();
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (journal) => {
    setIssuesOpen(false);
    setDialogMode("edit");
    setEditingJournal(journal);
    setForm(prefetchedForm(journal));
    setDialogOpen(true);
  };

const handleOpenIssues = (journal) => {
  if (dialogOpen) return;
  setSelectedJournal(journal);
  setIssuesOpen(true);
};

  const handleOpenIssueCreate = () => {
    setIssueDialogMode("create");
    setEditingIssue(null);
    setIssueForm({
      title: "",
      year: "",
      number: "",
      volume: "",
      published_at: "",
    });
    setIssueDialogOpen(true);
  };

  const handleOpenIssueEdit = (issue) => {
    setIssueDialogMode("edit");
    setEditingIssue(issue);
    setIssueForm({
      title: issue.title || "",
      year: issue.year ?? "",
      number: issue.number ?? "",
      volume: issue.volume ?? "",
      published_at: issue.published_at ? issue.published_at.slice(0, 10) : "",
    });
    setIssueDialogOpen(true);
  };

  const parseIssuePayload = () => {
    const year = issueForm.year !== "" ? Number(issueForm.year) : undefined;
    const number = issueForm.number !== "" ? Number(issueForm.number) : undefined;
    const volume = issueForm.volume !== "" ? Number(issueForm.volume) : undefined;
    return {
      title: issueForm.title?.trim() || undefined,
      year: Number.isFinite(year) ? year : undefined,
      number: Number.isFinite(number) ? number : undefined,
      volume: Number.isFinite(volume) ? volume : undefined,
      published_at: issueForm.published_at || null,
    };
  };

  const handleSubmit = () => {
    const nameValue = form.name.trim();
    if (!nameValue) {
      nameRef.current?.focus();
      notify.error(t("validation.nameRequired", {defaultMessage: "Name is required."}));
      return;
    }
    const coverValue = form.cover_image_url ? form.cover_image_url.trim() : "";
    const publisherValue = form.publisher ? form.publisher.trim() : "";

    if (dialogMode === "edit" && editingJournal) {
      const payload = {
        name: nameValue,
        slug: form.slug.trim() || undefined,
        issn: form.issn.trim() || undefined,
        description: form.description.trim() || undefined,
        publisher: publisherValue || undefined,
        cover_image_url: coverValue || undefined,
      };
      updateMutation.mutate({id: editingJournal.id, patch: payload});
    } else {
      createMutation.mutate({
        name: nameValue,
        slug: form.slug.trim() || undefined,
        issn: form.issn.trim() || undefined,
        description: form.description.trim() || undefined,
        publisher: publisherValue || undefined,
        cover_image_url: coverValue || undefined,
      });
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const contentType = file.type || "application/octet-stream";
      const presigned = await presignUpload(contentType);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        uploadXhrRef.current = xhr;
        xhr.open("PUT", presigned.uploadUrl);
        const headers = presigned.headers || {"Content-Type": contentType};
        Object.entries(headers).forEach(([key, value]) => {
          if (value) {
            xhr.setRequestHeader(key, value);
          }
        });
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
            resolve(null);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.send(file);
      });

      setForm((prev) => ({...prev, cover_image_url: presigned.publicUrl}));
      notify.success(t("toast.uploaded", {defaultMessage: "Cover uploaded."}));
    } catch (error) {
      notify.handleError(error, t("toast.uploadError", {defaultMessage: "Upload failed."}));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      uploadXhrRef.current = null;
    }
  };

  const handleRemoveCover = () => {
    setForm((prev) => ({...prev, cover_image_url: ""}));
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const items = listQuery.data?.items ?? [];
  const isLoading = listQuery.isLoading || listQuery.isFetching;
  const hasNext = listQuery.data?.hasNext ?? false;

  const issuesQueryKey = selectedJournal ? qkJournalIssues(selectedJournal.id, issuesParams) : null;

  const issuesQuery = useQuery({
    enabled: issuesOpen && Boolean(selectedJournal),
    queryKey: issuesQueryKey || ["admin:journals:issues"],
    queryFn: ({signal}) =>
      listJournalIssues(selectedJournal.id, {
        page: issuesParams.page,
        pageSize: issuesParams.pageSize,
        q: issuesDebounced || undefined,
        year: issuesParams.year,
        sort: issuesParams.sort,
        signal,
      }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const prefetchIssues = useCallback(
    (journal) => {
      queryClient.prefetchQuery({
        queryKey: qkJournalIssues(journal.id, issuesParams),
        queryFn: ({signal}) =>
          listJournalIssues(journal.id, {
            page: 1,
            pageSize: issuesParams.pageSize,
            sort: issuesParams.sort,
            signal,
          }),
        staleTime: 30_000,
      });
    },
    [issuesParams.pageSize, issuesParams.sort, queryClient],
  );

  useEffect(() => {
    if (issueDialogOpen) {
      requestAnimationFrame(() => issueTitleRef.current?.focus());
    }
  }, [issueDialogOpen]);

  const isInteractiveTarget = (target) => {
    if (!target) return false;
    const selector =
      "button, a, input, textarea, select, [role='menuitem'], [data-interactive='true'], [data-radix-dropdown-menu-content], [data-radix-popper-content-wrapper]";
    return Boolean(target.closest?.(selector));
  };

  const invalidateIssues = useCallback(() => {
    if (issuesQueryKey) {
      queryClient.invalidateQueries({queryKey: issuesQueryKey, exact: true});
    }
  }, [issuesQueryKey, queryClient]);

  const issueCreateMutation = useMutation({
    mutationFn: (payload) => createJournalIssue(selectedJournal.id, payload),
    onMutate: async (payload) => {
      if (!issuesQueryKey) return {previous: null};
      await queryClient.cancelQueries({queryKey: issuesQueryKey});
      const previous = queryClient.getQueryData(issuesQueryKey);
      let tempId = null;
      if (previous && issuesParams.page === 1) {
        tempId = `temp-issue-${Date.now()}`;
        const optimistic = {
          id: tempId,
          journal_id: selectedJournal.id,
          title: payload.title || "",
          year: payload.year ?? null,
          number: payload.number ?? null,
          volume: payload.volume ?? null,
          published_at: payload.published_at ?? null,
          cover_image_url: null,
          articles_count: 0,
          created_at: new Date().toISOString(),
        };
        const nextItems = [optimistic, ...previous.items].slice(0, issuesParams.pageSize);
        queryClient.setQueryData(issuesQueryKey, {
          ...previous,
          items: nextItems,
          total: previous.total + 1,
        });
      }
      return {previous, tempId};
    },
    onError: (error, _vars, context) => {
      if (context?.previous && issuesQueryKey) {
        queryClient.setQueryData(issuesQueryKey, context.previous);
      }
      notify.handleError(error, t("issues.toast.error", {defaultMessage: "Unable to save issue."}));
    },
    onSuccess: (data, _vars, context) => {
      if (issuesQueryKey) {
        queryClient.setQueryData(issuesQueryKey, (prev) => {
          if (!prev) return prev;
          const items = [...prev.items];
          if (context?.tempId) {
            const idx = items.findIndex((item) => item.id === context.tempId);
            if (idx >= 0) {
              items[idx] = data;
            } else {
              items.unshift(data);
            }
          } else if (issuesParams.page === 1) {
            items.unshift(data);
          }
          return {...prev, items: items.slice(0, issuesParams.pageSize)};
        });
      }
      setIssueDialogOpen(false);
      setIssueForm({title: "", year: "", number: "", volume: "", published_at: ""});
      notify.success(t("issues.toast.created", {defaultMessage: "Issue created"}));
    },
    onSettled: invalidateIssues,
  });

  const issueUpdateMutation = useMutation({
    mutationFn: ({id, patch}) => updateIssue(id, patch),
    onMutate: async ({id, patch}) => {
      if (!issuesQueryKey) return {previous: null};
      await queryClient.cancelQueries({queryKey: issuesQueryKey});
      const previous = queryClient.getQueryData(issuesQueryKey);
      if (previous) {
        const items = previous.items.map((item) => (item.id === id ? {...item, ...patch} : item));
        queryClient.setQueryData(issuesQueryKey, {...previous, items});
      }
      return {previous};
    },
    onError: (error, _vars, context) => {
      if (context?.previous && issuesQueryKey) {
        queryClient.setQueryData(issuesQueryKey, context.previous);
      }
      notify.handleError(error, t("issues.toast.error", {defaultMessage: "Unable to update issue."}));
    },
    onSuccess: (data) => {
      if (issuesQueryKey) {
        queryClient.setQueryData(issuesQueryKey, (prev) => {
          if (!prev) return prev;
          const items = prev.items.map((item) => (item.id === data.id ? data : item));
          return {...prev, items};
        });
      }
      setIssueDialogOpen(false);
      setIssueForm({title: "", year: "", number: "", volume: "", published_at: ""});
      setEditingIssue(null);
      notify.success(t("issues.toast.updated", {defaultMessage: "Issue updated"}));
    },
    onSettled: invalidateIssues,
  });

  const issueDeleteMutation = useMutation({
    mutationFn: (id) => deleteIssue(id),
    onMutate: async (id) => {
      if (!issuesQueryKey) return {previous: null};
      await queryClient.cancelQueries({queryKey: issuesQueryKey});
      const previous = queryClient.getQueryData(issuesQueryKey);
      if (previous) {
        const nextItems = previous.items.filter((item) => item.id !== id);
        queryClient.setQueryData(issuesQueryKey, {
          ...previous,
          items: nextItems,
          total: Math.max(0, previous.total - 1),
        });
      }
      return {previous};
    },
    onError: (error, _vars, context) => {
      if (context?.previous && issuesQueryKey) {
        queryClient.setQueryData(issuesQueryKey, context.previous);
      }
      notify.handleError(
        error,
        error?.userMessage || t("issues.toast.error", {defaultMessage: "Delete failed."}),
      );
    },
    onSuccess: () => {
      notify.success(t("issues.toast.deleted", {defaultMessage: "Issue deleted"}));
      setPendingIssueDelete(null);
    },
    onSettled: invalidateIssues,
  });

  const handleIssueSubmit = (event) => {
    event.preventDefault();
    if (!selectedJournal) return;
    const payload = parseIssuePayload();
    if (issueDialogMode === "edit" && editingIssue) {
      issueUpdateMutation.mutate({id: editingIssue.id, patch: payload});
    } else {
      issueCreateMutation.mutate(payload);
    }
  };

  const handleIssueDelete = () => {
    if (!pendingIssueDelete) return;
    issueDeleteMutation.mutate(pendingIssueDelete.id);
  };

  const issueSubmitting = issueCreateMutation.isPending || issueUpdateMutation.isPending;

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t("toolbar.search")}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(next) => {
                setStatusFilter(next);
                setPage(1);
                updateUrl({status: next, page: 1});
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder={t("toolbar.status.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`toolbar.status.${option.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canCreate ? (
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.add")}
              </Button>
            ) : null}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("table.title")}</CardTitle>
            <CardDescription>{t("table.description")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("columns.name")}</TableHead>
                    <TableHead className="w-[120px]">{t("columns.issn")}</TableHead>
                    <TableHead className="w-[100px] text-right">{t("columns.issues")}</TableHead>
                    <TableHead className="w-[110px] text-right">{t("columns.articles")}</TableHead>
                    <TableHead className="w-[140px]">{t("columns.created")}</TableHead>
                    <TableHead className="w-[120px]">{t("columns.status")}</TableHead>
                    <TableHead className="w-[80px] text-right">{t("columns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        {isLoading ? t("table.loading") : t("table.empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((journal) => (
                      <TableRow
                        key={journal.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer"
                        onMouseDownCapture={(event) => {
                          if (isInteractiveTarget(event.target)) {
                            event.stopPropagation();
                          }
                        }}
                        onClick={(event) => {
                          if (isInteractiveTarget(event.target)) return;
                          handleOpenIssues(journal);
                        }}
                        onMouseEnter={() => prefetchIssues(journal)}
                        onKeyDown={(event) => {
                          if (isInteractiveTarget(event.target)) return;
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleOpenIssues(journal);
                          }
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {journal.cover_image_url ? (
                              <img
                                src={journal.cover_image_url}
                                alt={journal.name || "Cover"}
                                className="h-12 w-12 rounded-md border object-cover"
                              />
                            ) : (
                              <div
                                className="h-12 w-12 rounded-md border border-dashed bg-muted"
                                aria-hidden="true"
                              />
                            )}
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">{journal.name}</p>
                              <p className="text-xs text-muted-foreground">{journal.slug}</p>
                              {journal.publisher ? (
                                <p className="text-xs text-muted-foreground">{journal.publisher}</p>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{journal.issn || "-"}</TableCell>
                        <TableCell className="text-right font-medium">{journal.issues_count}</TableCell>
                        <TableCell className="text-right font-medium">{journal.articles_count}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(journal.created_at)}</TableCell>
                        <TableCell>
                          {journal.deleted_at ? (
                            <Badge variant="destructive">{t("status.deleted")}</Badge>
                          ) : (
                            <Badge variant="secondary">{t("status.active")}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t("actions.more")}
                                data-interactive="true"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("actions.title")}</DropdownMenuLabel>
                              <DropdownMenuItem
                                onSelect={(event) => {
                                  event.preventDefault();
                                  handleOpenIssues(journal);
                                }}
                              >
                                {t("issues.open")}
                              </DropdownMenuItem>
                              {canUpdate ? (
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleOpenEdit(journal);
                                  }}
                                >
                                  {t("actions.edit")}
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuSeparator />
                              {journal.deleted_at ? (
                                canRestore && (
                                  <DropdownMenuItem
                                    onSelect={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      restoreMutation.mutate(journal.id);
                                    }}
                                    disabled={restoreMutation.isPending}
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    {t("actions.restore")}
                                  </DropdownMenuItem>
                                )
                              ) : (
                                canSoftDelete && (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      setPendingDelete(journal);
                                    }}
                                  >
                                    <Archive className="mr-2 h-4 w-4" />
                                    {t("actions.softDelete")}
                                  </DropdownMenuItem>
                                )
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
            <div className="text-sm text-muted-foreground">
              {t.rich("pagination.summary", {
                page,
                total: listQuery.data?.total ?? 0,
                strong: (chunks) => <span className="font-semibold text-foreground">{chunks}</span>,
              })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  updateUrl({page: next});
                }}
                disabled={isLoading || page <= 1}
              >
                {t("pagination.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  updateUrl({page: next});
                }}
                disabled={isLoading || !hasNext}
              >
                {t("pagination.next")}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <JournalForm
          t={t}
          form={form}
          setForm={setForm}
          mode={dialogMode}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              if (uploadXhrRef.current) {
                try {
                  uploadXhrRef.current.abort();
                } catch {
                  // ignore
                }
                uploadXhrRef.current = null;
              }
              setUploading(false);
              setUploadProgress(0);
              resetForm();
            }
          }}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          nameRef={nameRef}
          fileInputRef={fileInputRef}
          onFileChange={handleFileSelect}
          onUploadClick={triggerFilePicker}
          uploading={uploading}
          uploadProgress={uploadProgress}
          onRemoveCover={handleRemoveCover}
        />

        <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("dialog.delete.title")}</AlertDialogTitle>
              <AlertDialogDescription>{t("dialog.delete.description")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingDelete(null)}>
                {t("actions.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => pendingDelete && softDeleteMutation.mutate(pendingDelete.id)}
              >
                {t("actions.confirmDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Sheet open={issuesOpen} onOpenChange={(open) => setIssuesOpen(open)}>
          <SheetContent side="right" className="w-full min-w-[380px] p-0 sm:max-w-[900px]">
            <SheetHeader className="border-b px-6 py-4 text-left">
              <SheetTitle>{selectedJournal?.name || t("issues.title")}</SheetTitle>
              <SheetDescription>
                {selectedJournal?.issn ? `${t("fields.issn")}: ${selectedJournal.issn}` : null}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={issuesSearchRef}
                    value={issuesParams.q}
                    onChange={(event) =>
                      setIssuesParams((prev) => ({...prev, q: event.target.value, page: 1}))
                    }
                    placeholder={t("issues.searchPlaceholder")}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={issuesParams.year ?? ""}
                    onChange={(event) =>
                      setIssuesParams((prev) => ({
                        ...prev,
                        year: event.target.value ? Number(event.target.value) : undefined,
                        page: 1,
                      }))
                    }
                    placeholder={t("issues.yearPlaceholder", {defaultMessage: "Year"})}
                    className="w-28"
                  />
                  <Select
                    value={issuesParams.sort}
                    onValueChange={(next) => setIssuesParams((prev) => ({...prev, sort: next, page: 1}))}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder={t("issues.sort.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year_desc">{t("issues.sort.yearDesc")}</SelectItem>
                      <SelectItem value="year_asc">{t("issues.sort.yearAsc")}</SelectItem>
                      <SelectItem value="number_desc">{t("issues.sort.numberDesc")}</SelectItem>
                      <SelectItem value="number_asc">{t("issues.sort.numberAsc")}</SelectItem>
                      <SelectItem value="created_desc">{t("issues.sort.createdDesc")}</SelectItem>
                      <SelectItem value="created_asc">{t("issues.sort.createdAsc")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleOpenIssueCreate} data-interactive="true">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("issues.new")}
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("issues.columns.year")}</TableHead>
                      <TableHead>{t("issues.columns.number")}</TableHead>
                      <TableHead>{t("issues.columns.volume")}</TableHead>
                      <TableHead>{t("issues.columns.title")}</TableHead>
                      <TableHead className="text-right">{t("issues.columns.articles")}</TableHead>
                      <TableHead>{t("issues.columns.published")}</TableHead>
                      <TableHead>{t("issues.columns.created")}</TableHead>
                      <TableHead className="w-[60px] text-right">{t("issues.columns.actions", {defaultMessage: "Actions"})}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issuesQuery.isLoading ? (
                      Array.from({length: 4}).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell colSpan={8}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : issuesQuery.data?.items?.length ? (
                      issuesQuery.data.items.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>{issue.year ?? "-"}</TableCell>
                          <TableCell>{issue.number ?? "-"}</TableCell>
                          <TableCell>{issue.volume ?? "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{issue.title || "-"}</TableCell>
                          <TableCell className="text-right font-medium">{issue.articles_count}</TableCell>
                          <TableCell>{issue.published_at ? new Date(issue.published_at).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-interactive="true" onClick={(event) => event.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("actions.title")}</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    handleOpenIssueEdit(issue);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  {t("issues.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(event) => {
                                    event.preventDefault();
                                    setPendingIssueDelete(issue);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("issues.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                          {issuesQuery.error ? (
                            <div className="flex flex-col items-center gap-2">
                              <span>{t("issues.error")}</span>
                              <Button variant="outline" size="sm" onClick={() => issuesQuery.refetch()}>
                                {t("actions.retry", {defaultMessage: "Retry"})}
                              </Button>
                            </div>
                          ) : (
                            t("issues.empty")
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {t("pagination.summary", {
                    page: issuesQuery.data?.page ?? issuesParams.page,
                    total: issuesQuery.data?.total ?? 0,
                  })}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIssuesParams((prev) => ({...prev, page: Math.max(1, (prev.page || 1) - 1)}))
                    }
                    disabled={issuesQuery.isFetching || (issuesQuery.data?.page ?? 1) <= 1}
                  >
                    {t("pagination.prev")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIssuesParams((prev) => ({...prev, page: (prev.page || 1) + 1}))
                    }
                    disabled={issuesQuery.isFetching || !(issuesQuery.data?.hasNext ?? false)}
                  >
                    {t("pagination.next")}
                  </Button>
                </div>
              </div>
            </div>

            <Dialog
              open={issueDialogOpen}
              onOpenChange={(open) => {
                setIssueDialogOpen(open);
                if (!open) {
                  setEditingIssue(null);
                  setIssueForm({title: "", year: "", number: "", volume: "", published_at: ""});
                }
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {issueDialogMode === "edit" ? t("issues.edit") : t("issues.new")}
                  </DialogTitle>
                  <DialogDescription>
                    {issueDialogMode === "edit"
                      ? t("issues.dialogEditDescription", {defaultMessage: "Update issue details."})
                      : t("issues.dialogCreateDescription", {defaultMessage: "Add a new issue to this journal."})}
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleIssueSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="issue-title">{t("issues.form.title")}</Label>
                    <Input
                      id="issue-title"
                      ref={issueTitleRef}
                      value={issueForm.title}
                      onChange={(event) => setIssueForm((prev) => ({...prev, title: event.target.value}))}
                      placeholder={t("issues.form.titlePlaceholder", {defaultMessage: "Issue title"})}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="issue-year">{t("issues.form.year")}</Label>
                      <Input
                        id="issue-year"
                        type="number"
                        value={issueForm.year}
                        onChange={(event) =>
                          setIssueForm((prev) => ({...prev, year: event.target.value}))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-number">{t("issues.form.number")}</Label>
                      <Input
                        id="issue-number"
                        type="number"
                        value={issueForm.number}
                        onChange={(event) =>
                          setIssueForm((prev) => ({...prev, number: event.target.value}))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-volume">{t("issues.form.volume")}</Label>
                      <Input
                        id="issue-volume"
                        type="number"
                        value={issueForm.volume}
                        onChange={(event) =>
                          setIssueForm((prev) => ({...prev, volume: event.target.value}))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-published">{t("issues.form.publishedAt")}</Label>
                    <Input
                      id="issue-published"
                      type="date"
                      value={issueForm.published_at}
                      onChange={(event) =>
                        setIssueForm((prev) => ({...prev, published_at: event.target.value}))
                      }
                    />
                  </div>
                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setIssueDialogOpen(false)}>
                      {t("actions.cancel")}
                    </Button>
                    <Button type="submit" disabled={issueSubmitting}>
                      {issueSubmitting
                        ? t("actions.saving")
                        : issueDialogMode === "edit"
                          ? t("actions.save")
                          : t("issues.new")}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog
              open={Boolean(pendingIssueDelete)}
              onOpenChange={(open) => {
                if (!open) setPendingIssueDelete(null);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("issues.confirmDeleteTitle", {defaultMessage: "Delete issue?"})}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("issues.confirmDeleteDesc", {defaultMessage: "This action cannot be undone."})}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPendingIssueDelete(null)}>
                    {t("issues.close", {defaultMessage: "Close"})}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleIssueDelete}
                    disabled={issueDeleteMutation.isPending}
                  >
                    {issueDeleteMutation.isPending
                      ? t("actions.saving")
                      : t("issues.delete", {defaultMessage: "Delete"})}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetContent>
        </Sheet>
      </div>
    </AdminGuard>
  );
};

export default AdminJournalsPage;

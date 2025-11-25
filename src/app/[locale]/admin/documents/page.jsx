"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Check, FileText, Loader2, Plus, RotateCcw, Search, Trash2, Upload, X} from "lucide-react";
import {useForm} from "react-hook-form";

import AdminGuard from "@/components/auth/AdminGuard";
import {Badge} from "@/components/ui/badge";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Textarea} from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useAdminCapabilities from "@/hooks/useAdminCapabilities";
import useNotify from "@/hooks/useNotify";
import {
  createAdminDocument,
  getAdminDocument,
  listAdminDocuments,
  qkAdminDocs,
  restoreAdminDocument,
  softDeleteAdminDocument,
  updateAdminDocument,
} from "@/lib/api/adminDocuments";
import {getCategoryChildren, listCategories} from "@/lib/api/adminCategories";
import {ADMIN_AUTHORS_QUERY_KEYS, listAuthors} from "@/lib/api/adminAuthors";
import {
  ADMIN_JOURNALS_QUERY_KEYS,
  listJournalIssues,
  listJournals,
  presignUpload,
  qkJournalIssues,
} from "@/lib/api/adminJournals";
import {cn} from "@/lib/utils";

const PAGE_SIZE = 20;
const ALL = "all";
const DEFAULT_LANG = "ar";
const MIN_YEAR = 1800;
const MAX_YEAR = 2100;

const TYPE_OPTIONS = [
  {value: ALL, label: "All types"},
  {value: "article", label: "Article"},
  {value: "book", label: "Book"},
  {value: "thesis", label: "Thesis"},
  {value: "report", label: "Report"},
  {value: "manuscript", label: "Manuscript"},
  {value: "archive_item", label: "Archive item"},
  {value: "site_record", label: "Site record"},
  {value: "other", label: "Other"},
];

const LANG_OPTIONS = [
  {value: ALL, label: "All languages"},
  {value: "ar", label: "Arabic"},
  {value: "fr", label: "French"},
  {value: "en", label: "English"},
];

const STATUS_OPTIONS = [
  {value: "active", label: "Active"},
  {value: "deleted", label: "Deleted"},
  {value: "all", label: "All"},
];

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch (err) {
    return String(value);
  }
};

const formatIssue = (issue) => {
  if (!issue) return "-";
  const pieces = [];
  if (issue.year) pieces.push(issue.year);
  if (issue.volume) pieces.push(`Vol ${issue.volume}`);
  if (issue.number) pieces.push(`No ${issue.number}`);
  if (issue.title) pieces.push(issue.title);
  return pieces.join(" · ") || `#${issue.id}`;
};

const findCategory = (categories, id) => categories?.find((item) => item.id === id) ?? null;

const uploadFileWithProgress = (url, file, headers = {}, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    const headerEntries = headers && typeof headers === "object" ? Object.entries(headers) : [];
    headerEntries.forEach(([key, value]) => {
      if (typeof value === "string") {
        xhr.setRequestHeader(key, value);
      }
    });
    if (!headerEntries.find(([key]) => key.toLowerCase() === "content-type")) {
      xhr.setRequestHeader("Content-Type", file.type || "application/pdf");
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status}).`));
      }
    };
    xhr.send(file);
  });

const resolveLockedType = ({categoryKind, issueId, journalId, currentType}) => {
  if (issueId) return "article";
  if (categoryKind === "journal" && journalId) return "article";
  if (categoryKind === "archive_collection") return "archive_item";
  if (categoryKind === "historical-sites") return currentType || "site_record";
  return currentType || null;
};

const AdminDocumentsPage = () => {
  const t = useTranslations("admin.documents");
  const notify = useNotify();
  const queryClient = useQueryClient();
  const {data: capabilities} = useAdminCapabilities();

  const canList = capabilities?.documents?.list !== false;
  const canCreate = capabilities?.documents?.create !== false;
  const canUpdate = capabilities?.documents?.update !== false;
  const canDelete = capabilities?.documents?.delete !== false;
  const canRestore = capabilities?.documents?.restore !== false;

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [langFilter, setLangFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState("active");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [sectionId, setSectionId] = useState(null);
  const [categorySlug, setCategorySlug] = useState(null);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      const next = searchValue.trim();
      setDebouncedSearch((prev) => {
        if (prev !== next) {
          setPage(1);
        }
        return next;
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const sectionsQuery = useQuery({
    queryKey: ["admin:documents:sections"],
    queryFn: ({signal}) => listCategories({kind: "section", parentId: null, pageSize: 50, sort: "name", signal}),
    staleTime: 5 * 60 * 1000,
  });
  const subCategoriesQuery = useQuery({
    queryKey: sectionId ? ["admin:documents:subcategories", sectionId] : ["admin:documents:subcategories:idle"],
    queryFn: ({signal}) =>
      getCategoryChildren({
        parentId: Number(sectionId),
        signal,
      }),
    enabled: Boolean(sectionId),
    staleTime: 5 * 60 * 1000,
  });

  const journalsQuery = useQuery({
    queryKey: ADMIN_JOURNALS_QUERY_KEYS.list({status: "active", pageSize: 0}),
    queryFn: () => ({items: []}),
    enabled: false,
  });

  const issuesQuery = useQuery({
    queryKey: ["admin:documents:issues:disabled"],
    queryFn: () => ({items: []}),
    enabled: false,
  });

  const authorsQuery = useQuery({
    queryKey: ADMIN_AUTHORS_QUERY_KEYS.list({pageSize: 50, status: "active"}),
    queryFn: ({signal}) => listAuthors({pageSize: 50, status: "active", sort: "name", signal}),
    staleTime: 5 * 60 * 1000,
  });

  const topSections = sectionsQuery.data?.items || [];
  const filteredSections = topSections.filter(
    (node) => node.slug !== "library" && (node.name || "").toLowerCase() !== "library",
  );
  const selectedSection = sectionId ? topSections.find((node) => node.id === Number(sectionId)) : null;
  const childCategories = sectionId ? subCategoriesQuery.data || [] : [];
  const selectedCategory = categorySlug ? childCategories.find((node) => node.slug === categorySlug) || null : null;
  const derivedCategorySlug = selectedCategory?.slug || selectedSection?.slug || null;

  const listQueryKey = useMemo(
    () =>
      qkAdminDocs.list({
        q: debouncedSearch || undefined,
        type: typeFilter !== ALL ? typeFilter : undefined,
        lang: langFilter !== ALL ? langFilter : undefined,
        yearMin: yearMin ? Number(yearMin) : undefined,
        yearMax: yearMax ? Number(yearMax) : undefined,
        categorySlug: derivedCategorySlug || undefined,
        status: statusFilter,
        page,
        pageSize: PAGE_SIZE,
      }),
    [
      debouncedSearch,
      typeFilter,
      langFilter,
      statusFilter,
      yearMin,
      yearMax,
      derivedCategorySlug,
      page,
    ],
  );

  const listQuery = useQuery({
    queryKey: listQueryKey,
    queryFn: ({signal}) =>
      listAdminDocuments({
        q: debouncedSearch || undefined,
        type: typeFilter !== ALL ? typeFilter : undefined,
        lang: langFilter !== ALL ? langFilter : undefined,
        yearMin: yearMin ? Number(yearMin) : undefined,
        yearMax: yearMax ? Number(yearMax) : undefined,
        categorySlug: derivedCategorySlug || undefined,
        status: statusFilter,
        page,
        pageSize: PAGE_SIZE,
        signal,
      }),
    enabled: canList,
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const detailQuery = useQuery({
    queryKey: editingId ? qkAdminDocs.detail(editingId) : ["admin:documents:detail:idle"],
    queryFn: ({signal}) => getAdminDocument(Number(editingId), {signal}),
    enabled: Boolean(editingId) && dialogMode === "edit",
    staleTime: 2 * 60 * 1000,
  });

  const handleOpenCreate = () => {
    setDialogMode("create");
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (id) => {
    setDialogMode("edit");
    setEditingId(id);
    setDialogOpen(true);
  };

  const resetFilters = () => {
    setSearchValue("");
    setDebouncedSearch("");
    setTypeFilter(ALL);
    setLangFilter(ALL);
    setStatusFilter("active");
    setYearMin("");
    setYearMax("");
    setSectionId(null);
    setCategorySlug(null);
    setPage(1);
  };

  const createMutation = useMutation({
    mutationFn: createAdminDocument,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previous = queryClient.getQueryData(listQueryKey);
      const tempId = -Date.now();
      if (previous?.items) {
        const nextItems = [
          {
            id: tempId,
            title: payload.title,
            type: payload.type || "other",
            lang: payload.lang || DEFAULT_LANG,
            year: payload.year ?? null,
            pages: payload.pages ?? null,
            primary_category: null,
            journal: null,
            issue: null,
            authors: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "active",
            file_key: payload.file_key ?? null,
          },
          ...previous.items,
        ].slice(0, PAGE_SIZE);
        queryClient.setQueryData(listQueryKey, {
          ...previous,
          items: nextItems,
          total: (previous.total || 0) + 1,
        });
      }
      return {previous, tempId};
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listQueryKey, context.previous);
      }
      notify.handleError(error, "Unable to create document.");
    },
    onSuccess: (doc, _payload, context) => {
      queryClient.setQueryData(qkAdminDocs.detail(doc.id), doc);
      queryClient.setQueryData(listQueryKey, (old) => {
        if (!old) return old;
        const filtered = (old.items || []).filter((item) => item.id !== context?.tempId);
        return {
          ...old,
          items: [doc, ...filtered].slice(0, PAGE_SIZE),
        };
      });
      notify.success("Document created.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["admin:documents:list"]});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({id, payload}) => updateAdminDocument(id, payload),
    onMutate: async ({id, payload}) => {
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previousList = queryClient.getQueryData(listQueryKey);
      const previousDetail = queryClient.getQueryData(qkAdminDocs.detail(id));
      if (previousList?.items) {
        queryClient.setQueryData(listQueryKey, {
          ...previousList,
          items: previousList.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...payload,
                  primary_category: item.primary_category,
                }
              : item,
          ),
        });
      }
      if (previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(id), {...previousDetail, ...payload});
      }
      return {previousList, previousDetail};
    },
    onError: (error, _vars, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(listQueryKey, context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(editingId), context.previousDetail);
      }
      notify.handleError(error, "Unable to update document.");
    },
    onSuccess: (doc) => {
      queryClient.setQueryData(qkAdminDocs.detail(doc.id), doc);
      queryClient.setQueryData(listQueryKey, (old) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((item) => (item.id === doc.id ? doc : item)),
        };
      });
      notify.success("Document updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["admin:documents:list"]});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => softDeleteAdminDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previousList = queryClient.getQueryData(listQueryKey);
      const previousDetail = queryClient.getQueryData(qkAdminDocs.detail(id));
      if (previousList?.items) {
        const nextItems =
          statusFilter === "active"
            ? previousList.items.filter((item) => item.id !== id)
            : previousList.items.map((item) =>
                item.id === id ? {...item, status: "deleted"} : item,
              );
        queryClient.setQueryData(listQueryKey, {
          ...previousList,
          items: nextItems,
          total:
            statusFilter === "active" ? Math.max(0, (previousList.total || 0) - 1) : previousList.total,
        });
      }
      if (previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(id), {...previousDetail, status: "deleted"});
      }
      return {previousList, previousDetail};
    },
    onError: (error, id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(listQueryKey, context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(id), context.previousDetail);
      }
      notify.handleError(error, "Unable to delete document.");
    },
    onSuccess: (doc) => {
      queryClient.setQueryData(qkAdminDocs.detail(doc.id), doc);
      queryClient.setQueryData(listQueryKey, (old) => {
        if (!old?.items) return old;
        const updatedItems =
          statusFilter === "active"
            ? old.items.filter((item) => item.id !== doc.id)
            : old.items.map((item) => (item.id === doc.id ? doc : item));
        return {
          ...old,
          items: updatedItems,
        };
      });
      notify.success("Document deleted.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["admin:documents:list"]});
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => restoreAdminDocument(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({queryKey: listQueryKey});
      const previousList = queryClient.getQueryData(listQueryKey);
      const previousDetail = queryClient.getQueryData(qkAdminDocs.detail(id));
      if (previousList?.items) {
        const nextItems =
          statusFilter === "deleted"
            ? previousList.items.filter((item) => item.id !== id)
            : previousList.items.map((item) =>
                item.id === id ? {...item, status: "active"} : item,
              );
        queryClient.setQueryData(listQueryKey, {
          ...previousList,
          items: nextItems,
          total:
            statusFilter === "deleted" ? Math.max(0, (previousList.total || 0) - 1) : previousList.total,
        });
      }
      if (previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(id), {...previousDetail, status: "active"});
      }
      return {previousList, previousDetail};
    },
    onError: (error, id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(listQueryKey, context.previousList);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(qkAdminDocs.detail(id), context.previousDetail);
      }
      notify.handleError(error, "Unable to restore document.");
    },
    onSuccess: (doc) => {
      queryClient.setQueryData(qkAdminDocs.detail(doc.id), doc);
      queryClient.setQueryData(listQueryKey, (old) => {
        if (!old?.items) return old;
        const updatedItems =
          statusFilter === "deleted"
            ? old.items.filter((item) => item.id !== doc.id)
            : old.items.map((item) => (item.id === doc.id ? doc : item));
        return {
          ...old,
          items: updatedItems,
        };
      });
      notify.success("Document restored.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["admin:documents:list"]});
    },
  });

  const handleDialogSubmit = async (values) => {
    if (dialogMode === "edit" && editingId) {
      await updateMutation.mutateAsync({id: editingId, payload: values});
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogOpen(false);
  };

  const list = listQuery.data;
  const categories = [];
  const journals = [];
  const issues = [];
  const authors = authorsQuery.data?.items || [];

  const selectedJournal = journals.find((j) => j.id === Number(journalId));
  const selectedIssue = issues.find((i) => i.id === Number(issueId));

  const handleDelete = async (id) => {
    if (!canDelete) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleRestore = async (id) => {
    if (!canRestore) return;
    await restoreMutation.mutateAsync(id);
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{t("title", {defaultMessage: "Documents"})}</CardTitle>
              <CardDescription>
                {t("description", {defaultMessage: "Search, create, and edit documents."})}
              </CardDescription>
            </div>
            {canCreate && (
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t("create", {defaultMessage: "New document"})}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
              <div className="col-span-2 flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search title or author"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={langFilter}
                onValueChange={(value) => {
                  setLangFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANG_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={MIN_YEAR}
                max={MAX_YEAR}
                placeholder="Year from"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
              />
              <Input
                type="number"
                min={MIN_YEAR}
                max={MAX_YEAR}
                placeholder="Year to"
                value={yearMax}
                onChange={(e) => setYearMax(e.target.value)}
              />
              <Select
                value={sectionId ? String(sectionId) : "all"}
                onValueChange={(value) => {
                  const nextId = value && value !== "all" ? Number(value) : null;
                  setSectionId(nextId);
                  setCategorySlug(null);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Library</SelectItem>
                  {filteredSections.map((section) => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={categorySlug || "all"}
                disabled={!selectedSection || subCategoriesQuery.isLoading}
                onValueChange={(value) => {
                  const nextSlug = value && value !== "all" ? value : null;
                  setCategorySlug(nextSlug);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={selectedSection ? "Sub-category" : "Select section first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sub-categories</SelectItem>
                  {(childCategories || []).map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {category.kind}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" className="justify-self-start" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Results</CardTitle>
            <CardDescription>
              Showing {list?.items?.length ?? 0} of {list?.total ?? 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Journal / Issue</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listQuery.isLoading && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {list?.items?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="max-w-xs">
                      <div className="font-medium leading-tight">{doc.title}</div>
                      <div className="text-xs text-muted-foreground">#{doc.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.lang || "-"}</TableCell>
                    <TableCell>{doc.year ?? "-"}</TableCell>
                    <TableCell>
                      {doc.primary_category ? (
                        <div className="flex flex-col gap-1">
                          <span>{doc.primary_category.name}</span>
                          <Badge variant="secondary" className="w-fit text-[10px] uppercase">
                            {doc.primary_category.kind}
                          </Badge>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>{doc.journal ? doc.journal.name : "-"}</span>
                        <span className="text-xs text-muted-foreground">
                          {doc.issue ? formatIssue(doc.issue) : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.authors?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {doc.authors.slice(0, 2).map((author) => (
                            <Badge key={author.id} variant="outline">
                              {author.name_ar || author.name_lat || `#${author.id}`}
                            </Badge>
                          ))}
                          {doc.authors.length > 2 && (
                            <Badge variant="secondary">+{doc.authors.length - 2}</Badge>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(doc.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {doc.status === "deleted" || statusFilter === "deleted" ? (
                        canRestore ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRestore(doc.id)}
                            disabled={restoreMutation.isPending && restoreMutation.variables === doc.id}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )
                      ) : (
                        <div className="flex justify-end gap-2">
                          {canUpdate && (
                            <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(doc.id)}>
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  disabled={deleteMutation.isPending && deleteMutation.variables === doc.id}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete document?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will move the document to trash. You can restore it later.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDelete(doc.id)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {!canUpdate && !canDelete && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!listQuery.isLoading && (!list?.items || list.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
              <div>
                Page {list?.page ?? page} of {Math.max(1, Math.ceil((list?.total || 0) / PAGE_SIZE))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1 || listQuery.isFetching}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!list?.hasNext || listQuery.isFetching}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DocumentDialog
        open={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
        initialData={dialogMode === "edit" ? detailQuery.data : null}
        categories={categories}
        journals={journals}
        authors={authors}
        notify={notify}
        loading={dialogMode === "edit" && detailQuery.isLoading}
        onSubmit={handleDialogSubmit}
      />
    </AdminGuard>
  );
};

const CaretDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const DocumentDialog = ({
  open,
  mode,
  onOpenChange,
  initialData,
  categories,
  journals,
  authors,
  notify,
  loading,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
      title: "",
      abstract: "",
      type: "article",
      lang: DEFAULT_LANG,
      year: "",
      pages: "",
      doi: "",
      isbn: "",
      issn: "",
      primary_category_id: null,
      journal_id: null,
      issue_id: null,
      cover_image_url: "",
      start_page: "",
      end_page: "",
      author_ids: [],
      file_key: "",
    },
  });

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadName, setUploadName] = useState("");

  const primaryCategoryId = form.watch("primary_category_id");
  const categoryKind = useMemo(
    () => findCategory(categories, Number(primaryCategoryId))?.kind ?? null,
    [categories, primaryCategoryId],
  );
  const journalId = form.watch("journal_id");
  const issueId = form.watch("issue_id");
  const typeValue = form.watch("type");
  const lockedType = useMemo(
    () => resolveLockedType({categoryKind, issueId, journalId, currentType: typeValue}),
    [categoryKind, issueId, journalId, typeValue],
  );

  useEffect(() => {
    if (!open) return;
    const detail = initialData;
    form.reset({
      title: detail?.title || "",
      abstract: detail?.abstract || "",
      type: detail?.type || "article",
      lang: detail?.lang || DEFAULT_LANG,
      year: detail?.year ?? "",
      pages: detail?.pages ?? "",
      doi: detail?.doi || "",
      isbn: detail?.isbn || "",
      issn: detail?.issn || "",
      primary_category_id: detail?.primary_category?.id || null,
      journal_id: detail?.journal?.id || null,
      issue_id: detail?.issue?.id || null,
      cover_image_url: detail?.cover_image_url || "",
      start_page: detail?.start_page ?? "",
      end_page: detail?.end_page ?? "",
      author_ids: detail?.authors?.map((a) => a.id) || [],
      file_key: detail?.file_key || "",
    });
    setUploadName(detail?.file_key ? detail.file_key.split("/").pop() || detail.file_key : "");
    setUploadProgress(0);
    setUploading(false);
  }, [open, initialData, form]);

  useEffect(() => {
    if (lockedType && typeValue !== lockedType) {
      form.setValue("type", lockedType);
    }
  }, [lockedType, typeValue, form]);

  const issuesQuery = useQuery({
    queryKey: journalId
      ? qkJournalIssues(Number(journalId), {pageSize: 100, sort: "year_desc"})
      : ["admin:documents:dialog:issues"],
    queryFn: ({signal}) => listJournalIssues(Number(journalId), {pageSize: 100, sort: "year_desc", signal}),
    enabled: Boolean(journalId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!journalId) {
      form.setValue("issue_id", null);
      return;
    }
    const issueList = issuesQuery.data?.items || [];
    if (issueId && !issueList.find((issue) => issue.id === Number(issueId))) {
      form.setValue("issue_id", null);
    }
  }, [journalId, issueId, issuesQuery.data, form]);

  const submitting = form.formState.isSubmitting || loading;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      notify.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      notify.error("File too large. Max 100MB.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const presign = await presignUpload("application/pdf");
      await uploadFileWithProgress(presign.uploadUrl, file, presign.headers, setUploadProgress);
      const key = presign.key || presign.publicUrl || "";
      form.setValue("file_key", key);
      setUploadName(file.name);
      notify.success("PDF uploaded.");
    } catch (error) {
      notify.handleError(error, "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleAuthor = (authorId) => {
    const current = form.getValues("author_ids") || [];
    if (current.includes(authorId)) {
      form.setValue(
        "author_ids",
        current.filter((id) => id !== authorId),
      );
    } else {
      form.setValue("author_ids", [...current, authorId]);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      abstract: values.abstract?.trim() || null,
      type: lockedType || values.type || null,
      lang: values.lang || DEFAULT_LANG,
      year: values.year ? Number(values.year) : null,
      pages: values.pages ? Number(values.pages) : null,
      doi: values.doi?.trim() || null,
      isbn: values.isbn?.trim() || null,
      issn: values.issn?.trim() || null,
      primary_category_id: values.primary_category_id ? Number(values.primary_category_id) : null,
      journal_id: values.journal_id ? Number(values.journal_id) : null,
      issue_id: values.issue_id ? Number(values.issue_id) : null,
      cover_image_url: values.cover_image_url?.trim() || null,
      start_page: values.start_page ? Number(values.start_page) : null,
      end_page: values.end_page ? Number(values.end_page) : null,
      author_ids: Array.from(new Set(values.author_ids || [])).map((id) => Number(id)),
      file_key: values.file_key?.trim() || null,
    };
    if (!payload.title) {
      notify.error("Title is required.");
      return;
    }
    try {
      await onSubmit(payload);
    } catch (error) {
      notify.handleError(error, "Unable to save document.");
    }
  });

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit document" : "Create document"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update the document metadata." : "Add a new document entry."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lang"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANG_OPTIONS.filter((opt) => opt.value !== ALL).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    {lockedType ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {lockedType}
                        </Badge>
                        <FormDescription>Locked based on category or issue.</FormDescription>
                      </div>
                    ) : (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TYPE_OPTIONS.filter((opt) => opt.value !== ALL).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primary_category_id"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="justify-between">
                            {field.value ? (
                              <span>{findCategory(categories, Number(field.value))?.name || "Category"}</span>
                            ) : (
                              <span>Select category</span>
                            )}
                            <CaretDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search categories" />
                          <CommandList>
                            <CommandEmpty>No categories</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  onSelect={() => field.onChange(field.value === category.id ? null : category.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span>{category.name}</span>
                                  <Badge variant="outline" className="ml-2 text-[10px] uppercase">
                                    {category.kind}
                                  </Badge>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Type locks when category is journal / archive / historical.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="journal_id"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Journal (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="justify-between">
                            {field.value ? (
                              <span>{journals.find((j) => j.id === Number(field.value))?.name || "Journal"}</span>
                            ) : (
                              <span>Select journal</span>
                            )}
                            <CaretDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search journals" />
                          <CommandList>
                            <CommandEmpty>No journals</CommandEmpty>
                            <CommandGroup>
                              {journals.map((journal) => (
                                <CommandItem
                                  key={journal.id}
                                  onSelect={() => {
                                    const nextValue = field.value === journal.id ? null : journal.id;
                                    field.onChange(nextValue);
                                    form.setValue("issue_id", null);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === journal.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span>{journal.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_id"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Issue (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" disabled={!journalId} className="justify-between">
                            {field.value ? (
                              <span>
                                {formatIssue((issuesQuery.data?.items || []).find((i) => i.id === Number(field.value)))}
                              </span>
                            ) : (
                              <span>{journalId ? "Select issue" : "Select journal first"}</span>
                            )}
                            <CaretDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search issues" />
                          <CommandList>
                            <CommandEmpty>No issues</CommandEmpty>
                            <CommandGroup>
                              {(issuesQuery.data?.items || []).map((issue) => (
                                <CommandItem
                                  key={issue.id}
                                  onSelect={() => field.onChange(field.value === issue.id ? null : issue.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === issue.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <span>{formatIssue(issue)}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Picking an issue will lock the type to article.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" min={MIN_YEAR} max={MAX_YEAR} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pages"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormDescription>Automatically derived if start/end pages are set.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_page"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Start page</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_page"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>End page</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doi"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="10.xxxx/identifier" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issn"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>ISSN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_image_url"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Cover image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="abstract"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} placeholder="Short abstract" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="author_ids"
                render={() => (
                  <FormItem>
                    <FormLabel>Authors</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between">
                          <span>Select authors</span>
                          <CaretDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search authors" />
                          <CommandList>
                            <CommandEmpty>No authors</CommandEmpty>
                            <CommandGroup>
                              {authors.map((author) => {
                                const selected = form.watch("author_ids")?.includes(author.id);
                                return (
                                  <CommandItem key={author.id} onSelect={() => toggleAuthor(author.id)}>
                                    <Check
                                      className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")}
                                    />
                                    <span>{author.name_ar || author.name_latin || `#${author.id}`}</span>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(form.watch("author_ids") || []).map((id) => {
                        const author = authors.find((a) => a.id === id);
                        return (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1">
                            <span>{author?.name_ar || author?.name_latin || `#${id}`}</span>
                            <button
                              type="button"
                              className="text-xs hover:text-destructive"
                              onClick={() => toggleAuthor(id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                    <FormDescription>Order follows selection.</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file_key"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Upload PDF</FormLabel>
                    <div className="rounded-md border border-dashed p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {uploadName || field.value || "No file uploaded"}
                          </div>
                          <p className="text-xs text-muted-foreground">PDF only. Max 100MB.</p>
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload
                        </Button>
                      </div>
                      {uploading && (
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-2 w-full rounded bg-muted">
                            <div
                              className="h-2 rounded bg-primary"
                              style={{width: `${uploadProgress}%`, transition: "width 120ms linear"}}
                            />
                          </div>
                        </div>
                      )}
                      {field.value ? (
                        <p className="mt-2 text-xs text-muted-foreground">Stored key: {field.value}</p>
                      ) : null}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "edit" ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDocumentsPage;


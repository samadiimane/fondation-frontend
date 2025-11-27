"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Check, Loader2, Plus, RotateCcw, Search, Trash2} from "lucide-react";

import AdminGuard from "@/components/auth/AdminGuard";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
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
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
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
import {cn} from "@/lib/utils";
import DocumentDialog from "./DocumentDialog";
import {ALL, DEFAULT_LANG, LANG_OPTIONS, MAX_YEAR, MIN_YEAR, PAGE_SIZE, TYPE_OPTIONS} from "./constants";
import {formatIssue} from "./utils";

const STATUS_OPTIONS = [
  {value: "active", label: "Active"},
  {value: "deleted", label: "Deleted"},
  {value: "all", label: "All"},
];

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return String(value);
  }
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
  const searchInputRef = useRef(null);

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

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const sectionsQuery = useQuery({
    queryKey: ["admin:documents:sections"],
    queryFn: ({signal}) =>
      listCategories({kind: "section", parentId: null, pageSize: 50, sort: "name", signal}),
    staleTime: 5 * 60_000,
    select: (resp) => (resp?.items ?? []).map(({id, name, slug}) => ({id, name, slug})),
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
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });

  const authorsQuery = useQuery({
    queryKey: ADMIN_AUTHORS_QUERY_KEYS.list({pageSize: 50, status: "active"}),
    queryFn: ({signal}) => listAuthors({pageSize: 50, status: "active", sort: "name", signal}),
    staleTime: 5 * 60 * 1000,
  });

  const sections = sectionsQuery.data || [];
  const filteredSections = sections.filter(
    (node) => node.slug !== "library" && (node.name || "").toLowerCase() !== "library",
  );
  const selectedSection = sectionId ? sections.find((node) => node.id === Number(sectionId)) : null;
  const childCategories = sectionId ? subCategoriesQuery.data || [] : [];
  const derivedCategorySlug = categorySlug ?? (selectedSection ? selectedSection.slug : null);

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
    [debouncedSearch, typeFilter, langFilter, statusFilter, yearMin, yearMax, derivedCategorySlug, page],
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
    placeholderData: (prev) => prev,
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

  const handleOpenEdit = async (id) => {
    setDialogMode("edit");
    setEditingId(id);
    try {
      await queryClient.prefetchQuery({
        queryKey: qkAdminDocs.detail(id),
        queryFn: ({signal}) => getAdminDocument(Number(id), {signal}),
      });
    } catch (error) {
      notify.handleError(error, "Unable to load document.");
      return;
    }
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
      queryClient.invalidateQueries({queryKey: qkAdminDocs.root});
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
      queryClient.refetchQueries({queryKey: listQueryKey});
      notify.success("Document updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        predicate: ({queryKey}) =>
          Array.isArray(queryKey) && String(queryKey[0]).includes("admin:documents"),
      });
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
            : previousList.items.map((item) => (item.id === id ? {...item, status: "deleted"} : item));
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
      queryClient.invalidateQueries({queryKey: qkAdminDocs.root});
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
            : previousList.items.map((item) => (item.id === id ? {...item, status: "active"} : item));
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
      queryClient.invalidateQueries({queryKey: qkAdminDocs.root});
    },
  });

  const list = listQuery.data;
  const authors = authorsQuery.data?.items || [];

  const selectedCategory = childCategories.find((node) => node.slug === categorySlug) || null;

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
      <TooltipProvider>
        <div className="space-y-6">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{t("title", {defaultMessage: "Documents"})}</CardTitle>
              <CardDescription>{t("description", {defaultMessage: "Search, create, and edit documents."})}</CardDescription>
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
                    ref={searchInputRef}
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
                    placeholder={
                      selectedSection
                        ? "Sub-category"
                        : "Select section first"
                    }
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
              {`Showing ${list?.items?.length ?? 0} of ${list?.total ?? 0}`}
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
                {listQuery.isError && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-destructive">
                      Unable to load results.{" "}
                      <Button variant="link" size="sm" onClick={() => listQuery.refetch()}>
                        Retry
                      </Button>
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary">+{doc.authors.length - 2}</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="flex flex-col gap-1">
                                  {doc.authors.slice(2).map((author) => (
                                    <span key={author.id}>
                                      {author.name_ar || author.name_lat || `#${author.id}`}
                                    </span>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
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
            sections={sections}
            authors={authors}
            notify={notify}
            capabilities={capabilities}
            loading={dialogMode === "edit" && detailQuery.isLoading}
            onSubmit={async (payload) => {
              if (dialogMode === "edit" && editingId) {
                await updateMutation.mutateAsync({id: editingId, payload});
              } else {
                await createMutation.mutateAsync(payload);
              }
              setDialogOpen(false);
            }}
          />
      </TooltipProvider>
    </AdminGuard>
  );
};

const CaretDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default AdminDocumentsPage;

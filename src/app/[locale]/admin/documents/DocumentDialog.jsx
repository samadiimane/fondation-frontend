"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Check, FileText, Loader2, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryChildren } from "@/lib/api/adminCategories";
import { listJournals, listJournalIssues, presignUpload, qkJournalIssues } from "@/lib/api/adminJournals";

import { ALL, DEFAULT_LANG, DOC_DEFAULT_TYPE, LANG_OPTIONS, MIN_YEAR, MAX_YEAR, TYPE_OPTIONS } from "./constants";
import { derivePages, formatIssue, resolveLockedType } from "./utils";
import { DocumentFormSchema } from "./schema";

const uploadFileWithProgress = (
  url,
  file,
  headers = {},
  onProgress
) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    const headerEntries = headers && typeof headers === "object" ? Object.entries(headers) : [];
    headerEntries.forEach(([key, value]) => {
      if (typeof value === "string") xhr.setRequestHeader(key, value);
    });
    if (!headerEntries.find(([key]) => key.toLowerCase() === "content-type")) {
      xhr.setRequestHeader("Content-Type", file.type || "application/pdf");
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}).`)));
    xhr.send(file);
  });

const DocumentDialog = ({
  open,
  mode,
  onOpenChange,
  initialData,
  sections,
  authors,
  notify,
  loading,
  onSubmit,
  capabilities,
}) => {
  const form = useForm({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      title: "",
      abstract: "",
      type: DOC_DEFAULT_TYPE,
      lang: DEFAULT_LANG,
      year: null,
      pages: null,
      doi: "",
      isbn: "",
      issn: "",
      primary_category_id: null,
      journal_id: null,
      issue_id: null,
      cover_image_url: null,
      start_page: null,
      end_page: null,
      author_ids: [],
      file_key: "",
    },
  });

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadName, setUploadName] = useState("");
  const canUpload = Boolean(capabilities?.uploads?.presign);
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const [authorSearch, setAuthorSearch] = useState("");
  const authorsRef = useRef(null);

  const primaryCategoryId = form.watch("primary_category_id");
  const journalId = form.watch("journal_id");
  const issueId = form.watch("issue_id");
  const typeValue = form.watch("type");

  const sectionOptions = useMemo(() => sections || [], [sections]);
  const [sectionId, setSectionId] = useState(null);
  const selectedSection = useMemo(
    () => sectionOptions.find((s) => s.id === Number(sectionId)) || null,
    [sectionOptions, sectionId],
  );
  const sectionSlug = selectedSection?.slug ?? null;

  const subCategoriesQuery = useQuery({
    queryKey: sectionId ? ["admin:documents:dialog:subcategories", sectionId] : ["admin:documents:dialog:subcategories:idle"],
    queryFn: ({ signal }) => getCategoryChildren({ parentId: Number(sectionId), signal }),
    enabled: Boolean(sectionId),
    staleTime: 5 * 60 * 1000,
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });
  const subCategoryOptions = subCategoriesQuery.data || [];
  const selectedCategory = useMemo(
    () => subCategoryOptions.find((c) => c.id === Number(primaryCategoryId)) || null,
    [subCategoryOptions, primaryCategoryId],
  );
  const categoryKind = selectedCategory?.kind ?? null;
  const categoryJournalId = selectedCategory?.journal_id ?? null;

  const lockedType = useMemo(
    () =>
      resolveLockedType({
        sectionSlug,
        childKind: categoryKind,
        journalId: issueId ? journalId : null,
        issueId,
        currentType: null,
      }),
    [sectionSlug, categoryKind, issueId, journalId],
  );

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      const d = initialData;
      const nextSectionId = d?.primary_category?.parent_id ?? null;
      form.reset({
        title: d?.title || "",
        abstract: d?.abstract || "",
        type: d?.type ?? DOC_DEFAULT_TYPE,
        lang: d?.lang || DEFAULT_LANG,
        year: d?.year ?? null,
        pages: d?.pages ?? null,
        doi: d?.doi || "",
        isbn: d?.isbn || "",
        issn: d?.issn || "",
        primary_category_id: d?.primary_category?.id || null,
        journal_id: d?.journal?.id || null,
        issue_id: d?.issue?.id || null,
        cover_image_url: d?.cover_image_url || null,
        start_page: d?.start_page ?? null,
        end_page: d?.end_page ?? null,
        author_ids: d?.authors?.map((a) => a.id) || [],
        file_key: d?.file_key || "",
      });
      setSectionId(nextSectionId);
      setUploadName(d?.file_key ? d.file_key.split("/").pop() || d.file_key : "");
    } else {
      form.reset({
        title: "",
        abstract: "",
        type: null,
        lang: DEFAULT_LANG,
        year: null,
        pages: null,
        doi: "",
        isbn: "",
        issn: "",
        primary_category_id: null,
        journal_id: null,
        issue_id: null,
        cover_image_url: null,
        start_page: null,
        end_page: null,
        author_ids: [],
        file_key: "",
      });
      setSectionId(null);
      setUploadName("");
    }
    setUploadProgress(0);
    setUploading(false);
  }, [open, initialData, mode, form]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authorsRef.current && !authorsRef.current.contains(event.target)) {
        setAuthorsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAuthorsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (lockedType != null && lockedType !== typeValue) {
      form.setValue("type", lockedType, { shouldDirty: true, shouldValidate: true });
    }
  }, [lockedType, typeValue, form]);

  useEffect(() => {
    if (categoryKind !== "journal") {
      form.setValue("journal_id", null);
      form.setValue("issue_id", null);
    }
  }, [categoryKind, form]);

  useEffect(() => {
    if (categoryJournalId) {
      form.setValue("journal_id", Number(categoryJournalId));
      form.setValue("issue_id", null);
    }
  }, [categoryJournalId, form]);

  const journalsQuery = useQuery({
    queryKey: ["admin:documents:dialog:journals"],
    queryFn: ({ signal }) => listJournals({ status: "active", pageSize: 100, signal }),
    enabled: categoryKind === "journal" && !categoryJournalId,
    staleTime: 5 * 60 * 1000,
  });

  const issuesQuery = useQuery({
    queryKey:
      journalId && categoryKind === "journal"
        ? qkJournalIssues(Number(journalId), { pageSize: 100, sort: "year_desc" })
        : ["admin:documents:dialog:issues"],
    queryFn: ({ signal }) => listJournalIssues(Number(journalId), { pageSize: 100, sort: "year_desc", signal }),
    enabled: Boolean(journalId),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!journalId) {
      form.setValue("issue_id", null);
      return;
    }
    form.setValue("issue_id", null);
    const issueList = issuesQuery.data?.items || [];
    if (form.getValues("issue_id") && !issueList.find((i) => i.id === Number(form.getValues("issue_id")))) {
      form.setValue("issue_id", null);
    }
  }, [journalId, issuesQuery.data, form]);

  const submitting = form.formState.isSubmitting || loading;

  const handleFileChange = async (event) => {
    if (!canUpload) return;
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
      const key = typeof presign.key === "string" ? presign.key : presign.publicUrl || "";
      form.setValue("file_key", key, { shouldDirty: true, shouldValidate: true });
      setUploadName(file.name);
      notify.success("PDF uploaded.");
    } catch (error) {
      notify.handleError(error, "Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = form.handleSubmit(
    async (values) => {
      const payload = {
        title: (values.title ?? "").trim(),
        abstract: values.abstract?.trim() || null,
        type: lockedType || values.type || null,
        lang: values.lang || DEFAULT_LANG,
        year: values.year ?? null,
        pages: derivePages(values.start_page, values.end_page, values.pages),
        doi: values.doi?.trim() || null,
        isbn: values.isbn?.trim() || null,
        issn: values.issn?.trim() || null,
        primary_category_id: values.primary_category_id ?? null,
        journal_id: values.journal_id ?? null,
        issue_id: values.issue_id ?? null,
        cover_image_url: values.cover_image_url?.trim() ? values.cover_image_url.trim() : null, // convert "" -> null
        start_page: values.start_page ?? null,
        end_page: values.end_page ?? null,
        author_ids: Array.isArray(values.author_ids) ? values.author_ids.map((id) => Number(id)) : [],
        file_key: values.file_key?.trim() || null,
      };
      try {
        await onSubmit(payload);
      } catch (error) {
        notify.handleError(error, "Unable to save document.");
      }
    },
    (errors) => {
      const first = Object.keys(errors)[0];
      if (first) form.setFocus(first);
    },
  );

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
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="lang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
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

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    {lockedType ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{lockedType}</Badge>
                        <FormDescription>Locked based on selection.</FormDescription>
                      </div>
                    ) : (
                      <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TYPE_OPTIONS.filter((opt) => opt.value !== ALL).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section */}
              <div className="space-y-4">
                <FormLabel>Section</FormLabel>
                <Select
                  value={sectionId ? String(sectionId) : ""}
                  onValueChange={(v) => {
                    const next = v ? Number(v) : null;
                    setSectionId(next);
                    form.setValue("primary_category_id", null);
                    form.setValue("journal_id", null);
                    form.setValue("issue_id", null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose a section to load its sub-categories.</FormDescription>
              </div>

              {/* Sub-category */}
              <FormField
                control={form.control}
                name="primary_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-category</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      disabled={!sectionId || subCategoriesQuery.isFetching}
                      onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={sectionId ? "Select sub-category" : "Pick a section first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategoriesQuery.isFetching && (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        )}
                        {(subCategoryOptions || []).map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            <div className="flex items-center gap-2">
                              <span>{c.name}</span>
                              <Badge variant="outline" className="text-[10px] uppercase">{c.kind}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Type locks automatically for journal/archive selections.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Journal / Issue */}
              {categoryKind === "journal" && (
                <>
                  {categoryJournalId ? (
                    <div className="space-y-2">
                      <FormLabel>Journal</FormLabel>
                      <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                        <Badge variant="secondary">Linked</Badge>
                        <span>{selectedCategory?.journal?.name || `#${categoryJournalId}`}</span>
                      </div>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="journal_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Journal</FormLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            disabled={journalsQuery.isFetching}
                            onValueChange={(v) => {
                              const nextId = v ? Number(v) : null;
                              field.onChange(nextId);
                              form.setValue("issue_id", null);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select journal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(journalsQuery.data?.items || []).map((j) => (
                                <SelectItem key={j.id} value={String(j.id)}>{j.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {journalId ? (
                    <FormField
                      control={form.control}
                      name="issue_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue</FormLabel>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            disabled={!journalId || issuesQuery.isFetching}
                            onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={journalId ? "Select issue" : "Select journal first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {issuesQuery.isFetching && (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                              )}
                              {(issuesQuery.data?.items || []).map((issue) => (
                                <SelectItem key={issue.id} value={String(issue.id)}>
                                  {formatIssue(issue)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Picking an issue will lock the type to article.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                </>
              )}

              {/* Numbers */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" min={MIN_YEAR} max={MAX_YEAR} value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>Automatically derived if start/end pages are set.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start page</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End page</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IDs */}
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="10.xxxx/identifier" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISSN</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover image */}
              <FormField
                control={form.control}
                name="cover_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover image URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                        placeholder="https://..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Abstract */}
            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} rows={4} placeholder="Short abstract" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Authors */}
              <FormField
                control={form.control}
                name="author_ids"
                render={({ field }) => {
                  const selectedIds = Array.isArray(field.value) ? field.value.map((id) => Number(id)) : [];
                  const toggle = (authorId) => {
                    const id = Number(authorId);
                    const next = selectedIds.includes(id)
                      ? selectedIds.filter((x) => x !== id)
                      : [...selectedIds, id];
                    form.setValue("author_ids", next, { shouldDirty: true, shouldValidate: true });
                    field.onChange(next);
                  };
                  return (
                    <FormItem ref={authorsRef} className="relative">
                      <FormLabel>Authors</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        className="justify-between"
                        onClick={() => setAuthorsOpen((prev) => !prev)}
                      >
                        <span>Select authors</span>
                        <CaretDownIcon />
                      </Button>
                      {authorsOpen ? (
                        <div className="absolute z-[60] mt-2 w-80 rounded-md border bg-popover p-3 shadow-md">
                          <div className="mb-2">
                            <Input
                              value={authorSearch}
                              onChange={(e) => setAuthorSearch(e.target.value)}
                              placeholder="Search authors"
                              className="h-9"
                            />
                          </div>
                          <div className="max-h-60 space-y-1 overflow-auto">
                            {authors
                              .filter((a) => {
                                const term = authorSearch.trim().toLowerCase();
                                if (!term) return true;
                                const label = (a.name_lat || a.name_latin || a.name_ar || `#${a.id}`).toLowerCase();
                                return label.includes(term);
                              })
                              .map((a) => {
                                const selected = selectedIds.includes(Number(a.id));
                                const label = a.name_lat ?? a.name_latin ?? a.name_ar ?? `#${a.id}`;
                                return (
                                  <button
                                    key={a.id}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                                      selected ? "bg-accent" : "",
                                    )}
                                    onClick={() => toggle(a.id)}
                                  >
                                    <Check className={cn("h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                                    <span>{label}</span>
                                  </button>
                                );
                              })}
                            {authors.filter((a) => {
                              const term = authorSearch.trim().toLowerCase();
                              const label = (a.name_lat || a.name_latin || a.name_ar || `#${a.id}`).toLowerCase();
                              return term ? label.includes(term) : true;
                            }).length === 0 && (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">No authors</div>
                            )}
                          </div>
                        </div>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedIds.map((id) => {
                          const a = authors.find((x) => x.id === id);
                          const label = a?.name_lat ?? a?.name_latin ?? a?.name_ar ?? `#${id}`;
                          return (
                            <Badge key={id} variant="secondary" className="flex items-center gap-1">
                              <span>{label}</span>
                              <button type="button" className="text-xs hover:text-destructive" onClick={() => toggle(id)}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                      <FormDescription>Order follows selection.</FormDescription>
                    </FormItem>
                  );
                }}
              />

              {/* Upload */}
              {canUpload && (
                <FormField
                  control={form.control}
                  name="file_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload PDF</FormLabel>
                      <div className="rounded-md border border-dashed p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{uploadName || field.value || "No file uploaded"}</div>
                            <p className="text-xs text-muted-foreground">PDF only. Max 100MB.</p>
                          </div>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
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
                              <div className="h-2 rounded bg-primary" style={{ width: `${uploadProgress}%`, transition: "width 120ms linear" }} />
                            </div>
                          </div>
                        )}
                        {field.value ? <p className="mt-2 text-xs text-muted-foreground">Stored key: {field.value}</p> : null}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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

const CaretDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default DocumentDialog;

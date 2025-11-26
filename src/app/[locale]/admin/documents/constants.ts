"use client";

export const PAGE_SIZE = 20;
export const ALL = "all";
export const DEFAULT_LANG = "ar";
export const DOC_DEFAULT_TYPE: null = null;
export const MIN_YEAR = 1800;
export const MAX_YEAR = 2100;

export const TYPE_OPTIONS = [
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

export const LANG_OPTIONS = [
  {value: ALL, label: "All languages"},
  {value: "ar", label: "Arabic"},
  {value: "fr", label: "French"},
  {value: "en", label: "English"},
];

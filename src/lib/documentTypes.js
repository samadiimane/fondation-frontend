const DOCUMENT_TYPE_KEYS = new Set([
  "book",
  "article",
  "thesis",
  "report",
  "manuscript",
  "archive_item",
  "site_record",
  "other",
]);

export const normalizeDocumentType = (value) => {
  if (!value) return "";
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
};

export const formatDocumentTypeFallback = (value) => {
  const normalized = normalizeDocumentType(value);
  if (!normalized) return "";
  return normalized
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getDocumentTypeLabel = (value, t, fallback = "") => {
  const normalized = normalizeDocumentType(value);
  if (!normalized) return fallback;

  if (DOCUMENT_TYPE_KEYS.has(normalized) && typeof t === "function") {
    try {
      const label = t(normalized);
      if (typeof label === "string" && label.trim()) {
        return label;
      }
    } catch {
      // fall through to fallback formatting
    }
  }

  const formatted = formatDocumentTypeFallback(value);
  return formatted || fallback;
};

export const isKnownDocumentType = (value) => DOCUMENT_TYPE_KEYS.has(normalizeDocumentType(value));

export const DOCUMENT_TYPE_VALUES = Array.from(DOCUMENT_TYPE_KEYS);

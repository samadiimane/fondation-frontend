const pickNameForLocale = (author, locale) => {
  if (!author || typeof author !== "object") {
    return typeof author === "string" ? author.trim() : null;
  }

  const isArabic = (locale || "").toLowerCase().startsWith("ar");
  const primary = isArabic ? author.full_name_ar ?? author.fullNameAr : author.full_name_lat ?? author.fullNameLat;
  const secondary = isArabic ? author.full_name_lat ?? author.fullNameLat : author.full_name_ar ?? author.fullNameAr;
  const fallback = author.name ?? author.fullName ?? null;

  return (primary || secondary || fallback || "").toString().trim() || null;
};

const normalizeAuthorEntry = (author, index, locale) => {
  if (!author) {
    return null;
  }

  if (typeof author === "string") {
    const name = author.trim();
    if (!name) return null;
    return {
      key: `author-${index}-${name}`,
      name,
      affiliation: null,
    };
  }

  const name = pickNameForLocale(author, locale);
  if (!name) {
    return null;
  }

  const affiliation =
    typeof author.affiliation === "string" && author.affiliation.trim().length > 0
      ? author.affiliation.trim()
      : null;

  return {
    key: author.id ?? author.slug ?? `author-${index}-${name}`,
    name,
    affiliation,
  };
};

export const mapAuthors = (authors, locale) => {
  if (!authors) {
    return [];
  }

  const list = Array.isArray(authors) ? authors : [authors];
  return list
    .map((author, index) => normalizeAuthorEntry(author, index, locale))
    .filter(Boolean);
};

export const getFirstAuthor = (authors, locale) => {
  const items = mapAuthors(authors, locale);
  return items.length > 0 ? items[0] : null;
};

export const formatAuthorsText = (authors, locale, fallback = "") => {
  const items = mapAuthors(authors, locale);
  if (!items.length) {
    return fallback;
  }
  return items.map((item) => item.name).join(", ");
};

export const hasAuthors = (authors) => mapAuthors(authors).length > 0;

type BuildCategoryQueryArgs = {
  slug?: string | null;
  q?: string | null;
  page?: number | null;
  pageSize?: number | null;
  sort?: string | null;
  includeDescendants?: boolean;
  type?: string | string[] | null;
  author?: string | null;
};

const BASE_PATH = "/v1/search/documents";

const SORT_MAPPING: Record<string, string> = {
  title_asc: "title_asc",
  "title-asc": "title_asc",
  titleAsc: "title_asc",
  title_desc: "title_desc",
  "title-desc": "title_desc",
  titleDesc: "title_desc",
  year_desc: "year_desc",
  "year-desc": "year_desc",
  yearDesc: "year_desc",
  year_asc: "year_asc",
  "year-asc": "year_asc",
  yearAsc: "year_asc",
};

const sanitizeText = (value?: string | null) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const sanitizePage = (value?: number | null) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
};

const sanitizePageSize = (value?: number | null) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 20;
  }
  return Math.min(Math.max(Math.floor(parsed), 1), 100);
};

const resolveSort = (value?: string | null) => {
  if (!value) return undefined;
  const normalized = SORT_MAPPING[value] ?? SORT_MAPPING[value.toLowerCase()] ?? null;
  return normalized ?? undefined;
};

export function buildCategoryQuery({
  slug,
  q,
  page,
  pageSize = 20,
  sort,
  includeDescendants = false,
  type,
  author,
}: BuildCategoryQueryArgs): string {
  const params = new URLSearchParams();

  const sanitizedSlug = sanitizeText(slug ?? "");
  if (sanitizedSlug) {
    params.set("category", sanitizedSlug);
  }

  const sanitizedQuery = sanitizeText(q ?? "");
  if (sanitizedQuery) {
    params.set("q", sanitizedQuery);
  }

  const resolvedPage = sanitizePage(page ?? 1);
  if (resolvedPage > 1) {
    params.set("page", String(resolvedPage));
  }

  const resolvedPageSize = sanitizePageSize(pageSize);
  params.set("page_size", String(resolvedPageSize));

  const resolvedSort = resolveSort(sort ?? undefined);
  if (resolvedSort) {
    params.set("sort", resolvedSort);
  }

  const typeValues = Array.isArray(type)
    ? type.filter((value) => typeof value === "string" && value.trim().length > 0).map((value) => value.trim())
    : typeof type === "string" && type.trim().length > 0
      ? [type.trim()]
      : [];

  typeValues.forEach((value) => {
    params.append("type", value);
  });

  if (includeDescendants) {
    params.set("include_descendants", "true");
  }

  const sanitizedAuthor = sanitizeText(author ?? "");
  if (sanitizedAuthor) {
    params.set("author", sanitizedAuthor);
  }

  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}

export default buildCategoryQuery;

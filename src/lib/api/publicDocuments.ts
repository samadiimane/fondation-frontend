import {apiFetch} from "@/lib/api";

export interface PublicDocument {
  id: string;
  title: string;
  authors: string[];
  categories: string[];
  abstract?: string;
  cover_image_url?: string;
  created_at?: string;
  published_at?: string;
  updated_at?: string;
  year?: string;
}

interface LatestDocumentsParams {
  page?: number;
  pageSize?: number;
  locale?: string;
}

const FALLBACK_IMAGE = "/assets/images/blog/one.png";

const pickDate = (item: any): string => {
  const value =
    item?.published_at ||
    item?.publishedAt ||
    item?.created_at ||
    item?.createdAt ||
    item?.updated_at ||
    item?.updatedAt ||
    item?.publication_date ||
    item?.publicationDate ||
    item?.date ||
    item?.year ||
    item?.publication_year ||
    item?.publicationYear ||
    "";
  if (typeof value === "number") return String(value);
  if (typeof value !== "string") return "";
  return value.includes(" ") ? value.replace(" ", "T") : value;
};

const toStringArray = (input: any): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((entry) => {
        if (typeof entry === "string") return entry.trim();
        if (entry?.name) return String(entry.name).trim();
        if (entry?.full_name) return String(entry.full_name).trim();
        if (entry?.fullName) return String(entry.fullName).trim();
        if (entry?.display_name) return String(entry.display_name).trim();
        if (entry?.first_name || entry?.last_name) {
          return `${entry.first_name ?? ""} ${entry.last_name ?? ""}`.trim();
        }
        if (entry?.title) return String(entry.title).trim();
        return null;
      })
      .filter((v): v is string => !!v);
  }
  if (typeof input === "string") return [input.trim()];
  return [];
};

export async function getLatestDocuments({page = 1, pageSize = 10, locale}: LatestDocumentsParams = {}): Promise<PublicDocument[]> {
  const fetchPayload = async (path: string) =>
    (await apiFetch(path, {
      params: {
        page,
        page_size: pageSize,
        sort: "created_desc",
        locale
      }
    })) as {data?: any[]; results?: any[]; items?: any[]};

  const primary = await fetchPayload("/v1/search/documents");
  let items: any[] =
    (Array.isArray(primary?.data) && primary.data) ||
    (Array.isArray(primary?.results) && primary.results) ||
    (Array.isArray(primary?.items) && primary.items) ||
    [];

  if (!items.length) {
    const fallback = await fetchPayload("/v1/documents");
    items =
      (Array.isArray(fallback?.data) && fallback.data) ||
      (Array.isArray(fallback?.results) && fallback.results) ||
      (Array.isArray(fallback?.items) && fallback.items) ||
      [];
  }

  return items.map((item) => {
    const authors = [
      ...toStringArray(item?.authors),
      ...toStringArray(item?.author),
      ...toStringArray(item?.contributors),
      ...toStringArray(item?.creators),
      ...toStringArray(item?.author_names)
    ].filter(Boolean);

    const categories = [
      ...toStringArray(item?.categories),
      ...toStringArray(item?.tags)
    ].filter(Boolean);

    const normalizedDate = pickDate(item);

    return {
      id: item?.id ?? item?._id ?? "",
      title: item?.title ?? "",
      authors,
      categories,
      abstract: item?.abstract ?? item?.description ?? "",
      cover_image_url: item?.cover_image_url ?? item?.coverImage ?? item?.cover ?? FALLBACK_IMAGE,
      created_at: normalizedDate || undefined,
      published_at: normalizedDate || undefined,
      updated_at: (item?.updated_at ?? item?.updatedAt ?? normalizedDate) || undefined,
      year: normalizedDate || undefined
    };
  });
}

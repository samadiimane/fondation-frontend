"use client";

type ResolveLockedTypeParams = {
  sectionSlug?: string | null;
  childKind?: "journal" | "archive_collection" | "topic" | "section" | null;
  journalId?: number | null;
  issueId?: number | null;
  currentType?: string | null;
};

export const findCategory = (categories: {id: number}[] | null | undefined, id?: number | null) =>
  categories?.find((item) => item.id === id) ?? null;

export const formatIssue = (issue?: {
  id?: number | string | null;
  year?: number | string | null;
  volume?: number | string | null;
  number?: number | string | null;
  title?: string | null;
}): string => {
  if (!issue) return "-";
  const pieces: Array<string | number> = [];
  if (issue.year) pieces.push(issue.year);
  if (issue.volume) pieces.push(`Vol ${issue.volume}`);
  if (issue.number) pieces.push(`No ${issue.number}`);
  if (issue.title) pieces.push(issue.title);
  return pieces.join(" / ") || `#${issue.id}`;
};

export const resolveLockedType = ({
  sectionSlug = null,
  childKind = null,
  journalId = null,
  issueId = null,
  currentType = null,
}: ResolveLockedTypeParams): string | null => {
  if (issueId) return "article";
  if (childKind === "journal" && journalId) return "article";
  if (childKind === "archive_collection") return "archive_item";
  if (sectionSlug === "historical-sites") return "site_record";
  return currentType ?? null;
};

export const derivePages = (
  start?: number | null,
  end?: number | null,
  pages?: number | null,
): number | null => pages || (start && end ? Math.max(0, end - start + 1) : null);

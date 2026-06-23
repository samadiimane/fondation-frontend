export const PUBLIC_JOURNAL_SLUGS = ["dar-al-niaba", "tangerois"];

export function isPublicJournalSlug(value) {
  return PUBLIC_JOURNAL_SLUGS.includes(String(value || ""));
}

export function isValidJournalIssueId(value) {
  return /^\d+$/.test(String(value || ""));
}

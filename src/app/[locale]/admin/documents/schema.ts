import {z} from "zod";

export const DocumentFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    abstract: z.string().trim().optional().nullable(),
    type: z.string().optional().nullable(),
    lang: z.enum(["ar", "fr", "en"]),
    year: z.preprocess(
      (v) => (v === "" ? null : Number(v)),
      z.number().min(1800).max(2100).nullable(),
    ),
    pages: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().min(0).nullable()),
    doi: z.string().trim().optional().nullable(),
    isbn: z.string().trim().optional().nullable(),
    issn: z.string().trim().optional().nullable(),
    primary_category_id: z.preprocess((v) => (v ? Number(v) : null), z.number().nullable()),
    journal_id: z.preprocess((v) => (v ? Number(v) : null), z.number().nullable()),
    issue_id: z.preprocess((v) => (v ? Number(v) : null), z.number().nullable()),
    cover_image_url: z.string().url().optional().nullable(),
    start_page: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().min(0).nullable()),
    end_page: z.preprocess((v) => (v === "" ? null : Number(v)), z.number().min(0).nullable()),
    author_ids: z.array(z.number()).default([]),
    file_key: z.string().optional().nullable(),
  })
  .refine(
    (v) => {
      if (v.issue_id && v.type !== "article") return false;
      return true;
    },
    {message: "Invalid type for the selected context", path: ["type"]},
  );

export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;

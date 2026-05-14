export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  citations?: Citation[];
  bibtex?: string;
};

export type AssistantFilters = {
  scope: "all" | "section" | "category" | "journal" | "collection";
  languages: string[];
  yearFrom?: string;
  yearTo?: string;
  type?: "article" | "manuscript" | "issue" | "collection";
  strictCitations?: boolean;
};

export type Citation = {
  id: string;
  docId: string;
  title: string;
  page: string;
  snippet: string;
  href: string;
  year?: string;
  lang?: string;
  type?: string;
};

export type ChatChunk =
  | { type: "delta"; text: string }
  | { type: "final"; text: string; citations: Citation[]; bibtex: string };

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sampleCitations: Citation[] = [
  {
    id: "src-1",
    docId: "102",
    title: "Dar al-Niaba Chronicle",
    page: "12",
    snippet: "Administrative records from Tangier highlight negotiations over maritime passage.",
    href: "/documents/102",
    year: "1894",
    lang: "ar",
    type: "manuscript",
  },
  {
    id: "src-2",
    docId: "245",
    title: "Urban Histories of the Maghreb",
    page: "48",
    snippet: "Neighborhood councils mediated disputes and preserved customary law.",
    href: "/documents/245",
    year: "1932",
    lang: "fr",
    type: "article",
  },
  {
    id: "src-3",
    docId: "319",
    title: "Material Culture in the Rif",
    page: "7",
    snippet: "Ceramic workshops clustered around shared kiln sites to manage fuel scarcity.",
    href: "/documents/319",
    year: "1958",
    lang: "es",
    type: "collection",
  },
];

const buildBibtex = (citations: Citation[]) =>
  citations
    .map((citation) => {
      const key = `doc-${citation.docId}`;
      const year = citation.year ?? "1900";
      const page = citation.page ? `, pages = {${citation.page}}` : "";
      return `@misc{${key},\n  title = {${citation.title}},\n  year = {${year}}${page}\n}`;
    })
    .join("\n\n");

const responseByLocale: Record<string, string> = {
  en: "The archive suggests that coastal governance shifted alongside trade routes, with municipal records documenting new administrative roles and cross-border exchanges.",
  fr: "Les archives indiquent que la gouvernance côtière a évolué avec les routes commerciales, tandis que les registres municipaux décrivent de nouveaux rôles administratifs.",
  es: "Los archivos indican que la gobernanza costera cambió junto con las rutas comerciales, y los registros municipales documentan nuevas funciones administrativas.",
  ar: "تشير الوثائق إلى أن الحوكمة الساحلية تغيرت مع مسارات التجارة، وتُبرز السجلات البلدية أدوارًا إدارية جديدة.",
};

const suggestionsByLocale: Record<string, string[]> = {
  en: [
    "Which collections mention Tangier port administration in the 19th century?",
    "Summarize key themes in material culture research from 1900-1950.",
    "Find sources on neighborhood governance in colonial cities.",
  ],
  fr: [
    "Quelles collections mentionnent l'administration du port de Tanger au XIXe siècle ?",
    "Résumez les thèmes de la culture matérielle entre 1900 et 1950.",
    "Trouvez des sources sur la gouvernance des quartiers en ville coloniale.",
  ],
  es: [
    "¿Qué colecciones mencionan la administración del puerto de Tánger en el siglo XIX?",
    "Resume los temas de cultura material entre 1900 y 1950.",
    "Busca fuentes sobre gobernanza barrial en ciudades coloniales.",
  ],
  ar: [
    "ما هي المجموعات التي تذكر إدارة ميناء طنجة في القرن التاسع عشر؟",
    "لخّص موضوعات الثقافة المادية بين 1900 و1950.",
    "ابحث عن مصادر حول حوكمة الأحياء في المدن الاستعمارية.",
  ],
};

const filterCitations = (filters: AssistantFilters) => {
  let results = [...sampleCitations];
  if (filters.languages?.length) {
    results = results.filter((item) => item.lang && filters.languages.includes(item.lang));
  }
  if (filters.type) {
    results = results.filter((item) => item.type === filters.type);
  }
  return results.length ? results : sampleCitations.slice(0, 1);
};

export const mockClient = {
  async *chat({
    messages,
    filters,
    locale,
  }: {
    messages: AssistantMessage[];
    filters: AssistantFilters;
    locale: string;
  }): AsyncGenerator<ChatChunk> {
    const language = locale?.toLowerCase() || "en";
    const responseText = responseByLocale[language] || responseByLocale.en;
    const citations = filterCitations(filters);
    const tokens = responseText.split(" ");
    let buffer = "";

    for (const token of tokens) {
      buffer = buffer ? `${buffer} ${token}` : token;
      await delay(35);
      yield { type: "delta", text: token };
    }

    const finalText = buffer;
    const bibtex = buildBibtex(citations);
    yield { type: "final", text: finalText, citations, bibtex };
  },
  async suggestions(locale: string) {
    const language = locale?.toLowerCase() || "en";
    return suggestionsByLocale[language] || suggestionsByLocale.en;
  },
};

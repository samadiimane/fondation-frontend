import {defaultLocale, normalizeLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface StaticJournalItem {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
}

export interface JournalsContent {
  title: string;
  intro: string;
  breadcrumbs: {
    home: string;
    current: string;
    ariaLabel: string;
  };
  journals: StaticJournalItem[];
  availabilityLabel: string;
}

const journalImages = {
  darAlNiaba: "/assets/images/difference/dar-al-niaba.png",
  tangerois: "/assets/images/difference/tangerois.jpg",
};

const contentByLocale: Record<Locale, JournalsContent> = {
  en: {
    title: "Scientific Journals",
    intro:
      "This page brings together the Foundation's scientific and documentary journals, connected to its mission of preserving historical memory, organizing knowledge, and supporting research on Tangier and northern Morocco.",
    breadcrumbs: {
      home: "Home",
      current: "Scientific Journals",
      ariaLabel: "Breadcrumb",
    },
    journals: [
      {
        slug: "dar-al-niaba",
        title: "Dar Al-Niaba Journal",
        image: journalImages.darAlNiaba,
        imageAlt: "Cover of Dar Al-Niaba Journal",
        description:
          "A scholarly journal connected to the history of Tangier, Dar Al-Niaba, and diplomatic archives, contributing to historical and documentary research on northern Morocco.",
      },
      {
        slug: "tangerois",
        title: "Les Tangérois",
        image: journalImages.tangerois,
        imageAlt: "Cover of Les Tangérois journal",
        description:
          "A documentary and cultural initiative devoted to Tangier's urban, social, and cultural history, highlighting the city's place in Moroccan and Mediterranean memory.",
      },
    ],
    availabilityLabel: "Issues will be available soon",
  },
  fr: {
    title: "Revues scientifiques",
    intro:
      "Cette page rassemble les revues scientifiques et documentaires liées au projet de la Fondation : préserver la mémoire historique, organiser la connaissance et soutenir la recherche sur Tanger et le nord du Maroc.",
    breadcrumbs: {
      home: "Accueil",
      current: "Revues scientifiques",
      ariaLabel: "Fil d'Ariane",
    },
    journals: [
      {
        slug: "dar-al-niaba",
        title: "Revue Dar Al-Niaba",
        image: journalImages.darAlNiaba,
        imageAlt: "Couverture de la revue Dar Al-Niaba",
        description:
          "Une revue scientifique liée à l'histoire de Tanger, de Dar Al-Niaba et des archives diplomatiques, au service de la recherche historique et documentaire sur le nord du Maroc.",
      },
      {
        slug: "tangerois",
        title: "Les Tangérois",
        image: journalImages.tangerois,
        imageAlt: "Couverture de la revue Les Tangérois",
        description:
          "Une initiative documentaire et culturelle consacrée à l'histoire urbaine, sociale et culturelle de Tanger, mettant en valeur la place de la ville dans la mémoire marocaine et méditerranéenne.",
      },
    ],
    availabilityLabel: "Les numéros seront disponibles prochainement",
  },
  es: {
    title: "Revistas científicas",
    intro:
      "Esta página reúne las revistas científicas y documentales vinculadas al proyecto de la Fundación: preservar la memoria histórica, organizar el conocimiento y apoyar la investigación sobre Tánger y el norte de Marruecos.",
    breadcrumbs: {
      home: "Inicio",
      current: "Revistas científicas",
      ariaLabel: "Miga de pan",
    },
    journals: [
      {
        slug: "dar-al-niaba",
        title: "Revista Dar Al-Niaba",
        image: journalImages.darAlNiaba,
        imageAlt: "Cubierta de la revista Dar Al-Niaba",
        description:
          "Una revista académica vinculada a la historia de Tánger, Dar Al-Niaba y los archivos diplomáticos, al servicio de la investigación histórica y documental sobre el norte de Marruecos.",
      },
      {
        slug: "tangerois",
        title: "Les Tangérois",
        image: journalImages.tangerois,
        imageAlt: "Cubierta de la revista Les Tangérois",
        description:
          "Una iniciativa documental y cultural dedicada a la historia urbana, social y cultural de Tánger, destacando el lugar de la ciudad en la memoria marroquí y mediterránea.",
      },
    ],
    availabilityLabel: "Los números estarán disponibles próximamente",
  },
  ar: {
    title: "منابر البحث التاريخي",
    intro:
      "تجمع هذه الصفحة الدوريات العلمية والوثائقية المرتبطة بمشروع المؤسسة في صيانة الذاكرة التاريخية، وتنظيم المعرفة، وإتاحة البحث في تاريخ طنجة وشمال المغرب.",
    breadcrumbs: {
      home: "الرئيسية",
      current: "المجلات",
      ariaLabel: "مسار التصفح",
    },
    journals: [
      {
        slug: "dar-al-niaba",
        title: "مجلة دار النيابة",
        image: journalImages.darAlNiaba,
        imageAlt: "غلاف مجلة دار النيابة",
        description:
          "منبر علمي ارتبط بتاريخ طنجة ومؤسسة دار النيابة والأرشيف الدبلوماسي، وأسهم في خدمة البحث التاريخي والوثائقي حول شمال المغرب.",
      },
      {
        slug: "tangerois",
        title: "مجلة الطنجيون",
        image: journalImages.tangerois,
        imageAlt: "غلاف مجلة الطنجيون",
        description:
          "تجربة وثائقية وثقافية تعنى بتاريخ طنجة في أبعاده الحضرية والاجتماعية والثقافية، وتبرز مكانة المدينة في الذاكرة المغربية والمتوسطية.",
      },
    ],
    availabilityLabel: "سيتم إتاحة الأعداد قريباً",
  },
};

export function getJournalsContent(locale?: string): JournalsContent {
  const normalizedLocale = normalizeLocale(locale) as Locale;
  return contentByLocale[normalizedLocale] ?? contentByLocale[defaultLocale as Locale];
}

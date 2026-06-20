import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface TeamMember {
  id: string;
  name: string;
  profile: string;
  role: string;
}

export interface TeamInnerContent {
  title: string;
  intro: string;
  labels: {
    profile: string;
    role: string;
  };
  members: TeamMember[];
}

const members: TeamMember[] = [
  {
    id: "adil-khallouk-temsamani",
    name: "عادل خلوق التمسماني",
    profile: "رئيس مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي",
    role: "الإشراف المؤسسي"
  },
  {
    id: "mohamed-bourrass",
    name: "محمد بوراس",
    profile: "مؤرخ وباحث وأستاذ للتعليم العالي، متخصص في التاريخ المعاصر للمغرب.",
    role: "عضو الهيئة العلمية والإشراف البحثي"
  },
  {
    id: "mustapha-el-merroun",
    name: "مصطفى المرون",
    profile: "مؤرخ وباحث مغربي، متخصص في التاريخ العسكري للمغرب",
    role: "عضو الهيئة العلمية والإشراف البحثي"
  }
];

const teamInnerContent: Record<Locale, TeamInnerContent> = {
  en: {
    title: "Scientific Board and Research Supervision",
    intro:
      "The Foundation brings together academic supervision, research work, and documentary organization so its projects remain connected to scholarly rigor, responsible archival practice, and service to researchers and readers within a clear institutional framework.",
    labels: {
      profile: "Area of expertise",
      role: "Institutional role"
    },
    members
  },
  fr: {
    title: "Instance scientifique et encadrement de la recherche",
    intro:
      "La Fondation articule encadrement academique, travail de recherche et organisation documentaire afin que ses projets restent lies a la rigueur scientifique, a la methode archivistique et au service des chercheurs et lecteurs dans un cadre institutionnel clair.",
    labels: {
      profile: "Domaine de specialite",
      role: "Qualite institutionnelle"
    },
    members
  },
  es: {
    title: "Comite cientifico y supervision de investigacion",
    intro:
      "La Fundacion combina supervision academica, trabajo de investigacion y organizacion documental para que sus proyectos permanezcan vinculados al rigor cientifico, a la metodologia archivistica y al servicio de investigadores y lectores dentro de un marco institucional claro.",
    labels: {
      profile: "Area de especialidad",
      role: "Funcion institucional"
    },
    members
  },
  ar: {
    title: "الهيئة العلمية والإشراف البحثي",
    intro:
      "تستند الهيئة العلمية والإشراف البحثي إلى خبرات أكاديمية ومؤسسية تُسهم في ترسيخ توجه المؤسسة نحو بحث رصين، قائم على الوثيقة، والتحقق، وصيانة الذاكرة التاريخية. ومن خلال تعدد اختصاصات أعضائها ومواقعهم العلمية والمؤسسية، تواكب الهيئة مشاريع التوثيق والنشر والإتاحة الرقمية، وتدعم بناء فضاء معرفي يخدم الباحثين والمهتمين بتاريخ المغرب وشماله.",
    labels: {
      profile: "مجال الاختصاص",
      role: "الصفة المؤسسية"
    },
    members
  }
};

export function getTeamInnerContent(locale: Locale): TeamInnerContent {
  return teamInnerContent[locale] ?? teamInnerContent[defaultLocale];
}

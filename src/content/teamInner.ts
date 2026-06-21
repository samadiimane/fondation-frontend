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

const membersByLocale: Record<Locale, TeamMember[]> = {
  en: [
    {
      id: "adil-khallouk-temsamani",
      name: "Adil Khallouk Temsamani",
      profile: "President of the Abdelaziz Khallouk Temsamani Foundation for Scientific Research",
      role: "Institutional supervision"
    },
    {
      id: "abdelouahed-el-bekkali",
      name: "Abdelouahed El Bekkali",
      profile: "General coordination of the Foundation",
      role: "General Coordinator of the Foundation"
    },
    {
      id: "mohamed-bourrass",
      name: "Mohamed Bourass",
      profile: "Historian, researcher, and professor of higher education specializing in the contemporary history of Morocco.",
      role: "Member of the Scientific Board and Research Supervision"
    },
    {
      id: "mustapha-el-merroun",
      name: "Mustapha El Merroun",
      profile: "Moroccan historian and researcher specializing in the military history of Morocco.",
      role: "Member of the Scientific Board and Research Supervision"
    }
  ],
  fr: [
    {
      id: "adil-khallouk-temsamani",
      name: "Adil Khallouk Temsamani",
      profile: "Président de la Fondation Abdelaziz Khallouk Temsamani pour la recherche scientifique",
      role: "Supervision institutionnelle"
    },
    {
      id: "abdelouahed-el-bekkali",
      name: "Abdelouahed El Bekkali",
      profile: "Coordination générale de la Fondation",
      role: "Coordinateur général de la Fondation"
    },
    {
      id: "mohamed-bourrass",
      name: "Mohamed Bourass",
      profile: "Historien, chercheur et professeur de l’enseignement supérieur, spécialiste de l’histoire contemporaine du Maroc.",
      role: "Membre de l’instance scientifique et de l’encadrement de la recherche"
    },
    {
      id: "mustapha-el-merroun",
      name: "Mustapha El Merroun",
      profile: "Historien et chercheur marocain, spécialiste de l’histoire militaire du Maroc.",
      role: "Membre de l’instance scientifique et de l’encadrement de la recherche"
    }
  ],
  es: [
    {
      id: "adil-khallouk-temsamani",
      name: "Adil Khallouk Temsamani",
      profile: "Presidente de la Fundación Abdelaziz Khallouk Temsamani para la Investigación Científica",
      role: "Supervisión institucional"
    },
    {
      id: "abdelouahed-el-bekkali",
      name: "Abdelouahed El Bekkali",
      profile: "Coordinación general de la Fundación",
      role: "Coordinador general de la Fundación"
    },
    {
      id: "mohamed-bourrass",
      name: "Mohamed Bourass",
      profile: "Historiador, investigador y profesor de enseñanza superior, especializado en la historia contemporánea de Marruecos.",
      role: "Miembro del Consejo Científico y de Supervisión de Investigación"
    },
    {
      id: "mustapha-el-merroun",
      name: "Mustapha El Merroun",
      profile: "Historiador e investigador marroquí, especializado en la historia militar de Marruecos.",
      role: "Miembro del Consejo Científico y de Supervisión de Investigación"
    }
  ],
  ar: [
    {
      id: "adil-khallouk-temsamani",
      name: "عادل خلوق التمسماني",
      profile: "رئيس مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي",
      role: "الإشراف المؤسسي"
    },
    {
      id: "abdelouahed-el-bekkali",
      name: "عبد الواحد البقالي",
      profile: "الكتابة العامة للمؤسسة",
      role: "الكاتب العام للمؤسسة"
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
      profile: "مؤرخ وباحث مغربي، متخصص في التاريخ العسكري للمغرب.",
      role: "عضو الهيئة العلمية والإشراف البحثي"
    }
  ]
};

const teamInnerContent: Record<Locale, TeamInnerContent> = {
  en: {
    title: "Scientific Board and Research Supervision",
    intro:
      "The Foundation brings together academic supervision, research work, and documentary organization so its projects remain connected to scholarly rigor, responsible archival practice, and service to researchers and readers within a clear institutional framework.",
    labels: {
      profile: "Area of expertise",
      role: "Institutional role"
    },
    members: membersByLocale.en
  },
  fr: {
    title: "Instance scientifique et encadrement de la recherche",
    intro:
      "La Fondation articule encadrement académique, travail de recherche et organisation documentaire afin que ses projets restent liés à la rigueur scientifique, à la méthode archivistique et au service des chercheurs et lecteurs dans un cadre institutionnel clair.",
    labels: {
      profile: "Domaine de spécialité",
      role: "Qualité institutionnelle"
    },
    members: membersByLocale.fr
  },
  es: {
    title: "Comité científico y supervisión de investigación",
    intro:
      "La Fundación combina supervisión académica, trabajo de investigación y organización documental para que sus proyectos permanezcan vinculados al rigor científico, a la metodología archivística y al servicio de investigadores y lectores dentro de un marco institucional claro.",
    labels: {
      profile: "Área de especialidad",
      role: "Función institucional"
    },
    members: membersByLocale.es
  },
  ar: {
    title: "الهيئة العلمية والإشراف البحثي",
    intro:
      "تستند الهيئة العلمية والإشراف البحثي إلى خبرات أكاديمية ومؤسسية تُسهم في ترسيخ توجه المؤسسة نحو بحث رصين، قائم على الوثيقة، والتحقق، وصيانة الذاكرة التاريخية. ومن خلال تعدد اختصاصات أعضائها ومواقعهم العلمية والمؤسسية، تواكب الهيئة مشاريع التوثيق والنشر والإتاحة الرقمية، وتدعم بناء فضاء معرفي يخدم الباحثين والمهتمين بتاريخ المغرب وشماله.",
    labels: {
      profile: "مجال الاختصاص",
      role: "الصفة المؤسسية"
    },
    members: membersByLocale.ar
  }
};

export function getTeamInnerContent(locale: Locale): TeamInnerContent {
  return teamInnerContent[locale] ?? teamInnerContent[defaultLocale];
}

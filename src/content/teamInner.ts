import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface TeamMember {
  id: string;
  name: string;
  field: string;
  role: string;
  affiliation?: string;
}

export interface TeamGroup {
  key: "scientific" | "research";
  title: string;
  description: string;
  members: TeamMember[];
}

export interface TeamInnerContent {
  title: string;
  intro: string;
  labels: {
    field: string;
    affiliation: string;
  };
  groups: TeamGroup[];
}

const teamInnerContent: Record<Locale, TeamInnerContent> = {
  en: {
    title: "Scientific Board and Research Supervision",
    intro:
      "The Foundation brings together academic supervision, research work, and documentary organization so its projects remain connected to scholarly rigor, responsible archival practice, and service to researchers and readers within a clear institutional framework.",
    labels: {
      field: "Field",
      affiliation: "Affiliation"
    },
    groups: [
      {
        key: "scientific",
        title: "Scientific Committee",
        description:
          "The scientific committee supports the Foundation's major research orientations and methodological choices in history, archives, scholarly publishing, and documentary memory preservation.",
        members: [
          {
            id: "scientific-abdelaziz-temsamani",
            name: "Dr. Abdelaziz Khallouk Temsamani",
            role: "Founder and Scientific Director",
            field: "Moroccan Modern and Contemporary History"
          },
          {
            id: "scientific-fatima-al-khamlichi",
            name: "Prof. Fatima Al-Khamlichi",
            role: "Senior Historical Researcher",
            field: "Medieval Moroccan History"
          },
          {
            id: "scientific-ahmed-benali",
            name: "Dr. Ahmed Benali",
            role: "Digital Humanities Specialist",
            field: "Digital Archives and AI Research"
          },
          {
            id: "scientific-aicha-moroccan",
            name: "Prof. Aicha Moroccan",
            role: "Cultural Heritage Expert",
            field: "Tangible and Intangible Heritage"
          }
        ]
      },
      {
        key: "research",
        title: "Research and Documentation Team",
        description:
          "The research and documentation team organizes scholarly and documentary material, and follows cataloguing, digitization, and publishing workflows so the displayed content remains searchable and academically usable.",
        members: [
          {
            id: "research-mohammed-berrada",
            name: "Prof. Mohammed Berrada",
            role: "Scientific Committee Chair",
            field: "Research Quality Assurance"
          },
          {
            id: "research-latifa-bennani",
            name: "Dr. Latifa Bennani",
            role: "Editorial Review Specialist",
            field: "Academic Publishing Standards"
          },
          {
            id: "research-youssef-tazi",
            name: "Prof. Youssef Tazi",
            role: "Methodology Advisor",
            field: "Research Methodology"
          },
          {
            id: "research-khadija-alami",
            name: "Dr. Khadija Alami",
            role: "International Relations Coordinator",
            field: "Academic Partnerships"
          }
        ]
      }
    ]
  },
  fr: {
    title: "Instance scientifique et encadrement de la recherche",
    intro:
      "La Fondation articule encadrement académique, travail de recherche et organisation documentaire afin que ses projets restent liés à la rigueur scientifique, à la méthode archivistique et au service des chercheurs et lecteurs dans un cadre institutionnel clair.",
    labels: {
      field: "Domaine",
      affiliation: "Affiliation"
    },
    groups: [
      {
        key: "scientific",
        title: "Comité scientifique",
        description:
          "Le comité scientifique accompagne les grandes orientations de recherche de la Fondation et soutient ses choix méthodologiques dans les domaines de l'histoire, des archives, de l'édition scientifique et de la préservation de la mémoire documentaire.",
        members: [
          {
            id: "scientific-abdelaziz-temsamani",
            name: "Dr Abdelaziz Khallouk Temsamani",
            role: "Fondateur et directeur scientifique",
            field: "Histoire marocaine moderne et contemporaine"
          },
          {
            id: "scientific-fatima-al-khamlichi",
            name: "Pr Fatima Al-Khamlichi",
            role: "Chercheuse principale en histoire",
            field: "Histoire médiévale du Maroc"
          },
          {
            id: "scientific-ahmed-benali",
            name: "Dr Ahmed Benali",
            role: "Spécialiste en humanités numériques",
            field: "Archives numériques et recherche en IA"
          },
          {
            id: "scientific-aicha-moroccan",
            name: "Pr Aicha Moroccan",
            role: "Experte en patrimoine culturel",
            field: "Patrimoine matériel et immatériel"
          }
        ]
      },
      {
        key: "research",
        title: "Équipe de recherche et de documentation",
        description:
          "L'équipe de recherche et de documentation organise les matériaux scientifiques et documentaires, et suit les processus de catalogage, de numérisation et de publication afin de rendre le contenu consultable et utilisable académiquement.",
        members: [
          {
            id: "research-mohammed-berrada",
            name: "Pr Mohammed Berrada",
            role: "Président du comité scientifique",
            field: "Assurance qualité de la recherche"
          },
          {
            id: "research-latifa-bennani",
            name: "Dr Latifa Bennani",
            role: "Spécialiste de la revue éditoriale",
            field: "Normes de publication académique"
          },
          {
            id: "research-youssef-tazi",
            name: "Pr Youssef Tazi",
            role: "Conseiller en méthodologie",
            field: "Méthodologie de la recherche"
          },
          {
            id: "research-khadija-alami",
            name: "Dr Khadija Alami",
            role: "Coordinatrice des relations internationales",
            field: "Partenariats académiques"
          }
        ]
      }
    ]
  },
  es: {
    title: "Comité científico y supervisión de investigación",
    intro:
      "La Fundación combina supervisión académica, trabajo de investigación y organización documental para que sus proyectos permanezcan vinculados al rigor científico, a la metodología archivística y al servicio de investigadores y lectores dentro de un marco institucional claro.",
    labels: {
      field: "Campo",
      affiliation: "Afiliación"
    },
    groups: [
      {
        key: "scientific",
        title: "Comité científico",
        description:
          "El comité científico acompaña las principales orientaciones de investigación de la Fundación y apoya sus decisiones metodológicas en historia, archivos, publicación académica y preservación de la memoria documental.",
        members: [
          {
            id: "scientific-abdelaziz-temsamani",
            name: "Dr. Abdelaziz Khallouk Temsamani",
            role: "Fundador y director científico",
            field: "Historia moderna y contemporánea de Marruecos"
          },
          {
            id: "scientific-fatima-al-khamlichi",
            name: "Prof. Fatima Al-Khamlichi",
            role: "Investigadora principal en historia",
            field: "Historia medieval marroquí"
          },
          {
            id: "scientific-ahmed-benali",
            name: "Dr. Ahmed Benali",
            role: "Especialista en humanidades digitales",
            field: "Archivos digitales e investigación en IA"
          },
          {
            id: "scientific-aicha-moroccan",
            name: "Prof. Aicha Moroccan",
            role: "Experta en patrimonio cultural",
            field: "Patrimonio tangible e intangible"
          }
        ]
      },
      {
        key: "research",
        title: "Equipo de investigación y documentación",
        description:
          "El equipo de investigación y documentación organiza el material científico y documental, y sigue los procesos de catalogación, digitalización y publicación para que el contenido sea consultable y útil académicamente.",
        members: [
          {
            id: "research-mohammed-berrada",
            name: "Prof. Mohammed Berrada",
            role: "Presidente del comité científico",
            field: "Garantía de calidad de investigación"
          },
          {
            id: "research-latifa-bennani",
            name: "Dra. Latifa Bennani",
            role: "Especialista en revisión editorial",
            field: "Normas de publicación académica"
          },
          {
            id: "research-youssef-tazi",
            name: "Prof. Youssef Tazi",
            role: "Asesor metodológico",
            field: "Metodología de la investigación"
          },
          {
            id: "research-khadija-alami",
            name: "Dra. Khadija Alami",
            role: "Coordinadora de relaciones internacionales",
            field: "Alianzas académicas"
          }
        ]
      }
    ]
  },
  ar: {
    title: "الهيئة العلمية والإشراف البحثي",
    intro:
      "تجمع المؤسسة بين الإشراف الأكاديمي والعمل البحثي والتوثيقي، بما يضمن أن تظل مشاريعها مرتبطة بالصرامة العلمية، وبمنهجية التعامل مع الوثيقة، وبخدمة الباحثين والقراء ضمن إطار مؤسسي واضح.",
    labels: {
      field: "المجال",
      affiliation: "الانتماء"
    },
    groups: [
      {
        key: "scientific",
        title: "اللجنة العلمية",
        description:
          "تواكب اللجنة العلمية التوجهات البحثية الكبرى للمؤسسة، وتدعم اختياراتها المنهجية في مجالات التاريخ، والأرشيف، والنشر العلمي، وصيانة الذاكرة الوثائقية.",
        members: [
          {
            id: "scientific-abdelaziz-temsamani",
            name: "د. عبد العزيز خلوق التمسماني",
            role: "المؤسس والمدير العلمي",
            field: "تاريخ المغرب الحديث والمعاصر"
          },
          {
            id: "scientific-fatima-al-khamlichi",
            name: "الأستاذة فاطمة الحمليشي",
            role: "باحثة أولى في التاريخ",
            field: "التاريخ الوسيط للمغرب"
          },
          {
            id: "scientific-ahmed-benali",
            name: "د. أحمد بن علي",
            role: "متخصص في الإنسانيات الرقمية",
            field: "الأرشيف الرقمي وبحوث الذكاء الاصطناعي"
          },
          {
            id: "scientific-aicha-moroccan",
            name: "الأستاذة عائشة موروكن",
            role: "خبيرة في التراث الثقافي",
            field: "التراث المادي واللامادي"
          }
        ]
      },
      {
        key: "research",
        title: "فريق البحث والتوثيق",
        description:
          "يعنى فريق البحث والتوثيق بتنظيم المادة العلمية والوثائقية، ومتابعة مسارات الفهرسة والرقمنة والنشر، بما يجعل المحتوى المعروض قابلاً للبحث والاستعمال الأكاديمي.",
        members: [
          {
            id: "research-mohammed-berrada",
            name: "الأستاذ محمد برادة",
            role: "رئيس اللجنة العلمية",
            field: "ضمان جودة البحث"
          },
          {
            id: "research-latifa-bennani",
            name: "د. لطيفة بناني",
            role: "متخصصة في المراجعة التحريرية",
            field: "معايير النشر الأكاديمي"
          },
          {
            id: "research-youssef-tazi",
            name: "الأستاذ يوسف الطازي",
            role: "مستشار في المنهجية",
            field: "منهجية البحث"
          },
          {
            id: "research-khadija-alami",
            name: "د. خديجة العلامي",
            role: "منسقة العلاقات الدولية",
            field: "الشراكات الأكاديمية"
          }
        ]
      }
    ]
  }
};

export function getTeamInnerContent(locale: Locale): TeamInnerContent {
  return teamInnerContent[locale] ?? teamInnerContent[defaultLocale];
}

import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  specialization: string;
  education: string;
  experience: string;
  publications: string;
}

export interface TeamInnerContent {
  scientific: {
    title: string;
    description: string;
    members: TeamMember[];
  };
  committee: {
    subtitle: string;
    title: string;
    description: string;
    members: TeamMember[];
  };
}

const teamInnerContent: Record<Locale, TeamInnerContent> = {
  en: {
    scientific: {
      title: "Scientific Team & Research Supervisors",
      description:
        "Distinguished historians and researchers who guide our foundation's scholarly endeavors and ensure the highest academic standards.",
      members: [
        {
          id: 1,
          name: "Dr. Abdelaziz Khallouk Temsamani",
          position: "Founder & Scientific Director",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Moroccan Modern & Contemporary History",
          education: "PhD in History, Mohammed V University",
          experience: "30+ years in historical research",
          publications: "50+ books and research papers"
        },
        {
          id: 2,
          name: "Prof. Fatima Al-Khamlichi",
          position: "Senior Historical Researcher",
          image: "/assets/images/team/woman.png",
          specialization: "Medieval Moroccan History",
          education: "PhD in Islamic Studies, Al-Quaraouiyine University",
          experience: "25+ years in medieval studies",
          publications: "35+ academic publications"
        },
        {
          id: 3,
          name: "Dr. Ahmed Benali",
          position: "Digital Humanities Specialist",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Digital Archives & AI Research",
          education: "PhD in Information Sciences, Rabat University",
          experience: "15+ years in digital preservation",
          publications: "20+ papers on digital humanities"
        },
        {
          id: 4,
          name: "Prof. Aicha Moroccan",
          position: "Cultural Heritage Expert",
          image: "/assets/images/team/woman.png",
          specialization: "Tangible & Intangible Heritage",
          education: "PhD in Anthropology, Sorbonne University",
          experience: "20+ years in heritage studies",
          publications: "40+ studies on Moroccan culture"
        }
      ]
    },
    committee: {
      subtitle: "Quality Assurance",
      title: "Scientific Committee & Quality Control",
      description:
        "Expert reviewers responsible for maintaining rigorous academic standards, peer review processes, and ensuring research quality across all publications.",
      members: [
        {
          id: 1,
          name: "Prof. Mohammed Berrada",
          position: "Committee Chairman",
          image: "/assets/images/team/ceooo.jpg",
          specialization: "Research Quality Assurance",
          education: "PhD in History, Harvard University",
          experience: "35+ years in academic review",
          publications: "60+ peer-reviewed articles"
        },
        {
          id: 2,
          name: "Dr. Latifa Bennani",
          position: "Editorial Review Specialist",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Academic Publishing Standards",
          education: "PhD in Literature, Oxford University",
          experience: "20+ years in academic editing",
          publications: "Editor of 100+ academic works"
        },
        {
          id: 3,
          name: "Prof. Youssef Tazi",
          position: "Methodology Advisor",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Research Methodology",
          education: "PhD in Social Sciences, EHESS Paris",
          experience: "25+ years in research methodology",
          publications: "30+ methodological guides"
        },
        {
          id: 4,
          name: "Dr. Khadija Alami",
          position: "International Relations Coordinator",
          image: "/assets/images/team/woman.png",
          specialization: "Academic Partnerships",
          education: "PhD in International Relations, Sciences Po",
          experience: "18+ years in academic diplomacy",
          publications: "25+ papers on academic cooperation"
        }
      ]
    }
  },
  fr: {
    scientific: {
      title: "Équipe scientifique et encadrement de la recherche",
      description:
        "Des historiennes et historiens reconnus qui guident les travaux de la fondation et garantissent les standards académiques les plus élevés.",
      members: [
        {
          id: 1,
          name: "Dr Abdelaziz Khallouk Temsamani",
          position: "Fondateur et directeur scientifique",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Histoire marocaine moderne et contemporaine",
          education: "Doctorat en histoire, Université Mohammed V",
          experience: "30+ ans de recherche historique",
          publications: "50+ livres et articles"
        },
        {
          id: 2,
          name: "Pr Fatima Al-Khamlichi",
          position: "Chercheuse principale en histoire",
          image: "/assets/images/team/woman.png",
          specialization: "Histoire médiévale du Maroc",
          education: "Doctorat en études islamiques, Université Al-Qaraouiyine",
          experience: "25+ ans dans les études médiévales",
          publications: "35+ publications académiques"
        },
        {
          id: 3,
          name: "Dr Ahmed Benali",
          position: "Spécialiste en humanités numériques",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Archives numériques et recherche en IA",
          education: "Doctorat en sciences de l'information, Université de Rabat",
          experience: "15+ ans en préservation numérique",
          publications: "20+ articles sur les humanités numériques"
        },
        {
          id: 4,
          name: "Pr Aicha Moroccan",
          position: "Experte en patrimoine culturel",
          image: "/assets/images/team/woman.png",
          specialization: "Patrimoine matériel et immatériel",
          education: "Doctorat en anthropologie, Sorbonne Université",
          experience: "20+ ans dans les études patrimoniales",
          publications: "40+ études sur la culture marocaine"
        }
      ]
    },
    committee: {
      subtitle: "Assurance qualité",
      title: "Comité scientifique et contrôle qualité",
      description:
        "Des évaluateurs experts chargés de maintenir des standards académiques rigoureux, le processus de relecture par les pairs et la qualité des publications.",
      members: [
        {
          id: 1,
          name: "Pr Mohammed Berrada",
          position: "Président du comité",
          image: "/assets/images/team/ceooo.jpg",
          specialization: "Assurance qualité de la recherche",
          education: "Doctorat en histoire, Université Harvard",
          experience: "35+ ans dans l’évaluation académique",
          publications: "60+ articles évalués par les pairs"
        },
        {
          id: 2,
          name: "Dr Latifa Bennani",
          position: "Spécialiste de la revue éditoriale",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Normes de publication académique",
          education: "Doctorat en littérature, Université d’Oxford",
          experience: "20+ ans en édition scientifique",
          publications: "Éditrice de 100+ ouvrages académiques"
        },
        {
          id: 3,
          name: "Pr Youssef Tazi",
          position: "Conseiller en méthodologie",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Méthodologie de la recherche",
          education: "Doctorat en sciences sociales, EHESS Paris",
          experience: "25+ ans en conception de recherche",
          publications: "30+ guides méthodologiques"
        },
        {
          id: 4,
          name: "Dr Khadija Alami",
          position: "Coordinatrice des relations internationales",
          image: "/assets/images/team/woman.png",
          specialization: "Partenariats académiques",
          education: "Doctorat en relations internationales, Sciences Po",
          experience: "18+ ans en diplomatie académique",
          publications: "25+ articles sur la coopération académique"
        }
      ]
    }
  },
  es: {
    scientific: {
      title: "Equipo científico y supervisión de investigación",
      description:
        "Historiadores e investigadores destacados que guían el trabajo académico de la fundación y garantizan los más altos estándares.",
      members: [
        {
          id: 1,
          name: "Dr. Abdelaziz Khallouk Temsamani",
          position: "Fundador y director científico",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Historia moderna y contemporánea de Marruecos",
          education: "Doctor en Historia, Universidad Mohammed V",
          experience: "30+ años en investigación histórica",
          publications: "50+ libros y artículos de investigación"
        },
        {
          id: 2,
          name: "Prof. Fatima Al-Khamlichi",
          position: "Investigadora principal en historia",
          image: "/assets/images/team/woman.png",
          specialization: "Historia medieval marroquí",
          education: "Doctorado en Estudios Islámicos, Universidad Al-Qarawiyyin",
          experience: "25+ años en estudios medievales",
          publications: "35+ publicaciones académicas"
        },
        {
          id: 3,
          name: "Dr. Ahmed Benali",
          position: "Especialista en humanidades digitales",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Archivos digitales e investigación en IA",
          education: "Doctor en Ciencias de la Información, Universidad de Rabat",
          experience: "15+ años en preservación digital",
          publications: "20+ artículos sobre humanidades digitales"
        },
        {
          id: 4,
          name: "Prof. Aicha Moroccan",
          position: "Experta en patrimonio cultural",
          image: "/assets/images/team/woman.png",
          specialization: "Patrimonio tangible e intangible",
          education: "Doctorado en Antropología, Sorbona",
          experience: "20+ años en estudios patrimoniales",
          publications: "40+ estudios sobre cultura marroquí"
        }
      ]
    },
    committee: {
      subtitle: "Aseguramiento de la calidad",
      title: "Comité científico y control de calidad",
      description:
        "Revisores expertos encargados de mantener estándares académicos rigurosos, procesos de revisión por pares y calidad en todas las publicaciones.",
      members: [
        {
          id: 1,
          name: "Prof. Mohammed Berrada",
          position: "Presidente del comité",
          image: "/assets/images/team/ceooo.jpg",
          specialization: "Garantía de calidad de investigación",
          education: "Doctor en Historia, Universidad de Harvard",
          experience: "35+ años en evaluación académica",
          publications: "60+ artículos revisados por pares"
        },
        {
          id: 2,
          name: "Dra. Latifa Bennani",
          position: "Especialista en revisión editorial",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "Normas de publicación académica",
          education: "Doctorado en Literatura, Universidad de Oxford",
          experience: "20+ años en edición académica",
          publications: "Editora de 100+ obras académicas"
        },
        {
          id: 3,
          name: "Prof. Youssef Tazi",
          position: "Asesor metodológico",
          image: "/assets/images/team/ceo.jpg",
          specialization: "Metodología de la investigación",
          education: "Doctorado en Ciencias Sociales, EHESS París",
          experience: "25+ años en diseño de investigación",
          publications: "30+ guías metodológicas"
        },
        {
          id: 4,
          name: "Dra. Khadija Alami",
          position: "Coordinadora de relaciones internacionales",
          image: "/assets/images/team/woman.png",
          specialization: "Alianzas académicas",
          education: "Doctorado en Relaciones Internacionales, Sciences Po",
          experience: "18+ años en diplomacia académica",
          publications: "25+ artículos sobre cooperación académica"
        }
      ]
    }
  },
  ar: {
    scientific: {
      title: "الفريق العلمي والإشراف البحثي",
      description:
        "أساتذة وباحثون متميزون يقودون جهود المؤسسة العلمية ويضمنون أعلى المعايير الأكاديمية.",
      members: [
        {
          id: 1,
          name: "د. عبد العزيز خلوف تمسماني",
          position: "المؤسس والمدير العلمي",
          image: "/assets/images/team/ceo.jpg",
          specialization: "تاريخ المغرب الحديث والمعاصر",
          education: "دكتوراه في التاريخ، جامعة محمد الخامس",
          experience: "أكثر من 30 سنة في البحث التاريخي",
          publications: "أكثر من 50 كتاباً ودراسة"
        },
        {
          id: 2,
          name: "الأستاذة فاطمة الحمليشي",
          position: "باحثة أولى في التاريخ",
          image: "/assets/images/team/woman.png",
          specialization: "التاريخ الوسيط للمغرب",
          education: "دكتوراه في الدراسات الإسلامية، جامعة القرويين",
          experience: "أكثر من 25 سنة في الدراسات الوسيطة",
          publications: "أكثر من 35 دراسة أكاديمية"
        },
        {
          id: 3,
          name: "د. أحمد بن علي",
          position: "متخصص في الإنسانيات الرقمية",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "الأرشيف الرقمي وبحوث الذكاء الاصطناعي",
          education: "دكتوراه في علوم المعلومات، جامعة الرباط",
          experience: "أكثر من 15 سنة في الحفظ الرقمي",
          publications: "أكثر من 20 مقالاً في الإنسانيات الرقمية"
        },
        {
          id: 4,
          name: "الأستاذة عائشة موروكن",
          position: "خبيرة في التراث الثقافي",
          image: "/assets/images/team/woman.png",
          specialization: "التراث المادي واللامادي",
          education: "دكتوراه في الأنثروبولوجيا، جامعة السوربون",
          experience: "أكثر من 20 سنة في دراسات التراث",
          publications: "أكثر من 40 دراسة عن الثقافة المغربية"
        }
      ]
    },
    committee: {
      subtitle: "ضمان الجودة",
      title: "اللجنة العلمية والرقابة على الجودة",
      description:
        "مراجعون خبراء مسؤولون عن الحفاظ على المعايير الأكاديمية الصارمة، ومسارات التحكيم، وضمان جودة البحث في جميع المنشورات.",
      members: [
        {
          id: 1,
          name: "الأستاذ محمد برادة",
          position: "رئيس اللجنة",
          image: "/assets/images/team/ceooo.jpg",
          specialization: "ضمان جودة البحث",
          education: "دكتوراه في التاريخ، جامعة هارفارد",
          experience: "أكثر من 35 سنة في المراجعة الأكاديمية",
          publications: "أكثر من 60 مقالة محكمة"
        },
        {
          id: 2,
          name: "د. لطيفة بناني",
          position: "متخصصة في المراجعة التحريرية",
          image: "/assets/images/team/ceoo.jpg",
          specialization: "معايير النشر الأكاديمي",
          education: "دكتوراه في الأدب، جامعة أوكسفورد",
          experience: "أكثر من 20 سنة في التحرير العلمي",
          publications: "محررة لأكثر من 100 عمل أكاديمي"
        },
        {
          id: 3,
          name: "الأستاذ يوسف الطازي",
          position: "مستشار في المنهجية",
          image: "/assets/images/team/ceo.jpg",
          specialization: "منهجية البحث",
          education: "دكتوراه في العلوم الاجتماعية، مدرسة الدراسات العليا بباريس",
          experience: "أكثر من 25 سنة في تصميم البحث",
          publications: "أكثر من 30 دليلاً منهجياً"
        },
        {
          id: 4,
          name: "د. خديجة العلامي",
          position: "منسقة العلاقات الدولية",
          image: "/assets/images/team/woman.png",
          specialization: "الشراكات الأكاديمية",
          education: "دكتوراه في العلاقات الدولية، معهد العلوم السياسية",
          experience: "أكثر من 18 سنة في الدبلوماسية الأكاديمية",
          publications: "أكثر من 25 مقالاً حول التعاون الأكاديمي"
        }
      ]
    }
  }
};

export function getTeamInnerContent(locale: Locale): TeamInnerContent {
  return teamInnerContent[locale] ?? teamInnerContent[defaultLocale];
}

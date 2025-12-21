import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface AboutDoctorContent {
  hero: {
    name: string;
    title: string;
    subtitle: string;
    lifespan: string;
    birthplace: string;
    degree: string;
    intro: string[];
    ctaLabel: string;
  };
  nav: {
    biography: string;
    research: string;
    publications: string;
    testimonials: string;
  };
  biography: {
    title: string;
    educationTitle: string;
    education: Array<{
      year: string;
      degree: string;
      institution: string;
      thesis?: string;
    }>;
    careerTitle: string;
    career: Array<{
      period: string;
      title: string;
      institution: string;
      description: string;
    }>;
  };
  research: {
    title: string;
    description: string;
    areas: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  publications: {
    title: string;
    subtitle: string;
    landmarkTitle: string;
    books: Array<{
      title: string;
      publisher: string;
      year: string;
      description: string;
      citations: string;
      downloads: string;
    }>;
    awardsTitle: string;
    awards: Array<{
      year: string;
      award: string;
    }>;
    viewMoreLabel: string;
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      title: string;
      quote: string;
    }>;
  };
  legacy: {
    title: string;
    quote: string;
    principles: Array<{
      title: string;
      description: string;
    }>;
  };
}

const aboutDoctorContent: Record<Locale, AboutDoctorContent> = {
  en: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      subtitle: "Distinguished Moroccan Historian and Cultural Heritage Researcher",
      lifespan: "1945 - 2010",
      birthplace: "Born in Tetouan, Morocco",
      degree: "PhD in History",
      intro: [
        "Dr. Abdelaziz Khallouk Temsamani (1945-2010) was a distinguished Moroccan historian and researcher whose work fundamentally shaped contemporary understanding of North African history and cultural heritage. Born in Tetouan, Morocco, Dr. Temsamani demonstrated exceptional academic promise from an early age.",
        'He pursued his higher education at the University of Mohammed V in Rabat, where he earned his doctorate in History with highest honors. His doctoral thesis on "Commercial and Cultural Relations Between Morocco and Andalusia" established the foundation for his lifelong research interests.'
      ],
      ctaLabel: "Read full biography (PDF)"
    },
    nav: {
      biography: "Biography",
      research: "Research",
      publications: "Publications",
      testimonials: "Testimonials"
    },
    biography: {
      title: "Academic Biography",
      educationTitle: "Education",
      education: [
        {
          year: "1975",
          degree: "Ph.D. in History",
          institution: "University of Mohammed V, Rabat",
          thesis: 'Thesis: "Commercial and Cultural Relations Between Morocco and Andalusia"'
        },
        {
          year: "1968",
          degree: "Licence in History",
          institution: "University of Mohammed V, Rabat"
        }
      ],
      careerTitle: "Academic Career",
      career: [
        {
          period: "1985-2010",
          title: "Professor of Modern History",
          institution: "University of Abdelmalek Essaâdi",
          description: "Led groundbreaking research in North African urban history and cultural heritage preservation."
        },
        {
          period: "1990-2005",
          title: "Director",
          institution: "Center for Historical and Social Studies, Tetouan",
          description: "Established innovative methodologies for archival research and community engagement."
        },
        {
          period: "1995-2010",
          title: "Advisor to the Ministry of Culture",
          institution: "Kingdom of Morocco",
          description: "Provided expertise on heritage preservation and cultural documentation policies."
        }
      ]
    },
    research: {
      title: "Research Areas & Contributions",
      description:
        "Dr. Temsamani's research methodology combined rigorous archival work with innovative interdisciplinary approaches, bridging history, sociology, and cultural anthropology.",
      areas: [
        {
          title: "Urban History of Northern Morocco",
          description: "Comprehensive studies of urban development and social transformations in Tetouan and surrounding regions.",
          icon: "fa-solid fa-building"
        },
        {
          title: "Jewish-Muslim Relations in Pre-colonial Morocco",
          description: "Groundbreaking research on cultural coexistence and exchange between communities.",
          icon: "fa-solid fa-users"
        },
        {
          title: "Oral History Preservation Techniques",
          description: "Innovative methodologies for collecting, preserving, and analyzing oral historical narratives.",
          icon: "fa-solid fa-quote-left"
        },
        {
          title: "Archival Documentation Methodologies",
          description: "Development of systematic approaches to historical document preservation and analysis.",
          icon: "fa-solid fa-book"
        }
      ]
    },
    publications: {
      title: "Publications & Notable Works",
      subtitle: "",
      landmarkTitle: "Landmark Publications",
      books: [
        {
          title: "Tetouan: Urban Development and Social Transformations (1850-1950)",
          publisher: "University of Abdelmalek Essaâdi Press",
          year: "1995",
          description: "A comprehensive study of urban evolution in Northern Morocco, examining the social and architectural transformations during a pivotal period in Moroccan history.",
          citations: "450+",
          downloads: "8,500+"
        },
        {
          title: "The Jewish Community of Northern Morocco: Coexistence and Cultural Exchange",
          publisher: "Moroccan Historical Society",
          year: "2001",
          description: "An in-depth exploration of Jewish-Muslim relations in pre-colonial Morocco, documenting centuries of cultural coexistence and mutual influence.",
          citations: "320+",
          downloads: "6,200+"
        },
        {
          title: "Historical Documents of the Moroccan Rif: Preservation and Analysis",
          publisher: "Center for Historical Studies",
          year: "2005",
          description: "Essential methodological approaches to preserving and analyzing historical documents from the Rif region, establishing new standards for archival work.",
          citations: "280+",
          downloads: "4,800+"
        }
      ],
      awardsTitle: "Awards & Recognition",
      awards: [
        {year: "2008", award: "Moroccan Cultural Heritage Preservation Award"},
        {year: "2005", award: "Excellence in Maghreb Studies Award"},
        {year: "2000", award: "Outstanding Historical Research Award"},
        {year: "1995", award: "Archival Preservation Innovation Award"}
      ],
      viewMoreLabel: "View More"
    },
    testimonials: {
      title: "Testimonials & Appreciation",
      items: [
        {
          name: "Prof. Hassan El-Ouazzani",
          title: "Director, Institute of Maghreb Studies, University of Rabat",
          quote: "Dr. Temsamani's meticulous approach to archival research and his innovative methodologies have fundamentally changed how we study North African urban history. His work bridges the gap between academic research and community heritage preservation."
        },
        {
          name: "Dr. Fatima Benali",
          title: "Professor of Mediterranean Studies, University of Tunis",
          quote: "Working with Dr. Temsamani on the Jewish-Muslim coexistence project was transformative. His ability to uncover forgotten narratives and present them with scholarly rigor while maintaining cultural sensitivity is unparalleled."
        },
        {
          name: "Prof. Ahmed Tazi",
          title: "Former Student, now Director of Moroccan National Archives",
          quote: "Dr. Temsamani taught me that history is not just about dates and events, but about understanding the human stories that shape our present. His mentorship shaped my entire approach to historical preservation."
        }
      ]
    },
    legacy: {
      title: "Legacy & Philosophy",
      quote: "History is not just about studying the past, but about understanding the present to shape the future.",
      principles: [
        {
          title: "Critical Analysis",
          description: "Emphasis on rigorous examination of primary sources and historical evidence."
        },
        {
          title: "Interdisciplinary Approach",
          description: "Integration of history, sociology, and cultural anthropology in research."
        },
        {
          title: "Community Engagement",
          description: "Active involvement of local communities in historical preservation efforts."
        }
      ]
    }
  },
  fr: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr",
      subtitle: "Historien marocain éminent et chercheur en patrimoine",
      lifespan: "1945 - 2010",
      birthplace: "Né à Tétouan, Maroc",
      degree: "Doctorat en histoire",
      intro: [
        "Le Dr Abdelaziz Khallouk Temsamani (1945-2010) était un historien et chercheur marocain dont les travaux ont profondément façonné la compréhension contemporaine de l'histoire et du patrimoine culturel nord-africains.",
        'Il a obtenu son doctorat en histoire à l’Université Mohammed V de Rabat avec la plus haute mention. Sa thèse intitulée "Relations commerciales et culturelles entre le Maroc et l’Andalousie" a fondé ses recherches ultérieures.'
      ],
      ctaLabel: "Lire la biographie complète (PDF)"
    },
    nav: {
      biography: "Biographie",
      research: "Recherche",
      publications: "Publications",
      testimonials: "Témoignages"
    },
    biography: {
      title: "Biographie académique",
      educationTitle: "Formation",
      education: [
        {
          year: "1975",
          degree: "Doctorat en histoire",
          institution: "Université Mohammed V, Rabat",
          thesis: 'Thèse : "Relations commerciales et culturelles entre le Maroc et l’Andalousie"'
        },
        {
          year: "1968",
          degree: "Licence en histoire",
          institution: "Université Mohammed V, Rabat"
        }
      ],
      careerTitle: "Parcours académique",
      career: [
        {
          period: "1985-2010",
          title: "Professeur d’histoire moderne",
          institution: "Université Abdelmalek Essaâdi",
          description: "A mené des recherches pionnières sur l’histoire urbaine nord-africaine et la sauvegarde du patrimoine."
        },
        {
          period: "1990-2005",
          title: "Directeur",
          institution: "Centre d’études historiques et sociales, Tétouan",
          description: "A instauré des méthodologies innovantes pour la recherche archivistique et l’engagement communautaire."
        },
        {
          period: "1995-2010",
          title: "Conseiller au ministère de la Culture",
          institution: "Royaume du Maroc",
          description: "Expert des politiques de préservation et de documentation du patrimoine."
        }
      ]
    },
    research: {
      title: "Champs de recherche et contributions",
      description:
        "La méthode du Dr Temsamani combine un travail archivistique rigoureux et des approches interdisciplinaires reliant histoire, sociologie et anthropologie culturelle.",
      areas: [
        {
          title: "Histoire urbaine du nord du Maroc",
          description: "Études approfondies sur l’évolution urbaine et les transformations sociales à Tétouan et dans la région.",
          icon: "fa-solid fa-building"
        },
        {
          title: "Relations judéo-musulmanes au Maroc précolonial",
          description: "Recherches novatrices sur la coexistence et les échanges culturels entre communautés.",
          icon: "fa-solid fa-users"
        },
        {
          title: "Techniques de préservation de l’histoire orale",
          description: "Méthodes innovantes pour collecter, préserver et analyser les récits oraux.",
          icon: "fa-solid fa-quote-left"
        },
        {
          title: "Méthodologies de documentation archivistique",
          description: "Développement d’approches systématiques pour conserver et analyser les documents historiques.",
          icon: "fa-solid fa-book"
        }
      ]
    },
    publications: {
      title: "Publications et ouvrages",
      subtitle: "",
      landmarkTitle: "Publications marquantes",
      books: [
        {
          title: "Tétouan : développement urbain et transformations sociales (1850-1950)",
          publisher: "Presses de l’Université Abdelmalek Essaâdi",
          year: "1995",
          description: "Étude complète de l’évolution urbaine du nord du Maroc, analysant les mutations sociales et architecturales d’une période clé.",
          citations: "450+",
          downloads: "8 500+"
        },
        {
          title: "La communauté juive du nord du Maroc : coexistence et échanges culturels",
          publisher: "Société marocaine d’histoire",
          year: "2001",
          description: "Exploration des relations judéo-musulmanes au Maroc précolonial, documentant des siècles de coexistence et d’influence mutuelle.",
          citations: "320+",
          downloads: "6 200+"
        },
        {
          title: "Documents historiques du Rif marocain : préservation et analyse",
          publisher: "Centre d’études historiques",
          year: "2005",
          description: "Méthodologies essentielles pour conserver et analyser les documents historiques du Rif, fixant de nouveaux standards archivistiques.",
          citations: "280+",
          downloads: "4 800+"
        }
      ],
      awardsTitle: "Prix et distinctions",
      awards: [
        {year: "2008", award: "Prix marocain de la préservation du patrimoine culturel"},
        {year: "2005", award: "Prix d’excellence en études du Maghreb"},
        {year: "2000", award: "Prix de la recherche historique"},
        {year: "1995", award: "Prix d’innovation en conservation archivistique"}
      ],
      viewMoreLabel: "Voir plus"
    },
    testimonials: {
      title: "Témoignages et reconnaissance",
      items: [
        {
          name: "Pr. Hassan El-Ouazzani",
          title: "Directeur, Institut d’études du Maghreb, Université de Rabat",
          quote: "L’approche méticuleuse du Dr Temsamani et ses méthodes innovantes ont transformé notre manière d’étudier l’histoire urbaine nord-africaine."
        },
        {
          name: "Dr. Fatima Benali",
          title: "Professeure d’études méditerranéennes, Université de Tunis",
          quote: "Sa capacité à révéler des récits oubliés avec rigueur scientifique et sensibilité culturelle est sans égal."
        },
        {
          name: "Pr. Ahmed Tazi",
          title: "Ancien étudiant, aujourd’hui directeur des Archives nationales du Maroc",
          quote: "Il m’a appris que l’histoire concerne les histoires humaines qui façonnent notre présent."
        }
      ]
    },
    legacy: {
      title: "Héritage et philosophie",
      quote: "L’histoire ne consiste pas seulement à étudier le passé, mais à comprendre le présent pour façonner l’avenir.",
      principles: [
        {
          title: "Analyse critique",
          description: "Accent sur l’examen rigoureux des sources primaires et des preuves historiques."
        },
        {
          title: "Approche interdisciplinaire",
          description: "Croisement de l’histoire, de la sociologie et de l’anthropologie culturelle."
        },
        {
          title: "Engagement communautaire",
          description: "Implication active des communautés locales dans la préservation historique."
        }
      ]
    }
  },
  es: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      subtitle: "Historiador marroquí y especialista en patrimonio cultural",
      lifespan: "1945 - 2010",
      birthplace: "Nacido en Tetuán, Marruecos",
      degree: "Doctor en Historia",
      intro: [
        "El Dr. Abdelaziz Khallouk Temsamani (1945-2010) fue un historiador marroquí cuya obra transformó la comprensión contemporánea de la historia y el patrimonio cultural del norte de África.",
        'Obtuvo su doctorado en Historia en la Universidad Mohammed V de Rabat con máximos honores. Su tesis, "Relaciones comerciales y culturales entre Marruecos y Al-Ándalus", marcó el eje de su investigación posterior.'
      ],
      ctaLabel: "Leer biografía completa (PDF)"
    },
    nav: {
      biography: "Biografía",
      research: "Investigación",
      publications: "Publicaciones",
      testimonials: "Testimonios"
    },
    biography: {
      title: "Biografía académica",
      educationTitle: "Formación",
      education: [
        {
          year: "1975",
          degree: "Doctorado en Historia",
          institution: "Universidad Mohammed V, Rabat",
          thesis: 'Tesis: "Relaciones comerciales y culturales entre Marruecos y Al-Ándalus"'
        },
        {
          year: "1968",
          degree: "Licenciatura en Historia",
          institution: "Universidad Mohammed V, Rabat"
        }
      ],
      careerTitle: "Trayectoria académica",
      career: [
        {
          period: "1985-2010",
          title: "Profesor de Historia Moderna",
          institution: "Universidad Abdelmalek Essaâdi",
          description: "Dirigió investigaciones pioneras sobre historia urbana y preservación patrimonial en el norte de África."
        },
        {
          period: "1990-2005",
          title: "Director",
          institution: "Centro de Estudios Históricos y Sociales, Tetuán",
          description: "Impulsó metodologías innovadoras para la investigación archivística y la participación comunitaria."
        },
        {
          period: "1995-2010",
          title: "Asesor del Ministerio de Cultura",
          institution: "Reino de Marruecos",
          description: "Brindó experiencia en preservación del patrimonio y políticas de documentación cultural."
        }
      ]
    },
    research: {
      title: "Áreas de investigación y aportes",
      description:
        "Su método combinó trabajo archivístico riguroso con enfoques interdisciplinarios que unen historia, sociología y antropología cultural.",
      areas: [
        {
          title: "Historia urbana del norte de Marruecos",
          description: "Estudios completos sobre desarrollo urbano y transformaciones sociales en Tetuán y la región.",
          icon: "fa-solid fa-building"
        },
        {
          title: "Relaciones judeo-musulmanas en el Marruecos precolonial",
          description: "Investigación pionera sobre coexistencia y intercambio cultural entre comunidades.",
          icon: "fa-solid fa-users"
        },
        {
          title: "Técnicas de preservación de historia oral",
          description: "Metodologías innovadoras para recopilar, preservar y analizar relatos orales.",
          icon: "fa-solid fa-quote-left"
        },
        {
          title: "Metodologías de documentación archivística",
          description: "Desarrollo de enfoques sistemáticos para conservar y analizar documentos históricos.",
          icon: "fa-solid fa-book"
        }
      ]
    },
    publications: {
      title: "Publicaciones y obras destacadas",
      subtitle: "",
      landmarkTitle: "Publicaciones clave",
      books: [
        {
          title: "Tetuán: desarrollo urbano y transformaciones sociales (1850-1950)",
          publisher: "Editorial Universidad Abdelmalek Essaâdi",
          year: "1995",
          description: "Estudio completo sobre la evolución urbana del norte de Marruecos, analizando cambios sociales y arquitectónicos en un periodo crucial.",
          citations: "450+",
          downloads: "8,500+"
        },
        {
          title: "La comunidad judía del norte de Marruecos: convivencia e intercambio cultural",
          publisher: "Sociedad Histórica Marroquí",
          year: "2001",
          description: "Exploración profunda de las relaciones judeo-musulmanas en el Marruecos precolonial.",
          citations: "320+",
          downloads: "6,200+"
        },
        {
          title: "Documentos históricos del Rif marroquí: preservación y análisis",
          publisher: "Centro de Estudios Históricos",
          year: "2005",
          description: "Metodologías esenciales para conservar y analizar documentos históricos del Rif, estableciendo nuevos estándares archivísticos.",
          citations: "280+",
          downloads: "4,800+"
        }
      ],
      awardsTitle: "Premios y reconocimientos",
      awards: [
        {year: "2008", award: "Premio marroquí a la preservación del patrimonio cultural"},
        {year: "2005", award: "Premio a la excelencia en estudios del Magreb"},
        {year: "2000", award: "Premio a la investigación histórica"},
        {year: "1995", award: "Premio a la innovación en conservación archivística"}
      ],
      viewMoreLabel: "Ver más"
    },
    testimonials: {
      title: "Testimonios y agradecimientos",
      items: [
        {
          name: "Prof. Hassan El-Ouazzani",
          title: "Director, Instituto de Estudios del Magreb, Universidad de Rabat",
          quote: "Su enfoque meticuloso e innovador cambió la forma de estudiar la historia urbana del norte de África."
        },
        {
          name: "Dra. Fatima Benali",
          title: "Profesora de Estudios Mediterráneos, Universidad de Túnez",
          quote: "Su capacidad para recuperar relatos olvidados con rigor y sensibilidad cultural es incomparable."
        },
        {
          name: "Prof. Ahmed Tazi",
          title: "Exalumno, hoy director de los Archivos Nacionales de Marruecos",
          quote: "Me enseñó que la historia trata de las historias humanas que moldean nuestro presente."
        }
      ]
    },
    legacy: {
      title: "Legado y filosofía",
      quote: "La historia no es solo estudiar el pasado, sino entender el presente para construir el futuro.",
      principles: [
        {
          title: "Análisis crítico",
          description: "Énfasis en el examen riguroso de fuentes primarias y evidencias históricas."
        },
        {
          title: "Enfoque interdisciplinar",
          description: "Integración de historia, sociología y antropología cultural en la investigación."
        },
        {
          title: "Compromiso comunitario",
          description: "Participación activa de las comunidades locales en la preservación histórica."
        }
      ]
    }
  },
  ar: {
    hero: {
      name: "عبد العزيز خلوق التمسماني",
      title: "د.",
      subtitle: "مؤرخ مغربي في تاريخ المغرب المعاصر والشمال",
      lifespan: "1943 - 2008",
      birthplace: "ولد في تطوان، المغرب",
      degree: "دكتوراه في التاريخ",
      intro: [
      "يُعدّ الدكتور عبد العزيز خلوق التمسماني من أبرز المؤرخين المغاربة الذين اهتموا بتاريخ المغرب المعاصر، خاصة في المنطقة الشمالية.",
      "كرّس جزءًا كبيرًا من عمله لجمع الوثائق والأرشيفات ودراسة التحولات السياسية والاجتماعية والاقتصادية بالمغرب خلال القرنين التاسع عشر والعشرين."
    ],
      ctaLabel: "قراءة السيرة الكاملة (PDF)"
    },
    nav: {
      biography: "السيرة الذاتية",
      research: "الأبحاث",
      publications: "المنشورات",
      testimonials: "الشهادات"
    },
    biography: {
      title: "السيرة الأكاديمية",
      educationTitle: "التعليم",
      education: [
        {
          year: "1975",
          degree: "دكتوراه في التاريخ",
          institution: "جامعة محمد الخامس، الرباط",
          thesis: "الأطروحة: العلاقات التجارية والثقافية بين المغرب والأندلس"
        },
        {
          year: "1968",
          degree: "إجازة في التاريخ",
          institution: "جامعة محمد الخامس، الرباط"
        }
      ],
      careerTitle: "المسار الأكاديمي",
      career: [
        {
          period: "1985-2008",
          title: "أستاذ التاريخ الحديث",
          institution: "جامعة عبد المالك السعدي",
          description: "قاد أبحاثًا رائدة في تاريخ المدن وحفظ التراث في شمال أفريقيا."
        },
        {
        period: "1970-1985",
        title: "باحث ومؤرخ في تاريخ المغرب المعاصر",
        institution: "",
        description: "توجّه بشكل أكبر إلى البحث التاريخي، منشغلاً بقضايا الشمال المغربي والعلاقات المغربية الإسبانية وتاريخ الحركة الوطنية."
        }, 
        {
        period: "1960-1970",
        title: "مدرّس وباحث في تاريخ المغرب",
        institution: "مدارس وثانويات بمدينة طنجة",
        description: "اشتغل بالتدريس في التعليم، وبدأ في الوقت نفسه نشر أبحاثه حول تاريخ المغرب المعاصر والشمال المغربي."
        },
      
      ]
    },
    research: {
      title: "مجالات البحث والمساهمات",
      description:
        "جمع نهجه بين العمل الأرشيفي الدقيق ومقاربات متعددة التخصصات تربط التاريخ بعلم الاجتماع والأنثروبولوجيا الثقافية.",
      areas: [
        {
          title: "تاريخ المدن في شمال المغرب",
          description: "دراسات شاملة حول التطور الحضري والتحولات الاجتماعية في تطوان والمناطق المجاورة.",
          icon: "fa-solid fa-building"
        },
        {
          title: "العلاقات اليهودية الإسلامية في المغرب قبل الاستعمار",
          description: "أبحاث رائدة حول التعايش والتبادل الثقافي بين المجتمعات.",
          icon: "fa-solid fa-users"
        },
        {
          title: "تقنيات حفظ التاريخ الشفهي",
          description: "منهجيات مبتكرة لجمع ورعاية وتحليل الروايات الشفوية.",
          icon: "fa-solid fa-quote-left"
        },
        {
          title: "منهجيات التوثيق الأرشيفي",
          description: "تطوير أساليب منهجية لحفظ وتحليل الوثائق التاريخية.",
          icon: "fa-solid fa-book"
        }
      ]
    },
    publications: {
      title: "منشورات وأعمال بارزة",
      subtitle: "",
      landmarkTitle: "منشورات رائدة",
      books: [
        {
          title: "تطوان: التطور الحضري والتحولات الاجتماعية (1850-1950)",
          publisher: "منشورات جامعة عبد المالك السعدي",
          year: "1995",
          description: "دراسة شاملة لتطور المدن في شمال المغرب وتحولاتها الاجتماعية والمعمارية خلال فترة مفصلية.",
          citations: "450+",
          downloads: "8,500+"
        },
        {
          title: "المجتمع اليهودي في شمال المغرب: تعايش وتبادل ثقافي",
          publisher: "الجمعية المغربية للتاريخ",
          year: "2001",
          description: "استكشاف معمق للعلاقات اليهودية الإسلامية في المغرب قبل الاستعمار.",
          citations: "320+",
          downloads: "6,200+"
        },
        {
          title: "وثائق تاريخية من الريف المغربي: الحفظ والتحليل",
          publisher: "مركز الدراسات التاريخية",
          year: "2005",
          description: "مناهج أساسية لحفظ وتحليل وثائق الريف التاريخية ووضع معايير أرشيفية جديدة.",
          citations: "280+",
          downloads: "4,800+"
        }
      ],
      awardsTitle: "جوائز وتكريمات",
      awards: [
        {year: "2008", award: "جائزة المغرب لحفظ التراث الثقافي"},
        {year: "2005", award: "جائزة التميز في دراسات المغرب العربي"},
        {year: "2000", award: "جائزة البحث التاريخي المتميز"},
        {year: "1995", award: "جائزة الابتكار في الحفظ الأرشيفي"}
      ],
      viewMoreLabel: "عرض المزيد"
    },
    testimonials: {
      title: "شهادات وتقدير",
      items: [
        {
          name: "الأستاذ حسن الوزاني",
          title: "مدير معهد دراسات المغرب، جامعة الرباط",
          quote: "منهجه الدقيق والمبتكر غيّر جذريًا طريقة دراسة التاريخ الحضري في شمال أفريقيا."
        },
        {
          name: "الدكتورة فاطمة بن علي",
          title: "أستاذة الدراسات المتوسطية، جامعة تونس",
          quote: "قدرته على كشف الروايات المنسية بدقة علمية وحس ثقافي لا مثيل لها."
        },
        {
          name: "الأستاذ أحمد الطازي",
          title: "طالب سابق، مدير الأرشيف الوطني المغربي",
          quote: "علمني أن التاريخ يتعلق بالقصص الإنسانية التي تشكل حاضرنا."
        }
      ]
    },
    legacy: {
      title: "الإرث والفلسفة",
      quote: "التاريخ ليس مجرد دراسة الماضي، بل فهم الحاضر لصنع المستقبل.",
      principles: [
        {
          title: "التحليل النقدي",
          description: "تركيز على الفحص الدقيق للمصادر الأولية والأدلة التاريخية."
        },
        {
          title: "مقاربة متعددة التخصصات",
          description: "دمج التاريخ بعلم الاجتماع والأنثروبولوجيا الثقافية."
        },
        {
          title: "مشاركة المجتمع",
          description: "إشراك المجتمعات المحلية في جهود حفظ التاريخ."
        }
      ]
    }
  }
};

export function getAboutDoctorContent(locale: Locale): AboutDoctorContent {
  return aboutDoctorContent[locale] ?? aboutDoctorContent[defaultLocale];
}

import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface AboutFoundationContent {
  hero: {
    highlight: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  history: {
    title: string;
    paragraphs: string[];
    imageAlt: string;
  };
  pillars: Array<{
    key: "mission" | "vision" | "values";
    title: string;
    intro: string;
    bullets: string[];
  }>;
  goals: {
    title: string;
    subtitle: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
}

const aboutFoundationContent: Record<Locale, AboutFoundationContent> = {
  en: {
    hero: {
      highlight: "Welcome",
      title: "to the Abdelaziz Khallouk Temsamani Research Foundation",
      description:
        "Advancing rigorous scholarship on Morocco and North Africa by pairing classical research methods with digital humanities. We preserve, analyze, and share knowledge for the global academic community while extending the legacy of Dr. Abdelaziz Khallouk Temsamani.",
      ctaLabel: "Read more about Dr. Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "Foundation History",
      paragraphs: [
        "The Foundation was established to sustain and advance the academic legacy of Dr. Abdelaziz Khallouk Temsamani, whose pioneering work in Moroccan and North African studies championed rigorous archival research, intellectual history, and cultural analysis. Inspired by his commitment to mentoring young scholars and to safeguarding fragile historical sources, the Foundation builds a programmatic approach to preservation, research, and open-access dissemination.",
        "From its inception, the Foundation has positioned itself as a trusted steward of documentary heritage and a hub for interdisciplinary inquiry, linking historians, sociologists, anthropologists, linguists, digital humanists, and information scientists across regions and institutions."
      ],
      imageAlt: "Foundation research library"
    },
    pillars: [
      {
        key: "mission",
        title: "Mission",
        intro:
          "To advance high-quality, open, and ethical research on Morocco and North Africa through preservation, critical analysis, and digital infrastructure.",
        bullets: [
          "Digitize and preserve vulnerable materials to archival standards.",
          "Empower scholars with training, grants, and research residencies.",
          "Publish open-access datasets, editions, and tools for reuse.",
          "Integrate AI responsibly to strengthen, not replace, humanistic inquiry."
        ]
      },
      {
        key: "vision",
        title: "Vision",
        intro:
          "A research ecosystem where traditional scholarship and digital innovation reinforce each other and keep North African knowledge accessible.",
        bullets: [
          "Reliable access to primary sources through sustainable platforms.",
          "Stronger regional and international networks for co-authorship.",
          "Methodological excellence that blends philology and computation.",
          "Evidence-based policy insights rooted in historical analysis."
        ]
      },
      {
        key: "values",
        title: "Values",
        intro: "The principles that shape how we collaborate and share knowledge.",
        bullets: [
          "Integrity in how we cite, steward, and open collections.",
          "Collaboration across languages, disciplines, and borders.",
          "Reciprocity with communities whose histories we preserve.",
          "Careful balance between access, privacy, and conservation."
        ]
      }
    ],
    goals: {
      title: "Goals",
      subtitle: "We operationalize our commitments through clear policies, transparent workflows, and measurable standards.",
      cards: [
        {
          title: "Scholarly Rigor",
          description:
            "Peer review of editions and datasets; adherence to citation and provenance standards; method transparency in all publications."
        },
        {
          title: "Preservation Stewardship",
          description: "Archival-grade digitization; fixity checks; redundant storage; lifecycle planning aligned with OAIS and FAIR principles."
        },
        {
          title: "Open Access",
          description: "Non-exclusive rights; machine-readable licenses; public APIs; multilingual interfaces to broaden participation."
        },
        {
          title: "Interdisciplinarity",
          description: "Co-designed projects with historians, sociologists, linguists, and data scientists; mixed-methods research protocols."
        },
        {
          title: "Ethical Responsibility",
          description: "Culturally sensitive access models; community consultation; privacy-by-design for contemporary materials."
        },
        {
          title: "Public Engagement",
          description: "Exhibitions, workshops, and teacher resources that translate research into inclusive learning."
        }
      ]
    }
  },
  fr: {
    hero: {
      highlight: "Bienvenue",
      title: "à la Fondation de recherche Abdelaziz Khallouk Temsamani",
      description:
        "Nous faisons progresser une recherche rigoureuse sur le Maroc et l'Afrique du Nord en reliant les méthodes classiques aux humanités numériques. Nous préservons, analysons et partageons le savoir avec la communauté académique mondiale tout en prolongeant l'héritage du Dr Abdelaziz Khallouk Temsamani.",
      ctaLabel: "En savoir plus sur le Dr Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "Histoire de la fondation",
      paragraphs: [
        "La Fondation a été créée pour prolonger et enrichir l'héritage académique du Dr Abdelaziz Khallouk Temsamani, dont le travail pionnier sur le Maroc et l'Afrique du Nord défendait la recherche archivistique, l'histoire intellectuelle et l'analyse culturelle. Inspirée par son engagement auprès des jeunes chercheurs et par la sauvegarde des sources fragiles, la Fondation structure des programmes de conservation, de recherche et de diffusion en accès ouvert.",
        "Dès l'origine, la Fondation s'est positionnée comme un gardien de confiance du patrimoine documentaire et comme un carrefour d'enquêtes interdisciplinaires, reliant historiens, sociologues, anthropologues, linguistes, spécialistes du numérique et sciences de l'information à travers régions et institutions."
      ],
      imageAlt: "Bâtiment de la fondation"
    },
    pillars: [
      {
        key: "mission",
        title: "Mission",
        intro:
          "Faire progresser une recherche ouverte, éthique et exigeante sur le Maroc et l'Afrique du Nord grâce à la préservation, l'analyse critique et des infrastructures numériques solides.",
        bullets: [
          "Numériser et préserver les matériaux fragiles selon des standards archivistiques.",
          "Accompagner les chercheurs par des formations, des bourses et des résidences de recherche.",
          "Publier en accès ouvert des jeux de données, des éditions et des outils réutilisables.",
          "Intégrer l'IA de façon responsable pour renforcer, et non remplacer, les sciences humaines."
        ]
      },
      {
        key: "vision",
        title: "Vision",
        intro: "Un écosystème de recherche où la tradition et l'innovation numérique se renforcent.",
        bullets: [
          "Accès fiable aux sources primaires via des plateformes durables.",
          "Réseaux régionaux et internationaux plus solides pour la co-publication.",
          "Excellence méthodologique qui combine philologie et calcul.",
          "Recommandations éclairées pour les politiques publiques ancrées dans l'histoire."
        ]
      },
      {
        key: "values",
        title: "Valeurs",
        intro: "Des principes qui guident notre manière de collaborer et de partager le savoir.",
        bullets: [
          "Intégrité dans la citation, la conservation et l'ouverture des collections.",
          "Collaboration entre langues, disciplines et frontières.",
          "Réciprocité avec les communautés dont nous préservons les histoires.",
          "Équilibre attentif entre accès, confidentialité et conservation."
        ]
      }
    ],
    goals: {
      title: "Objectifs",
      subtitle: "Nous mettons en œuvre nos engagements par des politiques claires, des processus transparents et des standards mesurables.",
      cards: [
        {
          title: "Rigueur scientifique",
          description:
            "Relecture par les pairs des éditions et jeux de données; respect des standards de citation et de provenance; transparence méthodologique dans toutes les publications."
        },
        {
          title: "Préservation responsable",
          description: "Numérisation de niveau archivistique; contrôles d'intégrité; stockage redondant; planification du cycle de vie alignée sur les principes OAIS et FAIR."
        },
        {
          title: "Accès ouvert",
          description: "Droits non exclusifs; licences lisibles par machine; API publiques; interfaces multilingues pour élargir la participation."
        },
        {
          title: "Interdisciplinarité",
          description: "Projets co-conçus avec historiens, sociologues, linguistes et scientifiques des données; protocoles de recherche mixtes."
        },
        {
          title: "Responsabilité éthique",
          description: "Modèles d'accès adaptés aux contextes culturels; consultation des communautés; confidentialité intégrée pour les matériaux contemporains."
        },
        {
          title: "Engagement du public",
          description: "Expositions, ateliers et ressources pédagogiques qui transforment la recherche en apprentissage inclusif."
        }
      ]
    }
  },
  es: {
    hero: {
      highlight: "Bienvenidos",
      title: "a la Fundación de Investigación Abdelaziz Khallouk Temsamani",
      description:
        "Impulsamos una investigación rigurosa sobre Marruecos y el norte de África uniendo los métodos clásicos con las humanidades digitales. Preservamos, analizamos y compartimos el conocimiento con la comunidad académica mundial mientras prolongamos el legado del Dr. Abdelaziz Khallouk Temsamani.",
      ctaLabel: "Leer más sobre el Dr. Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "Historia de la fundación",
      paragraphs: [
        "La Fundación se creó para mantener y ampliar el legado académico del Dr. Abdelaziz Khallouk Temsamani, cuya labor pionera sobre Marruecos y el norte de África defendía la investigación archivística rigurosa, la historia intelectual y el análisis cultural. Inspirada por su compromiso con los jóvenes investigadores y la protección de fuentes frágiles, la Fundación organiza programas de preservación, investigación y difusión en acceso abierto.",
        "Desde su inicio, la Fundación se ha posicionado como un custodio confiable del patrimonio documental y como un centro de investigación interdisciplinaria, conectando a historiadores, sociólogos, antropólogos, lingüistas, humanistas digitales y especialistas de la información en distintas regiones e instituciones."
      ],
      imageAlt: "Edificio de la fundación"
    },
    pillars: [
      {
        key: "mission",
        title: "Misión",
        intro:
          "Avanzar una investigación abierta, ética y de alta calidad sobre Marruecos y el norte de África mediante preservación, análisis crítico e infraestructura digital.",
        bullets: [
          "Digitalizar y preservar materiales vulnerables con estándares archivísticos.",
          "Apoyar a los investigadores con formaciones, becas y residencias.",
          "Publicar conjuntos de datos, ediciones y herramientas en acceso abierto.",
          "Integrar la IA de manera responsable para reforzar, y no reemplazar, la investigación humanística."
        ]
      },
      {
        key: "vision",
        title: "Visión",
        intro: "Un ecosistema donde la investigación tradicional y la innovación digital se refuercen mutuamente.",
        bullets: [
          "Acceso fiable a fuentes primarias mediante plataformas sostenibles.",
          "Redes regionales e internacionales más fuertes para la coautoría.",
          "Excelencia metodológica que combina filología y computación.",
          "Recomendaciones de políticas basadas en evidencias históricas."
        ]
      },
      {
        key: "values",
        title: "Valores",
        intro: "Principios que guían cómo colaboramos y compartimos conocimiento.",
        bullets: [
          "Integridad en la citación, custodia y apertura de las colecciones.",
          "Colaboración entre idiomas, disciplinas y fronteras.",
          "Reciprocidad con las comunidades cuyas historias preservamos.",
          "Equilibrio cuidadoso entre acceso, privacidad y conservación."
        ]
      }
    ],
    goals: {
      title: "Objetivos",
      subtitle: "Aplicamos nuestros compromisos mediante políticas claras, procesos transparentes y estándares medibles.",
      cards: [
        {
          title: "Rigor académico",
          description:
            "Revisión por pares de ediciones y conjuntos de datos; cumplimiento de estándares de citación y procedencia; transparencia metodológica en todas las publicaciones."
        },
        {
          title: "Custodia y preservación",
          description: "Digitalización con calidad de archivo; verificaciones de integridad; almacenamiento redundante; planificación del ciclo de vida alineada con OAIS y FAIR."
        },
        {
          title: "Acceso abierto",
          description: "Derechos no exclusivos; licencias legibles por máquina; API públicas; interfaces multilingües para ampliar la participación."
        },
        {
          title: "Interdisciplinariedad",
          description: "Proyectos codiseñados con historiadores, sociólogos, lingüistas y científicos de datos; protocolos de investigación mixtos."
        },
        {
          title: "Responsabilidad ética",
          description: "Modelos de acceso sensibles a la cultura; consulta con comunidades; privacidad integrada para materiales contemporáneos."
        },
        {
          title: "Participación pública",
          description: "Exposiciones, talleres y recursos docentes que traducen la investigación en aprendizaje inclusivo."
        }
      ]
    }
  },
  ar: {
    hero: {
      highlight: "أهلاً بكم",
      title: "في مؤسسة عبد العزيز خلوق تمسماني للبحث",
      description:
        "نطوّر البحث الرصين حول المغرب وشمال إفريقيا بدمج المناهج الكلاسيكية مع الإنسانيات الرقمية. نحفظ المعرفة ونحللها ونتقاسمها مع المجتمع الأكاديمي العالمي مع مواصلة إرث الدكتور عبد العزيز خلوق تمسماني.",
      ctaLabel: "قراءة المزيد عن الدكتور تمسماني",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "تاريخ المؤسسة",
      paragraphs: [
        "أُنشئت المؤسسة للحفاظ على الإرث الأكاديمي للدكتور عبد العزيز خلوق تمسماني وتطويره. لقد دافع عمله الرائد في دراسات المغرب وشمال إفريقيا عن البحث الأرشيفي الدقيق، والتاريخ الفكري، والتحليل الثقافي. انطلاقاً من التزامه بتأطير الباحثين الشباب وحماية المصادر الهشة، تضع المؤسسة برامج منهجية للحفظ والبحث والنشر المفتوح.",
        "منذ البداية، رسخت المؤسسة نفسها كوصي موثوق على التراث الوثائقي وكمركز للبحث البيني، يربط المؤرخين وعلماء الاجتماع والأنثروبولوجيا واللغويين والمتخصصين في الإنسانيات الرقمية وعلوم المعلومات عبر المناطق والمؤسسات."
      ],
      imageAlt: "مبنى المؤسسة البحثية"
    },
    pillars: [
      {
        key: "mission",
        title: "الرسالة",
        intro: "تطوير بحث مفتوح وأخلاقي وعالي الجودة حول المغرب وشمال إفريقيا من خلال الحفظ، والتحليل النقدي، والبنى الرقمية.",
        bullets: [
          "رقمنة المواد الهشة وحفظها وفق المعايير الأرشيفية.",
          "تمكين الباحثين عبر التدريب والمنح والإقامات البحثية.",
          "نشر قواعد بيانات وإصدارات وأدوات متاحة لإعادة الاستخدام.",
          "دمج الذكاء الاصطناعي بمسؤولية لدعم، لا لاستبدال، البحث الإنساني."
        ]
      },
      {
        key: "vision",
        title: "الرؤية",
        intro: "منظومة بحثية يتعزز فيها التراث الأكاديمي بالابتكار الرقمي لتبقى المعرفة في المتناول.",
        bullets: [
          "وصول موثوق إلى المصادر الأولية عبر منصات مستدامة.",
          "شبكات إقليمية ودولية أقوى للتأليف المشترك.",
          "تفوق منهجي يجمع بين الفيلولوجيا والحوسبة.",
          "رؤى سياساتية مبنية على تحليل تاريخي موثق."
        ]
      },
      {
        key: "values",
        title: "القيم",
        intro: "مبادئ توجه تعاوننا وطريقة مشاركة المعرفة.",
        bullets: [
          "النزاهة في التوثيق وحفظ المجموعات وإتاحة الوصول إليها.",
          "التعاون عبر اللغات والتخصصات والحدود.",
          "التعامل بالمثل مع المجتمعات التي نحفظ تاريخها.",
          "موازنة مدروسة بين الإتاحة والخصوصية والحفاظ."
        ]
      }
    ],
    goals: {
      title: "الأهداف",
      subtitle: "نحوّل التزاماتنا إلى واقع عبر سياسات واضحة، ومسارات عمل شفافة، ومعايير قابلة للقياس.",
      cards: [
        {
          title: "صرامة علمية",
          description: "مراجعة الأقران للإصدارات وقواعد البيانات؛ الالتزام بمعايير الإسناد والتوثيق؛ شفافية منهجية في كل المنشورات."
        },
        {
          title: "رعاية الحفظ",
          description: "رقمنة بمعايير أرشيفية؛ فحوص سلامة دورية؛ تخزين متعدد النسخ؛ تخطيط عمر افتراضي وفق مبادئ OAIS و FAIR."
        },
        {
          title: "وصول مفتوح",
          description: "حقوق غير حصرية؛ تراخيص قابلة للقراءة آلياً؛ واجهات برمجة عامة؛ واجهات متعددة اللغات لتوسيع المشاركة."
        },
        {
          title: "تعدد التخصصات",
          description: "مشاريع مصممة مع مؤرخين وعلماء اجتماع ولسانيين وعلماء بيانات؛ بروتوكولات بحثية متنوعة."
        },
        {
          title: "مسؤولية أخلاقية",
          description: "نماذج إتاحة تراعي الخصوصيات الثقافية؛ تشاور مجتمعي؛ خصوصية مدمجة للمواد المعاصرة."
        },
        {
          title: "انخراط مجتمعي",
          description: "معارض وورش عمل وموارد تعليمية تنقل البحث إلى تعلّم شامل."
        }
      ]
    }
  }
};

export function getAboutFoundationContent(locale: Locale): AboutFoundationContent {
  return aboutFoundationContent[locale] ?? aboutFoundationContent[defaultLocale];
}

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
      highlight: "From legacy to institution",
      title: "Abdelaziz Khallouk Temsamani Foundation for Scientific Research",
      description:
        "The Foundation extends the scholarly memory of a historian who made documents and archives a path toward rereading the history of Tangier and Northern Morocco. It preserves documentary heritage, facilitates access to knowledge, and supports rigorous research in history and the humanities through an open and responsible digital horizon.",
      ctaLabel: "Read more about Dr. Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "From Legacy to Institution",
      paragraphs: [
        "The Foundation exists to carry forward a scholarly legacy rooted in documents, archives, and the historical memory of Tangier and Northern Morocco. It treats Dr. Temsamani's work not as a commemorative reference only, but as a living intellectual project that can continue through preservation, study, publication, and access.",
        "Its role is to turn documentary and scholarly material into a structured space for research and formation, linking historians and researchers with the possibilities of digitization, cataloguing, and open access. In this sense, the Foundation works to preserve memory, organize resources, and bring reliable documents and studies closer to students, scholars, and interested readers."
      ],
      imageAlt: "Research and documentary space of the Foundation"
    },
    pillars: [
      {
        key: "mission",
        title: "Mission",
        intro:
          "To preserve the documentary and scholarly heritage connected to Tangier and Northern Morocco, and make it organized, accessible, and useful for rigorous academic research.",
        bullets: [
          "Digitize documents, manuscripts, journals, and scholarly materials related to the region's history.",
          "Organize and catalogue archives so they can be searched and used responsibly.",
          "Support students and researchers with reliable sources and clear research pathways.",
          "Strengthen the culture of documentation, citation, and respect for knowledge sources."
        ]
      },
      {
        key: "vision",
        title: "Vision",
        intro:
          "To build a knowledge space where documentary memory becomes a foundation for research, and where digital tools help preserve and share heritage without weakening scholarly rigor.",
        bullets: [
          "Provide a multilingual digital library for researchers and interested readers.",
          "Connect the history of Tangier and Northern Morocco to its national and Mediterranean contexts.",
          "Develop modern research tools that help users read and understand documents.",
          "Transform Dr. Temsamani's legacy into a continuous institutional project."
        ]
      },
      {
        key: "values",
        title: "Values",
        intro: "The Foundation treats knowledge as a scholarly and ethical responsibility before it is a published resource.",
        bullets: [
          "Integrity in handling documents, sources, and citations.",
          "Rigor in research, cataloguing, publishing, and presentation.",
          "Openness to researchers and scholarly institutions in Morocco and abroad.",
          "Protection of local and national memory from simplification and loss."
        ]
      }
    ],
    goals: {
      title: "Fields of Action",
      subtitle: "The Foundation translates its mission into practical work that brings together documentary preservation, academic research, publishing, and access to knowledge.",
      cards: [
        {
          title: "Digital Library",
          description:
            "Gathering books, journals, articles, and digital documents in an organized space that enables access to reliable sources on Tangier and Northern Morocco."
        },
        {
          title: "Archive Preservation",
          description: "Preserving, classifying, and cataloguing documentary material while keeping each item connected to its historical context."
        },
        {
          title: "Research Support",
          description: "Encouraging rigorous studies based on documents and critical rereading, away from reduction and ready-made judgments."
        },
        {
          title: "Publishing and Journals",
          description: "Highlighting scholarly work connected to Dr. Temsamani's school and to journals that served Tangier's history and Moroccan memory."
        },
        {
          title: "Academic Events",
          description: "Organizing seminars, exhibitions, and workshops that bring historical documents closer to researchers, students, and the public."
        },
        {
          title: "Intelligent Assistant",
          description: "Using responsible digital assistance to improve discovery, orientation, and access while keeping the researcher and critical method at the center."
        }
      ]
    }
  },
  fr: {
    hero: {
      highlight: "De l'héritage à l'institution",
      title: "Fondation Abdelaziz Khallouk Temsamani pour la recherche scientifique",
      description:
        "La Fondation prolonge la mémoire scientifique d'un historien qui a fait du document et de l'archive une voie pour relire l'histoire de Tanger et du Nord du Maroc. Elle préserve le patrimoine documentaire, facilite l'accès au savoir et soutient une recherche rigoureuse en histoire et en sciences humaines dans un horizon numérique ouvert et responsable.",
      ctaLabel: "En savoir plus sur le Dr Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "De l'héritage à l'institution",
      paragraphs: [
        "La Fondation existe pour porter plus loin un héritage scientifique ancré dans les documents, les archives et la mémoire historique de Tanger et du Nord du Maroc. Elle ne considère pas l'œuvre du Dr Temsamani comme une simple référence commémorative, mais comme un projet intellectuel vivant appelé à se poursuivre par la conservation, l'étude, la publication et l'accès.",
        "Son rôle est de transformer les matériaux documentaires et scientifiques en un espace structuré de recherche et de formation, reliant les historiens et les chercheurs aux possibilités de la numérisation, du catalogage et de l'accès ouvert."
      ],
      imageAlt: "Espace de recherche et de documentation de la Fondation"
    },
    pillars: [
      {
        key: "mission",
        title: "Mission",
        intro:
          "Préserver le patrimoine documentaire et scientifique lié à Tanger et au Nord du Maroc, et le rendre organisé, accessible et utile à la recherche académique rigoureuse.",
        bullets: [
          "Numériser les documents, manuscrits, revues et matériaux scientifiques liés à l'histoire de la région.",
          "Organiser et cataloguer les archives pour faciliter leur recherche et leur usage scientifique.",
          "Accompagner les étudiants et chercheurs avec des sources fiables et des parcours de lecture clairs.",
          "Renforcer la culture de la documentation, de la citation et du respect des sources."
        ]
      },
      {
        key: "vision",
        title: "Vision",
        intro: "Construire un espace de connaissance où la mémoire documentaire fonde la recherche, et où le numérique aide à préserver et diffuser le patrimoine sans affaiblir la rigueur scientifique.",
        bullets: [
          "Mettre à disposition une bibliothèque numérique multilingue.",
          "Relier l'histoire de Tanger et du Nord du Maroc à ses contextes nationaux et méditerranéens.",
          "Développer des outils modernes d'aide à la lecture et à la compréhension des documents.",
          "Transformer l'héritage du Dr Temsamani en projet institutionnel continu."
        ]
      },
      {
        key: "values",
        title: "Valeurs",
        intro: "La Fondation considère la connaissance comme une responsabilité scientifique et éthique avant d'être une ressource publiée.",
        bullets: [
          "Intégrité dans le traitement des documents, des sources et des références.",
          "Rigueur dans la recherche, le catalogage, la publication et la présentation.",
          "Ouverture aux chercheurs et institutions scientifiques au Maroc et à l'étranger.",
          "Protection de la mémoire locale et nationale contre la simplification et l'oubli."
        ]
      }
    ],
    goals: {
      title: "Champs d'action",
      subtitle: "La Fondation traduit sa mission en projets concrets associant conservation documentaire, recherche académique, publication et accès au savoir.",
      cards: [
        {
          title: "Bibliothèque numérique",
          description:
            "Réunir livres, revues, articles et documents numériques dans un espace organisé donnant accès à des sources fiables sur Tanger et le Nord du Maroc."
        },
        {
          title: "Préservation des archives",
          description: "Conserver, classer et cataloguer les matériaux documentaires en maintenant leur lien avec leur contexte historique."
        },
        {
          title: "Soutien à la recherche",
          description: "Encourager des études rigoureuses fondées sur le document et sur une relecture critique de l'histoire."
        },
        {
          title: "Publication et revues",
          description: "Valoriser les travaux liés à l'école du Dr Temsamani et aux revues qui ont servi l'histoire de Tanger et la mémoire marocaine."
        },
        {
          title: "Événements scientifiques",
          description: "Organiser séminaires, expositions et ateliers rapprochant les documents historiques des chercheurs, étudiants et lecteurs."
        },
        {
          title: "Assistant intelligent",
          description: "Utiliser une assistance numérique responsable pour améliorer la découverte, l'orientation et l'accès, sans remplacer le chercheur ni la méthode critique."
        }
      ]
    }
  },
  es: {
    hero: {
      highlight: "Del legado a la institución",
      title: "Fundación Abdelaziz Khallouk Temsamani para la investigación científica",
      description:
        "La Fundación prolonga la memoria científica de un historiador que hizo del documento y del archivo una vía para releer la historia de Tánger y del norte de Marruecos. Preserva el patrimonio documental, facilita el acceso al conocimiento y apoya una investigación rigurosa en historia y humanidades dentro de un horizonte digital abierto y responsable.",
      ctaLabel: "Leer más sobre el Dr. Temsamani",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "Del legado a la institución",
      paragraphs: [
        "La Fundación existe para proyectar un legado científico arraigado en los documentos, los archivos y la memoria histórica de Tánger y del norte de Marruecos. No considera la obra del Dr. Temsamani como una simple referencia conmemorativa, sino como un proyecto intelectual vivo que continúa mediante conservación, estudio, publicación y acceso.",
        "Su función es transformar los materiales documentales y científicos en un espacio estructurado de investigación y formación, conectando a historiadores e investigadores con las posibilidades de la digitalización, la catalogación y el acceso abierto."
      ],
      imageAlt: "Espacio de investigación y documentación de la Fundación"
    },
    pillars: [
      {
        key: "mission",
        title: "Misión",
        intro:
          "Preservar el patrimonio documental y científico vinculado a Tánger y al norte de Marruecos, y convertirlo en material organizado, accesible y útil para la investigación académica rigurosa.",
        bullets: [
          "Digitalizar documentos, manuscritos, revistas y materiales científicos relacionados con la historia de la región.",
          "Organizar y catalogar archivos para facilitar la búsqueda y el uso científico.",
          "Apoyar a estudiantes e investigadores con fuentes fiables y rutas de lectura claras.",
          "Fortalecer la cultura de la documentación, la cita y el respeto de las fuentes."
        ]
      },
      {
        key: "vision",
        title: "Visión",
        intro: "Construir un espacio de conocimiento donde la memoria documental fundamente la investigación y las herramientas digitales ayuden a preservar y difundir el patrimonio sin debilitar el rigor científico.",
        bullets: [
          "Ofrecer una biblioteca digital multilingüe para investigadores y lectores interesados.",
          "Relacionar la historia de Tánger y del norte de Marruecos con sus contextos nacionales y mediterráneos.",
          "Desarrollar herramientas modernas que ayuden a leer y comprender documentos.",
          "Convertir el legado del Dr. Temsamani en un proyecto institucional continuo."
        ]
      },
      {
        key: "values",
        title: "Valores",
        intro: "La Fundación entiende el conocimiento como una responsabilidad científica y ética antes que como un simple recurso publicado.",
        bullets: [
          "Integridad en el trato con documentos, fuentes y referencias.",
          "Rigor en la investigación, catalogación, publicación y presentación.",
          "Apertura a investigadores e instituciones científicas dentro y fuera de Marruecos.",
          "Protección de la memoria local y nacional frente a la simplificación y la pérdida."
        ]
      }
    ],
    goals: {
      title: "Campos de acción",
      subtitle: "La Fundación traduce su misión en proyectos concretos que combinan preservación documental, investigación académica, publicación y acceso al conocimiento.",
      cards: [
        {
          title: "Biblioteca digital",
          description:
            "Reunir libros, revistas, artículos y documentos digitales en un espacio organizado que facilite el acceso a fuentes fiables sobre Tánger y el norte de Marruecos."
        },
        {
          title: "Preservación de archivos",
          description: "Conservar, clasificar y catalogar materiales documentales manteniendo su vínculo con el contexto histórico."
        },
        {
          title: "Apoyo a la investigación",
          description: "Fomentar estudios rigurosos basados en documentos y en una relectura crítica de la historia."
        },
        {
          title: "Publicación y revistas",
          description: "Poner en valor trabajos vinculados a la escuela del Dr. Temsamani y a las revistas que sirvieron la historia de Tánger y la memoria marroquí."
        },
        {
          title: "Eventos académicos",
          description: "Organizar seminarios, exposiciones y talleres que acerquen los documentos históricos a investigadores, estudiantes y lectores."
        },
        {
          title: "Asistente inteligente",
          description: "Usar asistencia digital responsable para mejorar el descubrimiento, la orientación y el acceso sin reemplazar al investigador ni al método crítico."
        }
      ]
    }
  },
  ar: {
    hero: {
      highlight: " في صون الذاكرة وخدمة البحث العلمي : ",
      title: "مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي",
      description:
        "تنهض المؤسسة بوصفها امتداداً علمياً لذاكرة مؤرخ جعل من الوثيقة والأرشيف مدخلاً إلى إعادة قراءة تاريخ طنجة وشمال المغرب. وتسعى إلى حفظ التراث الوثائقي، وتيسير الوصول إلى المعرفة، ودعم البحث الرصين في التاريخ والعلوم الإنسانية، ضمن أفق رقمي منفتح ومسؤول.",
      ctaLabel: "التعرّف إلى مسار الدكتور التمسماني",
      ctaHref: "/dr-temsamani"
    },
    history: {
      title: "من الإرث العلمي إلى البناء المؤسسي",
      paragraphs: [
        "تأسست مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي استلهاماً لمسار مؤرخ كرّس حياته للبحث في الوثيقة، واستنطاق الأرشيف، وإعادة الاعتبار لذاكرة طنجة وشمال المغرب. فهي لا تنظر إلى إرثه بوصفه ذكرى شخصية فحسب، بل تعتبره مشروعاً معرفياً قابلاً للاستمرار عبر الحفظ، والدراسة، والنشر، والإتاحة.",
        "تسعى المؤسسة إلى تحويل المادة الوثائقية والعلمية إلى فضاء حي للبحث والتكوين، يربط بين عمل المؤرخين والباحثين، وبين إمكانات الرقمنة والفهرسة والوصول المفتوح. ومن هذا المنطلق، تشتغل المؤسسة على صيانة الذاكرة، وتنظيم الموارد، وتقريب الوثائق والدراسات من الطلبة والباحثين والمهتمين."
      ],
      imageAlt: "فضاء بحثي ووثائقي تابع للمؤسسة"
    },
    pillars: [
      {
        key: "mission",
        title: "الرسالة",
        intro:
          "حفظ الإرث الوثائقي والعلمي المتصل بتاريخ طنجة وشمال المغرب، وجعله مادة منظمة ومتاحة لخدمة البحث الأكاديمي الرصين.",
        bullets: [
          "رقمنة الوثائق والمخطوطات والدوريات والمواد العلمية ذات الصلة بتاريخ المنطقة.",
          "تنظيم الأرشيف وفهرسته بما يضمن سهولة البحث والاستعمال العلمي.",
          "دعم الباحثين والطلبة بمصادر موثوقة ومسارات قراءة واضحة.",
          "تعزيز ثقافة التوثيق، والإحالة، واحترام مصادر المعرفة."
        ]
      },
      {
        key: "vision",
        title: "الرؤية",
        intro:
          "بناء فضاء معرفي يجعل من الذاكرة الوثائقية أساساً للبحث، ومن الرقمنة وسيلة لصون التراث وإشاعته دون التفريط في الصرامة العلمية.",
        bullets: [
          "إتاحة مكتبة رقمية متعددة اللغات تخدم الباحثين والمهتمين.",
          "ربط تاريخ طنجة وشمال المغرب بسياقاته الوطنية والمتوسطية.",
          "تطوير أدوات بحث حديثة تساعد على قراءة الوثائق وفهمها.",
          "تحويل إرث الدكتور التمسماني إلى مشروع مؤسسي مستمر."
        ]
      },
      {
        key: "values",
        title: "القيم",
        intro:
          "تستند المؤسسة إلى جملة من المبادئ التي تجعل المعرفة مسؤولية علمية وأخلاقية قبل أن تكون مجرد مادة منشورة.",
        bullets: [
          "الأمانة في التعامل مع الوثيقة والمصدر والإحالة.",
          "الصرامة في البحث، والفهرسة، والنشر، والتقديم.",
          "الانفتاح على الباحثين والمؤسسات العلمية داخل المغرب وخارجه.",
          "صيانة الذاكرة المحلية والوطنية من التبسيط والضياع."
        ]
      }
    ],
    goals: {
      title: "مجالات العمل",
      subtitle:
        "تترجم المؤسسة رسالتها من خلال مشاريع عملية تجمع بين الحفظ الوثائقي، والبحث الأكاديمي، والنشر، وإتاحة المعرفة للقراء والباحثين.",
      cards: [
        {
          title: "المكتبة الرقمية",
          description:
            "تجميع الكتب، والدوريات، والمقالات، والوثائق الرقمية في فضاء منظم يتيح البحث والوصول إلى مصادر موثوقة حول تاريخ طنجة وشمال المغرب."
        },
        {
          title: "الأرشيف والتوثيق",
          description:
            "حفظ المواد الوثائقية وتصنيفها وفهرستها، مع العناية بسياقاتها التاريخية حتى لا تتحول الوثيقة إلى صورة معزولة عن معناها العلمي."
        },
        {
          title: "البحث العلمي",
          description:
            "تشجيع الدراسات الرصينة التي تعتمد الوثيقة، وتعيد قراءة تاريخ المنطقة بعيداً عن الاختزال والأحكام الجاهزة."
        },
        {
          title: "النشر والدوريات",
          description:
            "إبراز التراث العلمي المتصل بمدرسة الدكتور التمسماني، والعناية بالدوريات والمساهمات التي خدمت تاريخ طنجة والذاكرة المغربية."
        },
        {
          title: "المساعد الذكي",
          description:
            "توظيف المساعدة الرقمية المسؤولة لتحسين الاكتشاف والتوجيه والوصول إلى الوثائق والمحتوى العلمي، مع الحفاظ على مركزية الباحث والمنهج النقدي."
        },
        {
          title: "الأنشطة العلمية",
          description:
            "تنظيم لقاءات وندوات ومعارض وورشات تُقرب الوثيقة التاريخية من الباحثين والطلبة والمهتمين، وتعيد وصل المعرفة بمحيطها الثقافي."
        }
      ]
    }
  }
};

export function getAboutFoundationContent(locale: Locale): AboutFoundationContent {
  return aboutFoundationContent[locale] ?? aboutFoundationContent[defaultLocale];
}

const DEFAULT_LOCALE = "en";

const SERVICES_CONTENT = {
  "academic-consultations": {
    en: {
      title: "Academic Consultations & Guidance",
      intro:
        "Book focused time with our research advisors to align your project goals, sources, and methodology with the Foundation's collections.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "One-to-one consultations led by subject specialists who understand the depth of the Foundation archive.",
            "Each session results in practical recommendations: priority collections to review, methodological adjustments, and suggested next steps."
          ]
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Early-career researchers refining their proposals or framing new questions.",
            "Experienced scholars who need to verify sources, triangulate materials, or validate their research design before field work."
          ]
        },
        {
          title: "How to request a session",
          paragraphs: [
            "Submit a short summary of your project and the support you need via the researcher contact form.",
            "Our coordination team will respond with available time slots and any background notes to prepare ahead of the consultation."
          ]
        }
      ]
    },
    fr: {
      title: "Consultations académiques et accompagnement",
      intro:
        "Planifiez un rendez-vous ciblé avec nos conseillers pour aligner vos objectifs, vos sources et votre méthode avec les fonds de la Fondation.",
      heroImage: null,
      bodySections: [
        {
          title: "Ce que nous offrons",
          paragraphs: [
            "Des échanges individuels animés par des spécialistes qui connaissent la profondeur des archives de la Fondation.",
            "Chaque session aboutit à des recommandations pratiques : collections à consulter en priorité, ajustements méthodologiques et prochaines étapes."
          ]
        },
        {
          title: "Pour qui",
          paragraphs: [
            "Chercheurs en début de parcours qui affinent leur projet ou posent de nouvelles questions.",
            "Chercheurs confirmés qui souhaitent vérifier des sources, croiser des matériaux ou valider leur dispositif avant le terrain."
          ]
        },
        {
          title: "Comment réserver",
          paragraphs: [
            "Soumettez un bref résumé de votre projet et du soutien souhaité via le formulaire de contact.",
            "L’équipe de coordination répondra avec des créneaux disponibles et des indications pour préparer la consultation."
          ]
        }
      ]
    },
    es: {
      title: "Consultorías académicas y orientación",
      intro:
        "Agenda una sesión con nuestros asesores para alinear tus objetivos, fuentes y metodología con las colecciones de la Fundación.",
      heroImage: null,
      bodySections: [
        {
          title: "Qué ofrecemos",
          paragraphs: [
            "Asesorías individuales dirigidas por especialistas que dominan la amplitud del archivo de la Fundación.",
            "Cada sesión termina con recomendaciones prácticas: colecciones prioritarias, ajustes metodológicos y próximos pasos."
          ]
        },
        {
          title: "Para quién",
          paragraphs: [
            "Investigadores en etapas tempranas afinando sus propuestas o planteando nuevas preguntas.",
            "Académicos experimentados que necesitan verificar fuentes, triangular materiales o validar el diseño antes del trabajo de campo."
          ]
        },
        {
          title: "Cómo solicitar",
          paragraphs: [
            "Envía un breve resumen de tu proyecto y el apoyo que necesitas mediante el formulario de contacto.",
            "El equipo de coordinación responderá con horarios disponibles y notas previas para preparar la sesión."
          ]
        }
      ]
    },
    ar: {
      title: "الاستشارات الأكاديمية والتوجيه العلمي",
      intro:
        "تتيح المؤسسة للباحثين فرصة الحصول على استشارة علمية فردية مع مختصين على دراية واسعة بأرشيفها ومصادرها، لمواءمة أهداف المشروع البحثي وأسئلته مع المادة المتوفرة، وضبط منهجيته بما يخدم تقدمه نحو التحقيق والكتابة.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "جلسات استشارية فردية يقدمها مختصون على معرفة دقيقة بمحتويات أرشيف المؤسسة ومصادره المتنوعة.",
            "تنتهي كل جلسة بتوصيات عملية واضحة: تحديد المجموعات ذات الأولوية، اقتراح تعديلات منهجية، وتحديد الخطوات المقبلة في المشروع."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون المبتدئون الذين يعملون على صقل مشاريعهم البحثية أو بلورة أسئلة جديدة.",
            "الباحثون المتخصصون الراغبون في التحقق من مصادرهم، أو تنظيم مادتهم، أو ضبط تصميم بحثهم قبل الشروع في العمل الميداني."
          ]
        },
        {
          title: "كيف تطلب جلسة استشارية",
          paragraphs: [
            "تواصلوا مع فريق المؤسسة عبر استمارة الاتصال، مع تقديم ملخص موجز لمشروعكم ونوع الدعم الذي تحتاجونه.",
            "سيتواصل معكم فريق التنسيق لتحديد موعد مناسب، وتزويدكم بإرشادات للاستعداد قبل الجلسة."
          ]
        }
      ]
    }
  },
  "researcher-support": {
    en: {
      title: "Researcher Support & Empowerment",
      intro:
        "Access tailored tools, training, and peer networks that keep your research moving from proposal to publication.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "Skills clinics on research design, data stewardship, and scholarly communication hosted by Foundation mentors.",
            "Toolkits and templates that simplify ethics submissions, archival requests, and project management."
          ]
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Researchers facing logistical hurdles, such as accessing restricted holdings or coordinating multi-site work.",
            "Scholars who want accountability partners and constructive peer feedback throughout the research lifecycle."
          ]
        },
        {
          title: "How to join the program",
          paragraphs: [
            "Register interest through the support intake form with a brief note on your current stage and challenges.",
            "We will match you with a mentor or cohort and share the next orientation date within five working days."
          ]
        }
      ]
    },
    fr: {
      title: "Soutien et autonomisation des chercheurs",
      intro:
        "Accédez à des outils, des formations et des réseaux pour avancer de la proposition à la publication.",
      heroImage: null,
      bodySections: [
        {
          title: "Ce que nous offrons",
          paragraphs: [
            "Ateliers sur la conception de recherche, la gestion des données et la communication scientifique animés par des mentors de la Fondation.",
            "Kits et modèles pour simplifier les dossiers d’éthique, les demandes d’archives et le pilotage de projet."
          ]
        },
        {
          title: "Pour qui",
          paragraphs: [
            "Chercheurs confrontés à des obstacles logistiques (accès restreint, coordination multi-sites).",
            "Équipes qui souhaitent un suivi pair-à-pair et des retours constructifs tout au long du cycle de recherche."
          ]
        },
        {
          title: "Comment rejoindre",
          paragraphs: [
            "Déclarez votre intérêt via le formulaire d’accueil avec une brève description de votre étape actuelle et de vos défis.",
            "Nous vous associerons à un mentor ou à une cohorte et partagerons la prochaine date d’orientation sous cinq jours ouvrables."
          ]
        }
      ]
    },
    es: {
      title: "Apoyo y empoderamiento para investigadores",
      intro:
        "Accede a herramientas, formación y redes para avanzar desde la propuesta hasta la publicación.",
      heroImage: null,
      bodySections: [
        {
          title: "Qué ofrecemos",
          paragraphs: [
            "Clínicas de habilidades sobre diseño de investigación, gestión de datos y comunicación científica dirigidas por mentores de la Fundación.",
            "Kits y plantillas que simplifican solicitudes de ética, requerimientos de archivo y gestión de proyectos."
          ]
        },
        {
          title: "Para quién",
          paragraphs: [
            "Investigadores con retos logísticos como acceso a fondos restringidos o coordinación multi-sede.",
            "Equipos que quieren acompañamiento entre pares y retroalimentación constructiva durante todo el ciclo de investigación."
          ]
        },
        {
          title: "Cómo unirse",
          paragraphs: [
            "Manifiesta tu interés mediante el formulario de soporte con una breve nota sobre tu etapa actual y desafíos.",
            "Asignaremos un mentor o cohorte y compartiremos la próxima fecha de orientación en un máximo de cinco días hábiles."
          ]
        }
      ]
    },
    ar: {
      title: "مواكبة الباحثين وتعزيز قدراتهم العلمية",
      intro:
        "ترافق المؤسسة الباحثين في مختلف مراحل مشروعهم العلمي، من صياغة المقترح البحثي وتصميم المنهجية إلى جمع المادة وتحليلها، عبر تكوينات متخصصة وإرشاد منهجي وشبكة من الخبراء والباحثين، بما يعزز جودة الإنتاج العلمي ويُيسّر مسار النشر والتعريف بالنتائج.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "دورات تكوينية وورش عمل في تصميم البحث وإدارة البيانات والتواصل العلمي، يشرف عليها مرشدون متخصصون من المؤسسة.",
            "أدلة ونماذج عملية تُبسّط إجراءات معتادة مثل طلبات الموافقات الأخلاقية والوصول إلى الأرشيف وإدارة المشاريع البحثية."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون الذين يواجهون تحديات لوجستية، كالوصول إلى مصادر مقيّدة أو العمل ضمن فرق متعددة المواقع.",
            "الفرق البحثية التي تحتاج إلى دعم من النظراء وملاحظات بنّاءة طوال مراحل المشروع البحثي."
          ]
        },
        {
          title: "كيف تستفيد من هذا الدعم",
          paragraphs: [
            "تواصلوا مع فريق المؤسسة عبر البريد الإلكتروني أو نموذج الاتصال، مع توضيح موجز لمرحلة مشروعكم البحثي والاحتياجات أو التحديات التي تواجهونها.",
            "سيقوم الفريق بدراسة طلبكم وتوجيهكم إلى المرشد أو مجموعة العمل المناسبة، وتحديد موعد الجلسة التوجيهية الأولى خلال خمسة أيام عمل."
          ]
        }
      ]
    }
  },
  "archive-search": {
    en: {
      title: "Specialized Archive Search Engine",
      intro:
        "An intelligent, advanced search tool that allows researchers, academics, and students to explore documents, manuscripts, journals, and academic sources within the Foundation's digital archive, quickly and accurately, with the ability to filter results by multiple criteria such as topic, time period, source type, and author—supporting every stage of the research process, from initial orientation and material gathering to verification, review, and final documentation.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "An advanced search engine covering documents, manuscripts, journals, and digital sources, with the ability to search by keywords, dates, topics, and authors.",
            "Carefully indexed and categorized results, with quick content previews and direct links to original sources where available."
          ]
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Researchers and academics seeking quick access to reliable sources on the history of Morocco and North Africa.",
            "Students and graduate researchers looking for primary references to support their theses and research."
          ]
        },
        {
          title: "How to use the search engine",
          paragraphs: [
            "Enter keywords or specific search criteria (topic, time period, document type) to access relevant results.",
            "Search results can be saved, or additional digital copies can be requested by contacting the Foundation's team directly."
          ]
        }
      ]
    },
    fr: {
      title: "Moteur de recherche spécialisé dans l'archive",
      intro:
        "Un outil de recherche intelligent et avancé permettant aux chercheurs, universitaires et étudiants d'explorer les documents, manuscrits, revues et sources académiques au sein de l'archive numérique de la Fondation, rapidement et avec précision, avec la possibilité de filtrer les résultats selon plusieurs critères tels que le sujet, la période, le type de source et l'auteur—accompagnant ainsi chaque étape du travail de recherche, depuis l'orientation initiale et la collecte de matériaux jusqu'à la vérification, le contrôle et la documentation finale.",
      heroImage: null,
      bodySections: [
        {
          title: "Ce que nous offrons",
          paragraphs: [
            "Un moteur de recherche avancé couvrant les documents, manuscrits, revues et sources numériques, avec recherche possible par mots-clés, dates, sujets et auteurs.",
            "Des résultats indexés et classés avec précision, avec aperçu rapide du contenu et liens directs vers les sources originales lorsque disponibles."
          ]
        },
        {
          title: "Pour qui",
          paragraphs: [
            "Chercheurs et universitaires souhaitant un accès rapide à des sources fiables sur l'histoire du Maroc et de l'Afrique du Nord.",
            "Étudiants et doctorants à la recherche de références primaires pour soutenir leurs thèses et travaux de recherche."
          ]
        },
        {
          title: "Comment utiliser le moteur",
          paragraphs: [
            "Entrez des mots-clés ou des critères de recherche spécifiques (sujet, période, type de document) pour accéder aux résultats pertinents.",
            "Les résultats de recherche peuvent être enregistrés, ou des copies numériques supplémentaires peuvent être demandées en contactant directement l'équipe de la Fondation."
          ]
        }
      ]
    },
    es: {
      title: "Motor de búsqueda especializado en el archivo",
      intro:
        "Una herramienta de búsqueda inteligente y avanzada que permite a investigadores, académicos y estudiantes explorar documentos, manuscritos, revistas y fuentes académicas dentro del archivo digital de la Fundación, de forma rápida y precisa, con la posibilidad de filtrar los resultados según múltiples criterios como tema, período, tipo de fuente y autor—acompañando así cada etapa del trabajo de investigación, desde la orientación inicial y la recopilación de materiales hasta la verificación, revisión y documentación final.",
      heroImage: null,
      bodySections: [
        {
          title: "Qué ofrecemos",
          paragraphs: [
            "Un motor de búsqueda avanzado que abarca documentos, manuscritos, revistas y fuentes digitales, con posibilidad de búsqueda por palabras clave, fechas, temas y autores.",
            "Resultados indexados y clasificados con precisión, con vista previa rápida del contenido y enlaces directos a las fuentes originales cuando estén disponibles."
          ]
        },
        {
          title: "Para quién",
          paragraphs: [
            "Investigadores y académicos que buscan acceso rápido a fuentes confiables sobre la historia de Marruecos y el norte de África.",
            "Estudiantes e investigadores de posgrado en busca de referencias primarias para respaldar sus tesis e investigaciones."
          ]
        },
        {
          title: "Cómo usar el motor",
          paragraphs: [
            "Introduce palabras clave o criterios de búsqueda específicos (tema, período, tipo de documento) para acceder a los resultados relevantes.",
            "Los resultados de búsqueda pueden guardarse, o pueden solicitarse copias digitales adicionales contactando directamente con el equipo de la Fundación."
          ]
        }
      ]
    },
    ar: {
      title: "محرك بحث متخصص في الأرشيف",
      intro:
        "أداة بحث ذكية ومتطورة تتيح للباحثين والأكاديميين والطلبة استكشاف الوثائق والمخطوطات والدوريات والمصادر الأكاديمية ضمن أرشيف المؤسسة الرقمي، بسرعة ودقة وسهولة، مع إمكانية تصفية النتائج وفق معايير متعددة كالموضوع والفترة الزمنية ونوع المصدر والمؤلف، بما يخدم مختلف مراحل العمل البحثي، من التوجيه الأولي وجمع المادة العلمية إلى التحقيق والتدقيق والتوثيق النهائي.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "محرك بحث متقدم يغطي الوثائق والمخطوطات والدوريات والمصادر الرقمية، مع إمكانية البحث بالكلمات المفتاحية والتواريخ والمواضيع والمؤلفين.",
            "نتائج مفهرسة ومصنّفة بدقة، مع معاينة سريعة للمحتوى وروابط مباشرة للمصادر الأصلية حيثما توفّر ذلك."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون والأكاديميون الراغبون في الوصول السريع إلى مصادر موثوقة حول تاريخ المغرب وشمال أفريقيا.",
            "الطلبة وطلاب الدراسات العليا الذين يبحثون عن مراجع أولية لدعم أطروحاتهم وأبحاثهم."
          ]
        },
        {
          title: "كيف تستخدم المحرك",
          paragraphs: [
            "أدخل كلمات مفتاحية أو معايير بحث محددة (الموضوع، الفترة الزمنية، نوع الوثيقة) للوصول إلى النتائج ذات الصلة.",
            "يمكن حفظ نتائج البحث أو طلب نسخ رقمية إضافية عبر التواصل مباشرة مع فريق المؤسسة."
          ]
        }
      ]
    }
  }
};

export const SERVICE_SLUGS = Object.keys(SERVICES_CONTENT);

export function getServiceContent(locale, slug) {
  const serviceLocales = SERVICES_CONTENT[slug];
  if (!serviceLocales) {
    return null;
  }

  const fallback = serviceLocales[DEFAULT_LOCALE] ?? {};
  const localized = (locale && serviceLocales[locale]) || fallback;

  const bodySections = Array.isArray(localized.bodySections)
    ? localized.bodySections
    : Array.isArray(fallback.bodySections)
      ? fallback.bodySections
      : [];

  return {
    ...fallback,
    ...localized,
    bodySections,
  };
}


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
      title: "الاستشارات الأكاديمية والتوجيه",
      intro:
        "احجز وقتاً مع مستشاري البحث لمواءمة أهداف مشروعك ومصادره ومنهجيته مع مجموعات المؤسسة.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "جلسات فردية يقدمها مختصون يعرفون عمق أرشيف المؤسسة.",
            "كل جلسة تنتهي بتوصيات عملية: مجموعات للأولوية، تعديلات منهجية وخطوات مقبلة."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون المبتدئون الذين يصقلون مشاريعهم أو يطرحون أسئلة جديدة.",
            "الباحثون المتخصصون الذين يريدون تأكيد المصادر أو تقطيع المواد أو تحقيق التصميم قبل العمل الميداني."
          ]
        },
        {
          title: "كيف تطلب جلسة",
          paragraphs: [
            "أرسل ملخصاً قصيراً لمشروعك وما تحتاجه من دعم عبر استمارة الاتصال.",
            "سترد فريقة التنسيق بمواعيد متاحة وإرشادات للاستعداد قبل الجلسة."
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
      title: "دعم الباحثين وتمكينهم",
      intro:
        "استفد من الأدوات والتدريب والشبكات لدعم بحثك من المقترح حتى النشر.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "دورات وورش عمل في تصميم البحث وإدارة البيانات والتواصل العلمي يشرف عليها مرشدون من المؤسسة.",
            "حزم ونماذج تبسّط مهام مثل طلبات الأخلاقيات والأرشيف وإدارة المشاريع."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون الذين يواجهون تحديات لوجستية مثل الوصول إلى مصادر مقيّدة أو العمل عبر مواقع متعددة.",
            "الفرق التي تحتاج إلى دعم من النظراء وملاحظات بنّاءة خلال كامل دورة البحث."
          ]
        },
        {
          title: "كيف تنضم",
          paragraphs: [
            "املأ نموذج الدعم بإيجاز عن مرحلتك الحالية وتحدياتك.",
            "سنختار لك مرشداً أو مجموعة ونوافيك بتاريخ التوجيه القادم خلال خمسة أيام عمل."
          ]
        }
      ]
    }
  },
  "personal-platform": {
    en: {
      title: "Personal Researcher Platform",
      intro:
        "Showcase your projects, datasets, and publications within the Foundation's digital ecosystem and reach a wider community.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "A customizable profile page hosted by the Foundation, including space for biographies, project updates, media, and downloadable files.",
            "Analytics on visits and referrals so you understand how audiences engage with your work."
          ]
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Researchers seeking a trusted, bilingual presence to host their outputs without maintaining a separate website.",
            "Collaborative projects that require a central hub to publish joint findings and invite participation."
          ]
        },
        {
          title: "How to request access",
          paragraphs: [
            "Complete the platform request form with links to your existing outputs and the material you wish to publish.",
            "Our digital engagement team will provision your space and provide onboarding guidance within one week."
          ]
        }
      ]
    },
    fr: {
      title: "Plateforme personnelle pour chercheurs",
      intro:
        "Diffusez vos projets, données et publications dans l’écosystème numérique de la Fondation pour toucher un public plus large.",
      heroImage: null,
      bodySections: [
        {
          title: "Ce que nous offrons",
          paragraphs: [
            "Une page de profil personnalisable hébergée par la Fondation, incluant biographie, actualités de projets, médias et fichiers téléchargeables.",
            "Des statistiques de visites et de provenance pour comprendre l’engagement du public avec vos travaux."
          ]
        },
        {
          title: "Pour qui",
          paragraphs: [
            "Chercheurs qui souhaitent une présence bilingue fiable sans gérer un site web séparé.",
            "Projets collaboratifs qui ont besoin d’un hub central pour publier des résultats communs et inviter à la participation."
          ]
        },
        {
          title: "Comment demander un espace",
          paragraphs: [
            "Remplissez le formulaire de demande de plateforme avec vos productions existantes et les contenus à publier.",
            "L’équipe d’engagement numérique créera votre espace et vous guidera pour la mise en ligne sous une semaine."
          ]
        }
      ]
    },
    es: {
      title: "Plataforma personal para investigadores",
      intro:
        "Comparte proyectos, datos y publicaciones en el ecosistema digital de la Fundación para llegar a una comunidad más amplia.",
      heroImage: null,
      bodySections: [
        {
          title: "Qué ofrecemos",
          paragraphs: [
            "Un perfil personalizable alojado por la Fundación con biografía, avances de proyectos, medios y archivos descargables.",
            "Métricas de visitas y referencias para entender cómo interactúa la audiencia con tu trabajo."
          ]
        },
        {
          title: "Para quién",
          paragraphs: [
            "Investigadores que buscan una presencia bilingüe confiable sin mantener un sitio aparte.",
            "Proyectos colaborativos que requieren un centro para publicar hallazgos conjuntos e invitar a la participación."
          ]
        },
        {
          title: "Cómo solicitar acceso",
          paragraphs: [
            "Completa el formulario de solicitud con enlaces a tus trabajos y el material que quieres publicar.",
            "El equipo de compromiso digital habilitará tu espacio y te guiará en la incorporación en un plazo de una semana."
          ]
        }
      ]
    },
    ar: {
      title: "منصة شخصية للباحثين",
      intro:
        "اعرض مشاريعك وبياناتك ونشرتك ضمن النظام الرقمي للمؤسسة للوصول إلى جمهور أوسع.",
      heroImage: null,
      bodySections: [
        {
          title: "ماذا نقدم",
          paragraphs: [
            "صفحة شخصية قابلة للتخصيص تستضيفها المؤسسة وتشمل السيرة الذاتية وتحديثات المشاريع والوسائط والملفات القابلة للتنزيل.",
            "إحصاءات عن الزيارات والمصادر لفهم تفاعل الجمهور مع أعمالك."
          ]
        },
        {
          title: "لمن تُفيد",
          paragraphs: [
            "الباحثون الذين يبحثون عن حضور ثنائي اللغة موثوق دون إدارة موقع جد منفصل.",
            "المشاريع التعاونية التي تحتاج إلى مركز لنشر النتائج المشتركة ودعوة المشاركة."
          ]
        },
        {
          title: "كيف تطلب الوصول",
          paragraphs: [
            "أكمل استمارة المنصة مع روابط إلى أعمالك الحالية والمواد التي ترغب في نشرها.",
            "سوف توفر فريقة التواجد الرقمي فضاءك وتقدم الإرشادات خلال أسبوع."
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


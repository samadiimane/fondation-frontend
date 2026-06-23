const DEFAULT_LOCALE = "en";

const SUPPORT_CONTENT = {
  faq: {
    en: {
      heading: "Frequently Asked Questions",
      items: [
        {
          question: "How do I request access to restricted materials?",
          answer:
            "Submit the researcher access form with a brief project overview. Our collections team reviews requests twice per week and will confirm available appointment windows.",
          category: "Access & Appointments",
        },
        {
          question: "Can I request digital reproductions of archive items?",
          answer:
            "Yes. Identify the catalogue reference and preferred format. Delivery times vary based on conservation requirements; we will share an estimated timeline after review.",
          category: "Access & Appointments",
        },
        {
          question: "Is there guidance for citing Foundation materials?",
          answer:
            "Each digitised item includes a recommended citation statement. You can also download citation templates (Chicago, MLA, APA) from the researcher toolkit in the Support & Help section.",
          category: "Research Support",
        },
        {
          question: "Who can join the researcher support programme?",
          answer:
            "The programme is open to scholars, independent researchers, and graduate students whose work aligns with the Foundation's focus areas. Introduce yourself via the support intake form to get started.",
          category: "Research Support",
        },
      ],
    },
    fr: {
      heading: "Questions frequentes",
      items: [
        {
          question: "Comment demander l'acces aux fonds restreints ?",
          answer:
            "Remplissez le formulaire de demande avec un resume de votre projet. L'equipe verifie les demandes chaque semaine et vous proposera un rendez-vous.",
          category: "Acces et rendez-vous",
        },
        {
          question: "Puis-je obtenir des reproductions numeriques ?",
          answer:
            "Oui, indiquez la reference et le format souhaite. Les delais dependent de l'etat de conservation; nous vous communiquerons un calendrier apres evaluation.",
          category: "Acces et rendez-vous",
        },
        {
          question: "Existe-t-il des recommandations pour citer les documents de la Fondation ?",
          answer:
            "Chaque document numerise contient une formulation de citation recommandee. Vous pouvez aussi telecharger des modeles de citation (Chicago, MLA, APA) dans la section Support et aide.",
          category: "Accompagnement de la recherche",
        },
        {
          question: "Qui peut integrer le programme d'accompagnement des chercheurs ?",
          answer:
            "Le programme est ouvert aux chercheurs universitaires, aux chercheurs independants et aux etudiants de master ou doctorat dont les travaux correspondent aux axes de la Fondation.",
          category: "Accompagnement de la recherche",
        },
      ],
    },
    es: {
      heading: "Preguntas frecuentes",
      items: [
        {
          question: "Como solicito acceso a materiales restringidos?",
          answer:
            "Completa el formulario para investigadores con un resumen de tu proyecto. El equipo revisa solicitudes cada semana y confirmara un horario disponible.",
          category: "Acceso y citas",
        },
        {
          question: "Puedo pedir reproducciones digitales?",
          answer:
            "Si. Indica la referencia del catalogo y el formato deseado. Compartiremos un plazo estimado despues de revisar el estado de conservacion.",
          category: "Acceso y citas",
        },
        {
          question: "Existe orientacion para citar materiales de la Fundacion?",
          answer:
            "Cada documento digitalizado incluye una cita recomendada. Tambien puedes descargar plantillas de cita (Chicago, MLA y APA) desde la seccion de soporte para investigadores.",
          category: "Apoyo a la investigacion",
        },
        {
          question: "Quien puede participar en el programa de apoyo a investigadores?",
          answer:
            "El programa esta abierto a personal investigador academico, investigadores independientes y estudiantes de posgrado cuyo trabajo se alinee con las lineas de la Fundacion.",
          category: "Apoyo a la investigacion",
        },
      ],
    },
    ar: {
      heading: "الأسئلة الشائعة",
      items: [
        {
          question: "كيف يمكنني طلب الوصول إلى المواد المقيدة؟",
          answer:
            "املأ نموذج الباحث مع ملخص عن مشروعك. يراجع الفريق الطلبات مرتين أسبوعياً وسيحدد مواعيد مناسبة.",
          category: "الوصول والمواعيد",
        },
        {
          question: "هل يمكن الحصول على نسخ رقمية؟",
          answer:
            "نعم. زودنا بمعرفة المرجع والصيغة المطلوبة. سنخبرك بالجدول الزمني بعد معاينة حالة المادة.",
          category: "الوصول والمواعيد",
        },
        {
          question: "هل توجد إرشادات لاقتباس مواد المؤسسة؟",
          answer:
            "كل مادة رقمية تحتوي على صيغة استشهاد موصى بها. ويمكنك أيضاً تحميل قوالب الاستشهاد بأنماط Chicago وMLA وAPA من قسم الدعم والمساعدة.",
          category: "دعم البحث",
        },
        {
          question: "من يمكنه الانضمام إلى برنامج دعم الباحثين؟",
          answer:
            "البرنامج متاح للباحثين الأكاديميين والمستقلين وطلبة الدراسات العليا عندما تتوافق مشاريعهم مع مجالات المؤسسة.",
          category: "دعم البحث",
        },
      ],
    },
  },
  contact: {
    en: {
      heading: "Contact the Research Support Desk",
      address: "Avenue Abdelaziz Khallouk Temsamani, Tangier 90000, Morocco",
      mapLink: "https://maps.google.com/?q=Avenue+Abdelaziz+Khallouk+Temsamani+Tangier",
      phone: ["+212 628 595 830"],
      email: ["aktfoundation.ma@gmail.com"],
      note: "For access requests, citation guidance, and institutional partnerships.",
      focus: [
        "Archive access and appointment scheduling",
        "Publication and citation guidance",
        "Institutional partnerships and permissions",
      ],
      hours: ["Monday-Friday: 09:00-17:00 (GMT+1)", "Saturday-Sunday: Closed"],
      responseTime: "Typical response time is within 2 working days.",
    },
    fr: {
      heading: "Contactez le bureau de soutien",
      address: "Avenue Abdelaziz Khallouk Temsamani, Tanger, Maroc",
      mapLink: "https://maps.google.com/?q=Avenue+Abdelaziz+Khallouk+Temsamani+Tangier",
      phone: ["+212 628 595 830"],
      email: ["aktfoundation.ma@gmail.com"],
      note: "Demandes d'acces, citations et partenariats institutionnels.",
      focus: [
        "Acces aux archives et planification des rendez-vous",
        "Accompagnement pour publication et citation",
        "Partenariats institutionnels et autorisations",
      ],
      hours: ["Lundi-Vendredi: 09:00-17:00 (GMT+1)", "Samedi-Dimanche: Ferme"],
      responseTime: "Le delai de reponse habituel est de 2 jours ouvrables.",
    },
    es: {
      heading: "Contacta con nuestro equipo",
      address: "Avenida Abdelaziz Khallouk Temsamani, Tanger, Marruecos",
      mapLink: "https://maps.google.com/?q=Avenue+Abdelaziz+Khallouk+Temsamani+Tangier",
      phone: ["+212 628 595 830"],
      email: ["aktfoundation.ma@gmail.com"],
      note: "Solicitudes de acceso, citas y alianzas institucionales.",
      focus: [
        "Acceso al archivo y programacion de citas",
        "Orientacion para publicacion y citacion",
        "Alianzas institucionales y permisos",
      ],
      hours: ["Lunes-Viernes: 09:00-17:00 (GMT+1)", "Sabado-Domingo: Cerrado"],
      responseTime: "El tiempo de respuesta habitual es de 2 dias habiles.",
    },
    ar: {
      heading: "التواصل مع المؤسسة",
      address: "طنجة، المغرب",
      mapLink: "https://maps.google.com/?q=Avenue+Abdelaziz+Khallouk+Temsamani+Tangier",
      phone: ["+212 628 595 830"],
      email: ["aktfoundation.ma@gmail.com"],
      note:
        "تستقبل المؤسسة طلبات الباحثين والمهتمين المرتبطة بالمكتبة الرقمية، والوثائق، والنشر العلمي، والشراكات الأكاديمية والمؤسسية.",
      focus: [
        "طلبات الاستفادة من الرصيد الوثائقي والمكتبة الرقمية",
        "الاستفسارات المرتبطة بالنشر العلمي والاستشهاد بالمصادر",
        "التعاون الأكاديمي والشراكات المؤسسية",
      ],
      hours: [
        "من الاثنين إلى الجمعة: 09:00-17:00 (GMT+1)",
        "السبت والأحد: مغلق",
      ],
      responseTime: "تتم معالجة الرسائل عادة خلال يومي عمل، بحسب طبيعة الطلب وتوفر المعطيات.",
    },
  },
  terms: {
    en: {
      heading: "Terms & Policies",
      intro:
        "These terms outline how to engage with the Foundation's digital services and on-site resources. By using our platforms, you agree to the guidelines below.",
      sections: [
        {
          title: "Access & Use of Collections",
          paragraphs: [
            "Access is granted exclusively for scholarly and educational use. Materials must be cited using the recommended statements provided in catalogue records.",
            "Redistribution of high-resolution media requires prior written permission from the Foundation's rights office.",
          ],
        },
        {
          title: "Research Conduct",
          paragraphs: [
            "Researchers agree to respect conservation directives and follow staff instructions during on-site visits.",
            "Any discovery of sensitive personal data must be reported immediately so the archives team can apply appropriate safeguards.",
          ],
        },
        {
          title: "Digital Privacy",
          paragraphs: [
            "We collect minimal analytics to improve our services. Personal information submitted via forms is stored securely and only for the stated purpose.",
            "You may request data removal or updates at any time by contacting aktfoundation.ma@gmail.com.",
          ],
        },
      ],
    },
    fr: {
      heading: "Conditions et politiques",
      intro:
        "Ces conditions decrivent les regles d'utilisation des services numeriques et des ressources sur site de la Fondation. En utilisant nos plateformes, vous acceptez les directives suivantes.",
      sections: [
        {
          title: "Acces et utilisation des collections",
          paragraphs: [
            "L'acces est accorde exclusivement a des fins scientifiques et pedagogiques. Les documents doivent etre cites selon les references recommandees dans les notices.",
            "La reproduction ou la diffusion de fichiers haute resolution en dehors du cadre de recherche exige une autorisation ecrite prealable du service des droits.",
          ],
        },
        {
          title: "Conduite de la recherche",
          paragraphs: [
            "Les chercheurs s'engagent a respecter les protocoles de conservation et a suivre les consignes de l'equipe pendant les consultations sur site.",
            "Toute decouverte de donnees personnelles sensibles doit etre signalee immediatement afin que les archivistes mettent en place les mesures de protection adaptees.",
          ],
        },
        {
          title: "Confidentialite et donnees personnelles",
          paragraphs: [
            "Nous collectons un volume limite de donnees analytiques pour ameliorer nos services. Les informations soumises via les formulaires sont conservees de facon securisee et uniquement pour l'objectif annonce.",
            "Vous pouvez demander la mise a jour ou la suppression de vos donnees a tout moment en ecrivant a aktfoundation.ma@gmail.com.",
          ],
        },
      ],
    },
    es: {
      heading: "Condiciones y politicas",
      intro:
        "Estas condiciones describen como utilizar los servicios digitales y los recursos presenciales de la Fundacion. Al usar nuestras plataformas, aceptas las directrices siguientes.",
      sections: [
        {
          title: "Acceso a las colecciones",
          paragraphs: [
            "El acceso se concede exclusivamente para fines academicos y educativos. Los materiales deben citarse siguiendo las referencias recomendadas en cada registro.",
            "La redistribucion o publicacion de archivos en alta resolucion fuera del marco de investigacion requiere una autorizacion escrita previa de la oficina de derechos.",
          ],
        },
        {
          title: "Conducta de investigacion",
          paragraphs: [
            "Las personas investigadoras deben respetar las normas de conservacion y seguir las indicaciones del equipo durante las consultas presenciales.",
            "Si se detectan datos personales sensibles en los documentos, debe notificarse de inmediato al equipo de archivo para aplicar las medidas de proteccion correspondientes.",
          ],
        },
        {
          title: "Privacidad digital",
          paragraphs: [
            "Recopilamos analitica minima para mejorar nuestros servicios. La informacion personal enviada en formularios se almacena de forma segura y solo para el fin indicado.",
            "Puedes solicitar en cualquier momento la actualizacion o eliminacion de tus datos escribiendo a aktfoundation.ma@gmail.com.",
          ],
        },
      ],
    },
    ar: {
      heading: "الشروط والسياسات",
      intro:
        "توضح هذه الشروط كيفية استخدام خدمات المؤسسة الرقمية والموارد المتاحة في المقر. باستخدام المنصات، فإنك تقر بالالتزام بالإرشادات التالية.",
      sections: [
        {
          title: "الوصول واستخدام المجموعات",
          paragraphs: [
            "يُمنح الوصول للأغراض الأكاديمية والتعليمية فقط. يجب توثيق المواد وفق صيغ الاستشهاد المعتمدة في سجلات الفهرسة.",
            "إعادة نشر النسخ عالية الدقة أو مشاركتها خارج نطاق البحث تتطلب موافقة كتابية مسبقة من مكتب الحقوق بالمؤسسة.",
          ],
        },
        {
          title: "سلوك الباحثين",
          paragraphs: [
            "يلتزم الباحثون باحترام قواعد الحفظ والصيانة واتباع تعليمات فريق المؤسسة أثناء الزيارات الحضورية.",
            "عند اكتشاف بيانات شخصية حساسة داخل المواد، يجب الإبلاغ الفوري لفريق الأرشيف لاتخاذ إجراءات الحماية المناسبة.",
          ],
        },
        {
          title: "الخصوصية والبيانات الرقمية",
          paragraphs: [
            "نجمع بيانات تحليلية محدودة لتحسين الخدمات. المعلومات الشخصية المرسلة عبر النماذج تُحفظ بشكل آمن وللغرض المحدد فقط.",
            "يمكنك طلب تحديث بياناتك أو حذفها في أي وقت عبر التواصل مع aktfoundation.ma@gmail.com.",
          ],
        },
      ],
    },
  },
};

function normalizeLocale(locale) {
  if (!locale || typeof locale !== "string") {
    return DEFAULT_LOCALE;
  }
  const normalized = locale.toLowerCase();
  const [base] = normalized.split(/[-_]/);
  return base || DEFAULT_LOCALE;
}

function withFallback(contentByLocale, locale) {
  if (!contentByLocale) {
    return null;
  }

  const fallback = contentByLocale[DEFAULT_LOCALE] ?? {};
  const normalized = normalizeLocale(locale);
  const localized =
    (locale && contentByLocale[locale]) || (normalized && contentByLocale[normalized]) || fallback;

  return {
    ...fallback,
    ...localized,
  };
}

export function getFaqContent(locale) {
  const content = withFallback(SUPPORT_CONTENT.faq, locale);
  if (!content) return null;
  const items = Array.isArray(content.items)
    ? content.items
    : Array.isArray(SUPPORT_CONTENT.faq[DEFAULT_LOCALE]?.items)
      ? SUPPORT_CONTENT.faq[DEFAULT_LOCALE].items
      : [];
  return {
    ...content,
    items,
  };
}

export function getContactContent(locale) {
  const content = withFallback(SUPPORT_CONTENT.contact, locale);
  if (!content) return null;
  return {
    email: "aktfoundation.ma@gmail.com",
    ...content,
  };
}

export function getTermsContent(locale) {
  const content = withFallback(SUPPORT_CONTENT.terms, locale);
  if (!content) return null;
  const sections = Array.isArray(content.sections)
    ? content.sections
    : Array.isArray(SUPPORT_CONTENT.terms[DEFAULT_LOCALE]?.sections)
      ? SUPPORT_CONTENT.terms[DEFAULT_LOCALE].sections
      : [];
  return {
    ...content,
    sections,
  };
}

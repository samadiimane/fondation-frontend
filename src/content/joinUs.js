import { defaultLocale, normalizeLocale } from "@/i18n/config";

const JOIN_US_CONTENT = {
  ar: {
    meta: {
      title: "الانضمام إلى شبكة المؤسسة",
      description:
        "استمارة للتواصل مع مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي، موجهة إلى الطلبة والباحثين والمهتمين.",
    },
    breadcrumbs: {
      home: "الرئيسية",
      current: "انضم إلينا",
      ariaLabel: "مسار التصفح",
    },
    title: "الانضمام إلى شبكة المؤسسة",
    intro:
      "تفتح المؤسسة هذه الاستمارة أمام الطلبة والباحثين وطلبة الدكتوراه والمهتمين الراغبين في التواصل معها، أو الاستفادة من مواردها العلمية والوثائقية، أو اقتراح تعاون بحثي أو أكاديمي.",
    note:
      "يرجى تعبئة المعطيات بدقة حتى يتمكن فريق المؤسسة من دراسة الطلب والتواصل معكم عند الحاجة.",
    helper:
      "تتعامل المؤسسة مع الطلبات وفق طبيعتها العلمية والتوثيقية، وسيتم التواصل معكم عند توفر المعطيات اللازمة.",
    fields: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      profileType: "الصفة",
      institution: "المؤسسة أو الانتماء",
      field: "مجال الدراسة أو الاختصاص",
      requestType: "نوع الطلب",
      message: "الرسالة أو الدافع",
      cityCountry: "المدينة / البلد",
      academicLevel: "المستوى الأكاديمي",
      preferredContact: "وسيلة التواصل المفضلة",
      consent: "الموافقة",
      website: "الموقع الإلكتروني",
    },
    placeholders: {
      select: "اختر خياراً",
      fullName: "اكتب الاسم الكامل",
      email: "name@example.com",
      phone: "+212 ...",
      institution: "اسم الجامعة أو المؤسسة أو الصفة المستقلة",
      field: "مثلاً: التاريخ المعاصر، الأرشيف، الدراسات المغربية",
      cityCountry: "مثلاً: طنجة، المغرب",
      academicLevel: "مثلاً: ماستر، دكتوراه، باحث مستقل",
      preferredContact: "مثلاً: البريد الإلكتروني",
      message: "اكتب بإيجاز موضوع الطلب أو الدافع إلى التواصل مع المؤسسة",
    },
    profileTypes: [
      "طالب",
      "باحث",
      "طالب دكتوراه",
      "أستاذ / مؤطر أكاديمي",
      "مهتم بالتراث والوثائق",
      "مؤسسة / شريك محتمل",
      "آخر",
    ],
    requestTypes: [
      "الاستفادة من المكتبة الرقمية",
      "طلب وثائق أو معلومات",
      "تعاون بحثي أو أكاديمي",
      "النشر أو المساهمة العلمية",
      "التطوع أو المساهمة في أنشطة المؤسسة",
      "شراكة مؤسسية",
      "طلب عام",
    ],
    consent:
      "أوافق على إرسال هذه المعطيات إلى المؤسسة لغرض دراسة الطلب والتواصل معي عند الحاجة.",
    submit: "إرسال الطلب",
    sending: "جاري الإرسال...",
    requiredHint: "الحقول المشار إليها بعلامة * إلزامية.",
    success:
      "تم إرسال طلبكم بنجاح. ستقوم المؤسسة بدراسة المعطيات والتواصل معكم عند الحاجة.",
    failure:
      "تعذر إرسال الطلب حالياً. يرجى المحاولة لاحقاً أو التواصل مع المؤسسة عبر البريد الإلكتروني.",
    errorSummary: "يرجى مراجعة الحقول المطلوبة قبل إرسال الطلب.",
    validation: {
      fullName: "يرجى إدخال الاسم الكامل بما لا يقل عن 3 أحرف.",
      email: "يرجى إدخال بريد إلكتروني صحيح.",
      profileType: "يرجى اختيار الصفة.",
      institution: "يرجى إدخال المؤسسة أو الانتماء.",
      field: "يرجى إدخال مجال الدراسة أو الاختصاص.",
      requestType: "يرجى اختيار نوع الطلب.",
      message: "يرجى كتابة رسالة لا تقل عن 20 حرفاً.",
      consent: "يلزم تأكيد الموافقة قبل إرسال الطلب.",
    },
  },
  en: {
    meta: {
      title: "Join the Foundation Network",
      description:
        "A public form for students, researchers, doctoral candidates, and interested users to contact the Foundation.",
    },
    breadcrumbs: {
      home: "Home",
      current: "Join Us",
      ariaLabel: "Breadcrumb",
    },
    title: "Join the Foundation Network",
    intro:
      "This form is open to students, researchers, doctoral candidates, and interested members of the public who wish to contact the Foundation, benefit from its scientific and documentary resources, or propose academic and research collaboration.",
    note:
      "Please provide accurate information so the Foundation team can review your request and contact you if needed.",
    helper:
      "The Foundation reviews requests according to their academic and documentary scope and will contact you when the necessary information is available.",
    fields: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      profileType: "Profile type",
      institution: "Institution or affiliation",
      field: "Field of study / specialization",
      requestType: "Request type",
      message: "Message / motivation",
      cityCountry: "City / country",
      academicLevel: "Academic level",
      preferredContact: "Preferred contact method",
      consent: "Consent",
      website: "Website",
    },
    placeholders: {
      select: "Select an option",
      fullName: "Enter your full name",
      email: "name@example.com",
      phone: "+212 ...",
      institution: "University, institution, or independent affiliation",
      field: "For example: modern history, archives, Moroccan studies",
      cityCountry: "For example: Tangier, Morocco",
      academicLevel: "For example: MA, PhD, independent researcher",
      preferredContact: "For example: email",
      message: "Briefly describe your request or motivation",
    },
    profileTypes: [
      "Student",
      "Researcher",
      "Doctoral candidate",
      "Professor / academic supervisor",
      "Heritage and documentation enthusiast",
      "Institution / potential partner",
      "Other",
    ],
    requestTypes: [
      "Access to the digital library",
      "Document or information request",
      "Research or academic collaboration",
      "Publication or scientific contribution",
      "Volunteering or contribution to Foundation activities",
      "Institutional partnership",
      "General request",
    ],
    consent:
      "I agree to send this information to the Foundation for the purpose of reviewing my request and contacting me if needed.",
    submit: "Send request",
    sending: "Sending...",
    requiredHint: "Fields marked with * are required.",
    success:
      "Your request has been sent successfully. The Foundation will review the information and contact you if needed.",
    failure:
      "The request could not be sent at the moment. Please try again later or contact the Foundation by email.",
    errorSummary: "Please review the required fields before submitting the request.",
    validation: {
      fullName: "Please enter a full name of at least 3 characters.",
      email: "Please enter a valid email address.",
      profileType: "Please select a profile type.",
      institution: "Please enter an institution or affiliation.",
      field: "Please enter a field of study or specialization.",
      requestType: "Please select a request type.",
      message: "Please write a message of at least 20 characters.",
      consent: "Consent is required before submitting the request.",
    },
  },
  fr: {
    meta: {
      title: "Rejoindre le réseau de la Fondation",
      description:
        "Formulaire public destiné aux étudiants, chercheurs, doctorants et personnes intéressées souhaitant contacter la Fondation.",
    },
    breadcrumbs: {
      home: "Accueil",
      current: "Nous rejoindre",
      ariaLabel: "Fil d'Ariane",
    },
    title: "Rejoindre le réseau de la Fondation",
    intro:
      "Ce formulaire s'adresse aux étudiants, chercheurs, doctorants et personnes intéressées souhaitant contacter la Fondation, bénéficier de ses ressources scientifiques et documentaires, ou proposer une collaboration académique ou scientifique.",
    note:
      "Veuillez renseigner les informations avec précision afin que l'équipe de la Fondation puisse étudier votre demande et vous contacter si nécessaire.",
    helper:
      "La Fondation examine les demandes selon leur portée académique et documentaire et vous contactera lorsque les éléments nécessaires seront disponibles.",
    fields: {
      fullName: "Nom complet",
      email: "Adresse e-mail",
      phone: "Téléphone",
      profileType: "Profil",
      institution: "Institution ou affiliation",
      field: "Domaine d'étude / spécialisation",
      requestType: "Type de demande",
      message: "Message / motivation",
      cityCountry: "Ville / pays",
      academicLevel: "Niveau académique",
      preferredContact: "Mode de contact préféré",
      consent: "Consentement",
      website: "Site web",
    },
    placeholders: {
      select: "Sélectionner une option",
      fullName: "Saisissez votre nom complet",
      email: "nom@example.com",
      phone: "+212 ...",
      institution: "Université, institution ou affiliation indépendante",
      field: "Par exemple : histoire contemporaine, archives, études marocaines",
      cityCountry: "Par exemple : Tanger, Maroc",
      academicLevel: "Par exemple : master, doctorat, chercheur indépendant",
      preferredContact: "Par exemple : e-mail",
      message: "Décrivez brièvement votre demande ou votre motivation",
    },
    profileTypes: [
      "Étudiant",
      "Chercheur",
      "Doctorant",
      "Professeur / encadrant académique",
      "Personne intéressée par le patrimoine et la documentation",
      "Institution / partenaire potentiel",
      "Autre",
    ],
    requestTypes: [
      "Accès à la bibliothèque numérique",
      "Demande de documents ou d'informations",
      "Collaboration scientifique ou académique",
      "Publication ou contribution scientifique",
      "Bénévolat ou contribution aux activités de la Fondation",
      "Partenariat institutionnel",
      "Demande générale",
    ],
    consent:
      "J'accepte d'envoyer ces informations à la Fondation afin que ma demande soit étudiée et que je puisse être contacté si nécessaire.",
    submit: "Envoyer la demande",
    sending: "Envoi en cours...",
    requiredHint: "Les champs marqués d'un * sont obligatoires.",
    success:
      "Votre demande a été envoyée avec succès. La Fondation examinera les informations et vous contactera si nécessaire.",
    failure:
      "La demande n'a pas pu être envoyée pour le moment. Veuillez réessayer plus tard ou contacter la Fondation par e-mail.",
    errorSummary: "Veuillez vérifier les champs obligatoires avant d'envoyer la demande.",
    validation: {
      fullName: "Veuillez saisir un nom complet d'au moins 3 caractères.",
      email: "Veuillez saisir une adresse e-mail valide.",
      profileType: "Veuillez sélectionner un profil.",
      institution: "Veuillez indiquer une institution ou affiliation.",
      field: "Veuillez indiquer un domaine d'étude ou de spécialisation.",
      requestType: "Veuillez sélectionner un type de demande.",
      message: "Veuillez rédiger un message d'au moins 20 caractères.",
      consent: "Le consentement est obligatoire avant l'envoi.",
    },
  },
  es: {
    meta: {
      title: "Unirse a la red de la Fundación",
      description:
        "Formulario público para estudiantes, investigadores, doctorandos y personas interesadas que desean contactar con la Fundación.",
    },
    breadcrumbs: {
      home: "Inicio",
      current: "Únete a nosotros",
      ariaLabel: "Ruta de navegación",
    },
    title: "Unirse a la red de la Fundación",
    intro:
      "Este formulario está dirigido a estudiantes, investigadores, doctorandos y personas interesadas que deseen contactar con la Fundación, beneficiarse de sus recursos científicos y documentales, o proponer una colaboración académica o científica.",
    note:
      "Complete la información con precisión para que el equipo de la Fundación pueda estudiar su solicitud y contactarle si es necesario.",
    helper:
      "La Fundación revisa las solicitudes según su alcance académico y documental y se pondrá en contacto cuando disponga de la información necesaria.",
    fields: {
      fullName: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono",
      profileType: "Tipo de perfil",
      institution: "Institución o afiliación",
      field: "Campo de estudio / especialización",
      requestType: "Tipo de solicitud",
      message: "Mensaje / motivación",
      cityCountry: "Ciudad / país",
      academicLevel: "Nivel académico",
      preferredContact: "Método de contacto preferido",
      consent: "Consentimiento",
      website: "Sitio web",
    },
    placeholders: {
      select: "Seleccione una opción",
      fullName: "Escriba su nombre completo",
      email: "nombre@example.com",
      phone: "+212 ...",
      institution: "Universidad, institución o afiliación independiente",
      field: "Por ejemplo: historia contemporánea, archivos, estudios marroquíes",
      cityCountry: "Por ejemplo: Tánger, Marruecos",
      academicLevel: "Por ejemplo: máster, doctorado, investigador independiente",
      preferredContact: "Por ejemplo: correo electrónico",
      message: "Describa brevemente su solicitud o motivación",
    },
    profileTypes: [
      "Estudiante",
      "Investigador",
      "Doctorando",
      "Profesor / supervisor académico",
      "Persona interesada en patrimonio y documentación",
      "Institución / posible socio",
      "Otro",
    ],
    requestTypes: [
      "Acceso a la biblioteca digital",
      "Solicitud de documentos o información",
      "Colaboración investigadora o académica",
      "Publicación o contribución científica",
      "Voluntariado o contribución a actividades de la Fundación",
      "Alianza institucional",
      "Solicitud general",
    ],
    consent:
      "Acepto enviar esta información a la Fundación para que mi solicitud sea revisada y puedan contactarme si es necesario.",
    submit: "Enviar solicitud",
    sending: "Enviando...",
    requiredHint: "Los campos marcados con * son obligatorios.",
    success:
      "Su solicitud se ha enviado correctamente. La Fundación revisará la información y se pondrá en contacto con usted si es necesario.",
    failure:
      "No se pudo enviar la solicitud en este momento. Inténtelo de nuevo más tarde o contacte con la Fundación por correo electrónico.",
    errorSummary: "Revise los campos obligatorios antes de enviar la solicitud.",
    validation: {
      fullName: "Introduzca un nombre completo de al menos 3 caracteres.",
      email: "Introduzca una dirección de correo electrónico válida.",
      profileType: "Seleccione un tipo de perfil.",
      institution: "Introduzca una institución o afiliación.",
      field: "Introduzca un campo de estudio o especialización.",
      requestType: "Seleccione un tipo de solicitud.",
      message: "Escriba un mensaje de al menos 20 caracteres.",
      consent: "El consentimiento es obligatorio antes de enviar la solicitud.",
    },
  },
};

export const getJoinUsContent = (locale) => {
  const normalizedLocale = normalizeLocale(locale);
  return JOIN_US_CONTENT[normalizedLocale] || JOIN_US_CONTENT[defaultLocale];
};


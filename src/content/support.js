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
      heading: "\u0623\u0633\u0626\u0644\u0629 \u0645\u062a\u0643\u0631\u0631\u0629",
      items: [
        {
          question: "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u064a \u0637\u0644\u0628 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0648\u0627\u062f \u0627\u0644\u0645\u0642\u064a\u062f\u0629\u061f",
          answer:
            "\u0627\u0645\u0644\u0623 \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0628\u0627\u062d\u062b \u0645\u0639 \u0645\u0644\u062e\u0635 \u0639\u0646 \u0645\u0634\u0631\u0648\u0639\u0643. \u064a\u0631\u0627\u062c\u0639 \u0627\u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0645\u0631\u062a\u064a\u0646 \u0623\u0633\u0628\u0648\u0639\u064a\u0627\u064b \u0648\u0633\u064a\u062d\u062f\u062f \u0645\u0648\u0627\u0639\u064a\u062f \u0645\u0646\u0627\u0633\u0628\u0629.",
          category: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f",
        },
        {
          question: "\u0647\u0644 \u064a\u0645\u0643\u0646 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0646\u0633\u062e \u0631\u0642\u0645\u064a\u0629\u061f",
          answer:
            "\u0646\u0639\u0645. \u0632\u0648\u062f\u0646\u0627 \u0628\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0645\u0631\u062c\u0639 \u0648\u0627\u0644\u0635\u064a\u063a\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629. \u0633\u0646\u062e\u0628\u0631\u0643 \u0628\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0628\u0639\u062f \u0645\u0639\u0627\u064a\u0646\u0629 \u062d\u0627\u0644\u0629 \u0627\u0644\u0645\u0627\u062f\u0629.",
          category: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f",
        },
        {
          question: "\u0647\u0644 \u062a\u0648\u062c\u062f \u0625\u0631\u0634\u0627\u062f\u0627\u062a \u0644\u0627\u0642\u062a\u0628\u0627\u0633 \u0645\u0648\u0627\u062f \u0627\u0644\u0645\u0624\u0633\u0633\u0629\u061f",
          answer:
            "\u0643\u0644 \u0645\u0627\u062f\u0629 \u0631\u0642\u0645\u064a\u0629 \u062a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0635\u064a\u063a\u0629 \u0627\u0633\u062a\u0634\u0647\u0627\u062f \u0645\u0648\u0635\u0649 \u0628\u0647\u0627. \u0648\u064a\u0645\u0643\u0646\u0643 \u0623\u064a\u0636\u0627\u064b \u062a\u062d\u0645\u064a\u0644 \u0642\u0648\u0627\u0644\u0628 \u0627\u0644\u0627\u0633\u062a\u0634\u0647\u0627\u062f \u0628\u0623\u0646\u0645\u0627\u0637 Chicago \u0648MLA \u0648APA \u0645\u0646 \u0642\u0633\u0645 \u0627\u0644\u062f\u0639\u0645 \u0648\u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629.",
          category: "\u062f\u0639\u0645 \u0627\u0644\u0628\u062d\u062b",
        },
        {
          question: "\u0645\u0646 \u064a\u0645\u0643\u0646\u0647 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0625\u0644\u0649 \u0628\u0631\u0646\u0627\u0645\u062c \u062f\u0639\u0645 \u0627\u0644\u0628\u0627\u062d\u062b\u064a\u0646\u061f",
          answer:
            "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c \u0645\u062a\u0627\u062d \u0644\u0644\u0628\u0627\u062d\u062b\u064a\u0646 \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u064a\u0646 \u0648\u0627\u0644\u0645\u0633\u062a\u0642\u0644\u064a\u0646 \u0648\u0637\u0644\u0628\u0629 \u0627\u0644\u062f\u0631\u0627\u0633\u0627\u062a \u0627\u0644\u0639\u0644\u064a\u0627 \u0639\u0646\u062f\u0645\u0627 \u062a\u062a\u0648\u0627\u0641\u0642 \u0645\u0634\u0627\u0631\u064a\u0639\u0647\u0645 \u0645\u0639 \u0645\u062c\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0629.",
          category: "\u062f\u0639\u0645 \u0627\u0644\u0628\u062d\u062b",
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
      heading: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0641\u0631\u064a\u0642\u0646\u0627",
      address: "\u0634\u0627\u0631\u0639 \u0639\u0628\u062f \u0627\u0644\u0639\u0632\u064a\u0632 \u062e\u0644\u0648\u0642 \u062a\u0645\u0633\u0627\u0645\u0627\u0646\u064a\u060c \u0637\u0646\u062c\u0629\u060c \u0627\u0644\u0645\u063a\u0631\u0628",
      mapLink: "https://maps.google.com/?q=Avenue+Abdelaziz+Khallouk+Temsamani+Tangier",
      phone: ["+212 628 595 830"],
      email: ["aktfoundation.ma@gmail.com"],
      note: "\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0625\u0631\u0634\u0627\u062f\u0627\u062a \u0627\u0644\u0627\u0633\u062a\u0634\u0647\u0627\u062f \u0648\u0627\u0644\u0634\u0631\u0627\u0643\u0627\u062a.",
      focus: [
        "\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0623\u0631\u0634\u064a\u0641 \u0648\u062c\u062f\u0648\u0644\u0629 \u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f",
        "\u062f\u0639\u0645 \u0627\u0644\u0646\u0634\u0631 \u0648\u0625\u0631\u0634\u0627\u062f\u0627\u062a \u0627\u0644\u0627\u0633\u062a\u0634\u0647\u0627\u062f",
        "\u0627\u0644\u0634\u0631\u0627\u0643\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u064a\u0629 \u0648\u0627\u0644\u062a\u0635\u0627\u0631\u064a\u062d",
      ],
      hours: [
        "\u0627\u0644\u0627\u062b\u0646\u064a\u0646-\u0627\u0644\u062c\u0645\u0639\u0629: 09:00-17:00 (GMT+1)",
        "\u0627\u0644\u0633\u0628\u062a-\u0627\u0644\u0623\u062d\u062f: \u0645\u063a\u0644\u0642",
      ],
      responseTime: "\u0645\u062f\u0629 \u0627\u0644\u0631\u062f \u0627\u0644\u0645\u062a\u0648\u0642\u0639\u0629 \u0639\u0627\u062f\u0629 \u062e\u0644\u0627\u0644 \u064a\u0648\u0645\u064a \u0639\u0645\u0644.",
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
      heading: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a",
      intro:
        "\u062a\u0648\u0636\u062d \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u0648\u0637 \u0643\u064a\u0641\u064a\u0629 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0629 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u0648\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0645\u062a\u0627\u062d\u0629 \u0641\u064a \u0627\u0644\u0645\u0642\u0631. \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0646\u0635\u0627\u062a\u060c \u0641\u0625\u0646\u0643 \u062a\u0642\u0631 \u0628\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645 \u0628\u0627\u0644\u0625\u0631\u0634\u0627\u062f\u0627\u062a \u0627\u0644\u062a\u0627\u0644\u064a\u0629.",
      sections: [
        {
          title: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a",
          paragraphs: [
            "\u064a\u064f\u0645\u0646\u062d \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u0623\u063a\u0631\u0627\u0636 \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629 \u0648\u0627\u0644\u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u0641\u0642\u0637. \u064a\u062c\u0628 \u062a\u0648\u062b\u064a\u0642 \u0627\u0644\u0645\u0648\u0627\u062f \u0648\u0641\u0642 \u0635\u064a\u063a \u0627\u0644\u0627\u0633\u062a\u0634\u0647\u0627\u062f \u0627\u0644\u0645\u0639\u062a\u0645\u062f\u0629 \u0641\u064a \u0633\u062c\u0644\u0627\u062a \u0627\u0644\u0641\u0647\u0631\u0633\u0629.",
            "\u0625\u0639\u0627\u062f\u0629 \u0646\u0634\u0631 \u0627\u0644\u0646\u0633\u062e \u0639\u0627\u0644\u064a\u0629 \u0627\u0644\u062f\u0642\u0629 \u0623\u0648 \u0645\u0634\u0627\u0631\u0643\u062a\u0647\u0627 \u062e\u0627\u0631\u062c \u0646\u0637\u0627\u0642 \u0627\u0644\u0628\u062d\u062b \u062a\u062a\u0637\u0644\u0628 \u0645\u0648\u0627\u0641\u0642\u0629 \u0643\u062a\u0627\u0628\u064a\u0629 \u0645\u0633\u0628\u0642\u0629 \u0645\u0646 \u0645\u0643\u062a\u0628 \u0627\u0644\u062d\u0642\u0648\u0642 \u0628\u0627\u0644\u0645\u0624\u0633\u0633\u0629.",
          ],
        },
        {
          title: "\u0633\u0644\u0648\u0643 \u0627\u0644\u0628\u0627\u062d\u062b\u064a\u0646",
          paragraphs: [
            "\u064a\u0644\u062a\u0632\u0645 \u0627\u0644\u0628\u0627\u062d\u062b\u0648\u0646 \u0628\u0627\u062d\u062a\u0631\u0627\u0645 \u0642\u0648\u0627\u0639\u062f \u0627\u0644\u062d\u0641\u0638 \u0648\u0627\u0644\u0635\u064a\u0627\u0646\u0629 \u0648\u0627\u062a\u0628\u0627\u0639 \u062a\u0639\u0644\u064a\u0645\u0627\u062a \u0641\u0631\u064a\u0642 \u0627\u0644\u0645\u0624\u0633\u0633\u0629 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0632\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u062d\u0636\u0648\u0631\u064a\u0629.",
            "\u0639\u0646\u062f \u0627\u0643\u062a\u0634\u0627\u0641 \u0628\u064a\u0627\u0646\u0627\u062a \u0634\u062e\u0635\u064a\u0629 \u062d\u0633\u0627\u0633\u0629 \u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0648\u0627\u062f\u060c \u064a\u062c\u0628 \u0627\u0644\u0625\u0628\u0644\u0627\u063a \u0627\u0644\u0641\u0648\u0631\u064a \u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0623\u0631\u0634\u064a\u0641 \u0644\u0627\u062a\u062e\u0627\u0630 \u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629.",
          ],
        },
        {
          title: "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0631\u0642\u0645\u064a\u0629",
          paragraphs: [
            "\u0646\u062c\u0645\u0639 \u0628\u064a\u0627\u0646\u0627\u062a \u062a\u062d\u0644\u064a\u0644\u064a\u0629 \u0645\u062d\u062f\u0648\u062f\u0629 \u0644\u062a\u062d\u0633\u064a\u0646 \u0627\u0644\u062e\u062f\u0645\u0627\u062a. \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0634\u062e\u0635\u064a\u0629 \u0627\u0644\u0645\u0631\u0633\u0644\u0629 \u0639\u0628\u0631 \u0627\u0644\u0646\u0645\u0627\u0630\u062c \u062a\u064f\u062d\u0641\u0638 \u0628\u0634\u0643\u0644 \u0622\u0645\u0646 \u0648\u0644\u0644\u063a\u0631\u0636 \u0627\u0644\u0645\u062d\u062f\u062f \u0641\u0642\u0637.",
            "\u064a\u0645\u0643\u0646\u0643 \u0637\u0644\u0628 \u062a\u062d\u062f\u064a\u062b \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0623\u0648 \u062d\u0630\u0641\u0647\u0627 \u0641\u064a \u0623\u064a \u0648\u0642\u062a \u0639\u0628\u0631 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 aktfoundation.ma@gmail.com.",
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

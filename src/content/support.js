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
            "The programme is open to scholars, independent researchers, and graduate students whose work aligns with the Foundation’s focus areas. Introduce yourself via the support intake form to get started.",
          category: "Research Support",
        },
      ],
    },
    fr: {
      heading: "Questions frequentes",
      items: [
        {
          question: "Comment demander l'accès aux fonds restreints ?",
          answer:
            "Remplissez le formulaire de demande avec un resume de votre projet. L'equipe verifie les demandes chaque semaine et vous proposera un rendez-vous.",
          category: "Acces & Rendez-vous",
        },
        {
          question: "Puis-je obtenir des reproductions numeriques ?",
          answer:
            "Oui, indiquez la reference et le format souhaite. Les delais dependent de l'etat de conservation; nous vous communiquerons un calendrier apres evaluation.",
          category: "Acces & Rendez-vous",
        },
      ],
    },
    es: {
      heading: "Preguntas frecuentes",
      items: [
        {
          question: "¿Cómo solicito acceso a materiales restringidos?",
          answer:
            "Completa el formulario para investigadores con un resumen de tu proyecto. El equipo revisa solicitudes cada semana y confirmará un horario disponible.",
          category: "Acceso y citas",
        },
        {
          question: "¿Puedo pedir reproducciones digitales?",
          answer:
            "Sí. Indica la referencia del catálogo y el formato deseado. Compartiremos un plazo estimado después de revisar el estado de conservación.",
          category: "Acceso y citas",
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
          question: "\u0647\u0644 \u064a\u0645\u064a\u0643\u0646 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0646\u0633\u062e \u0631\u0642\u0645\u064a\u0629\u061f",
          answer:
            "\u0646\u0639\u0645. \u0632\u0648\u062f\u0646\u0627 \u0628\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0645\u0631\u062c\u0639 \u0648\u0627\u0644\u0635\u064a\u063a\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629. \u0633\u0646\u062e\u0628\u0631\u0643 \u0628\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0628\u0639\u062f \u0645\u0639\u0627\u064a\u0646\u0629 \u062d\u0627\u0644\u0629 \u0627\u0644\u0645\u0627\u062f\u0629.",
          category: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f",
        },
      ],
    },
  },
  contact: {
    en: {
      heading: "Contact Our Team",
      address: "Avenue Abdelaziz Khallouk Temsamani, Tangier, Morocco",
      phone: "+212 537 00 00 00",
      email: "support@aktfoundation.org",
      note: "Our coordination desk responds Monday to Friday within two working days.",
    },
    fr: {
      heading: "Contactez notre equipe",
      address: "Avenue Abdelaziz Khallouk Temsamani, Tanger, Maroc",
      phone: "+212 537 00 00 00",
      email: "support@aktfoundation.org",
      note: "Reponse assuree sous deux jours ouvrables.",
    },
    es: {
      heading: "Contacta con nuestro equipo",
      address: "Avenida Abdelaziz Khallouk Temsamani, Tánger, Marruecos",
      phone: "+212 537 00 00 00",
      email: "support@aktfoundation.org",
      note: "Respondemos en un plazo de dos dias laborables.",
    },
    ar: {
      heading: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0641\u0631\u064a\u0642\u0646\u0627",
      address: "\u0634\u0627\u0631\u0639 \u0639\u0628\u062f \u0627\u0644\u0639\u0632\u064a\u0632 \u062e\u0644\u0648\u0642 \u062a\u0645\u0633\u0627\u0645\u0627\u0646\u064a\u060c \u0637\u0646\u062c\u0629\u060c \u0627\u0644\u0645\u063a\u0631\u0628",
      phone: "+212 537 00 00 00",
      email: "support@aktfoundation.org",
      note: "\u0646\u0631\u062f \u062e\u0644\u0627\u0644 \u064a\u0648\u0645\u064a\u0646 \u0639\u0645\u0644.",
    },
  },
  terms: {
    en: {
      heading: "Terms & Policies",
      intro:
        "These terms outline how to engage with the Foundation’s digital services and on-site resources. By using our platforms, you agree to the guidelines below.",
      sections: [
        {
          title: "Access & Use of Collections",
          paragraphs: [
            "Access is granted exclusively for scholarly and educational use. Materials must be cited using the recommended statements provided in catalogue records.",
            "Redistribution of high-resolution media requires prior written permission from the Foundation’s rights office.",
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
            "You may request data removal or updates at any time by contacting support@aktfoundation.org.",
          ],
        },
      ],
    },
    fr: {
      heading: "Conditions et politiques",
      intro:
        "Ces conditions encadrent l'utilisation des services numeriques et des ressources sur site. Leur consultation implique votre adhesion aux regles suivantes.",
      sections: [
        {
          title: "Acces et utilisation des collections",
          paragraphs: [
            "L'acces est reserve a un usage scientifique ou pedagogique, avec citation obligatoire des references recommandees.",
          ],
        },
        {
          title: "Protection des donnees",
          paragraphs: [
            "Les informations personnelles transmises via les formulaires sont conservees de maniere securisee et peuvent etre supprimees sur simple demande.",
          ],
        },
      ],
    },
    es: {
      heading: "Condiciones y politicas",
      intro:
        "Estas condiciones regulan el uso de los servicios digitales y recursos presenciales de la Fundacion.",
      sections: [
        {
          title: "Acceso a las colecciones",
          paragraphs: [
            "El acceso se concede para fines academicos. Deben respetarse las citas recomendadas en cada registro.",
          ],
        },
      ],
    },
    ar: {
      heading: "\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a",
      intro:
        "\u062a\u062d\u062f\u062f \u0647\u0630\u0647 \u0627\u0644\u0634\u0631\u0648\u0637 \u0637\u0631\u064a\u0642\u0629 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u062e\u062f\u0645\u0627\u062a\u0646\u0627 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u0648\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0645\u064a\u062f\u0627\u0646\u064a\u0629.",
      sections: [
        {
          title: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a",
          paragraphs: [
            "\u064a\u062a\u0645 \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0623\u063a\u0631\u0627\u0636 \u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629 \u0641\u0642\u0637 \u0645\u0639 \u0632\u064a\u0627\u062f\u0629 \u0630\u0643\u0631 \u0627\u0644\u0645\u0635\u0627\u062f\u0631.",
          ],
        },
      ],
    },
  },
};

function withFallback(contentByLocale, locale) {
  if (!contentByLocale) {
    return null;
  }
  const fallback = contentByLocale[DEFAULT_LOCALE] ?? {};
  const localized = (locale && contentByLocale[locale]) || fallback;
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
    email: "support@aktfoundation.org",
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


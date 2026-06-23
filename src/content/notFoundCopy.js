export const NOT_FOUND_COPY = {
  en: {
    title: "Page not available",
    message:
      "The link may be incorrect, or the content may no longer be available on the platform. You can return to the homepage or continue browsing the available sections.",
    cta: "Back to homepage",
  },
  fr: {
    title: "Page non disponible",
    message:
      "Le lien est peut-etre incorrect, ou le contenu n'est plus disponible sur la plateforme. Vous pouvez revenir a l'accueil ou poursuivre la navigation.",
    cta: "Retour a l'accueil",
  },
  es: {
    title: "Pagina no disponible",
    message:
      "Es posible que el enlace sea incorrecto o que el contenido ya no este disponible en la plataforma. Puede volver al inicio o seguir navegando por las secciones disponibles.",
    cta: "Volver al inicio",
  },
  ar: {
    title: "الصفحة غير متاحة",
    message:
      "قد يكون الرابط غير صحيح، أو أن المحتوى لم يعد متاحاً على المنصة. يمكنكم العودة إلى الصفحة الرئيسية أو متابعة التصفح من الأقسام المتاحة.",
    cta: "العودة إلى الصفحة الرئيسية",
  },
};

export function getNotFoundCopy(locale) {
  return NOT_FOUND_COPY[locale] ?? NOT_FOUND_COPY.en;
}

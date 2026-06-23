import {defaultLocale, normalizeLocale} from "@/i18n/config";

const publicUnavailableContent = {
  en: {
    title: "Content temporarily unavailable",
    message:
      "We are working to make this section available again. Please try again later, or contact the Foundation if your request is urgent.",
  },
  fr: {
    title: "Contenu temporairement indisponible",
    message:
      "Nous travaillons a rendre cette section de nouveau accessible. Veuillez reessayer plus tard ou contacter la Fondation si votre demande est urgente.",
  },
  es: {
    title: "Contenido no disponible temporalmente",
    message:
      "Estamos trabajando para que esta seccion vuelva a estar disponible. Intentelo de nuevo mas tarde o contacte con la Fundacion si su solicitud es urgente.",
  },
  ar: {
    title: "المحتوى غير متاح مؤقتاً",
    message:
      "نعمل على إتاحة هذا القسم من جديد. يرجى المحاولة لاحقاً، أو التواصل مع المؤسسة إذا كان طلبكم مستعجلاً.",
  },
};

export function getPublicUnavailableContent(locale) {
  const normalizedLocale = normalizeLocale(locale);
  return publicUnavailableContent[normalizedLocale] ?? publicUnavailableContent[defaultLocale];
}

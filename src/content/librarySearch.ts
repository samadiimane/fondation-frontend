import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface LibrarySearchContent {
  heroTitle: string;
  search: {
    placeholder: string;
    aria: string;
    submitSr: string;
  };
  filters: {
    aria: string;
    typeLabel: string;
    langLabel: string;
    categoryLabel: string;
    allTypes: string;
    allLanguages: string;
    allCategories: string;
    advancedOpen: string;
    advancedClose: string;
  };
  advanced: {
    aria: string;
    closeSr: string;
    authorLabel: string;
    authorPlaceholder: string;
    yearFrom: string;
    yearFromPlaceholder: string;
    yearTo: string;
    yearToPlaceholder: string;
    reset: string;
  };
  toolbar: {
    title: string;
    searching: string;
    refreshing: string;
    results: (total: number, page: number, totalPages: number) => string;
    noResults: string;
    start: string;
    filtersButton: string;
    viewGroupAria: string;
    viewDetailed: string;
    viewCompact: string;
    sortAria: string;
    sortOptions: Array<{value: string; label: string}>;
  };
  list: {
    emptyTitle: string;
    emptySubtitle: string;
    errorTitle: string;
  };
  unavailable: {
    title: string;
    message: string;
    retry: string;
  };
  card: {
    metaAria: string;
    pagesSuffix: string;
    preview: string;
    download: string;
    details: string;
  };
  pagination: {
    aria: string;
    prev: string;
    next: string;
    page: (page: number) => string;
  };
}

const librarySearchContent: Record<Locale, LibrarySearchContent> = {
  en: {
    heroTitle: "Explore the Foundation Library",
    search: {
      placeholder: "Search documents, themes, or keywords...",
      aria: "Search documents",
      submitSr: "Search"
    },
    filters: {
      aria: "Primary filters",
      typeLabel: "Type",
      langLabel: "Language",
      categoryLabel: "Category",
      allTypes: "All types",
      allLanguages: "All languages",
      allCategories: "All categories",
      advancedOpen: "Advanced search",
      advancedClose: "Hide advanced"
    },
    advanced: {
      aria: "Advanced search filters",
      closeSr: "Close advanced search",
      authorLabel: "Author",
      authorPlaceholder: "Enter author name",
      yearFrom: "Publication year (from)",
      yearFromPlaceholder: "e.g. 1900",
      yearTo: "Publication year (to)",
      yearToPlaceholder: "e.g. 2024",
      reset: "Reset all filters"
    },
    toolbar: {
      title: "Results",
      searching: "Searching the collection...",
      refreshing: "Refreshing results...",
      results: (total, page, totalPages) => `${total} document${total === 1 ? "" : "s"} - Page ${page} of ${totalPages}`,
      noResults: "No documents found for this search.",
      start: "Start exploring the library by running a search.",
      filtersButton: "Filters",
      viewGroupAria: "Change view mode",
      viewDetailed: "Detailed view",
      viewCompact: "Compact view",
      sortAria: "Sort results",
      sortOptions: [
        {value: "created_desc", label: "Newest first"},
        {value: "created_asc", label: "Oldest first"},
        {value: "year_desc", label: "Year (desc)"},
        {value: "year_asc", label: "Year (asc)"},
        {value: "title_asc", label: "Title A-Z"},
        {value: "title_desc", label: "Title Z-A"}
      ]
    },
    list: {
      emptyTitle: "No documents match your current filters.",
      emptySubtitle: "Try broadening your search terms or resetting your filters.",
      errorTitle: "We could not load documents."
    },
    unavailable: {
      title: "The digital library is temporarily unavailable",
      message: "We are working to make the digital library content available soon. Please try again later, or contact the Foundation if your request is urgent.",
      retry: "You can keep this page open and try another search later."
    },
    card: {
      metaAria: "Document metadata",
      pagesSuffix: "pages",
      preview: "Preview",
      download: "Download",
      details: "Details"
    },
    pagination: {
      aria: "Pagination",
      prev: "Previous",
      next: "Next",
      page: (page) => `Page ${page}`
    }
  },
  fr: {
    heroTitle: "Explorer la bibliothèque de la fondation",
    search: {
      placeholder: "Rechercher des documents, thèmes ou mots-clés...",
      aria: "Rechercher des documents",
      submitSr: "Rechercher"
    },
    filters: {
      aria: "Filtres principaux",
      typeLabel: "Type",
      langLabel: "Langue",
      categoryLabel: "Catégorie",
      allTypes: "Tous les types",
      allLanguages: "Toutes les langues",
      allCategories: "Toutes les catégories",
      advancedOpen: "Recherche avancée",
      advancedClose: "Masquer l’avancé"
    },
    advanced: {
      aria: "Filtres de recherche avancée",
      closeSr: "Fermer la recherche avancée",
      authorLabel: "Auteur",
      authorPlaceholder: "Saisir le nom de l’auteur",
      yearFrom: "Année de publication (de)",
      yearFromPlaceholder: "ex. 1900",
      yearTo: "Année de publication (à)",
      yearToPlaceholder: "ex. 2024",
      reset: "Réinitialiser les filtres"
    },
    toolbar: {
      title: "Résultats",
      searching: "Recherche dans la collection...",
      refreshing: "Actualisation des résultats...",
      results: (total, page, totalPages) => `${total} document${total === 1 ? "" : "s"} - Page ${page} sur ${totalPages}`,
      noResults: "Aucun document trouvé pour cette recherche.",
      start: "Commencez à explorer la bibliothèque en lançant une recherche.",
      filtersButton: "Filtres",
      viewGroupAria: "Changer le mode d’affichage",
      viewDetailed: "Affichage détaillé",
      viewCompact: "Affichage compact",
      sortAria: "Trier les résultats",
      sortOptions: [
        {value: "created_desc", label: "Plus récents"},
        {value: "created_asc", label: "Plus anciens"},
        {value: "year_desc", label: "Année (décroissant)"},
        {value: "year_asc", label: "Année (croissant)"},
        {value: "title_asc", label: "Titre A-Z"},
        {value: "title_desc", label: "Titre Z-A"}
      ]
    },
    list: {
      emptyTitle: "Aucun document ne correspond à vos filtres.",
      emptySubtitle: "Élargissez vos termes ou réinitialisez les filtres.",
      errorTitle: "Impossible de charger les documents."
    },
    unavailable: {
      title: "La bibliothèque numérique est temporairement indisponible",
      message: "Nous travaillons à rendre le contenu de la bibliothèque numérique disponible prochainement. Veuillez réessayer plus tard ou contacter la Fondation si votre demande est urgente.",
      retry: "Vous pouvez garder cette page ouverte et relancer une recherche plus tard."
    },
    card: {
      metaAria: "Métadonnées du document",
      pagesSuffix: "pages",
      preview: "Aperçu",
      download: "Télécharger",
      details: "Détails"
    },
    pagination: {
      aria: "Pagination",
      prev: "Précédent",
      next: "Suivant",
      page: (page) => `Page ${page}`
    }
  },
  es: {
    heroTitle: "Explorar la biblioteca de la fundación",
    search: {
      placeholder: "Buscar documentos, temas o palabras clave...",
      aria: "Buscar documentos",
      submitSr: "Buscar"
    },
    filters: {
      aria: "Filtros principales",
      typeLabel: "Tipo",
      langLabel: "Idioma",
      categoryLabel: "Categoría",
      allTypes: "Todos los tipos",
      allLanguages: "Todos los idiomas",
      allCategories: "Todas las categorías",
      advancedOpen: "Búsqueda avanzada",
      advancedClose: "Ocultar avanzado"
    },
    advanced: {
      aria: "Filtros de búsqueda avanzada",
      closeSr: "Cerrar búsqueda avanzada",
      authorLabel: "Autor",
      authorPlaceholder: "Ingresa el nombre del autor",
      yearFrom: "Año de publicación (desde)",
      yearFromPlaceholder: "ej. 1900",
      yearTo: "Año de publicación (hasta)",
      yearToPlaceholder: "ej. 2024",
      reset: "Restablecer filtros"
    },
    toolbar: {
      title: "Resultados",
      searching: "Buscando en la colección...",
      refreshing: "Actualizando resultados...",
      results: (total, page, totalPages) => `${total} documento${total === 1 ? "" : "s"} - Página ${page} de ${totalPages}`,
      noResults: "No se encontraron documentos para esta búsqueda.",
      start: "Empieza a explorar la biblioteca realizando una búsqueda.",
      filtersButton: "Filtros",
      viewGroupAria: "Cambiar modo de vista",
      viewDetailed: "Vista detallada",
      viewCompact: "Vista compacta",
      sortAria: "Ordenar resultados",
      sortOptions: [
        {value: "created_desc", label: "Más recientes"},
        {value: "created_asc", label: "Más antiguos"},
        {value: "year_desc", label: "Año (desc)"},
        {value: "year_asc", label: "Año (asc)"},
        {value: "title_asc", label: "Título A-Z"},
        {value: "title_desc", label: "Título Z-A"}
      ]
    },
    list: {
      emptyTitle: "Ningún documento coincide con tus filtros.",
      emptySubtitle: "Amplía los términos o restablece los filtros.",
      errorTitle: "No pudimos cargar los documentos."
    },
    unavailable: {
      title: "La biblioteca digital no está disponible temporalmente",
      message: "Estamos trabajando para que el contenido de la biblioteca digital esté disponible pronto. Inténtelo de nuevo más tarde o contacte con la Fundación si su solicitud es urgente.",
      retry: "Puede mantener esta página abierta e intentar otra búsqueda más tarde."
    },
    card: {
      metaAria: "Metadatos del documento",
      pagesSuffix: "páginas",
      preview: "Vista previa",
      download: "Descargar",
      details: "Detalles"
    },
    pagination: {
      aria: "Paginación",
      prev: "Anterior",
      next: "Siguiente",
      page: (page) => `Página ${page}`
    }
  },
  ar: {
    heroTitle: "المكتبة الرقمية للمؤسسة",
    search: {
      placeholder: "ابحث عن الوثائق أو المواضيع أو الكلمات المفتاحية...",
      aria: "بحث في الوثائق",
      submitSr: "بحث"
    },
    filters: {
      aria: "المرشحات الأساسية",
      typeLabel: "النوع",
      langLabel: "اللغة",
      categoryLabel: "الفئة",
      allTypes: "كل الأنواع",
      allLanguages: "كل اللغات",
      allCategories: "كل الفئات",
      advancedOpen: "بحث متقدم",
      advancedClose: "إخفاء المتقدم"
    },
    advanced: {
      aria: "مرشحات البحث المتقدم",
      closeSr: "إغلاق البحث المتقدم",
      authorLabel: "المؤلف",
      authorPlaceholder: "أدخل اسم المؤلف",
      yearFrom: "سنة النشر (من)",
      yearFromPlaceholder: "مثلاً 1900",
      yearTo: "سنة النشر (إلى)",
      yearToPlaceholder: "مثلاً 2024",
      reset: "إعادة تعيين المرشحات"
    },
    toolbar: {
      title: "النتائج",
      searching: "جاري البحث في المجموعة...",
      refreshing: "تحديث النتائج...",
      results: (total, page, totalPages) => `${total} وثيقة - الصفحة ${page} من ${totalPages}`,
      noResults: "لا توجد وثائق مطابقة لهذا البحث.",
      start: "ابدأ استكشاف المكتبة بإجراء بحث.",
      filtersButton: "مرشحات",
      viewGroupAria: "تغيير وضع العرض",
      viewDetailed: "عرض مفصل",
      viewCompact: "عرض مختصر",
      sortAria: "ترتيب النتائج",
      sortOptions: [
        {value: "created_desc", label: "الأحدث أولاً"},
        {value: "created_asc", label: "الأقدم أولاً"},
        {value: "year_desc", label: "السنة (تنازلي)"},
        {value: "year_asc", label: "السنة (تصاعدي)"},
        {value: "title_asc", label: "العنوان أ-ي"},
        {value: "title_desc", label: "العنوان ي-أ"}
      ]
    },
    list: {
      emptyTitle: "لا توجد وثائق تطابق المرشحات الحالية.",
      emptySubtitle: "جرّب توسيع كلمات البحث أو إعادة تعيين المرشحات.",
      errorTitle: "تعذر تحميل الوثائق."
    },
    unavailable: {
      title: "المكتبة الرقمية غير متاحة مؤقتاً",
      message: "نعمل على إتاحة محتوى المكتبة الرقمية قريباً. يرجى المحاولة لاحقاً، أو التواصل مع المؤسسة إذا كان طلبكم مستعجلاً.",
      retry: "يمكنكم إبقاء الصفحة مفتوحة وإعادة المحاولة لاحقاً."
    },
    card: {
      metaAria: "بيانات الوثيقة",
      pagesSuffix: "صفحة",
      preview: "معاينة",
      download: "تنزيل",
      details: "التفاصيل"
    },
    pagination: {
      aria: "ترقيم الصفحات",
      prev: "السابق",
      next: "التالي",
      page: (page) => `الصفحة ${page}`
    }
  }
};

export function getLibrarySearchContent(locale: Locale): LibrarySearchContent {
  return librarySearchContent[locale] ?? librarySearchContent[defaultLocale];
}

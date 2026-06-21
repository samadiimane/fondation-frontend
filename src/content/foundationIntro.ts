import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface FoundationIntroContent {
  intro: string[];
  tabs: {
    mission: string[];
    vision: string[];
    excellence: string[];
  };
  videoId: string;
  images: {
    primary: string;
    secondary: string;
  };
}

export const foundationIntroContent: Record<Locale, FoundationIntroContent> = {
  en: {
    intro: [
      "The Abdelaziz Khallouk Temsamani Research Foundation preserves and shares Morocco's scientific and historical heritage. We digitize archives, steward collections from Tangier and beyond, and organize these sources according to rigorous academic standards in service of researchers and scholars.",
      "Building on the legacy of Dr. Abdelaziz Khallouk Temsamani's scholarly work, the foundation is committed to fostering a culture of preservation, documentation, publishing, and academic collaboration, ensuring that historical knowledge remains a living, renewable resource for future generations."
    ],
    tabs: {
      mission: [
        "Safeguard scientific and historical collections from Morocco and the wider Mediterranean.",
        "Expand open access to digital archives, journals, and educational resources.",
        "Support researchers with tools, guidance, and publication pathways."
      ],
      vision: [
        "A connected research community where discoveries circulate freely and responsibly.",
        "Heritage that is preserved with rigor and shared with clarity for all audiences.",
        "Collaborations that link Tangier's legacy to global networks of innovation."
      ],
      excellence: [
        "Meticulous digitization and cataloguing standards for lasting preservation.",
        "Editorial quality that honors authorship and strengthens scholarly impact.",
        "Services designed with researchers, librarians, and educators at the center."
      ]
    },
    videoId: "noTczKTP0Ag",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  fr: {
    intro: [
      "La Fondation de recherche Abdelaziz Khallouk Temsamani préserve et partage le patrimoine scientifique et historique du Maroc. Nous numérisons les archives, valorisons les collections de Tanger et d'ailleurs, et organisons ces sources selon des normes académiques rigoureuses au service des chercheurs et des spécialistes.",
      "Dans la continuité du parcours scientifique du Dr Abdelaziz Khallouk Temsamani, la fondation s'engage à ancrer une culture de la conservation, de la documentation, de l'édition et de la collaboration académique, afin que le savoir historique demeure une ressource vivante et renouvelée pour les générations futures."
    ],
    tabs: {
      mission: [
        "Sauvegarder les collections scientifiques et historiques du Maroc et de la Méditerranée.",
        "Étendre l'accès ouvert aux archives numériques, aux revues et aux ressources pédagogiques.",
        "Accompagner les chercheurs avec des outils, des conseils et des parcours de publication."
      ],
      vision: [
        "Une communauté de recherche connectée où les découvertes circulent librement et de manière responsable.",
        "Un patrimoine préservé avec rigueur et partagé clairement avec tous les publics.",
        "Des collaborations qui relient l'héritage de Tanger aux réseaux mondiaux d'innovation."
      ],
      excellence: [
        "Des normes de numérisation et de catalogage exigeantes pour une conservation durable.",
        "Une qualité éditoriale qui valorise les auteurs et renforce l'impact scientifique.",
        "Des services conçus avec les chercheurs, les bibliothécaires et les enseignants au cœur."
      ]
    },
    videoId: "noTczKTP0Ag",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  es: {
    intro: [
      "La Fundación de Investigación Abdelaziz Khallouk Temsamani preserva y comparte el patrimonio científico e histórico de Marruecos. Digitalizamos archivos, custodiamos colecciones de Tánger y otras regiones, y organizamos estas fuentes conforme a rigurosos estándares académicos al servicio de los investigadores y especialistas.",
      "En continuidad con la trayectoria científica del Dr. Abdelaziz Khallouk Temsamani, la fundación se compromete a consolidar una cultura de conservación, documentación, edición y colaboración académica, para que el conocimiento histórico siga siendo un recurso vivo y renovado para las generaciones futuras."
    ],
    tabs: {
      mission: [
        "Proteger colecciones científicas e históricas de Marruecos y del Mediterráneo.",
        "Ampliar el acceso abierto a archivos digitales, revistas y recursos educativos.",
        "Acompañar a los investigadores con herramientas, orientación y vías de publicación."
      ],
      vision: [
        "Una comunidad de investigación conectada donde los hallazgos circulan libre y responsablemente.",
        "Un patrimonio preservado con rigor y compartido con claridad para todos los públicos.",
        "Colaboraciones que vinculan el legado de Tánger con redes globales de innovación."
      ],
      excellence: [
        "Normas exigentes de digitalización y catalogación para una preservación duradera.",
        "Calidad editorial que honra la autoría y refuerza el impacto académico.",
        "Servicios diseñados con investigadores, bibliotecarios y educadores en el centro."
      ]
    },
    videoId: "noTczKTP0Ag",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  ar: {
    intro: [
      "تعمل مؤسسة عبد العزيز خلوق التمسماني للبحث العلمي على حفظ ونشر التراث العلمي والتاريخي للمغرب. نقوم برقمنة الأرشيفات، والعناية بالمجموعات الواردة من طنجة ومناطق أخرى، وتنظيم مصادرها وفق معايير علمية رصينة تخدم الباحثين والدارسين.",
      "تسعى المؤسسة، امتداداً لمسيرة الدكتور عبد العزيز خلوق التمسماني العلمية، إلى ترسيخ ثقافة الحفظ والتوثيق والنشر والتعاون الأكاديمي، لتظل المعرفة التاريخية مورداً حياً ومتجدداً للأجيال القادمة."
    ],
    tabs: {
      mission: [
        "حماية وإبراز المجموعات العلمية والتاريخية الخاصة بالمغرب في محيطه الدولي ضمن فضاءات: المتوسط، المحيط الاطلسي، الشرق الأوسطـ، العمق الإفريقي.",
        "توسيع نطاق الوصول المفتوح إلى الأرشيفات الرقمية والمجلات العلمية والموارد التعليمية.",
        "مواكبة الباحثين بالأدوات والإرشاد ومسارات النشر الأكاديمي."
      ],
      vision: [
        "مجتمع بحثي مترابط تتداول فيه الاكتشافات بحرية ومسؤولية علمية.",
        "تراث محفوظ بدقة ومنهجية، ومُتاح بوضوح لمختلف الفئات والمستويات.",
        "شراكات علمية تربط إرث طنجة التاريخي بشبكات الابتكار والبحث العالمية."
      ],
      excellence: [
        "معايير دقيقة في الرقمنة والفهرسة لضمان حفظ مستدام للوثائق والمصادر.",
        "جودة تحريرية تحترم حقوق المؤلفين وتعزز الأثر العلمي للأبحاث المنشورة.",
        "خدمات مصممة بما يضع الباحثين وأمناء المكتبات والمربين في صلب اهتماماتها."
      ]
    },
    videoId: "noTczKTP0Ag",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  }
};

export function getFoundationIntroContent(locale: Locale): FoundationIntroContent {
  const resolvedLocale = foundationIntroContent[locale] ? locale : defaultLocale;
  return foundationIntroContent[resolvedLocale];
}

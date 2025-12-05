import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface FoundationIntroContent {
  heroTitle: string;
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
    heroTitle: "Foundation & Founder",
    intro: [
      "The Abdelaziz Khallouk Temsamani Research Foundation preserves and shares Morocco’s scientific and historical heritage. We digitize archives, steward collections from Tangier and beyond, and build platforms that make research accessible to scholars, students, and the public.",
      "Founded by Dr. Abdelaziz Khallouk Temsamani, the foundation bridges tradition and innovation—supporting conservation, publishing, and collaboration so that knowledge remains a living resource for future generations."
    ],
    tabs: {
      mission: [
        "Safeguard and promote scientific and historical collections from Morocco and the wider Mediterranean.",
        "Expand open access to digital archives, journals, and educational resources.",
        "Support researchers with tools, guidance, and publication pathways."
      ],
      vision: [
        "A connected research community where discoveries circulate freely and responsibly.",
        "Heritage that is preserved with rigor and shared with clarity for all audiences.",
        "Collaborations that link Tangier’s legacy to global networks of innovation."
      ],
      excellence: [
        "Meticulous digitization and cataloguing standards for lasting preservation.",
        "Editorial quality that honors authorship and strengthens scholarly impact.",
        "Services designed with researchers, librarians, and educators at the center."
      ]
    },
    videoId: "XxVg_s8xAms",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  fr: {
    heroTitle: "Fondation & Fondateur",
    intro: [
      "La Fondation de recherche Abdelaziz Khallouk Temsamani préserve et partage le patrimoine scientifique et historique du Maroc. Nous numérisons les archives, valorisons les collections de Tanger et d’ailleurs, et créons des plateformes pour rendre la recherche accessible aux chercheurs, aux étudiants et au grand public.",
      "Fondée par le Dr Abdelaziz Khallouk Temsamani, la fondation relie tradition et innovation : elle soutient la conservation, l’édition et la collaboration afin que le savoir reste une ressource vivante pour les générations futures."
    ],
    tabs: {
      mission: [
        "Sauvegarder et promouvoir les collections scientifiques et historiques du Maroc et de la Méditerranée.",
        "Étendre l’accès ouvert aux archives numériques, aux revues et aux ressources pédagogiques.",
        "Accompagner les chercheurs avec des outils, des conseils et des parcours de publication."
      ],
      vision: [
        "Une communauté de recherche connectée où les découvertes circulent librement et de manière responsable.",
        "Un patrimoine préservé avec rigueur et partagé clairement avec tous les publics.",
        "Des collaborations qui relient l’héritage de Tanger aux réseaux mondiaux d’innovation."
      ],
      excellence: [
        "Des normes de numérisation et de catalogage exigeantes pour une conservation durable.",
        "Une qualité éditoriale qui valorise les auteurs et renforce l’impact scientifique.",
        "Des services conçus avec les chercheurs, les bibliothécaires et les enseignants au cœur."
      ]
    },
    videoId: "XxVg_s8xAms",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  es: {
    heroTitle: "Fundación y fundador",
    intro: [
      "La Fundación de Investigación Abdelaziz Khallouk Temsamani preserva y comparte el patrimonio científico e histórico de Marruecos. Digitalizamos archivos, custodiamos colecciones de Tánger y otras regiones y creamos plataformas que acercan la investigación a académicos, estudiantes y al público.",
      "Creada por el Dr. Abdelaziz Khallouk Temsamani, la fundación une tradición e innovación: impulsa la conservación, la edición y la colaboración para que el conocimiento siga vivo para las futuras generaciones."
    ],
    tabs: {
      mission: [
        "Proteger y promover colecciones científicas e históricas de Marruecos y del Mediterráneo.",
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
    videoId: "XxVg_s8xAms",
    images: {
      primary: "/assets/images/difference/fondation.jpg",
      secondary: "/assets/images/difference/temsamani.png"
    }
  },
  ar: {
    heroTitle: "المؤسسة والمؤسس",
    intro: [
      "تعمل مؤسسة عبد العزيز خلوف تمسماني للبحث على حفظ ونشر التراث العلمي والتاريخي للمغرب. نقوم برقمنة الأرشيفات، ورعاية المجموعات القادمة من طنجة ومناطق أخرى، ونبني منصات تجعل البحث متاحاً للعلماء والطلاب والجمهور.",
      "أسسها الدكتور عبد العزيز خلوف تمسماني لربط التقليد بالابتكار، ودعم الحفظ والنشر والتعاون حتى يبقى العلم مورداً حياً للأجيال القادمة."
    ],
    tabs: {
      mission: [
        "حماية وإبراز المجموعات العلمية والتاريخية من المغرب ومنطقة البحر الأبيض المتوسط.",
        "توسيع الوصول المفتوح إلى الأرشيفات الرقمية والمجلات والموارد التعليمية.",
        "مساندة الباحثين بالأدوات والإرشاد ومسارات النشر."
      ],
      vision: [
        "مجتمع بحثي مترابط تتداول فيه الاكتشافات بحرية ومسؤولية.",
        "تراث محفوظ بدقة ويُقدَّم بوضوح لمختلف الفئات.",
        "شراكات تربط إرث طنجة بشبكات الابتكار العالمية."
      ],
      excellence: [
        "معايير دقيقة للرقمنة والفهرسة لضمان حفظ مستدام.",
        "جودة تحريرية تحترم حقوق المؤلف وتعزز الأثر العلمي.",
        "خدمات مصممة بوضع الباحثين وأمناء المكتبات والمربين في المركز."
      ]
    },
    videoId: "XxVg_s8xAms",
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

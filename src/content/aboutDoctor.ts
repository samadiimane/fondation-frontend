import {defaultLocale} from "@/i18n/config";
import {Locale} from "@/types/i18n";

export interface AboutDoctorContent {
  hero: {
    name: string;
    title: string;
    eyebrow?: string;
    subtitle: string;
    imageAlt?: string;
    lifespan?: string;
    birthplace?: string;
    degree?: string;
    intro: string[];
    ctaLabel: string;
  };
  nav: {
    biography: string;
  };
  formation?: {
    title: string;
    subtitle: string;
    intro: string[];
    cards: Array<{
      title: string;
      description: string;
    }>;
    quote?: string;
  };
  biography: {
    title: string;
    subtitle?: string;
    milestones?: Array<{
      period: string;
      category: string;
      title: string;
      place: string;
      description: string;
    }>;
    educationTitle?: string;
    education?: Array<{
      year: string;
      degree: string;
      institution: string;
      thesis?: string;
    }>;
    careerTitle?: string;
    career?: Array<{
      period: string;
      title: string;
      institution: string;
      description: string;
    }>;
  };
  methodology?: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    quote: string;
    quoteSource?: string;
    principles: Array<{
      title: string;
      description: string;
    }>;
  };
  journals?: {
    title: string;
    intro: string;
    highlight: string;
    highlightSource: string;
    items: Array<{
      key: string;
      title: string;
      image?: string;
      imageAlt?: string;
      period: string;
      description: string;
    }>;
  };
  publications: {
    title: string;
    intro: string;
    listTitle: string;
    items: Array<{
      title: string;
      meta: string;
    }>;
    ctaLabel: string;
    ctaHref: string;
  };
  archive?: {
    title: string;
    controls: {
      previous: string;
      next: string;
    };
    groups: Array<{
      key: string;
      images: Array<{
        src: string;
        alt: string;
        caption?: string;
      }>;
    }>;
  };
}

const doctorBibliographyItems: AboutDoctorContent["publications"]["items"] = [
  {
    title: "Pays Jbala : Makhzen, Espagne et Ahmed Raissouni",
    meta: "طنجة، الطبعة الأولى 1995؛ الطبعة الثانية 1996"
  },
  {
    title: "بحوث ونصوص حول تاريخ المغرب المعاصر",
    meta: "طنجة، 1996"
  },
  {
    title: "حفريات في تاريخ المغرب المعاصر",
    meta: "طنجة، 1996"
  },
  {
    title: "ملامح من تاريخ طنجة المعاصر (1792-1947)",
    meta: "طنجة، 1996"
  },
  {
    title: "دراسات في تاريخ شمال المغرب المعاصر",
    meta: "طنجة، 1996"
  },
  {
    title: "مقالات ووثائق حول تاريخ المغرب المعاصر",
    meta: "طنجة، 1997"
  },
  {
    title: "الحركة الريسونية من خلال الوثائق المغربية",
    meta: "جزآن، طنجة، 1997"
  },
  {
    title: "العلاقات الإسبانية المغربية في نهاية القرن 19 من خلال الأرشيف الديبلوماسي (1884-1898)",
    meta: "المحمدية، 1997"
  },
  {
    title: "تقديم ونشر كتاب: رحلة الجلالة المحمدية إلى طنجة عاصمتها الديبلوماسية",
    meta: "لأحمد بن محمد الكردودي الكلالي، طنجة، 1997"
  },
  {
    title: "تأملات في تاريخ المغرب المعاصر من خلال التقاييد والرؤى",
    meta: "طنجة، 1998"
  },
  {
    title: "تقديم ونشر كتاب: الرحلة الطنجوية الممزوجة بالمناسك المالكية",
    meta: "للمحسن بن محمد الغسال، طنجة، 1998"
  },
  {
    title: "طنجة الدولية من خلال الوثائق",
    meta: "دراسة بدعم من وزارة الثقافة، 2000؛ لم يكتب لها النشر"
  }
];

const archiveManuscriptImagePaths = Array.from(
  {length: 16},
  (_, index) => `/assets/images/difference/manu${index + 1}.jpg`
);

function createDoctorArchiveContent(copy: {
  title: string;
  manuscriptAlt: string;
  manuscriptCaption: string;
  previousLabel: string;
  nextLabel: string;
}): NonNullable<AboutDoctorContent["archive"]> {
  return {
    title: copy.title,
    controls: {
      previous: copy.previousLabel,
      next: copy.nextLabel
    },
    groups: [
      {
        key: "manuscripts",
        images: archiveManuscriptImagePaths.map((src, index) => ({
          src,
          alt: `${copy.manuscriptAlt} ${index + 1}`,
          caption: copy.manuscriptCaption
        }))
      },
      {
        key: "press",
        images: []
      }
    ]
  };
}

const aboutDoctorContent: Record<Locale, AboutDoctorContent> = {
  en: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      eyebrow: "Historian and researcher in the modern history of Northern Morocco",
      subtitle:
        "A scholarly path devoted to documents and archives for understanding the history of Tangier and Northern Morocco, and rereading historical memory with critical method.",
      imageAlt: "Portrait of Dr. Abdelaziz Khallouk Temsamani",
      intro: [
        "Abdelaziz Khallouk Temsamani was not simply a historian concerned with recording events; his scholarly project made the document an entry point for questioning memory and reconstructing the history of Northern Morocco.",
        "From Tangier, and specifically Hay Al-Mesalla, his early intellectual awareness was shaped by reading and knowledge before expanding through a self-directed formation across languages and sources."
      ],
      ctaLabel: "Read full biography (PDF)"
    },
    nav: {
      biography: "Biography",
    },
    formation: {
      title: "Intellectual Formation and the Beginnings of Critical Awareness",
      subtitle: "From Hay Al-Mesalla to the horizon of historical inquiry",
      intro: [
        "Temsamani's intellectual formation was shaped by wide reading, encouraged from childhood and pursued independently across Arabic, French, and Spanish sources.",
        "This early culture of reading connected literature, thought, history, and politics, and later informed his documentary method and his attention to the archives of Tangier and Northern Morocco."
      ],
      cards: [
        {
          title: "Self-Education and Reading",
          description: "His formation relied on sustained personal reading and a disciplined search for knowledge beyond narrow cultural routines.",
        },
        {
          title: "Languages and Sources",
          description: "Arabic, French, and Spanish opened multiple documentary and intellectual horizons across history, literature, thought, and politics.",
        },
        {
          title: "Critical Inquiry",
          description: "His work gradually moved toward independent questioning and a documentary approach to historical memory.",
        }
      ],
      quote: "I read widely, and in a self-directed way, major works in Arabic, French, and Spanish."
    },
    biography: {
      title: "Academic Biography",
      educationTitle: "Education",
      education: [
        {
          year: "1975",
          degree: "Ph.D. in History",
          institution: "University of Mohammed V, Rabat",
          thesis: 'Thesis: "Commercial and Cultural Relations Between Morocco and Andalusia"'
        },
        {
          year: "1968",
          degree: "Licence in History",
          institution: "University of Mohammed V, Rabat"
        }
      ],
      careerTitle: "Academic Career",
      career: [
        {
          period: "1985-2010",
          title: "Professor of Modern History",
          institution: "University of Abdelmalek Essaâdi",
          description: "Led groundbreaking research in North African urban history and cultural heritage preservation."
        },
        {
          period: "1990-2005",
          title: "Director",
          institution: "Center for Historical and Social Studies, Tetouan",
          description: "Established innovative methodologies for archival research and community engagement."
        },
        {
          period: "1995-2010",
          title: "Advisor to the Ministry of Culture",
          institution: "Kingdom of Morocco",
          description: "Provided expertise on heritage preservation and cultural documentation policies."
        }
      ]
    },
    publications: {
      title: "Scholarly Works and Publications",
      intro:
        "For Abdelaziz Khallouk Temsamani, authorship was a direct extension of his historical method: the book remained a space for questioning documents, organizing historical material, and revisiting issues long shaped by reduction or ready-made readings.",
      listTitle: "Selected examples of his works",
      items: doctorBibliographyItems,
      ctaLabel: "Read the doctor's works in the library",
      ctaHref: "/library"
    },
    archive: createDoctorArchiveContent({
      title: "The Memory Cabinet: Documents and Images from a Scholarly Path",
      manuscriptAlt: "Archival document",
      manuscriptCaption: "Archival document",
      previousLabel: "Previous archival image",
      nextLabel: "Next archival image"
    }),
  },
  fr: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr",
      subtitle: "Historien marocain éminent et chercheur en patrimoine",
      lifespan: "1945 - 2010",
      birthplace: "Né à Tétouan, Maroc",
      degree: "Doctorat en histoire",
      intro: [
        "Le Dr Abdelaziz Khallouk Temsamani (1945-2010) était un historien et chercheur marocain dont les travaux ont profondément façonné la compréhension contemporaine de l'histoire et du patrimoine culturel nord-africains.",
        'Il a obtenu son doctorat en histoire à l’Université Mohammed V de Rabat avec la plus haute mention. Sa thèse intitulée "Relations commerciales et culturelles entre le Maroc et l’Andalousie" a fondé ses recherches ultérieures.'
      ],
      ctaLabel: "Lire la biographie complète (PDF)"
    },
    nav: {
      biography: "Biographie",
    },
    biography: {
      title: "Biographie académique",
      educationTitle: "Formation",
      education: [
        {
          year: "1975",
          degree: "Doctorat en histoire",
          institution: "Université Mohammed V, Rabat",
          thesis: 'Thèse : "Relations commerciales et culturelles entre le Maroc et l’Andalousie"'
        },
        {
          year: "1968",
          degree: "Licence en histoire",
          institution: "Université Mohammed V, Rabat"
        }
      ],
      careerTitle: "Parcours académique",
      career: [
        {
          period: "1985-2010",
          title: "Professeur d’histoire moderne",
          institution: "Université Abdelmalek Essaâdi",
          description: "A mené des recherches pionnières sur l’histoire urbaine nord-africaine et la sauvegarde du patrimoine."
        },
        {
          period: "1990-2005",
          title: "Directeur",
          institution: "Centre d’études historiques et sociales, Tétouan",
          description: "A instauré des méthodologies innovantes pour la recherche archivistique et l’engagement communautaire."
        },
        {
          period: "1995-2010",
          title: "Conseiller au ministère de la Culture",
          institution: "Royaume du Maroc",
          description: "Expert des politiques de préservation et de documentation du patrimoine."
        }
      ]
    },
    publications: {
      title: "Œuvres scientifiques et publications",
      intro:
        "Chez Abdelaziz Khallouk Temsamani, l'écriture prolonge directement sa méthode historique : le livre demeure un espace d'interrogation du document, d'organisation de la matière historique et de relecture de questions longtemps réduites par des interprétations toutes faites.",
      listTitle: "Exemples choisis de ses travaux",
      items: doctorBibliographyItems,
      ctaLabel: "Lire les œuvres du docteur dans la bibliothèque",
      ctaHref: "/library"
    },
    archive: createDoctorArchiveContent({
      title: "Le cabinet de la mémoire : documents et images d'un parcours",
      manuscriptAlt: "Document d'archive",
      manuscriptCaption: "Document d'archive",
      previousLabel: "Image d'archive précédente",
      nextLabel: "Image d'archive suivante"
    }),
  },
  es: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      subtitle: "Historiador marroquí y especialista en patrimonio cultural",
      lifespan: "1945 - 2010",
      birthplace: "Nacido en Tetuán, Marruecos",
      degree: "Doctor en Historia",
      intro: [
        "El Dr. Abdelaziz Khallouk Temsamani (1945-2010) fue un historiador marroquí cuya obra transformó la comprensión contemporánea de la historia y el patrimonio cultural del norte de África.",
        'Obtuvo su doctorado en Historia en la Universidad Mohammed V de Rabat con máximos honores. Su tesis, "Relaciones comerciales y culturales entre Marruecos y Al-Ándalus", marcó el eje de su investigación posterior.'
      ],
      ctaLabel: "Leer biografía completa (PDF)"
    },
    nav: {
      biography: "Biografía",
    },
    biography: {
      title: "Biografía académica",
      educationTitle: "Formación",
      education: [
        {
          year: "1975",
          degree: "Doctorado en Historia",
          institution: "Universidad Mohammed V, Rabat",
          thesis: 'Tesis: "Relaciones comerciales y culturales entre Marruecos y Al-Ándalus"'
        },
        {
          year: "1968",
          degree: "Licenciatura en Historia",
          institution: "Universidad Mohammed V, Rabat"
        }
      ],
      careerTitle: "Trayectoria académica",
      career: [
        {
          period: "1985-2010",
          title: "Profesor de Historia Moderna",
          institution: "Universidad Abdelmalek Essaâdi",
          description: "Dirigió investigaciones pioneras sobre historia urbana y preservación patrimonial en el norte de África."
        },
        {
          period: "1990-2005",
          title: "Director",
          institution: "Centro de Estudios Históricos y Sociales, Tetuán",
          description: "Impulsó metodologías innovadoras para la investigación archivística y la participación comunitaria."
        },
        {
          period: "1995-2010",
          title: "Asesor del Ministerio de Cultura",
          institution: "Reino de Marruecos",
          description: "Brindó experiencia en preservación del patrimonio y políticas de documentación cultural."
        }
      ]
    },
    publications: {
      title: "Obra científica y publicaciones",
      intro:
        "Para Abdelaziz Khallouk Temsamani, la escritura fue una prolongación directa de su método histórico: el libro siguió siendo un espacio para interrogar documentos, ordenar material histórico y revisar cuestiones marcadas por lecturas reductoras o ya establecidas.",
      listTitle: "Ejemplos seleccionados de sus obras",
      items: doctorBibliographyItems,
      ctaLabel: "Leer las obras del doctor en la biblioteca",
      ctaHref: "/library"
    },
    archive: createDoctorArchiveContent({
      title: "El gabinete de la memoria: documentos e imágenes de una trayectoria",
      manuscriptAlt: "Documento de archivo",
      manuscriptCaption: "Documento de archivo",
      previousLabel: "Imagen de archivo anterior",
      nextLabel: "Imagen de archivo siguiente"
    }),
  },
  ar: {
    hero: {
      name: "عبد العزيز خلوق التمسماني",
      title: "د.",
      subtitle: "مؤرخ مغربي في تاريخ المغرب المعاصر والشمال",
      lifespan: "1943 - 2008",
      birthplace: "ولد في تطوان، المغرب",
      degree: "دكتوراه في التاريخ",
      intro: [
      "يُعدّ الدكتور عبد العزيز خلوق التمسماني من أبرز المؤرخين المغاربة الذين اهتموا بتاريخ المغرب المعاصر، خاصة في المنطقة الشمالية.",
      "كرّس جزءًا كبيرًا من عمله لجمع الوثائق والأرشيفات ودراسة التحولات السياسية والاجتماعية والاقتصادية بالمغرب خلال القرنين التاسع عشر والعشرين."
    ],
      ctaLabel: "ذاكرة مؤرخ",
    },
    nav: {
      biography: "السيرة الذاتية",
    },
    biography: {
      title: "محطات من المسار العلمي والأكاديمي",
      subtitle:
        "من التكوين الأول إلى البحث الجامعي، تشكل مسار عبد العزيز خلوق التمسماني عبر محطات جمعت بين التدريس، والتحصيل الأكاديمي، والاشتغال الوثائقي على تاريخ طنجة وشمال المغرب.",
      milestones: [
        {
          period: "1943",
          category: "البدايات",
          title: "النشأة في طنجة",
          place: "حي المصلى، طنجة",
          description:
            "ولد عبد العزيز خلوق التمسماني سنة 1943 بحي المصلى بطنجة، في وسط عائلي شجع مساره التعليمي وفتح أمامه مبكرا أفق القراءة والمعرفة."
        },
        {
          period: "1961",
          category: "التكوين",
          title: "مدرسة المعلمين بمراكش",
          place: "مدرسة المعلمين بالقصبة، مراكش",
          description:
            "بعد نهاية التكوين الابتدائي والثانوي بطنجة، انتقل إلى مراكش حيث عُيّن معلما متدربا بمدرسة المعلمين بالقصبة، فالتحق بالقسم الفرنسي وتخرّج متفوقا داخل فصله."
        },
        {
          period: "بعد التخرج",
          category: "التدريس",
          title: "البدايات المهنية بطنجة",
          place: "مدرسة بني مكادة، طنجة",
          description:
            "بدأ مساره المهني معلما بمدرسة بني مكادة بطنجة، ثم أستاذا للغة الفرنسية بالسلك الأول، قبل أن يلتحق بمدرسة المعلمين أستاذا لمادة البيداغوجيا عقب حصوله على الإجازة."
        },
        {
          period: "1978",
          category: "البحث الجامعي",
          title: "دكتوراه السلك الثالث",
          place: "جامعة بوردو، فرنسا",
          description:
            "حصل سنة 1978 على دكتوراه السلك الثالث من جامعة بوردو، ببحث تناول فيه قيمة تراث النوازل في دراسة تطور اقتصاد المغرب الإسلامي خلال العصر الوسيط، اعتمادا على نموذج نوازل البرزلي، تحت إشراف الأستاذ روحي هادي إدريس."
        },
        {
          period: "ابتداء من 1980",
          category: "تحول علمي",
          title: "الانتقال إلى تاريخ المغرب المعاصر",
          place: "فرنسا / تاريخ منطقة جبالة",
          description:
            "ابتداء من سنة 1980، اتجه إلى الاشتغال على الفترة المعاصرة، فأنجز أطروحة الدولة حول تطور أوضاع منطقة جبالة في نهاية القرن التاسع عشر ومطلع القرن العشرين، في ضوء الأطماع الإسبانية، وطموحات أحمد الريسوني، وأزمات المخزن المغربي."
        },
        {
          period: "المسار الجامعي",
          category: "الجامعة",
          title: "التدريس الجامعي",
          place: "تطوان، الرباط، ثم تطوان",
          description:
            "درّس بكلية أصول الدين بمدينة تطوان، ثم بكلية الآداب والعلوم الإنسانية بالرباط، قبل أن يواصل مساره أستاذا للتعليم العالي بشعبة التاريخ بكلية الآداب بتطوان."
        },
        {
          period: "1984",
          category: "منعطف مؤسساتي",
          title: "إطلاق مجلة دار النيابة",
          place: "طنجة",
          description:
            "مع مطلع سنة 1984، ساهم في تنظيم الاشتغال الجماعي حول تاريخ المغرب وشماله من خلال إصدار مجلة دار النيابة الى جانب الدكتور محمد الأمين البزاز، التي تحولت إلى منبر متخصص استقطب باحثين مغاربة وأجانب في في حقل الدراسات التاريخية وطنيا ودوليا."
        }
      ]
    },
    methodology: {
      eyebrow: "منهجه في كتابة التاريخ",
      title: "الوثيقة بوصفها مدخلاً إلى إعادة بناء الكتابة التاريخية و الذاكرة",
      subtitle:
        "لم يكن اشتغال الدكتور عبد العزيز خلوق التمسماني على تاريخ الشمال المغربي مجرد جمعٍ للوقائع، بل كان سعياً منهجياً إلى مساءلة الروايات المتداولة، واستنطاق الوثائق، وتصحيح ما تراكم من أحكام جاهزة حول تاريخ المنطقة.",
      body:
        "ينطلق مشروعه التاريخي من وعي عميق بأن الخصاص في دراسة تاريخ طنجة ومنطقتي جبالة والريف لم يكن راجعاً إلى ندرة المادة الوثائقية بقدر ما كان نتيجة لهيمنة قراءات كولونيالية متهافتة، ومحدودية بعض المقاربات التقليدية، وغياب الوثيقة الغميسة عن كثير من محاولات الفهم والتأويل. لذلك جعل من الأرشيف، ومن الوثائق المخزنية والدبلوماسية والمحلية، أساساً لإعادة النظر في تاريخ الشمال المغربي، وإضاءة مناطقه المعتمة، وردّ الاعتبار إلى تعقيداته السياسية والاجتماعية والثقافية.",
      quote:
        "لقد فتح الاشتغال على الوثائق إمكانيات هائلة أمام مشاريع إعادة الأمور إلى نصابها عبر تصحيح الأخطاء الجسيمة التي ارتبطت بتاريخنا، وعبر إضاءة نقاط الظلام الكثيف الذي كان يكتنف هذا التاريخ.",
      quoteSource: "من حوار مع المؤرخ عبد العزيز خلوق التمسماني",
      principles: [
        {
          title: "استنطاق الوثيقة",
          description:
            "اعتمد التمسماني على الوثيقة بوصفها شاهداً لا يكتفي بتأكيد الرواية، بل يفتح إمكانات جديدة للسؤال، والمراجعة، وإعادة تركيب الوقائع في سياقاتها التاريخية."
        },
        {
          title: "نقد الروايات الجاهزة",
          description:
            "واجه في أعماله آثار الكتابات الكولونيالية والقراءات التقليدية التي اختزلت تاريخ الشمال، وسعى إلى تفكيك الأحكام المسبقة التي حجبت كثيراً من تعقيدات المجال والإنسان والمؤسسة."
        },
        {
          title: "إعادة كتابة تاريخ الشمال",
          description:
            "لم يكن تاريخ طنجة وجبالة والريف عنده موضوعاً محلياً ضيقاً، بل مدخلاً لفهم علاقة المغرب بمحيطه المتوسطي، وبالتحولات الدبلوماسية والسياسية التي وسمت العصرين الحديث والمعاصر."
        },
        {
          title: "العمل العلمي الجماعي",
          description:
            "كان واعياً بأن إعادة بناء الذاكرة التاريخية تتجاوز إمكانات الفرد الواحد، لذلك ارتبط مشروعه بإطلاق منابر علمية متخصصة، وفي مقدمتها مجلة دار النيابة، لتوسيع دائرة البحث والتوثيق."
        }
      ]
    },
    journals: {
      title: "منابر البحث التاريخي: مجلتا 'دار النيابة' و'الطنجيون'",
      intro:
        "توزّع الاشتغال العلمي للدكتور عبد العزيز خلوق التمسماني على قضايا مترابطة في تاريخ طنجة وشمال المغرب، من تاريخ جبالة والريف، والعلاقات المغربية الإسبانية وقضية الصحراء المغربية، إلى الوثائق المخزنية والدبلوماسية، والتحولات الحضرية والثقافية والاجتماعية للمدينة. غير أن هذه المحاور لم تكن عنده موضوعات متفرقة، بل كانت أجزاء من مشروع واحد يقوم على استنطاق الوثيقة، ونقد الروايات الجاهزة، وإعادة بناء الذاكرة التاريخية على أسس علمية رصينة. ومن هنا تبرز أهمية «مجلة دار النيابة» و«الطنجيون»؛ فالأولى مثّلت امتداداً لاهتمامه بالمؤسسة المخزنية الطنجية والأرشيف الدبلوماسي، والثانية وسّعت أفق البحث نحو تاريخ طنجة في أبعاده الحضارية والإنسانية والمعمارية والثقافية. وبذلك تحولت الدوريتان من مجرد فضاء للنشر إلى تعبير مؤسساتي عن مشروعه في حفظ الذاكرة، وتنظيم البحث الجماعي، وردّ الاعتبار لتاريخ الشمال المغربي من داخل الوثيقة لا من خارجها.",
      highlight:
        "إن ما قام به عبد العزيز خلوق التمسماني هو عمل جماعة ومؤسسة، وليس عمل فرد أو اثنين.",
      highlightSource: "من نص ذاكرة مؤرخ",
      items: [
        {
          key: "darAlNiaba",
          title: "مجلة دار النيابة",
          image: "/assets/images/difference/dar-al-niaba.png",
          imageAlt: "غلاف مجلة دار النيابة",
          period: "صدرت أولى أعدادها مطلع سنة 1984",
          description:
            "منبر متخصص أعاد توجيه البحث نحو دار النيابة بطنجة، ووثائقها الدبلوماسية، وتاريخ المغرب وشماله في القرن التاسع عشر وبدايات القرن العشرين."
        },
        {
          key: "tangerois",
          title: "الطنجيون",
          image: "/assets/images/difference/tangerois.jpg",
          imageAlt: "غلاف مجلة الطنجيون",
          period: "تجربة وثائقية لاحقة متخصصة في تاريخ طنجة",
          description:
            "امتداد لسؤال التوثيق والذاكرة، ركز على طنجة بوصفها مجالاً حضرياً وثقافياً تتقاطع فيه التحولات الاجتماعية والاقتصادية والمعمارية."
        }
      ],
    },
    publications: {
      title: " مختارات من آثاره العلمية ومؤلفاته",
      intro:
        "شكّل التأليف عند عبد العزيز خلوق التمسماني امتداداً مباشراً لمنهجه في البحث التاريخي؛ فقد ظل الكتاب عنده مجالاً لاستنطاق الوثيقة، وترتيب المادة التاريخية، وإعادة النظر في قضايا ظلّت محكومة بالاختزال أو القراءة الجاهزة. ولذلك جاءت أعماله موزعة بين الدراسة، والتحقيق، والنشر، وتجميع النصوص والوثائق، بما يخدم مشروعاً أوسع في صيانة الذاكرة التاريخية لشمال المغرب.",
      listTitle: "نماذج مختارة من أعماله",
      items: doctorBibliographyItems,
      ctaLabel: "قراءة أعمال الدكتور في المكتبة",
      ctaHref: "/library"
    },
    archive: createDoctorArchiveContent({
      title: "خزانة الذاكرة : وثائق وصور من المسار",
      manuscriptAlt: "وثيقة أرشيفية رقم",
      manuscriptCaption: "وثيقة أرشيفية",
      previousLabel: "الصورة الأرشيفية السابقة",
      nextLabel: "الصورة الأرشيفية التالية"
    }),
  }
};

type AboutDoctorTopContent = {
  hero: AboutDoctorContent["hero"];
  formation: NonNullable<AboutDoctorContent["formation"]>;
};

const aboutDoctorTopContent: Partial<Record<Locale, AboutDoctorTopContent>> = {
  fr: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      eyebrow: "Historien et chercheur en histoire contemporaine du Nord du Maroc",
      subtitle:
        "Un parcours scientifique consacré aux documents et aux archives pour comprendre l'histoire de Tanger et du Nord du Maroc, et relire la mémoire historique avec méthode critique.",
      imageAlt: "Portrait du Dr Abdelaziz Khallouk Temsamani",
      intro: [
        "Abdelaziz Khallouk Temsamani n'était pas seulement un historien soucieux de consigner les faits; son projet scientifique a fait du document un point d'entrée pour interroger la mémoire et reconstruire l'histoire du Nord marocain.",
        "Depuis Tanger, et plus précisément Hay Al-Mesalla, sa conscience intellectuelle s'est formée par la lecture et le savoir, avant de s'élargir grâce à une formation autodidacte ouverte sur plusieurs langues et sources."
      ],
      ctaLabel: "Lire la biographie complète (PDF)"
    },
    formation: {
      title: "Formation intellectuelle et débuts de la conscience critique",
      subtitle: "De Hay Al-Mesalla à l'horizon du questionnement historique",
      intro: [
        "La formation intellectuelle de Temsamani s'est construite par une lecture large, encouragée dès l'enfance puis poursuivie de manière autonome et régulière.",
        "L'arabe, le français et l'espagnol lui ont ouvert des horizons documentaires et intellectuels dans la pensée, la littérature, l'histoire et la politique."
      ],
      cards: [
        {
          title: "Autodidaxie et lecture",
          description: "Sa formation s'est appuyée sur une lecture soutenue et une recherche disciplinée du savoir.",
        },
        {
          title: "Langues et sources",
          description: "L'arabe, le français et l'espagnol ont ouvert plusieurs horizons documentaires et intellectuels.",
        },
        {
          title: "Questionnement critique",
          description: "Son travail s'est orienté vers une pensée indépendante et une approche documentaire de la mémoire historique.",
        }
      ],
      quote: "J'ai beaucoup lu, de manière autodidacte, les grandes oeuvres en arabe, en français et en espagnol."
    }
  },
  es: {
    hero: {
      name: "Abdelaziz Khallouk Temsamani",
      title: "Dr.",
      eyebrow: "Historiador e investigador de la historia contemporánea del norte de Marruecos",
      subtitle:
        "Una trayectoria académica dedicada a los documentos y archivos para comprender la historia de Tánger y del norte de Marruecos, y releer la memoria histórica con método crítico.",
      imageAlt: "Retrato del Dr. Abdelaziz Khallouk Temsamani",
      intro: [
        "Abdelaziz Khallouk Temsamani no fue solo un historiador dedicado a registrar hechos; su proyecto científico convirtió el documento en una vía para interrogar la memoria y reconstruir la historia del norte marroquí.",
        "Desde Tánger, y más concretamente desde Hay Al-Mesalla, su conciencia intelectual se formó a través de la lectura y el conocimiento antes de ampliarse mediante una formación autodidacta en varias lenguas y fuentes."
      ],
      ctaLabel: "Leer la biografía completa (PDF)"
    },
    formation: {
      title: "Formación intelectual e inicios de la conciencia crítica",
      subtitle: "De Hay Al-Mesalla al horizonte de la pregunta histórica",
      intro: [
        "La formación intelectual de Temsamani se construyó mediante una lectura amplia, alentada desde la infancia y continuada de forma autónoma y constante.",
        "El árabe, el francés y el español le abrieron horizontes documentales e intelectuales en el pensamiento, la literatura, la historia y la política."
      ],
      cards: [
        {
          title: "Autodidaxia y lectura",
          description: "Su formación se apoyó en la lectura sostenida y en una búsqueda disciplinada del conocimiento.",
        },
        {
          title: "Lenguas y fuentes",
          description: "El árabe, el francés y el español abrieron varios horizontes documentales e intelectuales.",
        },
        {
          title: "Pregunta crítica",
          description: "Su obra avanzó hacia el pensamiento independiente y un enfoque documental de la memoria histórica.",
        }
      ],
      quote: "Leí mucho, de forma autodidacta, grandes obras en árabe, francés y español."
    }
  },
  ar: {
    hero: {
      name: "عبد العزيز خلوق التمسماني",
      title: "د.",
      eyebrow: "مؤرخ وباحث في التاريخ المعاصر لشمال المغرب",
      subtitle:
        "مسارٌ علميٌّ حافل، كرَّسه الراحل لخدمة الوثيقة والأرشيف بُغيةَ فهم تاريخ شمال المغرب في بيئته الوطنية ومحيطه الدوالي، وإعادة قراءة الذاكرة التاريخية بروحٍ نقدية ورؤيةٍ منهجية.",
      imageAlt: "صورة الدكتور عبد العزيز خلوق التمسماني",
      intro: [
        "لم يكن عبد العزيز خلوق التمسماني مجرد مؤرخ منشغل بتدوين الوقائع، بل صاحب مشروع علمي جعل من الوثيقة مدخلا إلى مساءلة الذاكرة وإعادة بناء تاريخ الشمال المغربي.",
        "فمن طنجة، عاصمة البوغاز، وتحديداً من حي 'المصلى'، انطلق تشكُّل وعيه المعرفي والأدبي الأول، لينفتح بعد ذلك أفقُه الأكاديمي من خلال تكوينٍ عصامي رصين، تعدَّدت لغاته وتنوعت مصادره."
      ],
      ctaLabel:  "قراءة ذاكرة مؤرخ"
    },
    formation: {
      title: "التكوين الفكري وبدايات الوعي النقدي",
      subtitle: "من حي المصلى إلى أفق السؤال التاريخي",
      intro: [
        "تشكل التكوين الفكري لعبد العزيز خلوق التمسماني عبر قراءة واسعة شجعها محيطه العائلي منذ الطفولة، ثم تابعها بشكل عصامي ومنتظم.",
        "أتاحت له مجال إكتساب كفاءة لغوية عالية ومتنوعة شملت اللغة العربية والفرنسية والإسبانية الانفتاح على مجالات الفكر والأدب والتاريخ والسياسة، وهو ما انعكس لاحقا في منهجه القائم على الوثيقة والأرشيف وإعادة قراءة تاريخ طنجة وشمال المغرب."
      ],
      cards: [
        {
          title: "العصامية والقراءة",
          description: "تكوين رصين نتيجة فعل المطالعة الواسعة الأفق والمنتظمة المسار، جعلت من وظيفة القراءة مدخلا لبناء الوعي العلمي واستقلال النظر.",
        },
        {
          title: "تعدد اللغات والمصادر",
          description: "قرأ بالعربية والفرنسية والإسبانية، وتنقل بين الفكر والأدب والتاريخ والسياسة بحثا عن أفق معرفي أوسع.",
        },
        {
          title: "السؤال النقدي",
          description: "ابتعد تدريجيا عن أساليب الثقافة الجامدة، وانفتح على السؤال النقدي والتفكير المستقل.",
        }
      ],
      quote:
        "طالعت كثيرا - وبشكل عصامي - روائع المؤلفات العربية والفرنسية والإسبانية\nالتاريخ ليس مجرد دراسة الماضي، بل فهم الحاضر لصنع المستقبل"
    }
  }
};

export function getAboutDoctorContent(locale: Locale): AboutDoctorContent {
  const baseContent = aboutDoctorContent[locale] ?? aboutDoctorContent[defaultLocale];
  const topContent = aboutDoctorTopContent[locale];

  if (!topContent) {
    return baseContent;
  }

  return {
    ...baseContent,
    hero: topContent.hero,
    formation: topContent.formation
  };
}

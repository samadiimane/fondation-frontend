const DEFAULT_LOCALE = "en";

const SERVICES_CONTENT = {
  "academic-consultations": {
    en: {
      title: "Academic Consultations & Guidance",
      intro:
        "Book focused time with our research advisors to align your project goals, sources, and methodology with the Foundation's collections.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "One-to-one consultations led by subject specialists who understand the depth of the Foundation archive.",
            "Each session results in practical recommendations: priority collections to review, methodological adjustments, and suggested next steps.",
          ],
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Early-career researchers refining their proposals or framing new questions.",
            "Experienced scholars who need to verify sources, triangulate materials, or validate their research design before field work.",
          ],
        },
        {
          title: "How to request a session",
          paragraphs: [
            "Submit a short summary of your project and the support you need via the researcher contact form.",
            "Our coordination team will respond with available time slots and any background notes to prepare ahead of the consultation.",
          ],
        },
      ],
    },
    fr: {
      title: "Consultations academiques et accompagnement",
      intro:
        "Planifiez un rendez-vous cible avec nos conseillers pour aligner vos objectifs de recherche avec les fonds de la Fondation.",
    },
    es: {
      title: "Consultorias academicas y orientacion",
      intro:
        "Programa una sesion con nuestros asesores para alinear los objetivos y fuentes de tu proyecto con las colecciones de la Fundacion.",
    },
    ar: {
      title: "\u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629 \u0648\u0627\u0644\u062a\u0648\u062c\u064a\u0647",
      intro:
        "\u0627\u062d\u062c\u0632 \u0648\u0642\u062a\u0627\u064b \u0645\u0639 \u0645\u0633\u062a\u0634\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b \u0644\u0645\u0648\u0627\u0621\u0645\u0629 \u0623\u0647\u062f\u0627\u0641 \u0645\u0634\u0631\u0648\u0639\u0643 \u0648\u0645\u0635\u0627\u062f\u0631\u0647 \u0645\u0639 \u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u0629.",
    },
  },
  "researcher-support": {
    en: {
      title: "Researcher Support & Empowerment",
      intro:
        "Access tailored tools, training, and peer networks that keep your research moving from proposal to publication.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "Skills clinics on research design, data stewardship, and scholarly communication hosted by Foundation mentors.",
            "Toolkits and templates that simplify ethics submissions, archival requests, and project management.",
          ],
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Researchers facing logistical hurdles, such as accessing restricted holdings or coordinating multi-site work.",
            "Scholars who want accountability partners and constructive peer feedback throughout the research lifecycle.",
          ],
        },
        {
          title: "How to join the program",
          paragraphs: [
            "Register interest through the support intake form with a brief note on your current stage and challenges.",
            "We will match you with a mentor or cohort and share the next orientation date within five working days.",
          ],
        },
      ],
    },
    fr: {
      title: "Soutien et autonomisation des chercheurs",
      intro:
        "Accedez a des outils et a un accompagnement personnalises pour faire avancer vos travaux jusqu'a la publication.",
    },
    es: {
      title: "Apoyo y empoderamiento para investigadores",
      intro:
        "Accede a herramientas y acompanamiento personalizado para avanzar desde la propuesta hasta la publicacion.",
    },
    ar: {
      title: "\u062f\u0639\u0645 \u0627\u0644\u0628\u0627\u062d\u062b\u064a\u0646 \u0648\u062a\u0645\u0643\u064a\u0646\u0647\u0645",
      intro:
        "\u0627\u0633\u062a\u0641\u062f \u0645\u0646 \u0627\u0644\u0623\u062f\u0648\u0627\u062a \u0648\u0627\u0644\u0625\u0631\u0634\u0627\u062f\u064a\u0627\u062a \u0627\u0644\u0645\u0648\u062c\u0647\u0629 \u0644\u0644\u0627\u0628\u062d\u0627\u062b \u0645\u0646 \u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u0645\u0642\u062a\u0631\u062d \u062d\u062a\u0649 \u0627\u0644\u0646\u0634\u0631.",
    },
  },
  "personal-platform": {
    en: {
      title: "Personal Researcher Platform",
      intro:
        "Showcase your projects, datasets, and publications within the Foundation's digital ecosystem and reach a wider community.",
      heroImage: null,
      bodySections: [
        {
          title: "What we provide",
          paragraphs: [
            "A customizable profile page hosted by the Foundation, including space for biographies, project updates, media, and downloadable files.",
            "Analytics on visits and referrals so you understand how audiences engage with your work.",
          ],
        },
        {
          title: "Who can benefit",
          paragraphs: [
            "Researchers seeking a trusted, bilingual presence to host their outputs without maintaining a separate website.",
            "Collaborative projects that require a central hub to publish joint findings and invite participation.",
          ],
        },
        {
          title: "How to request access",
          paragraphs: [
            "Complete the platform request form with links to your existing outputs and the material you wish to publish.",
            "Our digital engagement team will provision your space and provide onboarding guidance within one week.",
          ],
        },
      ],
    },
    fr: {
      title: "Plateforme personnelle pour chercheurs",
      intro:
        "Diffusez vos projets et resultats dans l'ecosysteme numerique de la Fondation pour toucher une communaute plus large.",
    },
    es: {
      title: "Plataforma personal para investigadores",
      intro:
        "Comparte proyectos y resultados dentro del ecosistema digital de la Fundacion para llegar a una comunidad mas amplia.",
    },
    ar: {
      title: "\u0645\u0646\u0635\u0629 \u0634\u062e\u0635\u064a\u0629 \u0644\u0644\u0628\u0627\u062d\u062b\u064a\u0646",
      intro:
        "\u0627\u0639\u0631\u0636 \u0645\u0634\u0627\u0631\u064a\u0639\u0643 \u0648\u0646\u062a\u0627\u0626\u062c\u0643 \u0636\u0645\u0646 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0631\u0642\u0645\u064a \u0644\u0644\u0645\u0624\u0633\u0633\u0629 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u062c\u0645\u0647\u0648\u0631 \u0623\u0648\u0633\u0639.",
    },
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES_CONTENT);

export function getServiceContent(locale, slug) {
  const serviceLocales = SERVICES_CONTENT[slug];
  if (!serviceLocales) {
    return null;
  }

  const fallback = serviceLocales[DEFAULT_LOCALE] ?? {};
  const localized = (locale && serviceLocales[locale]) || fallback;

  const bodySections = Array.isArray(localized.bodySections)
    ? localized.bodySections
    : Array.isArray(fallback.bodySections)
      ? fallback.bodySections
      : [];

  return {
    ...fallback,
    ...localized,
    bodySections,
  };
}


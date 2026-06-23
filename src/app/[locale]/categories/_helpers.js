import {getCategory} from "@/lib/api";

const isCategoryNotFoundError = (error) => {
  const message = String(error?.message || "");
  return Number(error?.status) === 404 || /\b404\b|not found/i.test(message);
};

export async function getPublicCategory(slug, {locale}) {
  try {
    const category = await getCategory(slug, {locale});
    return {category, unavailable: false};
  } catch (error) {
    if (isCategoryNotFoundError(error)) {
      return {category: null, unavailable: false};
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn(`Public category "${slug}" is temporarily unavailable.`, error);
    }
    return {category: null, unavailable: true};
  }
}

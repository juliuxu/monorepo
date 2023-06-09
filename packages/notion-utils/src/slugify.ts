import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getTitle } from "./helpers";

export function slugify(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")

      // Norwegian æøå
      .replace("æ¨", "ae")
      .replace("ø", "o")
      .replace("å", "a")

      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  );
}

/**
 * Helper to find a page by slug
 * @example const page = pages.find(findPageBySlugPredicate("my-page"))
 * @param slug A slug generated by slugify, e.g. `"my-page"`
 * @returns A predicate function that can be used to find a page by slug
 */
export const findPageBySlugPredicate =
  (slug: string) => (page: PageObjectResponse) =>
    slugify(getTitle(page) ?? "").toLocaleLowerCase() ===
    slug.toLocaleLowerCase();

import type { PageObjectResponse } from "@julianjark/notion-utils";
import {
  getTitle,
  getRichText,
  getSelect,
  slugify,
} from "@julianjark/notion-utils";
import type { Relaxed } from "~/misc";
import type { NotionDrivenPage } from "./schema";
import { notionDrivenPageSchema } from "./schema";

export function mapNotionDrivenPage(fromPage: PageObjectResponse) {
  return {
    id: fromPage.id,
    title: getTitle(fromPage),
    slug: slugify(getTitle(fromPage) ?? ""),
    preamble: getRichText("Ingress", fromPage) as any,
    published: getSelect("Published", fromPage) as any,
  } satisfies Relaxed<NotionDrivenPage>;
}
export function parseNotionDrivenPage(fromPage: PageObjectResponse) {
  return notionDrivenPageSchema.parse(mapNotionDrivenPage(fromPage));
}

export function safeParseNotionDrivenPage(fromPage: PageObjectResponse) {
  const result = notionDrivenPageSchema.safeParse(
    mapNotionDrivenPage(fromPage)
  );
  if (!result.success) {
    console.warn(
      `⚠️ failed parsing notion driven page ${getTitle(fromPage)}`,
      result.error.message
    );
    return undefined;
  }
  return result.data;
}

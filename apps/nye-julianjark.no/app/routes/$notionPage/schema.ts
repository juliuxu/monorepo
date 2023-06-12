import type {
  RichTextItem,
  PageObjectResponse,
} from "@julianjark/notion-utils";
import {
  getTitle,
  getRichText,
  getSelect,
  slugify,
} from "@julianjark/notion-utils";
import { z } from "zod";
import type { Relaxed } from "~/misc";

const richTextItemSchema = z.custom<RichTextItem>((val) => {
  return val && typeof val === "object" && "type" in val && "text" in val;
});
const notionDrivenPageSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  preamble: z.array(richTextItemSchema).nonempty(),
  published: z.preprocess(
    (val) => val || "PUBLISHED",
    z.enum(["PUBLISHED", "UNPUBLISHED", "DEV"])
  ),
});
export type NotionDrivenPage = z.infer<typeof notionDrivenPageSchema>;

// Parser
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

import { shikifyNotionBlocks } from "@julianjark/notion-shiki-code/dist/index.server";
import {
  getTitle,
  slugify,
  getRichText,
  getSelect,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { config } from "~/config.server";
import { cmsBlocks, cmsPage } from "@julianjark/notion-cms";
import {
  blocksSchema,
  publishedStateSchema,
  richTextSchema,
} from "@julianjark/notion-cms";

export const notionDrivenPageSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  preamble: richTextSchema.nonempty(),
  published: publishedStateSchema("DRAFT"),
});
export type NotionDrivenPageHead = z.infer<typeof notionDrivenPageSchema>;

export const { getPage, getPages } = cmsPage(notionDrivenPageSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    slug: slugify(getTitle(page) ?? ""),
    preamble: getRichText("Ingress", page) as any,
    published: getSelect("Published", page) as any,
  };
});

export const notionDrivenPageBodySchema = z.object({
  blocks: blocksSchema,
});
type NotionDrivenPageBody = z.infer<typeof notionDrivenPageBodySchema>;
export type NotionDrivenPage = NotionDrivenPageHead & NotionDrivenPageBody;

export const { getBodyFromHead } = cmsBlocks(
  notionDrivenPageBodySchema,
  async (blocks) => ({
    blocks: await shikifyNotionBlocks(blocks, { theme: config.shikiTheme }),
  })
);

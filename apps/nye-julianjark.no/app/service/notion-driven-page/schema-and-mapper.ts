import { shikifyNotionBlocks } from "@julianjark/notion-shiki-code/dist/index.server";
import {
  getTitle,
  slugify,
  getRichText,
  getSelect,
  getMultiSelect,
  getText,
} from "@julianjark/notion-utils";
import { z } from "zod";
import { config } from "~/config.server";
import {
  cmsBlocks,
  cmsPage,
  blocksSchema,
  publishedStateSchema,
  richTextSchema,
} from "@julianjark/notion-cms";

export const notionDrivenPageSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  prefix: z.string().optional(),
  preamble: richTextSchema.nonempty(),
  published: publishedStateSchema("DRAFT"),
  options: z.array(z.string()),
});
export type NotionDrivenPageHead = z.infer<typeof notionDrivenPageSchema>;

export const { getPage, getPages } = cmsPage(notionDrivenPageSchema, (page) => {
  return {
    id: page.id,
    title: getTitle(page),
    slug: slugify(getTitle(page) ?? ""),
    prefix: getText("Prefiks", page),
    preamble: getRichText("Ingress", page) as any,
    published: getSelect("Published", page) as any,
    options: getMultiSelect("Options", page),
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

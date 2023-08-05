import {
  getTitle,
  getMultiSelectAndColor,
  getSelect,
  takeBlocksAfterHeader,
  getTextFromRichText,
  getFormulaDate,
  getDatabasePropertyMultiSelectOptions,
  slugify,
} from "@julianjark/notion-utils";
import { z } from "zod";
import {
  blocksSchema,
  cmsMetainfo,
  multiSelectSchema,
  publishedStateSchema,
  richTextSchema,
  cmsBlocks,
  cmsPage,
} from "@julianjark/notion-cms";
import { getSummary } from "./get-summary";
import { config } from "~/config.server";
import { shikifyNotionBlocks } from "@julianjark/notion-shiki-code/dist/index.server.js";

export const todayILearnedMetainfoSchema = z.object({
  title: z.string(),
  description: richTextSchema,
  tags: multiSelectSchema,
});
export type TodayILearnedMetainfo = z.infer<typeof todayILearnedMetainfoSchema>;
export const { getMetainfo } = cmsMetainfo(
  todayILearnedMetainfoSchema,
  (database) => {
    return {
      title: getTextFromRichText(database.title),
      description: database.description,
      tags: getDatabasePropertyMultiSelectOptions("Tags", database),
    };
  }
);

export const todayILearnedEntryHeadSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  slug: z.string().nonempty(),
  published: publishedStateSchema("PUBLISHED"),
  publishedDate: z.string(),
  tags: multiSelectSchema,
});
type TodayILearnedEntryHead = z.infer<typeof todayILearnedEntryHeadSchema>;

export const { getPages } = cmsPage(todayILearnedEntryHeadSchema, (page) => {
  return {
    id: page.id,
    publishedDate: getFormulaDate("Published Date", page),
    title: getTitle(page),
    slug: slugify(getTitle(page) ?? ""),
    tags: getMultiSelectAndColor("Tags", page),
    published: getSelect("Published", page) as any,
  };
});

export const todayILearnedEntryBodySchema = z.object({
  blocks: blocksSchema,
  summary: z.string(),
  references: z.array(z.string().url()).optional(),
});
type TodayILearnedEntryBody = z.infer<typeof todayILearnedEntryBodySchema>;
export type TodayILearnedEntry = TodayILearnedEntryHead &
  TodayILearnedEntryBody;

export const { getBodyFromHead, getHeadAndBodyListFromHeads } = cmsBlocks(
  todayILearnedEntryBodySchema,
  async function mapper(blocks) {
    const [referenceBlocks, remainingBlocks] = takeBlocksAfterHeader(
      "Referanser",
      blocks
    );
    const references = referenceBlocks
      .map((x) => {
        if (x.type === "bookmark") {
          return x.bookmark.url;
        }
        if (x.type === "paragraph") {
          const firstLink = x.paragraph.rich_text.find((r) => r.href !== null);
          if (firstLink && firstLink.href !== null) {
            return firstLink.href;
          }
        }

        return undefined;
      })
      .filter(function <T>(x: T | undefined): x is T {
        return x !== undefined;
      });

    return {
      blocks: await shikifyNotionBlocks(remainingBlocks, {
        theme: config.shikiTheme,
      }),
      summary: getSummary(remainingBlocks),
      references,
    };
  }
);

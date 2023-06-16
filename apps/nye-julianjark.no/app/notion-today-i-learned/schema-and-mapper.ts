import {
  getTitle,
  getMultiSelectAndColor,
  getSelect,
  takeBlocksAfterHeader,
} from "@julianjark/notion-utils";
import { z } from "zod";
import {
  blocksSchema,
  multiSelectSchema,
  publishedStateSchema,
} from "~/notion-cms/helpers";
import { cmsBlocks, cmsPage } from "~/notion-cms/cms";
import { getSummary } from "./get-summary";
import { config } from "~/config.server";
import { shikifyNotionBlocks } from "@julianjark/notion-shiki-code/dist/index.server";

export const todayILearnedEntryHeadSchema = z.object({
  id: z.string(),
  title: z.string().nonempty(),
  created: z.string().datetime(),
  tags: multiSelectSchema,
  published: publishedStateSchema("DRAFT"),
});
type TodayILearnedEntryHead = z.infer<typeof todayILearnedEntryHeadSchema>;

export const { getPages } = cmsPage(todayILearnedEntryHeadSchema, (page) => {
  return {
    id: page.id,
    created: page.created_time,
    title: getTitle(page),
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

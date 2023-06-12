import type { BlockObjectResponse } from "@julianjark/notion-utils";
import {
  getMultiSelectAndColor,
  getSelect,
  getTextFromRichText,
  getTitle,
  type PageObjectResponse,
} from "@julianjark/notion-utils";
import type { TodayILearnedEntry } from "./schema";
import { todayILearnedEntrySchema } from "./schema";
import type { Relaxed } from "~/misc";

export function mapTodayILearnedEntry(
  fromPage: PageObjectResponse,
  andBlocks: BlockObjectResponse[]
) {
  return {
    id: fromPage.id,
    created: fromPage.created_time,
    title: getTitle(fromPage),
    blocks: andBlocks,
    summary: getSummary(andBlocks),
    tags: getMultiSelectAndColor("Tags", fromPage),
    published: getSelect("Published", fromPage) as any,
  } satisfies Relaxed<TodayILearnedEntry>;
}
export function parseTodayILearnedEntry(
  fromPage: PageObjectResponse,
  andBlocks: BlockObjectResponse[]
) {
  const result = todayILearnedEntrySchema.safeParse(
    mapTodayILearnedEntry(fromPage, andBlocks)
  );
  if (!result.success) {
    console.warn(
      `⚠️ failed parsing today i learned entry ${fromPage.id}`,
      result.error
    );
    return undefined;
  }
  return result.data;
}

/**
 * Get first paragraph and use as the summary
 */
function getSummary(fromBlocks: BlockObjectResponse[]) {
  const summary = fromBlocks
    .filter((x) => x.type === "paragraph")
    .slice(0, 1)
    .map((p) =>
      p.type === "paragraph" ? getTextFromRichText(p.paragraph.rich_text) : ""
    )
    .join(".\n")
    .replace(/([^.])\.\.\n/, "$1. ");
  return summary;
}

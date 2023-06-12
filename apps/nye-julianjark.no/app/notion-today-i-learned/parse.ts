import type { BlockObjectResponse } from "@julianjark/notion-utils";
import {
  getMultiSelectAndColor,
  getSelect,
  getTextFromRichText,
  getTitle,
  type PageObjectResponse,
} from "@julianjark/notion-utils";
import type {
  TodayILearnedEntry,
  TodayILearnedEntryBody,
  TodayILearnedEntryHead,
} from "./schema";
import { todayILearnedEntrySchema } from "./schema";
import type { Relaxed } from "~/misc";

// Head
export function mapTodayILearnedEntryHead(fromPage: PageObjectResponse) {
  return {
    id: fromPage.id,
    created: fromPage.created_time,
    title: getTitle(fromPage),
    tags: getMultiSelectAndColor("Tags", fromPage),
    published: getSelect("Published", fromPage) as any,
  } satisfies Relaxed<TodayILearnedEntryHead>;
}
export function safeParseTodayILearnedEntryHead(fromPage: PageObjectResponse) {
  const result = todayILearnedEntrySchema.safeParse(
    mapTodayILearnedEntryHead(fromPage)
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

// Body
export function mapTodayILearnedEntryBody(fromBlocks: BlockObjectResponse[]) {
  return {
    blocks: fromBlocks,
    summary: getSummary(fromBlocks),
  } satisfies Relaxed<TodayILearnedEntryBody>;
}
export function parseTodayILearnedEntryBody(fromBlocks: BlockObjectResponse[]) {
  return todayILearnedEntrySchema.parse(mapTodayILearnedEntryBody(fromBlocks));
}

// Entry
export function parseTodayILearnedEntry(
  fromHead: TodayILearnedEntryHead,
  andBody: TodayILearnedEntryBody
) {
  return todayILearnedEntrySchema.parse({
    ...fromHead,
    ...andBody,
  });
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

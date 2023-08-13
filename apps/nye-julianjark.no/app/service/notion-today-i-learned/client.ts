import { filterPublishedPredicate } from "@julianjark/notion-cms";

import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import {
  getHeadAndBodyListFromHeads,
  getMetainfo,
  getPages,
} from "./schema-and-mapper";

async function getTodayILearnedEntryHeads(isPreview: boolean) {
  const entryHeads = await getPages(notionClient)(
    config.todayILearnedDatabaseId,
    {
      sorts: [{ property: "Published Date", direction: "descending" }],
    },
  );
  return entryHeads.success.filter(filterPublishedPredicate(isPreview));
}

export async function getLatestTodayILearnedEntries(isPreview: boolean) {
  const entryHeads = await getTodayILearnedEntryHeads(isPreview);
  return (
    await getHeadAndBodyListFromHeads(notionClient)(entryHeads.slice(0, 3))
  ).success;
}

export async function getAllTodayILearnedEntriesAndMetainfo(
  isPreview: boolean,
) {
  const [metainfo, entryHeads] = await Promise.all([
    getMetainfo(notionClient)(config.todayILearnedDatabaseId),
    getTodayILearnedEntryHeads(isPreview),
  ]);
  const entries = (await getHeadAndBodyListFromHeads(notionClient)(entryHeads))
    .success;

  // Ensure only tags that are used in entries are included
  // Would be pretty stupid to show tags that is not visible on the website
  metainfo.tags = metainfo.tags.filter((tag) =>
    entries.some((entry) =>
      entry.tags.some((entryTag) => entryTag.id === tag.id),
    ),
  );

  return { metainfo, entries };
}

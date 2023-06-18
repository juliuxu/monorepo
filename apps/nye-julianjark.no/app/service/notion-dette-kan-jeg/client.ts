import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { getMetainfo, getPages } from "./schema-and-mapper";

export async function getAllDetteKanJeg() {
  const pages = await getPages(notionClient)(config.detteKanJegDatabaseId, {
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });

  return pages.success;
}

export async function getDetteKanJegMetainfo() {
  return await getMetainfo(notionClient)(config.detteKanJegDatabaseId);
}

export async function getFeaturedDetteKanJeg() {
  const detteKanJeg = await getAllDetteKanJeg();
  return detteKanJeg.filter((v) => v.isFeatured);
}

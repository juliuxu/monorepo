import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import { safeParseNotionDrivenPage } from "./schema";
import { filterPublishedPredicate, typedBoolean } from "~/misc";

export async function getNotionDrivenPages() {
  const pages = await notionClient.getDatabasePages(
    config.notionDrivenPagesDatabaseId
  );

  return pages
    .map(safeParseNotionDrivenPage)
    .filter(typedBoolean)
    .filter(filterPublishedPredicate);
}

export async function getNotionDrivenPageWithBlocks(fromSlug: string) {
  const pages = await getNotionDrivenPages();
  console.log("got pages", pages);
  const page = pages.find((page) => page.slug === fromSlug);
  console.log("got page", page, fromSlug);
  if (!page) return undefined;

  const blocks = await notionClient.getBlocksWithChildren(page.id);
  return { page, blocks };
}

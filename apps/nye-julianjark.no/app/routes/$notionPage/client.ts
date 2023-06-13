import { notionClient } from "~/clients.server";
import { config } from "~/config.server";
import type { NotionDrivenPage, NotionDrivenPageAndBlocks } from "./schema";
import { safeParseNotionDrivenPage } from "./parse";
import { chunked, filterPublishedPredicate, typedBoolean } from "~/misc";

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
  const page = pages.find((page) => page.slug === fromSlug);
  if (!page) return undefined;

  const blocks = await notionClient.getBlocksWithChildren(page.id);
  return { page, blocks };
}

export async function getNotionDrivenPagesWithBlocks(
  fromPages: NotionDrivenPage[]
) {
  const entries: Array<NotionDrivenPageAndBlocks | undefined> = [];
  for (const chunk of chunked(fromPages, 5)) {
    const fetchedAndParsed = await Promise.all(
      chunk.map((page) =>
        notionClient
          .getBlocksWithChildren(page.id)
          .then(
            (blocks) => ({ page, blocks } satisfies NotionDrivenPageAndBlocks)
          )
      )
    );
    entries.push(...fetchedAndParsed);
  }

  return entries.filter(typedBoolean);
}

import { config } from "~/config.server";
import { filterPublishedPredicate } from "~/misc";
import { getBodyFromHead, getPage, getPages } from "./schema-and-mapper";
import { notionClient } from "~/clients.server";

export async function getNotionDrivenLandingPage() {
  const page = await getPage(notionClient)(config.landingPageId);
  return await getBodyFromHead(notionClient)(page);
}

export async function getNotionDrivenPages() {
  const pages = await getPages(notionClient)(
    config.notionDrivenPagesDatabaseId,
    {}
  );
  return pages.success.filter(filterPublishedPredicate);
}

export async function getNotionDrivenPageWithBlocks(fromSlug: string) {
  const pages = await getNotionDrivenPages();
  const page = pages.find(
    (page) => page.slug.toLowerCase() === fromSlug.toLowerCase()
  );
  if (!page) return undefined;

  return await getBodyFromHead(notionClient)(page);
}

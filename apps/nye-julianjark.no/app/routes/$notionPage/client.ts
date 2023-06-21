import { config } from "~/config.server";
import { getBodyFromHead, getPage, getPages } from "./schema-and-mapper";
import { notionClient } from "~/clients.server";
import { filterPublishedPredicate } from "@julianjark/notion-cms";

export async function getNotionDrivenLandingPage() {
  const page = await getPage(notionClient)(config.landingPageId);
  return await getBodyFromHead(notionClient)(page);
}

export async function getNotionDrivenPages(isPreview: boolean) {
  const pages = await getPages(notionClient)(
    config.notionDrivenPagesDatabaseId,
    {}
  );
  return pages.success.filter(filterPublishedPredicate(isPreview));
}

export async function getNotionDrivenPageWithBlocks(
  fromSlug: string,
  isPreview: boolean
) {
  const pages = await getNotionDrivenPages(isPreview);
  const page = pages.find(
    (page) => page.slug.toLowerCase() === fromSlug.toLowerCase()
  );
  if (!page) return undefined;

  return await getBodyFromHead(notionClient)(page);
}

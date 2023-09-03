import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { buildSiteHeaderMetaInfo } from "~/components/site-header";
import { config } from "~/config.server";
import { useContentOnlyMode } from "~/content-only-mode";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { assertItemFound } from "~/utils/misc";
import { classes } from "../($prefix).$notionPage/notion-driven-page";
import { useEditNotionPage } from "../($prefix).$notionPage/use-edit-notion-page";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { TodayILearnedArticle } from "./today-i-learned-article";
import { TodayILearnedArticlePreviewList } from "./today-i-learned-article-preview";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.entry.title },
    {
      name: "description",
      content: data?.entry.summary,
    },

    // OG image
    { property: "og:title", content: data?.entry.title },
    { property: "twitter:title", content: data?.entry.title },
    {
      property: "og:image",
      content: `${data?.basePath}/i-dag-lærte-jeg/${data?.entry.slug}/og?v=0.1.0`,
    },
    { property: "og:type", content: "summary_large_image" },
    { property: "twitter:card", content: "summary_large_image" },
  ];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug ?? "";
  const { metainfo, entries } = await getAllTodayILearnedEntriesAndMetainfo(
    isPreviewModeFromRequest(request),
  );
  const entry = entries.find((entry) => entry.slug === slug);
  assertItemFound(entry);

  const entryTagIds = entry.tags.map((tag) => tag.id);
  const relatedEntries = entries
    .filter(
      (possibleRelatedEntry) =>
        possibleRelatedEntry.id !== entry.id &&
        possibleRelatedEntry.tags.some((tag) => entryTagIds.includes(tag.id)),
    )
    .slice(0, 3);

  const basePath =
    config.nodeEnv === "development"
      ? `http://localhost:3000`
      : `https://julianjark.no`;

  return json(
    {
      basePath,
      metainfo,
      entry,
      ...buildSiteHeaderMetaInfo({
        headerMenu: {
          title: entry.lang === "en" ? "Today I learned" : "I dag lærte jeg",
          href: "/i-dag-lærte-jeg",
        },
      }),
      relatedEntries,
    },
    { headers: config.loaderCacheControlHeaders },
  );
};

export default function Component() {
  const { entry, relatedEntries } = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: entry.id });
  const isContentOnlyMode = useContentOnlyMode();
  return (
    <>
      <main className="max-w-3xl mx-auto">
        <TodayILearnedArticle entry={entry} titleAs="h1" />
      </main>
      {!isContentOnlyMode && relatedEntries.length > 0 && (
        <aside>
          <hr className={classes.divider.root} />
          <h2 className="text-h2 lg:text-h2-lg mb-6 lg:mb-12">
            Andre ting jeg har lært
          </h2>
          <TodayILearnedArticlePreviewList
            titleAs="h3"
            entries={relatedEntries}
            hideSummary
          />
        </aside>
      )}
    </>
  );
}

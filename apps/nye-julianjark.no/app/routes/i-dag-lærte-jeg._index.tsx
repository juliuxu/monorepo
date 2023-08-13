import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";

import { getTextFromRichText } from "@julianjark/notion-utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/hover-card";
import { PageHeader } from "~/components/page-header";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { pick, uniqueBy } from "~/utils/misc";
import { classes } from "./($prefix).$notionPage/notion-driven-page";
import { useEditNotionPage } from "./($prefix).$notionPage/use-edit-notion-page";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";
import { Badge } from "./i-dag-lærte-jeg.$slug/badge";
import { dateFormatterShort } from "./i-dag-lærte-jeg.$slug/date-formatter";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.metainfo.title },
    {
      name: "description",
      content: getTextFromRichText(data?.metainfo.description ?? []),
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const { metainfo, entries } = await getAllTodayILearnedEntriesAndMetainfo(
    isPreviewModeFromRequest(request),
  );

  const shallowEntries = entries.map((entry) =>
    pick(entry, [
      "id",
      "title",
      "tags",
      "summary",
      "publishedDate",
      "slug",
      "lang",
    ]),
  );

  const tags = uniqueBy(
    entries.flatMap((entry) => entry.tags),
    (tag) => tag.id,
  ).sort((a, b) => a.title.localeCompare(b.title));

  return json(
    {
      metainfo,
      entries: shallowEntries,
      tags,
      todayILearnedDatabaseId: config.todayILearnedDatabaseId,
    },
    { headers: config.loaderCacheControlHeaders },
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.todayILearnedDatabaseId });

  const [searchParams, setSearchParams] = useSearchParams();
  let activeTags = data.tags.map((tag) => tag.title);
  if (searchParams.has("tags")) {
    activeTags = activeTags.filter((tag) =>
      searchParams.getAll("tags").includes(tag),
    );
  }
  const toggleTag = (tag: string) => {
    setSearchParams(
      (prev) => {
        const currentTags = prev.getAll("tags");
        if (prev.getAll("tags").includes(tag)) {
          prev.delete("tags");
          currentTags
            .filter((t) => t !== tag)
            .forEach((t) => prev.append("tags", t));
        } else {
          prev.append("tags", tag);
        }
        return prev;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  const filteredEntries = data.entries.filter((entry) =>
    entry.tags.some((tag) => activeTags.includes(tag.title)),
  );

  return (
    <main>
      <PageHeader
        title={data.metainfo.title}
        description={getTextFromRichText(data.metainfo.description)}
      />

      <hr className={classes.divider.root} />

      <aside className="mb-12 lg:mb-16">
        <h2 className="text-h2 lg:text-h2-lg font-semibold lg:font-normal">
          Filtrer på kategori
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2 lg:gap-x-4 max-w-3xl">
          {data.tags.map((tag) => (
            <li key={tag.id}>
              <button
                className={activeTags.includes(tag.title) ? "" : "opacity-40"}
                onClick={() => toggleTag(tag.title)}
              >
                <Badge as="div" key={tag.id} color={tag.color}>
                  {tag.title}
                </Badge>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <ul className="space-y-8 text-h2">
        {filteredEntries.map((entry) => (
          <li className="flex flex-col md:flex-row" key={entry.id}>
            <time className="text-body md:text-h2 md:shrink-0 md:basis-1/4 xl:basis-1/5">
              {dateFormatterShort.format(new Date(entry.publishedDate))}
            </time>

            <div className="group">
              <Link
                className={classes.rich_text_anchor}
                to={entry.slug}
                prefetch="intent"
                lang={entry.lang}
              >
                {entry.title}
              </Link>
              <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                  <span className="hidden sm:inline-block ml-2 cursor-default opacity-0 group-hover:opacity-100 transition-opacity">
                    👀
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-[400px] h-[420px] overflow-hidden">
                  <iframe
                    width={400}
                    height={420}
                    title={entry.title}
                    src={`/i-dag-lærte-jeg/${entry.slug}?content-only=true`}
                  />
                </HoverCardContent>
              </HoverCard>
            </div>
            <ul className="sr-only md:not-sr-only mt-2 md:mt-0 md:ml-auto flex gap-2">
              {entry.tags.map((tag) => (
                <Badge as="li" key={tag.id} color={tag.color}>
                  {tag.title}
                </Badge>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { pick } from "~/utils/misc";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";
import { PageHeader } from "~/components/page-header";
import { useEditNotionPage } from "./($prefix).$notionPage/use-edit-notion-page";
import { dateFormatterShort } from "./i-dag-lærte-jeg.$slug/date-formatter";
import { classes } from "./($prefix).$notionPage/notion-driven-page";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/hover-card";

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
    isPreviewModeFromRequest(request)
  );

  const shallowEntries = entries.map((entry) =>
    pick(entry, ["id", "title", "tags", "summary", "publishedDate", "slug"])
  );

  return json(
    {
      metainfo,
      entries: shallowEntries,
      todayILearnedDatabaseId: config.todayILearnedDatabaseId,
    },
    { headers: config.loaderCacheControlHeaders }
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.todayILearnedDatabaseId });
  return (
    <main>
      <PageHeader
        title={data.metainfo.title}
        description={getTextFromRichText(data.metainfo.description)}
      />

      <hr className={classes.divider.root} />

      <ul className="space-y-8 text-h2">
        {data.entries.map((entry) => (
          <li className="flex flex-col md:flex-row" key={entry.id}>
            <time className="text-body md:text-h2 md:shrink-0 md:basis-1/4 xl:basis-1/5">
              {dateFormatterShort.format(new Date(entry.publishedDate))}
            </time>

            <div className="group">
              <Link
                className={classes.rich_text_anchor}
                to={entry.slug}
                prefetch="intent"
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
          </li>
        ))}
      </ul>
    </main>
  );
}

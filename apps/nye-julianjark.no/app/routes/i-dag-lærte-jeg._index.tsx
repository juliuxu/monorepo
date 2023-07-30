import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { pick } from "~/misc";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";
import { Header } from "~/components/header";
import { useEditNotionPage } from "./$notionPage/use-edit-notion-page";
import { dateFormatterShort } from "./$notionPage/custom-blocks/latest-today-i-learned-entries";
import { classes } from "./$notionPage/notion-driven-page";

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
      <Header
        title={data.metainfo.title}
        description={getTextFromRichText(data.metainfo.description)}
      />

      <hr className={classes.divider.root} />

      <ul className="space-y-12 md:space-y-16">
        {data.entries.map((entry) => (
          <li className="flex flex-col md:flex-row" key={entry.id}>
            <time className="md:basis-[24vw] text-body md:text-h2-lg">
              {dateFormatterShort.format(new Date(entry.publishedDate))}
            </time>
            <Link
              className={classes.rich_text_anchor}
              to={entry.slug}
              prefetch="intent"
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { components, classes } from "~/routes/$notionPage/notion-driven-page";
import { dateFormatter } from "./_index/latest-today-i-learned-entries";
import type { TodayILearnedEntry } from "~/service/notion-today-i-learned/schema-and-mapper";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { classNames } from "~/misc";
import { isPreviewMode } from "./api.preview-mode/preview-mode.server";
import { OramaSearch } from "~/service/orama-search/search";
import { Header } from "~/components/header";

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
    await isPreviewMode(request),
  );
  return json(
    { metainfo, entries, isPreview: await isPreviewMode(request) },
    { headers: config.loaderCacheControlHeaders },
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <Outlet />
      <Header
        title={data.metainfo.title}
        description={getTextFromRichText(data.metainfo.description)}
      />

      {/* WIP */}
      {/* <div className="mt-[4vw] flex flex-wrap gap-[1vw]">
        {data.metainfo.tags.map((tag) => (
          <span
            className="transtion-all badge badge-info badge-lg"
            key={tag.id}
          >
            {tag.title}
          </span>
        ))}
      </div> */}

      {data.isPreview && <OramaSearch />}

      <div className="mx-auto mt-[12vw] flex w-full max-w-3xl flex-col space-y-[6vw] divide-y-2 divide-black md:mt-[6vw] [&>*:not(:first-child)]:pt-[6vw]">
        {data.entries.map((entry) => (
          <TodayILearnedArticle key={entry.id} entry={entry} />
        ))}
      </div>
    </main>
  );
}

const todayILearnedClasses /*tw*/ = {
  ...classes,
  column_list: {
    root: classNames(
      "mt-[1.2em]",
      "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
      "[&>div:first-child>*:first-child]:mt-0 [&>div>*:last-child]:mb-0",
      "sm:[&>div>*:first-child]:mt-0 sm:[&>div>*:last-child]:mb-0",
      "sm:[&>div>*_pre]:mb-0",
      "[&_figure]:mt-0 [&_figure]:mb-0 [&_figure_pre]:mt-0 [&_figure_pre]:mb-0",
    ),
  },
  column: {
    root: "",
  },
  code: {
    // Full bleed on mobile
    root: classNames(
      "relative left-[50%] ml-[-50vw] right-[50%] mr-[-50vw] w-screen sm:left-0 sm:ml-0 sm:right-0 sm:mr-0 sm:w-full",
      "[&_pre]:pl-[7.5vw] [&_pre]:pr-[7.5vw] sm:[&_pre]:pl-5 sm:[&_pre]:pr-5",
      "[&_pre]:pt-6 [&_pre]:pb-6 sm:[&_pre]:pt-4 sm:[&_pre]:pb-4",
      "[&_pre]:rounded-none sm:[&_pre]:rounded-lg",
      "[&_figcaption]:pl-[7.5vw] sm:[&_figcaption]:pl-0",
    ),
  },
} satisfies Partial<Classes>;
export function TodayILearnedArticle({ entry }: { entry: TodayILearnedEntry }) {
  return (
    <article key={entry.id}>
      <time className="text-body text-gray-700 lg:text-body">
        {dateFormatter.format(new Date(entry.publishedDate))}
      </time>
      <h2
        id={entry.slug}
        className={`mt-2 scroll-mt-[calc(6vw+2.5rem)] text-h2 lg:text-h2-lg`}
      >
        <Link
          to={`/i-dag-lærte-jeg/${entry.slug}`}
          preventScrollReset
          className="hover:underline"
        >
          {entry.title}
        </Link>
      </h2>
      <div
        className={classNames(
          "mt-8",
          `prose-xl prose max-w-6xl`,
          "prose-pre:text-base",
          "prose-p:overflow-scroll",

          "prose-code:text-base",
          "prose-code:rounded",
          "prose-code:font-medium",
          "prose-code:py-1",

          "[&_figure:has(pre)]:mt-0",
          "[&_figure:has(pre)]:mb-0",
          "[&_figure_pre]:mb-0",
          "prose-figcaption:text-black/70",
        )}
      >
        <NotionRender
          {...{ components, classes: todayILearnedClasses }}
          blocks={entry.blocks}
        />
      </div>
      {(entry.references?.length ?? 0) > 0 && (
        <div className="mt-8 lg:mt-12">
          <h3 className="text-xl font-semibold md:text-2xl">Referanser</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {entry.references?.map((reference, i) => (
              <a
                className={`${classes.rich_text_anchor} text-lg`}
                key={i}
                href={reference}
                target="_blank"
                rel="noreferrer"
              >
                {reference}
              </a>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import type {
  HeadersFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntriesAndMetainfo } from "~/service/notion-today-i-learned/client";
import { sharedClasses } from "~/root";
import {
  components,
  classes,
  Header,
} from "~/routes/$notionPage/notion-driven-page";
import { dateFormatter } from "./_index/latest-today-i-learned-entries";
import type { TodayILearnedEntry } from "~/service/notion-today-i-learned/schema-and-mapper";
import { slugify } from "@julianjark/notion-utils";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { classNames } from "~/misc";
import { isPreviewMode } from "~/is-preview-mode.server";

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
    isPreviewMode(request)
  );
  return json(
    { metainfo, entries },
    { headers: config.loaderCacheControlHeaders }
  );
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <Header
        title={data.metainfo.title}
        description={getTextFromRichText(data.metainfo.description)}
      />
      <Outlet />
      <div className="mx-auto mt-[12vw] flex w-full max-w-4xl flex-col space-y-[6vw] divide-y-2 divide-black md:mt-[6vw] [&>*:not(:first-child)]:pt-[6vw]">
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
      "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
      "[&>div:first-child>*:first-child]:mt-0 [&>div>*:last-child]:mb-0",
      "sm:[&>div>*:first-child]:mt-0 sm:[&>div>*:last-child]:mb-0",
      "sm:[&>div>*_pre]:mb-0",
      "[&_figure]:mt-0 [&_figure]:mb-0 [&_figure_pre]:mt-0 [&_figure_pre]:mb-0"
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
      "[&_pre]:rounded-none sm:[&_pre]:rounded-lg"
    ),
  },
} satisfies Partial<Classes>;
export function TodayILearnedArticle({ entry }: { entry: TodayILearnedEntry }) {
  return (
    <article key={entry.id}>
      <time className="text-lg text-gray-700 sm:text-xl md:text-2xl">
        {dateFormatter.format(new Date(entry.created))}
      </time>
      <h2
        id={slugify(entry.title)}
        className={`mt-2 ${sharedClasses.typography} scroll-mt-[calc(6vw+2.5rem)]`}
      >
        {entry.title}
      </h2>
      <div
        className={classNames(
          "mt-8",
          `prose-xl prose max-w-6xl`,
          "prose-pre:text-base",
          "prose-code:rounded-md",
          "prose-p:overflow-scroll"
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

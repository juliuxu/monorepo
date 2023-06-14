import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntries } from "~/notion-today-i-learned/client";
import { sharedClasses } from "~/root";
import {
  components,
  classes,
  Header,
} from "~/routes/$notionPage/notion-driven-page";
import { dateFormatter } from "./_index/latest-today-i-learned-entries";
import type { TodayILearnedEntry } from "~/notion-today-i-learned/schema";
import { slugify } from "@julianjark/notion-utils";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: "I dag lærte jeg" },
    { name: "description", content: "Her publiserer jeg småting jeg lærer" },
  ];
};

export const loader = async () => {
  const entries = await getAllTodayILearnedEntries();
  return json({ entries }, { headers: config.loaderCacheControlHeaders });
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Header
        title={"I dag lærte jeg"}
        description={
          "Her publiserer jeg småting jeg lærer. Jeg har en tendens til å glemme ting jeg har lært, så jeg skriver det ned her."
        }
      />
      <main className="mt-[12vw] md:mt-[6vw]">
        <Outlet />
        <div className="mx-auto flex w-full max-w-6xl flex-col space-y-[6vw] divide-y-2 divide-black [&>*:not(:first-child)]:pt-[6vw]">
          {data.entries.map((entry) => (
            <TodayILearnedArticle key={entry.id} entry={entry} />
          ))}
        </div>
      </main>
    </>
  );
}

const todayILearnedClasses /*tw*/ = {
  ...classes,
  column_list: {
    root: "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
  },
  column: {
    root: "",
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
        className={`mt-2 ${sharedClasses.typography}`}
      >
        {entry.title}
      </h2>
      <div className="prose-xl prose mt-4 max-w-6xl">
        <NotionRender
          {...{ components, classes: todayILearnedClasses }}
          blocks={entry.blocks}
        />
      </div>
      {(entry.references?.length ?? 0) > 0 && (
        <div>
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

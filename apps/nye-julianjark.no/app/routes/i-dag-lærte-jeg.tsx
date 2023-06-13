import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllTodayILearnedEntries } from "~/notion-today-i-learned/client";
import { sharedClasses } from "~/root";
import {
  components,
  classes,
  Header,
} from "~/routes/$notionPage/notion-driven-page";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: "I dag lærte jeg" },
    { name: "description", content: "Her publiserer jeg småting jeg lærer" },
  ];
};

export const loader = async () => {
  const entries = await getAllTodayILearnedEntries();
  return json({ entries });
};
export const headers: HeadersFunction = () => config.cacheControlHeaders;

const todayILearnedClasses /*tw*/ = {
  ...classes,
  column_list: {
    root: "grid gap-0 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-flow-col sm:auto-cols-fr",
  },
} satisfies Partial<Classes>;

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
      <main className="mt-[12vw] flex flex-col gap-[12vw] md:mt-[6vw]">
        {data.entries.map((entry) => (
          <article key={entry.id}>
            <h2 className={sharedClasses.typography}>{entry.title}</h2>
            <div className="prose">
              <NotionRender
                {...{ components, classes: todayILearnedClasses }}
                blocks={entry.blocks}
              />
            </div>
          </article>
        ))}
      </main>
    </>
  );
}

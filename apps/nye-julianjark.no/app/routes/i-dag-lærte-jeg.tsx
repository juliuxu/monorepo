import { NotionRender } from "@julianjark/notion-render";
import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllTodayILearnedEntries } from "~/notion-today-i-learned/client";
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
            <h2 className="text-2xl md:text-3xl lg:text-[2.5vw] lg:leading-snug">
              {entry.title}
            </h2>
            <div className="prose">
              <NotionRender
                {...{ components, classes }}
                blocks={entry.blocks}
              />
            </div>
          </article>
        ))}
      </main>
    </>
  );
}

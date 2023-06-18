import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { RichTextListRender } from "@julianjark/notion-render";
import { getTextFromRichText } from "@julianjark/notion-utils";
import {
  getAllDetteKanJeg,
  getDetteKanJegMetainfo,
} from "~/service/notion-dette-kan-jeg/client";
import type { DetteKanJeg } from "~/service/notion-dette-kan-jeg/schema-and-mapper";
import { classNames, shuffled } from "~/misc";
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

export const loader = async () => {
  const [metainfo, detteKanJeg] = await Promise.all([
    getDetteKanJegMetainfo(),
    getAllDetteKanJeg(),
  ]);
  return json(
    { metainfo, detteKanJeg: shuffled(detteKanJeg) },
    { headers: config.loaderCacheControlHeaders }
  );
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <header className={`pt-[4vw]`}>
        <h1 className="mt-8 max-w-4xl text-4xl">
          <RichTextListRender richTextList={data.metainfo.description} />
        </h1>
      </header>
      <main className="mt-[12vw] md:mt-[6vw]">
        <div className="mx-auto flex w-full flex-col space-y-[6vw] divide-y-2 divide-black [&>*:not(:first-child)]:pt-[6vw]">
          <section>
            <h2 className="mb-4 md:mb-2">Dette kan jeg</h2>
            <KnowledgeList
              knowledge={data.detteKanJeg.filter(
                ({ knowledge }) => knowledge === "Known"
              )}
            />
          </section>
          <section>
            <h2 className="mb-4 md:mb-2">Dette ønsker jeg å lære mer om</h2>
            <KnowledgeList
              knowledge={data.detteKanJeg.filter(
                ({ knowledge }) => knowledge === "WantToLearnMore"
              )}
            />
          </section>
        </div>
      </main>
    </>
  );
}

function KnowledgeList({ knowledge }: { knowledge: DetteKanJeg[] }) {
  return (
    <ul className="flex flex-wrap">
      {knowledge.map((item) => (
        <li key={item.id} className="group">
          <span
            className={classNames(
              "badge cursor-default group-hover:badge-info",
              "transition-all duration-700",
              "group-hover:scale-150",
              "group-hover:z-50",
              item.isFeatured && "badge-lg font-semibold"
            )}
          >
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

import type { Classes, Components } from "@julianjark/notion-render";
import { NotionRender, RichTextListRender } from "@julianjark/notion-render";
import type { RichTextItem } from "@julianjark/notion-utils";
import {
  getRichText,
  getTextFromRichText,
  getTitle,
  type PageObjectResponse,
} from "@julianjark/notion-utils";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { notionClient } from "~/clients.server";
import { UnpicNotionImage } from "~/components/unpic-notion-image";
import { config } from "~/config.server";
import { getTodayILearnedEntries } from "~/notion-today-i-learned/client";
import { LatestTodayILearnedEntries } from "./latest-today-i-learned-entries";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

const richTextItemSchema = z.custom<RichTextItem>((val) => {
  return val && typeof val === "object" && "type" in val && "text" in val;
});
const pageSchema = z.object({
  title: z.string(),
  preamble: z.array(richTextItemSchema).nonempty(),
});
const parsePage = (page: PageObjectResponse) => {
  return pageSchema.parse({
    title: getTitle(page),
    preamble: getRichText("Ingress", page),
  });
};

export const loader = async () => {
  const [page, blocks, todayILearnedEntries] = await Promise.all([
    notionClient.getPage(config.landingPageId).then(parsePage),
    notionClient.getBlocksWithChildren(config.landingPageId),
    getTodayILearnedEntries(),
  ]);

  return json({
    page,
    blocks,
    latestTodayILearnedEntries: todayILearnedEntries.slice(0, 3),
  });
};

export const components: Partial<Components> = {
  image: UnpicNotionImage,
  callout: ({ block }) => {
    if (block.type !== "callout") return null;
    const name = getTextFromRichText(block.callout.rich_text).trim();

    if (name === "BLOCK_REPLACE_TODAY_I_LEARNED_LATEST") {
      return <LatestTodayILearnedEntries />;
    }
    return null;
  },
};

export const classes: Partial<Classes> /*tw*/ = {
  heading_2: { root: "underline" },
  rich_text_anchor:
    "underline focus:text-primary-focus hover:text-primary-focus",
  column_list: {
    root: "gap-x-[5vw] gap-y-[4vw] grid sm:grid-cols-12 [&>*:first-child]:col-span-5 [&>*:nth-child(2)]:col-span-7",
  },
  column: {
    root: "gap-1 md:gap-2 flex flex-col justify-center md:justify-start sm:[&_img]:max-w-md",
  },
  divider: { root: "mt-[6vw] mb-[6vw] border-t-2 border-black" },
  color_orange: "text-secondary",
  paragraph: { root: "max-w-4xl" },
  toggle: { root: "bg-primary" },
};
const sharedClasses /*tw*/ = {
  text: "text-2xl md:text-3xl lg:text-[2.5vw] lg:leading-snug",
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className={sharedClasses.text}>
      <header className="pl-[7.5vw] pr-[7.5vw] pt-[4vw]">
        <h1 className="text-6xl font-bold">{data.page.title}</h1>
        <div className="mt-4 text-3xl">
          <RichTextListRender
            richTextList={data.page.preamble}
            classes={classes}
          />
        </div>
      </header>
      {/* <details>
        <summary>Debug</summary>
        <pre>{JSON.stringify(data.latestTodayILearnedEntries, null, 2)}</pre>
      </details> */}
      <main className="mt-[12vw] pl-[7.5vw] pr-[7.5vw] md:mt-[6vw]">
        <NotionRender
          blocks={data.blocks}
          components={components}
          classes={classes}
        />
      </main>
    </div>
  );
}

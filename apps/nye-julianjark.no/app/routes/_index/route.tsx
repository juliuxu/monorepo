import type { Classes, Components } from "@julianjark/notion-render";
import { NotionRender, RichTextListRender } from "@julianjark/notion-render";
import type { RichTextItem } from "@julianjark/notion-utils";
import {
  getRichText,
  getTitle,
  type PageObjectResponse,
} from "@julianjark/notion-utils";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { notionClient } from "~/clients.server";
import { UnpicNotionImage } from "~/components/unpic-notion-image";
import { config } from "~/config.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Julian Jark" },
    { name: "description", content: "Hei og hallo" },
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
  const [page, blocks] = await Promise.all([
    notionClient.getPage(config.landingPageId).then(parsePage),
    notionClient.getBlocksWithChildren(config.landingPageId),
  ]);

  return json({
    page,
    blocks,
  });
};

export const components: Partial<Components> = {
  image: UnpicNotionImage,
};
export const classes: Partial<Classes> /*tw*/ = {
  heading_2: { root: "text-3xl underline" },
  column_list: {
    root: "gap-x-[5vw] grid sm:grid-cols-12 [&>*:first-child]:col-span-5 [&>*:nth-child(2)]:col-span-7",
  },
  column: {
    root: "gap-2 md:gap-4 flex flex-col justify-center md:justify-start [&_img]:max-w-md",
  },
  divider: { root: "mt-[6vw] mb-[6vw]" },
  color_orange: "text-secondary",
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <header className="pl-[7.5vw] pr-[7.5vw] pt-[4vw]">
        <h1 className="text-6xl font-bold">{data.page.title}</h1>
        <div className="mt-4 text-3xl">
          <RichTextListRender
            richTextList={data.page.preamble}
            classes={classes}
          />
        </div>
      </header>
      <main className="mt-[12vw] pl-[7.5vw] pr-[7.5vw] text-2xl lg:text-[2.5vw]">
        <NotionRender
          blocks={data.blocks}
          components={components}
          classes={classes}
        />
      </main>
    </>
  );
}

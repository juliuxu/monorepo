import type { Classes } from "@julianjark/notion-render";
import { NotionRender } from "@julianjark/notion-render";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notionClient } from "~/clients.server";
import { config } from "~/config.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Julian Jark" },
    { name: "description", content: "Hei og hallo" },
  ];
};

export const loader = async () => {
  const blocks = await notionClient.getBlocksWithChildren(config.landingPageId);
  return json({
    blocks,
  });
};

export const classes: Partial<Classes> /*tw*/ = {
  heading_1: { root: "text-4xl font-bold" },
  heading_2: { root: "text-2xl underline" },
  column_list: { root: "flex flex-col sm:flex-row gap-[2.5vw]" },
  column: { root: "" },
  divider: { root: "mt-[6vw] mb-[6vw]" },
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="pl-[7.5vw] pr-[7.5vw] text-2xl lg:text-[2.5vw]">
      <NotionRender blocks={data.blocks} classes={classes} />
    </main>
  );
}

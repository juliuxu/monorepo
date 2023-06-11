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
  heading_2: { root: "text-2xl font-bold" },
  column_list: { root: "flex flex-col sm:flex-row" },
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <NotionRender blocks={data.blocks} classes={classes} />
    </main>
  );
}

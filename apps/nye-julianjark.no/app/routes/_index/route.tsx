import { NotionRender } from "@julianjark/notion-render";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { notionClient } from "~/clients.server";
import { config } from "~/config.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Hello, world" },
    { name: "description", content: "Hei og hallo" },
  ];
};

export const loader = async () => {
  const blocks = await notionClient.getBlocksWithChildren(config.landingPageId);
  return json({
    blocks,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="text-2xl">Hello, world</h1>
      <NotionRender blocks={data.blocks} />
    </main>
  );
}

import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenPageWithBlocks } from "./client";
import { config } from "~/config.server";
import { getCustomBlocksData } from "./custom-blocks.server";
import { TableOfConents } from "~/components/table-of-contents";
import { isPreviewMode } from "../api.preview-mode/preview-mode.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async ({
  params: { notionPage },
  request,
}: LoaderArgs) => {
  if (!notionPage) throw new Response("param not given", { status: 500 });

  const page = await getNotionDrivenPageWithBlocks(
    notionPage,
    await isPreviewMode(request)
  );
  if (!page) throw new Response(null, { status: 404 });

  const customBlocksData = await getCustomBlocksData(page.blocks);

  return json(
    { ...customBlocksData, page, featureTableOfContents: false },
    { headers: config.loaderCacheControlHeaders }
  );
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

// export const proseClasses /*tw*/ = {
//   prose: "prose-lg prose max-w-full [&_p]:max-w-prose",
//   typography:
//     "prose-headings:font-normal prose-headings:text-2xl prose-headings:md:text-3xl prose-headings:lg:text-[2.5vw] prose-headings:lg:leading-snug",
// };
export default function Component() {
  const data = useLoaderData<typeof loader>();
  if (data.featureTableOfContents) {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <TableOfConents />
        </div>
        <div className="col-span-10">
          <NotionPage {...data} />
        </div>
      </div>
    );
  }
  return (
    <>
      <NotionPage {...data} />
    </>
  );
}

import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenPageWithBlocks } from "./client";
import { config } from "~/config.server";
import { getCustomBlocksData } from "./custom-blocks.server";
import { TableOfConents } from "~/components/table-of-contents";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { useShortcut } from "@julianjark/dev-tools";

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
    isPreviewModeFromRequest(request)
  );
  if (!page) throw new Response(null, { status: 404 });

  const customBlocksData = await getCustomBlocksData(page.blocks);

  return json(
    { ...customBlocksData, page, featureTableOfContents: false },
    { headers: config.loaderCacheControlHeaders }
  );
};

// export const proseClasses /*tw*/ = {
//   prose: "prose-lg prose max-w-full [&_p]:max-w-prose",
//   typography:
//     "prose-headings:font-normal prose-headings:text-2xl prose-headings:md:text-3xl prose-headings:lg:text-[2.5vw] prose-headings:lg:leading-snug",
// };
export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.page.id });

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

/**
 * Let's the author quickly edit the page in Notion
 */
export function useEditNotionPage({ pageId }: { pageId: string }) {
  useShortcut("ee", () => {
    // As of 11. july 2023 Notion figures out which page this belongs to and opens it correctly
    window.open(`https://notion.so/${pageId.replaceAll("-", "")}`, "_blank");
  });
}

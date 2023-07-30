import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenPageWithBlocks } from "../../service/notion-driven-page/client";
import { config } from "~/config.server";
import { getCustomBlocksData } from "./custom-blocks/index.server";
import { TableOfConents } from "~/components/table-of-contents";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { useEditNotionPage } from "./use-edit-notion-page";

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
  return <NotionPage {...data} />;
}

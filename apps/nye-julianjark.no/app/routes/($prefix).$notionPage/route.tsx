import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NotionPage } from "~/routes/($prefix).$notionPage/notion-driven-page";
import { getNotionDrivenPageWithBlocks } from "../../service/notion-driven-page/client";
import { config } from "~/config.server";
import { getCustomBlocksData } from "./custom-blocks/index.server";
import { TableOfConents } from "~/components/table-of-contents";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { useEditNotionPage } from "./use-edit-notion-page";
import { buildSiteHeaderMetaInfo } from "~/components/site-header";
import { deSlugify } from "~/misc";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async ({
  params: { prefix, notionPage },
  request,
}: LoaderArgs) => {
  if (!notionPage) throw new Response("param not given", { status: 500 });

  const page = await getNotionDrivenPageWithBlocks({
    prefix,
    slug: notionPage,
    isPreview: isPreviewModeFromRequest(request),
  });
  if (!page) throw new Response(null, { status: 404 });

  const customBlocksData = await getCustomBlocksData(page.blocks);

  return json(
    {
      ...(page.prefix
        ? buildSiteHeaderMetaInfo({
            headerMenu: {
              title: deSlugify(page.prefix),
              href: "/" + page.prefix,
            },
          })
        : {}),

      ...customBlocksData,
      page,

      // @deprecated
      featureTableOfContents: false,
    },
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

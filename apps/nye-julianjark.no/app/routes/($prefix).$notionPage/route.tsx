import { json, type LoaderArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getTextFromRichText } from "@julianjark/notion-utils";

import { buildSiteHeaderMetaInfo } from "~/components/site-header";
import { TableOfConents } from "~/components/table-of-contents";
import { config } from "~/config.server";
import { NotionPage } from "~/routes/($prefix).$notionPage/notion-driven-page";
import { deSlugify } from "~/utils/misc";
import { getNotionDrivenPageWithBlocks } from "../../service/notion-driven-page/client";
import { isPreviewModeFromRequest } from "../api.preview-mode/preview-mode.server";
import { getCustomBlocksData } from "./custom-blocks/index.server";
import { useEditNotionPage } from "./use-edit-notion-page";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: getTextFromRichText(data!.page.preamble) },
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

  const customBlocksData = await getCustomBlocksData(page.blocks, request);

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
    { headers: config.loaderCacheControlHeaders },
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

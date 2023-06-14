import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import { json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { NotionPage } from "~/routes/$notionPage/notion-driven-page";
import { getNotionDrivenPageWithBlocks } from "./client";
import { config } from "~/config.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title },
    { name: "description", content: data?.page.preamble },
  ];
};

export const loader = async ({ params: { notionPage } }: LoaderArgs) => {
  if (!notionPage) throw new Response("param not given", { status: 500 });

  const result = await getNotionDrivenPageWithBlocks(notionPage);
  if (!result) throw new Response(null, { status: 404 });

  return json(result, { headers: config.loaderCacheControlHeaders });
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

// export const proseClasses /*tw*/ = {
//   prose: "prose-lg prose max-w-full [&_p]:max-w-prose",
//   typography:
//     "prose-headings:font-normal prose-headings:text-2xl prose-headings:md:text-3xl prose-headings:lg:text-[2.5vw] prose-headings:lg:leading-snug",
// };
export default function Component() {
  const data = useLoaderData<typeof loader>();
  return <NotionPage {...data} />;
}

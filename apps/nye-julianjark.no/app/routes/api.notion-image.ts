import type { LoaderArgs } from "@remix-run/node";
import {
  createImageUrlBuilder,
  getNotionImage,
} from "@julianjark/notion-image";
import { config } from "~/config.server";

const apiPath = "/api/notion-image";
const basePath = "https://nye.julianjark.no";

export const imageUrlBuilder = createImageUrlBuilder(
  new URL(apiPath, basePath).toString()
);

export const loader = async ({ request }: LoaderArgs) => {
  const imageResponse = await getNotionImage(config.notionToken)(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  const response = new Response(imageResponse.body);
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return response;
};

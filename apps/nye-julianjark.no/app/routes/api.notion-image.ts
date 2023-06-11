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
  return getNotionImage(config.notionToken)(
    Object.fromEntries(new URL(request.url).searchParams)
  );
};

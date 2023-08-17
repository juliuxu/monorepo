import type { LoaderArgs } from "@remix-run/node";

import { createIPX, handleRequest } from "ipx";

const domains = ["julianjark.no", "picsum.photos"];
const ipx = createIPX({
  domains,
});

export const loader = async ({ params }: LoaderArgs) => {
  let ipxPath = params["*"];
  if (!ipxPath) throw new Error("No path provided");
  ipxPath = "/" + ipxPath;

  // Hack: IPX doesn't allow to never convert svg's
  // So we need to do a initial fetch to see if it's a svg and return it as is if so
  // Since this endpoint is cached by nginx the cost of this extra hack is fine
  const url = new URL(ipxPath.split("/").slice(2).join("/"));
  if (!domains.includes(url.hostname)) throw new Error("Invalid hostname");
  const imageResponse = await fetch(url);
  if (imageResponse.headers.get("content-type")?.includes("svg")) {
    return new Response(await imageResponse.body, {
      headers: {
        "content-type": "image/svg+xml",
        "cache-control": "max-age=31536000, public, s-maxage=31536000",
      },
      status: imageResponse.status,
      statusText: imageResponse.statusText,
    });
  }

  const ipxResponse = await handleRequest(
    {
      url: ipxPath,
    },
    ipx,
  );

  return new Response(ipxResponse.body, {
    headers: ipxResponse.headers,
    status: ipxResponse.statusCode,
    statusText: ipxResponse.statusMessage,
  });
};

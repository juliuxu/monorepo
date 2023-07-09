import type { LoaderArgs } from "@remix-run/node";
import { createIPX, handleRequest } from "ipx";

const ipx = createIPX({
  domains: ["nye.julianjark.no", "picsum.photos"],
});

export const loader = async ({ params }: LoaderArgs) => {
  let ipxPath = params["*"];
  if (!ipxPath) throw new Error("No path provided");
  ipxPath = "/" + ipxPath;

  const ipxResponse = await handleRequest(
    {
      url: ipxPath,
    },
    ipx
  );

  const response = new Response(ipxResponse.body, {
    headers: ipxResponse.headers,
    status: ipxResponse.statusCode,
    statusText: ipxResponse.statusMessage,
  });

  return response;
};

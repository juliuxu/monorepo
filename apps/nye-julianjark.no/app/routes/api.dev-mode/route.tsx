import type { ActionArgs } from "@remix-run/node";
import {
  getDevModeFromJson,
  getDevModeSetCookieHeader,
} from "./dev-mode.server";

export const action = async ({ request }: ActionArgs) => {
  const devMode = getDevModeFromJson(await request.json());
  if (!devMode) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = getDevModeSetCookieHeader(devMode);
  return new Response("OK", { status: 200, headers });
};

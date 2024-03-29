import type { ActionFunctionArgs } from "@remix-run/node";

import {
  getPreviewModeFromJson,
  getPreviewModeSetCookieHeader,
} from "./preview-mode.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const preivewMode = getPreviewModeFromJson(await request.json());
  if (!preivewMode) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = getPreviewModeSetCookieHeader(preivewMode);
  return new Response("OK", { status: 200, headers });
};

import type { ActionArgs } from "@remix-run/node";
import { PreviewModeToggle as PreviewModeToggleComponent } from "@julianjark/dev-tools";
import {
  getPreviewModeFromJson,
  getPreivewModeSetCookieHeader,
} from "./preview-mode.server";
import { useRouteLoaderData } from "@remix-run/react";
import type { loader } from "~/root";

export const action = async ({ request }: ActionArgs) => {
  const preivewMode = getPreviewModeFromJson(await request.json());
  if (!preivewMode) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = getPreivewModeSetCookieHeader(preivewMode);
  return new Response("OK", { status: 200, headers });
};

export function PreviewModeToggle() {
  const { previewMode } = useRouteLoaderData<typeof loader>("root") ?? {};
  return (
    <PreviewModeToggleComponent
      previewMode={previewMode}
      apiEndpoint="/api/preview-mode"
    />
  );
}

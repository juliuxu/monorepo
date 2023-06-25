import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { useShortcut } from "~/components/use-shortcut";
import { config } from "~/config.server";
import type { loader } from "~/root";
import type { PreviewMode } from "./preview-mode.server";
import {
  preivewModeSchema,
  serializePreviewModeToCookie,
} from "./preview-mode.server";

export const action = async ({ request }: ActionArgs) => {
  const body = preivewModeSchema.parse(await request.json());
  if (body.secret !== config.previewSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = { "Set-Cookie": await serializePreviewModeToCookie(body) };
  return new Response("OK", { status: 200, headers });
};

export function PreviewModeToggle() {
  const { previewMode } = useRouteLoaderData("root") as SerializeFrom<
    typeof loader
  >;
  async function togglePreviewMode() {
    const secret =
      previewMode?.secret ?? window.prompt("Fyll inn preview secret") ?? "";
    const previewModeToSend: PreviewMode = {
      enabled: !previewMode?.enabled,
      secret,
    };
    const response = await fetch(`/api/preview-mode`, {
      method: "POST",
      body: JSON.stringify(previewModeToSend),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      window.location.reload();
    }
  }
  useShortcut("pp", togglePreviewMode);
  if (!previewMode) return null;
  if (!previewMode.enabled) return null;
  return (
    <div
      lang="en"
      className="fixed right-0 top-0 rounded-bl-lg border-secondary bg-secondary/20 p-2 text-secondary backdrop-blur"
    >
      <button onClick={togglePreviewMode} title="Toggle preview mode">
        👀 Preview
      </button>
    </div>
  );
}

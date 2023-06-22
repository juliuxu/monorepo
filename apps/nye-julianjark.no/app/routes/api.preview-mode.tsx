import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { createCookie } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { z } from "zod";
import { useShortcut } from "~/components/use-shortcut";
import { config } from "~/config.server";
import type { loader } from "~/root";

// Schema
const preivewModeSchema = z.object({
  enabled: z.boolean(),
  secret: z.string(),
});
export type PreviewMode = z.infer<typeof preivewModeSchema>;

// Cookie
const cookie = createCookie("preview-mode");
export async function serializePreviewModeToCookie(previewMode: PreviewMode) {
  return await cookie.serialize(previewMode);
}
async function safeParsePreviewModeCookie(cookieHeader: string | null) {
  const value = await cookie.parse(cookieHeader);
  const parsed = preivewModeSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  else return undefined;
}

// Getter
export async function isPreviewMode(fromRequest: Request) {
  return (await getPreviewMode(fromRequest))?.enabled ?? false;
}
export async function getPreviewMode(
  fromRequest: Request
): Promise<PreviewMode | undefined> {
  // First. always use the url
  const previewSecretFromUrl = new URL(fromRequest.url).searchParams.get(
    "preview"
  );
  const previewModeEnabledFromUrl =
    previewSecretFromUrl === config.previewSecret;
  if (previewModeEnabledFromUrl) {
    return {
      enabled: true,
      secret: previewSecretFromUrl,
    };
  }

  // Second. use the cookie, if the secret is correct of course
  const previewMode = await safeParsePreviewModeCookie(
    fromRequest.headers.get("cookie")
  );
  if (previewMode?.secret === config.previewSecret) {
    return previewMode;
  }

  return undefined;
}

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
    <div className="absolute right-2 top-2 text-secondary">👀 Preview</div>
  );
}

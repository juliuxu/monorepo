import { createCookie } from "@remix-run/node";
import { z } from "zod";
import { config } from "~/config.server";

// Schema
export const preivewModeSchema = z.object({
  enabled: z.boolean(),
  secret: z.string(),
});
export type PreviewMode = z.infer<typeof preivewModeSchema>;
// Cookie
const cookie = createCookie("preview_mode");
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

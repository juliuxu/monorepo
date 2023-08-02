import { z } from "zod";
import cookie from "cookie";
import { safeCompare } from "./safe-compare";

const PREVIEW_KEY = "preview_mode";

// Schema
const preivewModeSchema = z.object({
  enabled: z.boolean(),
  secret: z.string(),
});
export type PreviewMode = z.infer<typeof preivewModeSchema>;

// Cookie
function serializePreviewModeToCookie(previewMode: PreviewMode) {
  return cookie.serialize(PREVIEW_KEY, btoa(JSON.stringify(previewMode)), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 400,
  });
}
function safeParsePreviewModeCookie(cookieHeader: string | null) {
  const values = cookie.parse(cookieHeader ?? "");
  try {
    return preivewModeSchema.parse(JSON.parse(atob(values[PREVIEW_KEY] ?? "")));
  } catch (e) {
    return undefined;
  }
}

const getPreviewModeFromJson = (secret: string) => (data: unknown) => {
  const parsed = preivewModeSchema.safeParse(data);
  if (!parsed.success) return undefined;
  if (!safeCompare(parsed.data.secret, secret)) return undefined;
  return parsed.data;
};

const isPreviewModeFromRequest = (secret: string) => (request: Request) => {
  return getPreviewModeFromRequest(secret)(request)?.enabled ?? false;
};
const getPreviewModeFromRequest = (secret: string) => (request: Request) => {
  // First. always use the url
  // this allows us to open preview mode from a link
  const previewSecretFromUrl =
    new URL(request.url).searchParams.get(PREVIEW_KEY) ?? "";
  const previewModeEnabledFromUrl = safeCompare(previewSecretFromUrl, secret);
  if (previewModeEnabledFromUrl) {
    return {
      enabled: true,
      secret: previewSecretFromUrl,
    };
  }

  // Second. use the cookie, if the secret is correct of course
  const previewMode = safeParsePreviewModeCookie(request.headers.get("cookie"));
  if (safeCompare(previewMode?.secret ?? "", secret)) {
    return previewMode;
  }

  return undefined;
};

function getPreviewModeSetCookieHeader(previewMode: PreviewMode | undefined) {
  if (!previewMode) return { "Set-Cookie": "" };
  return { "Set-Cookie": serializePreviewModeToCookie(previewMode) };
}

export function createPreviewMode(secret: string) {
  return {
    isPreviewModeFromRequest: isPreviewModeFromRequest(secret),
    getPreviewModeFromRequest: getPreviewModeFromRequest(secret),
    getPreviewModeFromJson: getPreviewModeFromJson(secret),
    serializePreviewModeToCookie,
    getPreviewModeSetCookieHeader,
  };
}

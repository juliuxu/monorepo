import { z } from "zod";
import cookie from "cookie";
import { safeCompare } from "./safe-compare";

const DEV_MODE_KEY = "dev-mode";

// Schema
const devModeSchema = z.object({
  enabled: z.boolean(),
  secret: z.string(),
});
export type DevMode = z.infer<typeof devModeSchema>;

// Cookie
function serializeDevModeToCookie(devMode: DevMode) {
  return cookie.serialize(DEV_MODE_KEY, btoa(JSON.stringify(devMode)), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 400,
  });
}
function safeParseDevModeCookie(cookieHeader: string | null) {
  const values = cookie.parse(cookieHeader ?? "");
  try {
    return devModeSchema.parse(JSON.parse(atob(values[DEV_MODE_KEY] ?? "")));
  } catch (e) {
    return undefined;
  }
}

const getDevModeFromJson = (secret: string) => (data: unknown) => {
  const parsed = devModeSchema.safeParse(data);
  if (!parsed.success) return undefined;
  if (!safeCompare(parsed.data.secret, secret)) return undefined;
  return parsed.data;
};

const isDevModeFromRequest = (secret: string) => (request: Request) => {
  return getDevModeFromRequest(secret)(request)?.enabled ?? false;
};
const getDevModeFromRequest =
  (secret: string) =>
  (request: Request): DevMode | undefined => {
    // First. always use the url
    // this allows us to open dev mode from a link
    const devModeSecretFromUrl =
      new URL(request.url).searchParams.get(DEV_MODE_KEY) ?? "";
    const devModeEnabledFromUrl = safeCompare(devModeSecretFromUrl, secret);
    if (devModeEnabledFromUrl) {
      return {
        enabled: true,
        secret: devModeSecretFromUrl,
      };
    }

    // Second. use the cookie, if the secret is correct of course
    const devMode = safeParseDevModeCookie(request.headers.get("cookie"));
    if (safeCompare(devMode?.secret ?? "", secret)) {
      return devMode;
    }

    return undefined;
  };

function getDevModeSetCookieHeader(devMode: DevMode | undefined) {
  if (!devMode) return { "Set-Cookie": "" };
  return { "Set-Cookie": serializeDevModeToCookie(devMode) };
}

export function createDevMode(secret: string) {
  return {
    isDevModeFromRequest: isDevModeFromRequest(secret),
    getDevModeFromRequest: getDevModeFromRequest(secret),
    getDevModeFromJson: getDevModeFromJson(secret),
    serializeDevModeToCookie: serializeDevModeToCookie,
    getDevModeSetCookieHeader,
  };
}

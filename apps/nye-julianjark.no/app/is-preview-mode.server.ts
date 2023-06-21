import { config } from "~/config.server";

export function isPreviewMode(fromRequest: Request) {
  return (
    config.nodeEnv === "development" ||
    new URL(fromRequest.url).searchParams.get("preview") ===
      config.previewSecret
  );
}

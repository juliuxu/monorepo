import { createPreviewMode } from "@julianjark/dev-tools/dist/index.server";
import { config } from "~/config.server";

export const {
  getPreviewModeFromJson,
  getPreviewModeFromRequest,
  isPreviewModeFromRequest,
  getPreviewModeSetCookieHeader,
} = createPreviewMode(config.previewSecret);

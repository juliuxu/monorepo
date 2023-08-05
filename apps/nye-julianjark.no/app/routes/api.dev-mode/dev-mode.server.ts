import { createDevMode } from "@julianjark/dev-tools/dist/index.server.js";
import { config } from "~/config.server";

export const {
  getDevModeFromJson,
  getDevModeFromRequest,
  isDevModeFromRequest,
  getDevModeSetCookieHeader,
} = createDevMode(config.previewSecret);

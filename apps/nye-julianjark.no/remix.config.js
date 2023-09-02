import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  watchPaths: [
    require.resolve("@julianjark/dev-tools"),
    require.resolve("@julianjark/notion-client"),
    require.resolve("@julianjark/notion-image"),
    require.resolve("@julianjark/notion-render"),
    require.resolve("@julianjark/notion-utils"),
    require.resolve("@julianjark/notion-shiki-code"),
  ],
  serverDependenciesToBundle: ["photoswipe", "@vercel/og"],
  tailwind: true,
  postcss: true,
};

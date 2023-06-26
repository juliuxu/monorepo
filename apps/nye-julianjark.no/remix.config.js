/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  watchPaths: [
    require.resolve("@julianjark/notion-client"),
    require.resolve("@julianjark/notion-image"),
    require.resolve("@julianjark/notion-render"),
    require.resolve("@julianjark/notion-utils"),
    require.resolve("@julianjark/notion-shiki-code"),
  ],
  serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true,
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};

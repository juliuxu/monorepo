import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";

import appleTouchIcon from "~/assets/favicon/apple-touch-icon.png";
import icoFavicon from "~/assets/favicon/favicon.ico";
import pngFavicon from "~/assets/favicon/favicon.png";
import svgFavicon from "~/assets/favicon/favicon.svg";
import manifest from "~/assets/favicon/manifest.webmanifest";
import {
  getPreviewModeFromRequest,
  getPreviewModeSetCookieHeader,
} from "~/routes/api.preview-mode/preview-mode.server";
import tailwindCss from "~/styles/tailwind.css";
import { MatomoAnalytics } from "./components/analytics";
import { Footer } from "./components/footer";
import { SiteHeader } from "./components/site-header";
import { config } from "./config.server";
import { useContentOnlyMode } from "./content-only-mode";
import { useScrollBehaviorSmooth } from "./handle";
import {
  getDevModeFromRequest,
  getDevModeSetCookieHeader,
} from "./routes/api.dev-mode/dev-mode.server";
import { DevTools } from "./routes/api.dev-mode/dev-tools";
import { classNames } from "./utils/misc";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindCss },

  // Favicon stuff
  {
    rel: "icon",
    href: svgFavicon,
    type: "image/svg+xml",
  },
  {
    rel: "icon",
    href: pngFavicon,
    type: "image/png",
  },
  {
    rel: "icon",
    href: icoFavicon,
    sizes: "32x32",
  },
  {
    rel: "apple-touch-icon",
    href: appleTouchIcon,
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: manifest,
  },
];

/**
 <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
<link rel="icon" type="image/png" href="/assets/images/favicon.png">
 */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const previewMode = getPreviewModeFromRequest(request);
  const devMode = getDevModeFromRequest(request);

  previewMode &&
    headers.append(
      "Set-Cookie",
      getPreviewModeSetCookieHeader(previewMode)["Set-Cookie"],
    );
  devMode &&
    headers.append(
      "Set-Cookie",
      getDevModeSetCookieHeader(devMode)["Set-Cookie"],
    );

  return json(
    {
      devMode,
      previewMode,
    },
    {
      headers,
    },
  );
};

export function useDevMode() {
  return useRouteLoaderData<typeof loader>("root")?.devMode;
}

export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function App() {
  const { previewMode, devMode } = useLoaderData<typeof loader>();
  const scrollBehaviorSmooth = useScrollBehaviorSmooth();
  const isContentOnlyMode = useContentOnlyMode();

  return (
    <html lang="no" className={scrollBehaviorSmooth ? "scroll-smooth" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={classNames(
          `px-container flex min-h-screen flex-col bg-base-100`,
          "antialiased text-body lg:text-body-lg ",
        )}
      >
        {!isContentOnlyMode && <SiteHeader />}
        <div className={isContentOnlyMode ? "py-8" : ""}>
          <Outlet />
        </div>
        {!isContentOnlyMode && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}

        <DevTools {...{ previewMode, devMode }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        {process.env.NODE_ENV === "production" && (
          <MatomoAnalytics
            hostname="analytics.julianjark.no"
            siteId="1"
            scriptPath="icecream.js"
            trackerPath="popcorn"
            enableHeartBeatTimer
            userId={devMode ? "dev" : undefined}
          />
        )}
      </body>
    </html>
  );
}

import { cssBundleHref } from "@remix-run/css-bundle";
import { json } from "@remix-run/node";
import type {
  HeadersFunction,
  LoaderArgs,
  LinksFunction,
} from "@remix-run/node";
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
import tailwindCss from "~/styles/tailwind.css";

import manifest from "~/assets/manifest.webmanifest";
import svgFavicon from "~/assets/favicon.svg";
import pngFavicon from "~/assets/favicon.png";
import appleTouchIcon from "~/assets/apple-touch-icon.png";

import {
  getPreviewModeFromRequest,
  getPreviewModeSetCookieHeader,
} from "~/routes/api.preview-mode/preview-mode.server";
import { config } from "./config.server";
import { useScrollBehaviorSmooth } from "./handle";
import { Footer } from "./components/footer";
import { DevTools } from "./routes/api.dev-mode/dev-tools";
import { SiteHeader } from "./components/site-header";
import { useContentOnlyMode } from "./content-only-mode";
import {
  getDevModeFromRequest,
  getDevModeSetCookieHeader,
} from "./routes/api.dev-mode/dev-mode.server";

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

export const loader = async ({ request }: LoaderArgs) => {
  const headers = new Headers();
  const previewMode = getPreviewModeFromRequest(request);
  const devMode = getDevModeFromRequest(request);

  previewMode &&
    headers.append(
      "Set-Cookie",
      getPreviewModeSetCookieHeader(previewMode)["Set-Cookie"]
    );
  devMode &&
    headers.append(
      "Set-Cookie",
      getDevModeSetCookieHeader(devMode)["Set-Cookie"]
    );

  return json(
    {
      devMode,
      previewMode,
    },
    {
      headers,
    }
  );
};

export function useDevMode() {
  return useRouteLoaderData<typeof loader>("root")?.devMode;
}

export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

// TODO: This might belong in the tailwind config
export const sharedClasses /*tw*/ = {
  container: "pl-[7.5vw] pr-[7.5vw]",
  typography: "antialiased text-h2 lg:text-h2-lg",
};
export default function App() {
  const { previewMode, devMode } = useLoaderData();
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
        className={`${sharedClasses.container} ${sharedClasses.typography} flex min-h-screen flex-col bg-base-100`}
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
      </body>
    </html>
  );
}

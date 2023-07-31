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
  useSearchParams,
} from "@remix-run/react";
import tailwindCss from "~/styles/tailwind.css";

import manifest from "~/assets/manifest.webmanifest";
import svgLogo from "~/assets/logo.svg";
import pngLogo from "~/assets/logo.png";
import {
  getPreivewModeSetCookieHeader,
  getPreviewModeFromRequest,
} from "./routes/api.preview-mode/preview-mode.server";
import { config } from "./config.server";
import { useScrollBehaviorSmooth } from "./handle";
import { Footer } from "./components/footer";
import { DevTools } from "./components/dev-tools";
import { SiteHeader } from "./components/site-header";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindCss },
  {
    rel: "icon",
    href: svgLogo,
  },
  {
    rel: "apple-touch-icon",
    href: pngLogo,
  },
  {
    rel: "manifest",
    href: manifest,
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  const previewMode = getPreviewModeFromRequest(request);
  const headers = getPreivewModeSetCookieHeader(previewMode);

  return json(
    {
      abc: 123,
      previewMode,
    },
    {
      headers,
    }
  );
};

export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

// TODO: This might belong in the tailwind config
export const sharedClasses /*tw*/ = {
  container: "pl-[7.5vw] pr-[7.5vw]",
  typography: "antialiased text-h2 lg:text-h2-lg",
};
export default function App() {
  const scrollBehaviorSmooth = useScrollBehaviorSmooth();
  const [search] = useSearchParams();
  const isIframe = search.get("content-only") === "true";

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
        {!isIframe && <SiteHeader />}
        <div>
          <Outlet />
        </div>
        {!isIframe && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}

        <DevTools />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

import { cssBundleHref } from "@remix-run/css-bundle";
import { json } from "@remix-run/node";
import type {
  HeadersFunction,
  LoaderArgs,
  LinksFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import tailwindCss from "~/styles/tailwind.css";

import manifest from "~/assets/manifest.webmanifest";
import svgLogo from "~/assets/logo.svg";
import pngLogo from "~/assets/logo.png";
import backSvg from "~/assets/back.svg";
import julianFace from "~/assets/julian-face.svg";
import { ClearCacheButton } from "./routes/api.clear-cache";
import { classes } from "~/routes/$notionPage/notion-driven-page";
import { classNames } from "~/misc";
import { PreviewModeToggle } from "~/routes/api.preview-mode/route";
import {
  getPreviewMode,
  serializePreviewModeToCookie,
} from "./routes/api.preview-mode/preview-mode.server";
import { config } from "./config.server";
import { useScrollBehaviorSmooth } from "./handle";

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
  const previewMode = await getPreviewMode(request);
  const headers = previewMode
    ? { "Set-Cookie": await serializePreviewModeToCookie(previewMode) }
    : { "Set-Cookie": "" };

  return json(
    {
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
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const scrollBehaviorSmooth = useScrollBehaviorSmooth();
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
        <header
          className={classNames(
            isLandingPage ? "mb-[4vw]" : "mb-[8vw] pt-[4vw] md:mb-[4vw]"
          )}
        >
          <nav
            className={classNames(
              isLandingPage && "hidden",
              "grid grid-cols-12"
            )}
          >
            <Link to="/" className="" prefetch="render">
              <p className="sr-only">Til hovedside</p>
              <img src={backSvg} alt="" width={33} height={24} />
            </Link>
          </nav>
        </header>
        <div>
          <Outlet />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <div className="mb-[6vw]">
      <hr className={classes.divider.root} />

      {/**
       * Hardcoded information in footer
       * for me, this is not information that will change often
       * and if so, I can change it easily
       *
       * Had this been a bigger site, with more people involved I could put the content in CMS/Notion instead
       * */}
      <footer className="flex flex-row gap-6">
        <PreviewModeToggle />
        <ClearCacheButton>
          <img src={julianFace} alt="Illustrajon av fjeset til Julian" />
        </ClearCacheButton>
        <nav className="flex flex-col justify-center gap-2 text-body lg:text-body-lg">
          <Link
            prefetch="viewport"
            to="/kontakt"
            className={classes.rich_text_anchor}
          >
            Kontakt Julian Jark
          </Link>
          <a
            href="https://www.linkedin.com/in/julianjark/"
            className={classes.rich_text_anchor}
          >
            linkedin.julianjark
          </a>
          <a
            href="https://github.com/juliuxu/"
            className={classes.rich_text_anchor}
          >
            Github
          </a>
        </nav>
      </footer>
    </div>
  );
}

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LoaderArgs } from "@remix-run/node";
import { json, type LinksFunction } from "@remix-run/node";
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
import {
  getPreviewMode,
  PreviewMode,
  serializePreviewModeToCookie,
} from "~/routes/api.preview-mode";

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

// TODO: This might belong in the tailwind config
export const sharedClasses /*tw*/ = {
  container: "pl-[7.5vw] pr-[7.5vw]",
  typography: "text-2xl md:text-3xl lg:text-[2.5vw] lg:leading-snug",
};
export default function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  return (
    <html lang="no" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`${sharedClasses.container} ${sharedClasses.typography} flex min-h-screen flex-col`}
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
            <Link to="/" className="">
              <p className="sr-only">Til hovedside</p>
              <img src={backSvg} alt="" />
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
        <PreviewMode />
        <ClearCacheButton>
          <img src={julianFace} alt="Illustrajon av fjeset til Julian" />
        </ClearCacheButton>
        <nav className="flex flex-col justify-center gap-2 text-xl">
          <Link
            prefetch="intent"
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

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindCss from "~/styles/tailwind.css";

import manifest from "~/assets/manifest.webmanifest";
import svgLogo from "~/assets/logo.svg";
import pngLogo from "~/assets/logo.png";
import julianFace from "~/assets/julian-face.svg";
import { ClearCacheButton } from "./routes/api.clear-cache";
import { classes } from "./routes/$notionPage/notion-driven-page";

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

// TODO: This might belong in the tailwind config
const sharedClasses /*tw*/ = {
  container: "pl-[7.5vw] pr-[7.5vw]",
  typography: "text-2xl md:text-3xl lg:text-[2.5vw] lg:leading-snug",
};
export default function App() {
  return (
    <html lang="no" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`${sharedClasses.container} ${sharedClasses.typography}`}
      >
        <Outlet />
        <Footer />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <>
      <hr className={classes.divider.root} />

      {/**
       * Hardcoded information in footer
       * for me, this is not information that will change often
       * and if so, I can change it easily
       *
       * Had this been a bigger site, with more people involved I could put the content in CMS/Notion instead
       * */}
      <footer className="flex flex-row gap-6">
        <ClearCacheButton>
          <img src={julianFace} alt="Illustrajon av fjeset til Julian" />
        </ClearCacheButton>
        <nav className="flex flex-col">
          <Link prefetch="intent" to="/kontakt">
            Kontakt Julian Jark
          </Link>
          <a href="https://www.linkedin.com/in/julianjark/">
            linkedin.julianjark
          </a>
          <a href="https://github.com/juliuxu/">Github</a>
        </nav>
      </footer>
    </>
  );
}

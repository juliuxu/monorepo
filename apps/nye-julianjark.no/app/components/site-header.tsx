import { Link, useLocation, useMatches } from "@remix-run/react";

import { classNames } from "~/utils/misc";

interface SiteHeaderInfo {
  headerMenu?: {
    title: string;
    href: string;
  };
}
export function buildSiteHeaderMetaInfo(siteHeaderInfo: SiteHeaderInfo) {
  return { siteHeaderInfo };
}

export function useHeaderMenu() {
  const matches = useMatches();
  return matches
    .map((it) => it.data?.siteHeaderInfo as SiteHeaderInfo)
    .filter((it) => it?.headerMenu)[0]?.headerMenu;
}

export function SiteHeader() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const headerMenu = useHeaderMenu();

  return (
    <header
      className={classNames(
        isLandingPage ? "mb-[4vw]" : "mb-[8vw] pt-[4vw] md:mb-[4vw]",
      )}
    >
      <nav
        className={classNames(
          isLandingPage && "hidden",
          "grid grid-cols-12 items-center",
          "text-h2 lg:text-h2-lg",
        )}
      >
        <p className="tracking-wider font-semibold max-h-[1.3em]">
          <Link
            to="/"
            className="hover:text-secondary hover:text-h1 lg:hover:text-h1-lg transition-all duration-300"
            prefetch="render"
          >
            <span className="sr-only">Tilbake til hovedsiden</span>
            <span aria-hidden>JJ</span>
          </Link>
        </p>

        {/* <p className="sr-only">Til hovedside</p>
          <img src={backSvg} alt="" width={33} height={24} />
          */}

        {/* <p className="text-h2 font-semibold">
            <span aria-hidden className="tracking-wider">
              JJ
            </span>
            <span className="sr-only lg:not-sr-only">Julian Jark</span>
            <span aria-hidden className="tracking-wider lg:hidden">
              JJ
            </span>
          </p> */}
        {headerMenu && (
          <div className="col-span-10 text-center">
            <Link
              className="hover:text-secondary underline font-medium underline-offset-4"
              to={headerMenu.href}
              prefetch="render"
            >
              {headerMenu.title}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

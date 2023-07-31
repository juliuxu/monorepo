import { useLocation, Link } from "@remix-run/react";
import { useHeaderMenu } from "~/handle";
import { classNames } from "~/misc";
import backSvg from "~/assets/back.svg";

export function SiteHeader() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const headerMenu = useHeaderMenu();
  return (
    <header
      className={classNames(
        isLandingPage ? "mb-[4vw]" : "mb-[8vw] pt-[4vw] md:mb-[4vw]"
      )}
    >
      <nav
        className={classNames(
          isLandingPage && "hidden",
          "grid grid-cols-12 items-center"
        )}
      >
        <Link to="/" className="col-span-1" prefetch="render">
          <p className="sr-only">Til hovedside</p>
          <img src={backSvg} alt="" width={33} height={24} />
        </Link>
        {headerMenu && (
          <div className="col-span-10 text-center">
            <Link
              className="text-h2 hover:text-secondary underline font-medium underline-offset-4"
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

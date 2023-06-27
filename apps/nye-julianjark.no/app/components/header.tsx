import { useLocation } from "@remix-run/react";
import { classes } from "~/routes/$notionPage/notion-driven-page";

interface HeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}
export function Header({ title, description, className }: HeaderProps) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const landingPageMessage = isLandingPage ? (
    <>
      <br />
      {"🚧 Under utvikling 🚧"}
    </>
  ) : null;
  return (
    <>
      <header className={`${className ? className : ""}`}>
        <h1 className="text-h1 lg:text-h1-lg">{title}</h1>
        <p className="mt-4 max-w-4xl text-lead lg:text-lead-lg">
          {description}
          {landingPageMessage}
        </p>
      </header>
      {!isLandingPage && <hr className={classes.divider.root} />}
    </>
  );
}

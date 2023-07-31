// import { useLocation } from "@remix-run/react";
import { classes } from "~/routes/$notionPage/notion-driven-page";

interface HeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  addDivderUnderneath?: boolean;
}
export function PageHeader({
  title,
  description,
  className,
  addDivderUnderneath,
}: HeaderProps) {
  // const location = useLocation();
  // const isLandingPage = location.pathname === "/";
  // const landingPageMessage = isLandingPage ? (
  //   <>&nbsp;{"🚧 Under utvikling 🚧"}</>
  // ) : null;
  return (
    <>
      <header className={`${className ? className : ""}`}>
        <h1 className="text-h1 lg:text-h1-lg">{title}</h1>
        <p className="mt-4 max-w-4xl text-lead lg:text-lead-lg">
          {description}
          {/* {landingPageMessage} */}
        </p>
      </header>
      {addDivderUnderneath && <hr className={classes.divider.root} />}
    </>
  );
}

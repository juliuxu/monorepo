// import { useLocation } from "@remix-run/react";
import { classes } from "~/routes/($prefix).$notionPage/notion-driven-page";

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
  return (
    <>
      <header className={`${className ? className : ""}`}>
        <h1 className="text-h1 lg:text-h1-lg">{title}</h1>
        {description && (
          <p className="mt-4 max-w-4xl text-lead lg:text-lead-lg">
            {description}
          </p>
        )}
      </header>
      {addDivderUnderneath && <hr className={classes.divider.root} />}
    </>
  );
}

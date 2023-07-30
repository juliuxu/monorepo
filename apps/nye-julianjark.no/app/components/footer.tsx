import { Link } from "@remix-run/react";
import julianFace from "~/assets/julian-face.svg";
import { classes } from "~/routes/$notionPage/notion-driven-page";

export function Footer() {
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
        <img
          width={80}
          height={134}
          src={julianFace}
          alt="Illustrajon av fjeset til Julian"
        />
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

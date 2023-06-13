import { slugify } from "@julianjark/notion-utils";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/_index/route";
import { classes } from "../$notionPage/notion-driven-page";

export const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export function LatestTodayILearnedEntries() {
  const { latestTodayILearnedEntries } = useLoaderData<typeof loader>();
  return (
    <ul className="mt-4 grid gap-x-[5vw] gap-y-8 sm:grid-cols-2 md:grid-cols-3">
      {latestTodayILearnedEntries.map((entry) => (
        <li key={entry.id}>
          <article>
            <time className="text-lg sm:text-xl md:text-2xl">
              {dateFormatter.format(new Date(entry.created))}
            </time>
            <h3 className="">
              <Link
                className={classes.rich_text_anchor}
                prefetch="intent"
                to={`/i-dag-lærte-jeg/${slugify(entry.title)}`}
              >
                {entry.title}
              </Link>
            </h3>
            <p className="mt-3 text-lg">{entry.summary}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}

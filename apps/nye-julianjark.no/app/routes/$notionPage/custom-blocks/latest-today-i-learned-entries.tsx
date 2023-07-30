import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/_index";
import { classes } from "~/routes/$notionPage/notion-driven-page";

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
            <time className="text-body lg:text-body-lg">
              {dateFormatter.format(new Date(entry.publishedDate))}
            </time>
            <h3 className="text-h2 lg:text-h2-lg">
              <Link
                className={classes.rich_text_anchor}
                prefetch="viewport"
                to={`/i-dag-lærte-jeg/${entry.slug}`}
              >
                {entry.title}
              </Link>
            </h3>
            <p className="break-words mt-3 text-body lg:text-body-lg">
              {entry.summary}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}

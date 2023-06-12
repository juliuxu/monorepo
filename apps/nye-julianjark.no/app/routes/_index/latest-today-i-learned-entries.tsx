import { slugify } from "@julianjark/notion-utils";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/_index/route";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export function LatestTodayILearnedEntries() {
  const { latestTodayILearnedEntries } = useLoaderData<typeof loader>();
  return (
    <ul className="mt-4 grid gap-x-[5vw] gap-y-4 sm:grid-cols-2 md:grid-cols-3">
      {latestTodayILearnedEntries.map((entry) => (
        <li key={entry.id}>
          <article className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <time className="text-lg">
                {dateFormatter.format(new Date(entry.created))}
              </time>
              <h3 className="card-title text-xl">
                <Link
                  prefetch="intent"
                  to={`/i-dag-lærte-jeg/${slugify(entry.title)}`}
                >
                  {entry.title}
                </Link>
              </h3>
              <p className="text-lg">{entry.summary}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

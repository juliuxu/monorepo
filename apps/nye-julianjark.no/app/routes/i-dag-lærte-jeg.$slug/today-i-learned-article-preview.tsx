import { Link } from "@remix-run/react";
import { classes } from "~/routes/($prefix).$notionPage/notion-driven-page";
import { dateFormatter } from "./date-formatter";
import { TodayILearnedEntry } from "~/service/notion-today-i-learned/schema-and-mapper";
import { Badge } from "./badge";

interface TodayILearnedArticlePreviewProps {
  titleAs: "h2" | "h3" | "h4";
  entry: TodayILearnedEntry;
  hideSummary?: boolean;
}
export function TodayILearnedArticlePreview({
  entry,
  titleAs: TitleComponent,
  hideSummary,
}: TodayILearnedArticlePreviewProps) {
  return (
    <article>
      <time className="text-body lg:text-body-lg">
        {dateFormatter.format(new Date(entry.publishedDate))}
      </time>
      <TitleComponent className="text-h2 lg:text-h2-lg mt-1">
        <Link
          className={classes.rich_text_anchor}
          prefetch="viewport"
          to={`/i-dag-lærte-jeg/${entry.slug}`}
        >
          {entry.title}
        </Link>
      </TitleComponent>

      {!hideSummary && (
        <p className="break-words mt-3 text-body lg:text-body-lg">
          {entry.summary}
        </p>
      )}

      <div className="mt-4">
        <ul className="flex gap-2">
          {entry.tags.map((tag) => (
            <Badge as="li" key={tag.id} color={tag.color}>
              {tag.title}
            </Badge>
          ))}
        </ul>
      </div>
    </article>
  );
}

interface TodayILearnedArticlePreviewListProps {
  titleAs: "h2" | "h3" | "h4";
  entries: TodayILearnedEntry[];
  hideSummary?: boolean;
}
export function TodayILearnedArticlePreviewList({
  titleAs,
  entries,
  hideSummary,
}: TodayILearnedArticlePreviewListProps) {
  return (
    <ul className="mt-4 grid gap-x-[5vw] gap-y-8 sm:grid-cols-2 md:grid-cols-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <TodayILearnedArticlePreview
            titleAs={titleAs}
            entry={entry}
            hideSummary={hideSummary}
          />
        </li>
      ))}
    </ul>
  );
}

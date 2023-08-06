import { useLoaderData } from "@remix-run/react";
import { getAllDetteKanJeg } from "~/service/notion-dette-kan-jeg/client";
import type { DetteKanJeg } from "~/service/notion-dette-kan-jeg/schema-and-mapper";
import { classNames, shuffled } from "~/utils/misc";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { RichTextListRender } from "@julianjark/notion-render";

export const getDetteKanJegData = async () => {
  const detteKanJeg = await getAllDetteKanJeg();
  return { detteKanJeg: shuffled(detteKanJeg) };
};

export function DetteKanJegBlock() {
  const { detteKanJeg } = useLoaderData() as Awaited<
    ReturnType<typeof getDetteKanJegData>
  >;

  return (
    <KnowledgeList
      knowledge={detteKanJeg.filter((item) => item.competence === "known")}
    />
  );
}
export function DetteKanJegWantToLearnMoreBlock() {
  const { detteKanJeg } = useLoaderData() as Awaited<
    ReturnType<typeof getDetteKanJegData>
  >;
  return (
    <KnowledgeList
      knowledge={detteKanJeg.filter(
        (item) => item.competence === "want-to-learn-more"
      )}
    />
  );
}

function KnowledgeList({ knowledge }: { knowledge: DetteKanJeg[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-4">
      {knowledge.map((item) => {
        let element = (
          <span
            className={classNames(
              "text-h2"
              // "hover:underline focus:underline"
              // "badge badge-lg group-hover:badge-info",
              // "transition-all duration-500 ease-out",
              // "group-hover:scale-150",
              // "group-hover:z-50",
              // "grouo-hover:border border-none",
              // item.isFeatured && "font-bold",
              // item.link ? "cursor-pointer" : "cursor-default"
            )}
          >
            {item.title}
          </span>
        );
        if (item.link) {
          element = (
            <a href={item.link} target="_blank" rel="noreferrer">
              {element}
            </a>
          );
        }
        return (
          <li key={item.id} className="group text-base">
            {item.link ? (
              <HoverCard>
                <HoverCardTrigger asChild className="font-bold">
                  {element}
                </HoverCardTrigger>
                <HoverCardContent className="p-6 w-96 flex space-x-6">
                  {item.logo && (
                    <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img
                        className="aspect-square h-full w-full"
                        src={item.logo}
                        alt=""
                      />
                    </span>
                  )}
                  <div>
                    <h3 className="text-h2 font-bold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-4 text-body">
                        <RichTextListRender richTextList={item.description} />
                      </p>
                    )}
                    <a
                      href={item.link}
                      className="mt-4 text-body inline-flex items-center gap-2 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-[1em] w-[1em]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                      </svg>
                      Link
                    </a>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              element
            )}
          </li>
        );
      })}
    </ul>
  );
}

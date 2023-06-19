import { useLoaderData } from "@remix-run/react";
import { getAllDetteKanJeg } from "~/service/notion-dette-kan-jeg/client";
import type { DetteKanJeg } from "~/service/notion-dette-kan-jeg/schema-and-mapper";
import { classNames, shuffled } from "~/misc";

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
    <ul className="flex flex-wrap">
      {knowledge.map((item) => {
        const element = (
          <span
            className={classNames(
              "badge group-hover:badge-info",
              "transition-all duration-500",
              "group-hover:scale-150",
              "group-hover:z-50",
              item.isFeatured && "badge-lg font-bold",
              item.link ? "cursor-pointer" : "cursor-default"
            )}
          >
            {item.title}
          </span>
        );
        return (
          <li key={item.id} className="group">
            {item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer">
                {element}
              </a>
            ) : (
              element
            )}
          </li>
        );
      })}
    </ul>
  );
}

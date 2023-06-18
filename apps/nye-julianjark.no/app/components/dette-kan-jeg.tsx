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
      {knowledge.map((item) => (
        <li key={item.id} className="group">
          <span
            className={classNames(
              "badge cursor-default group-hover:badge-info",
              "transition-all duration-700",
              "group-hover:scale-150",
              "group-hover:z-50",
              item.isFeatured && "badge-lg font-bold"
            )}
          >
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

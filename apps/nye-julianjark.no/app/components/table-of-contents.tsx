import { useMemo } from "react";
import { useHydrated } from "./use-hydrated";
import { slugify } from "@julianjark/notion-utils";

interface Heading {
  id: string;
  title: string;
  children: Heading[];

  parent?: Heading;
  level: number;
}

function buildHeadingsTree(headings: Heading[]) {
  return headings.map((heading) => (
    <li key={heading.id}>
      <a href={`#${heading.id}`}>
        {heading.level}: {heading.title}
      </a>
      {heading.children.length > 0 && (
        <ul>{buildHeadingsTree(heading.children)}</ul>
      )}
    </li>
  ));
}
export function TableOfConents() {
  const isHydrated = useHydrated();
  const headingsTree = useMemo(
    () => (isHydrated ? getHeadingsTreeInPage() : []),
    [isHydrated]
  );

  return (
    <nav className="fade-in prose sticky top-0">
      <ul>{buildHeadingsTree(headingsTree)}</ul>
    </nav>
  );
}

function getHeadingsTreeInPage(): Heading[] {
  const root: Heading = {
    id: "",
    title: "",
    level: 0,
    children: [],
  };

  let previousHeading: Heading | undefined;
  const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const element of elements) {
    const title = element.textContent ?? "";
    const id = slugify(title);
    const level = parseInt(element.tagName.slice(1));
    const heading: Heading = { id, title, level, children: [] };

    // Place correctly
    // Assumes that the headings are in order
    if (!previousHeading) {
      heading.parent = root;
    } else if (heading.level > previousHeading.level) {
      heading.parent = previousHeading;
    } else if (heading.level <= previousHeading.level) {
      heading.parent = previousHeading.parent;
      while (heading.level <= heading.parent!.level) {
        heading.parent = heading.parent!.parent;
      }
    }

    heading.parent?.children.push(heading);
    previousHeading = heading;
  }

  return root.children;
}

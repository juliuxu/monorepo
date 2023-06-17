import type { HeadersFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllProjectsAndMetainfo } from "~/notion-projects/client";
import { classes } from "./$notionPage/notion-driven-page";
import type { Project } from "~/notion-projects/schema-and-mapper";
import { RichTextListRender } from "@julianjark/notion-render";
import { Image } from "@unpic/react";
import { classNames } from "~/misc";
import { getTextFromRichText } from "@julianjark/notion-utils";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.metainfo.title },
    {
      name: "description",
      content: getTextFromRichText(data?.metainfo.description ?? []),
    },
  ];
};

export const loader = async () => {
  const { metainfo, projects } = await getAllProjectsAndMetainfo();
  return json(
    { metainfo, projects },
    { headers: config.loaderCacheControlHeaders }
  );
};
export const headers: HeadersFunction = () => config.htmlCacheControlHeaders;

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <header className={`pt-[4vw]`}>
        <h1 className="mt-8 max-w-4xl text-4xl">
          <RichTextListRender richTextList={data.metainfo.description} />
        </h1>
      </header>
      <main className="mt-[12vw] md:mt-[6vw]">
        <div className="mx-auto flex w-full max-w-4xl flex-col space-y-[6vw] divide-y-2 divide-black [&>*:not(:first-child)]:pt-[6vw]">
          {data.projects.map((project, index) => (
            <ProjectComponent
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </main>
    </>
  );
}

interface ProjectComponentProps {
  project: Project;
  index: number;
}
export function ProjectComponent({ project, index }: ProjectComponentProps) {
  const coverImage =
    project.imageUrls[0] ?? `https://picsum.photos/1200/800?index=${index}`;
  const even = index % 2 === 0;
  return (
    <article>
      <div className={classNames(classes.column_list.root, "")}>
        <div className={`order-2 ${even ? "sm:order-1" : "sm:order-2"}`}>
          <h2>{project.title}</h2>
          <p className="mt-2">
            <RichTextListRender
              richTextList={project.description}
              classes={classes}
            />
          </p>
        </div>
        <div className={`order-1 ${even ? "sm:order-2" : "sm:order-1"}`}>
          <Image
            aspectRatio={1200 / 800}
            layout="fullWidth"
            alt=""
            src={coverImage}
            priority={index < 2}
            transformer={({ url }) => url}
          />
        </div>
      </div>
    </article>
  );
}

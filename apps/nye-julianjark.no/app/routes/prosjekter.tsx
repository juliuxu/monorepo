import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { config } from "~/config.server";
import { getAllProjectsAndMetainfo } from "~/service/notion-projects/client";
import { classes } from "./$notionPage/notion-driven-page";
import type { Project } from "~/service/notion-projects/schema-and-mapper";
import { RichTextListRender } from "@julianjark/notion-render";
import { Image } from "@unpic/react";
import { classNames } from "~/misc";
import { getTextFromRichText } from "@julianjark/notion-utils";
import githubIcon from "~/assets/github-mark.svg";
import { isPreviewMode } from "./api.preview-mode/preview-mode.server";
import { Header } from "~/components/header";
import { optimzedImageTransformer } from "~/components/unpic-notion-image";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.metainfo.title },
    {
      name: "description",
      content: getTextFromRichText(data?.metainfo.description ?? []),
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const { metainfo, projects } = await getAllProjectsAndMetainfo(
    await isPreviewMode(request)
  );
  return json(
    { metainfo, projects },
    { headers: config.loaderCacheControlHeaders }
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <Header
        title={<RichTextListRender richTextList={data.metainfo.description} />}
        addDivderUnderneath
      />
      <section className="mx-auto flex w-full flex-col gap-[6vw]">
        {data.projects.map((project, index) => (
          <ProjectComponent key={project.id} project={project} index={index} />
        ))}
      </section>
    </main>
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
    <article className={classNames(classes.column_list.root, "group")}>
      <div
        className={`order-2 ${
          even ? "sm:order-1" : "sm:order-2"
        } flex flex-col`}
      >
        <h2 className="text-[1.1em] font-semibold">{project.title}</h2>
        <p className="mt-2 text-h2 lg:text-h2-lg">
          <RichTextListRender
            richTextList={project.description}
            classes={classes}
          />
        </p>
        {/* <div className="mt-auto" /> */}
        <footer className="mt-2 flex flex-wrap gap-6 text-body transition-opacity group-focus-within:opacity-90 group-hover:opacity-90 lg:text-body-lg lg:opacity-0 [&_a:hover]:underline">
          {project.demoLink && (
            <a
              title="Link til applikasjonen kjørende i produksjon"
              href={project.demoLink}
              className="flex items-center gap-2"
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
          )}
          {project.codeLink && (
            <a
              title="Se kildekoden på GitHub"
              href={project.codeLink}
              className="flex items-center gap-2"
            >
              <img alt="" className="h-[1em] w-[1em]" src={githubIcon} />
              Github
            </a>
          )}
        </footer>
      </div>
      <div className={`order-1 ${even ? "sm:order-2" : "sm:order-1"}`}>
        <Image
          aspectRatio={1200 / 800}
          layout="fullWidth"
          alt=""
          src={coverImage}
          priority={index < 2}
          transformer={optimzedImageTransformer}
        />
      </div>
    </article>
  );
}

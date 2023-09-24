import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { RichTextListRender } from "@julianjark/notion-render";
import { getTextFromRichText } from "@julianjark/notion-utils";
import { Image } from "@unpic/react";

import githubIcon from "~/assets/github-mark.svg";
import { PageHeader } from "~/components/page-header";
import { optimzedImageTransformer } from "~/components/unpic-notion-image";
import { config } from "~/config.server";
import { getAllProjectsAndMetainfo } from "~/service/notion-projects/client";
import type { Project } from "~/service/notion-projects/schema-and-mapper";
import { classNames } from "~/utils/misc";
import { classes } from "./($prefix).$notionPage/notion-driven-page";
import { useEditNotionPage } from "./($prefix).$notionPage/use-edit-notion-page";
import { isPreviewModeFromRequest } from "./api.preview-mode/preview-mode.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.metainfo.title },
    {
      name: "description",
      content: getTextFromRichText(data?.metainfo.description ?? []),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { metainfo, projects } = await getAllProjectsAndMetainfo(
    isPreviewModeFromRequest(request),
  );
  return json(
    { metainfo, projects, projectsDatabaseId: config.projectsDatabaseId },
    { headers: config.loaderCacheControlHeaders },
  );
};

export default function Component() {
  const data = useLoaderData<typeof loader>();
  useEditNotionPage({ pageId: data.projectsDatabaseId });
  return (
    <main>
      <PageHeader
        title={<RichTextListRender richTextList={data.metainfo.description} />}
        addDivderUnderneath
      />
      <section className="mx-auto flex w-full flex-col gap-[6vw]">
        {data.projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </section>
    </main>
  );
}

interface ProjectComponentProps {
  project: Project;
  index: number;
}
export function ProjectCard({ project, index }: ProjectComponentProps) {
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
        <div className="contents text-h2 lg:text-h2-lg">
          <h2 className="text-[1.1em] font-semibold break-words">
            {project.title}
          </h2>
        </div>
        <p className="mt-2 text-h2 lg:text-h2-lg">
          <RichTextListRender
            richTextList={project.description}
            classes={classes}
          />
        </p>
        {/* <div className="mt-auto" /> */}
        <footer className="mt-4 flex flex-wrap gap-6 text-body transition-opacity group-focus-within:opacity-90 group-hover:opacity-90 lg:text-body-lg lg:opacity-0">
          {project.demoLink && (
            <a
              title="Link til applikasjonen kjørende i produksjon"
              href={project.demoLink}
              className="flex items-center gap-2 hover:underline"
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
              className="flex items-center gap-2 hover:underline"
            >
              <img alt="" className="h-[1em] w-[1em]" src={githubIcon} />
              Github
            </a>
          )}
        </footer>
      </div>
      <div className={`order-1 ${even ? "sm:order-2" : "sm:order-1"}`}>
        <Image
          aspectRatio={1920 / 1200}
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

import { useLoaderData } from "@remix-run/react";

import type { loader } from "../../_index";
import { ProjectCard } from "../../prosjekter";

export function FeaturedProject() {
  const { featuredProject } = useLoaderData<typeof loader>();
  return <ProjectCard project={featuredProject} index={1} />;
}

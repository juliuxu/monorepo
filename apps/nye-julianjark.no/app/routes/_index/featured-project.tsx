import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";
import { ProjectComponent } from "../prosjekter";

export function FeaturedProject() {
  const { featuredProject } = useLoaderData<typeof loader>();
  return <ProjectComponent project={featuredProject} index={8} />;
}

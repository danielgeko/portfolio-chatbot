import { ProjectsGrid } from "@/components/ProjectsGrid";
import { getProjects } from "@/lib/context-loader";

export default function ProjectsPage() {
  return <ProjectsGrid projects={getProjects()} />;
}

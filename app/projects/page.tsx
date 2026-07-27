import { Markdown } from "@/components/Markdown";
import { getProjectsMarkdown } from "@/lib/context-loader";

export default function ProjectsPage() {
  return <Markdown>{getProjectsMarkdown()}</Markdown>;
}

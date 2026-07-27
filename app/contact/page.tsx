import { Markdown } from "@/components/Markdown";
import { getContactMarkdown } from "@/lib/context-loader";

export default function ContactPage() {
  return <Markdown>{getContactMarkdown()}</Markdown>;
}

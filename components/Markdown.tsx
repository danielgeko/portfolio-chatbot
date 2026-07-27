import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="mx-auto h-full w-full max-w-3xl overflow-y-auto p-6 pt-14 sm:p-10 sm:pt-14">
      <article className="prose prose-zinc max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
      </article>
    </div>
  );
}

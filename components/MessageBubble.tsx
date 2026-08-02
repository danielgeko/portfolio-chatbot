import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? "whitespace-pre-wrap bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
            : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        }`}
      >
        {isUser ? (
          content
        ) : (
          // Assistant replies are Markdown — render bold labels, lists, etc.
          // Tight prose so it reads well inside the bubble.
          <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-2 prose-headings:text-sm prose-ul:my-2 prose-li:my-0.5 prose-hr:my-3 prose-hr:border-zinc-300 dark:prose-hr:border-zinc-600 first:prose-p:mt-0 last:prose-p:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

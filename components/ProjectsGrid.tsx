"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/context-loader";

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? projects[openIndex] : null;

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl p-6 pt-14 sm:p-10 sm:pt-14">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Projects
        </h1>

        {projects.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">No projects yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project, i) => (
              <button
                key={project.title}
                onClick={() => setOpenIndex(i)}
                style={{ animationDelay: `${i * 70}ms` }}
                className="animate-tile-in flex flex-col items-start gap-3 rounded-xl border border-zinc-200 p-5 text-left transition duration-200 hover:z-10 hover:scale-[1.03] hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </span>
                {project.org && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{project.org}</span>
                )}
                {project.tags.length > 0 && (
                  <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {open.title}
                </h2>
                {open.org && (
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{open.org}</p>
                )}
              </div>
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {open.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {open.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}

            <article className="prose prose-zinc mt-4 max-w-none text-sm dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{open.body}</ReactMarkdown>
            </article>

            {open.link && (
              <a
                href={open.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View project
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

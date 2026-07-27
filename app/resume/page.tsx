export default function ResumePage() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-end gap-3 py-2 pl-14 pr-4">
        <a
          href="/resume.pdf"
          download
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Download PDF
        </a>
      </div>
      <iframe
        src="/resume.pdf"
        title="Daniel Gekonde — Resume"
        className="w-full flex-1 border-0"
      />
    </div>
  );
}

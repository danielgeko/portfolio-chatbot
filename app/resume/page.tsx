export default function ResumePage() {
  return (
    <div className="relative h-full w-full">
      <iframe
        src="/resume.pdf"
        title="Daniel Gekonde — Resume"
        className="h-full w-full border-0"
      />
      <a
        href="/resume.pdf"
        download
        className="fixed bottom-6 right-6 z-20 rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-50 shadow-lg transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Download PDF
      </a>
    </div>
  );
}

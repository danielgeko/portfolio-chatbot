import { getContactInfo } from "@/lib/context-loader";

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="relative flex items-center gap-4 rounded-xl border border-zinc-200 p-4 transition duration-200 hover:z-10 hover:scale-[1.03] hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:hover:bg-zinc-900"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <span className="block truncate text-sm text-zinc-900 dark:text-zinc-50">{value}</span>
      </span>
    </a>
  );
}

export default function ContactPage() {
  const c = getContactInfo();
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-xl p-6 pt-14 sm:p-10 sm:pt-14">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {c.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{c.location}</p>

        <div className="mt-6 flex flex-col gap-3">
          <ContactRow icon={<EmailIcon />} label="Email" value={c.email} href={`mailto:${c.email}`} />
          <ContactRow icon={<PhoneIcon />} label="Phone" value={c.phone} href={`tel:${c.phoneLink}`} />
          <ContactRow icon={<GlobeIcon />} label="Website" value={c.website} href={c.websiteLink} />
          <ContactRow icon={<LinkedInIcon />} label="LinkedIn" value={c.linkedin} href={c.linkedinLink} />
        </div>
      </div>
    </div>
  );
}

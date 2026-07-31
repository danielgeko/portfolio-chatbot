"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavIcon } from "@/lib/constants";

const ICONS: Record<NavIcon, React.ReactNode> = {
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  resume: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full">
      {/* Sidebar animates between a labeled panel (w-56) and an icon rail (w-16). */}
      <nav
        className={`shrink-0 overflow-hidden border-r border-zinc-200 transition-[width] duration-300 ease-in-out dark:border-zinc-800 ${
          open ? "w-56" : "w-16"
        }`}
      >
        <div className="flex h-full w-56 flex-col py-3">
          {/* Header: brand + toggle. When open the toggle sits at the right of
              "Ask Daniel"; when collapsed it shifts to the rail's icon column
              (via flex order) so it stays reachable to expand again. */}
          <div className="mb-1 flex h-10 items-center px-2">
            <span
              className={`flex shrink-0 items-center justify-center ${
                open ? "order-2 ml-auto w-10" : "order-1 w-14"
              }`}
            >
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </span>
            <span
              className={`whitespace-nowrap text-base font-semibold text-zinc-900 dark:text-zinc-50 ${
                open ? "order-1 pl-1" : "order-2"
              }`}
            >
              Ask Daniel
            </span>
          </div>

          {/* Nav items: 56px icon zone (+8px inset) puts labels at the rail edge to clip cleanly.
              When expanded, the active highlight is a full-width pill; when collapsed, it's a
              self-contained rounded square around the icon so it isn't clipped by the rail edge. */}
          <div className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const linkClasses = open
                ? isActive
                  ? "rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 animate-pop-in"
                  : "rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                : isActive
                  ? "text-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400";
              const chipClasses = open
                ? ""
                : isActive
                  ? "bg-zinc-900 dark:bg-zinc-50 animate-pop-in"
                  : "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`group flex h-10 items-center transition-colors ${linkClasses}`}
                >
                  <span className="flex h-10 w-14 shrink-0 items-center justify-center">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${chipClasses}`}
                    >
                      {ICONS[item.icon]}
                    </span>
                  </span>
                  <span className="whitespace-nowrap pr-3 text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

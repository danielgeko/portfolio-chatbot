"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white py-1.5 pl-4 pr-1.5 focus-within:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
      <input
        className="flex-1 bg-transparent text-sm outline-none dark:text-zinc-50"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Ask me anything..."
        disabled={disabled}
      />
      <button
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}

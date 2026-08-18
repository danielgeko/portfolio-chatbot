"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { CHATBOT_GREETING } from "@/lib/constants";

// "notice" = a system message (rate limit, error) shown as a centered pill,
// not a chat bubble, and never sent back to the API as conversation history.
type Message = { role: "user" | "assistant" | "notice"; content: string };

// Per-tab session key: history survives navigation + reload, clears on tab close.
const CHAT_STORAGE_KEY = "askdaniel:chat";

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Stop the typewriter loop if the user navigates away mid-reply.
  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  // Restore this session's conversation on mount (survives navigating away and
  // back, and reloads within the tab). Done in an effect — not a lazy useState
  // initializer — to avoid an SSR/hydration mismatch.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydrate from sessionStorage; keeps first client render matching SSR (empty) to avoid a mismatch */
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved) as Message[]);
    } catch {
      // storage unavailable (private mode, disabled, etc.) — stay in-memory
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist after hydration. The guard stops the initial empty [] (the pre-
  // hydration first render) from clobbering the saved history.
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage write failures (e.g. quota)
    }
  }, [messages, hydrated]);

  const isEmpty = messages.length === 0;

  async function handleSend(text: string) {
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only real conversation turns go to the model — notices are UI-only.
        body: JSON.stringify({ messages: next.filter((m) => m.role !== "notice") }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // 429 is an expected, graceful limit — show its friendly message as-is.
        // Anything else is a genuine error — show a generic, non-technical notice.
        const content =
          res.status === 429
            ? (err.error ?? "You've hit the message limit — please try again in about an hour.")
            : "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "notice", content }]);
        return;
      }

      // Read the network stream into a buffer (`target`) without touching the
      // UI, and reveal it to the screen at a steady per-frame pace. Decoupling
      // the two makes the reply type in smoothly instead of in bursty chunks.
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let target = "";
      let shown = 0;
      let streamDone = false;
      let assistantAdded = false;

      const reveal = new Promise<void>((resolve) => {
        const tick = () => {
          if (!assistantAdded && target.length > 0) {
            assistantAdded = true;
            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
          }
          if (shown < target.length) {
            const remaining = target.length - shown;
            // A few chars/frame; nudge faster when far behind so long replies
            // don't drag, but never jump far enough to look chunky.
            const step = Math.min(8, Math.max(1, Math.ceil(remaining / 20)));
            shown = Math.min(target.length, shown + step);
            const text = target.slice(0, shown);
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = { role: "assistant", content: text };
              return copy;
            });
          }
          if (streamDone && shown >= target.length) {
            rafRef.current = null;
            resolve();
            return;
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      });

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        target += decoder.decode(value, { stream: true });
      }
      streamDone = true;
      await reveal;

      if (!assistantAdded) {
        setMessages((prev) => [
          ...prev,
          { role: "notice", content: "Something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "notice", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      {isEmpty ? (
        // Empty state: greeting heading + input floating in the middle.
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
          <h1 className="max-w-2xl text-center text-2xl font-semibold text-zinc-800 dark:text-zinc-100 sm:text-3xl">
            {CHATBOT_GREETING}
          </h1>
          <div className="w-full max-w-2xl">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      ) : (
        // Conversation state: scrolling messages with input pinned at bottom.
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl space-y-3 p-4">
              {messages.map((m, i) =>
                m.role === "notice" ? (
                  <div key={i} className="flex justify-center">
                    <span className="rounded-full bg-red-50 px-3 py-1 text-center text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">
                      {m.content}
                    </span>
                  </div>
                ) : (
                  <MessageBubble key={i} role={m.role} content={m.content} />
                )
              )}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <MessageBubble role="assistant" content="..." />
              )}
            </div>
          </div>
          <div>
            <div className="mx-auto w-full max-w-3xl p-3">
              <ChatInput onSend={handleSend} disabled={loading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

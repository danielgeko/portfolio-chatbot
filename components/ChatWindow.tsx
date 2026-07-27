"use client";

import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { CHATBOT_GREETING } from "@/lib/constants";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const isEmpty = messages.length === 0;

  async function handleSend(text: string) {
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Something went wrong: ${(e as Error).message}` },
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
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && <MessageBubble role="assistant" content="..." />}
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

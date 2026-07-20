import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getSystemBlocks } from "@/lib/context-loader";
import { MODEL, MAX_TOKENS, MAX_HISTORY_MESSAGES } from "@/lib/constants";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: ChatMessage[] = body.messages ?? [];

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a trailing user message" }, { status: 400 });
  }

  const cappedHistory = messages.slice(-MAX_HISTORY_MESSAGES);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: getSystemBlocks(),
    messages: cappedHistory,
  });

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return NextResponse.json({ reply });
}

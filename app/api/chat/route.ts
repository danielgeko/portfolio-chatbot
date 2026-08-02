import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getChatbotSystemBlocks } from "@/lib/context-loader";
import { checkLimits } from "@/lib/ratelimit";
import { MODEL, MAX_TOKENS, MAX_HISTORY_MESSAGES } from "@/lib/constants";

type ChatMessage = { role: "user" | "assistant"; content: string };

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const limit = await checkLimits(getClientIp(req));
  if (!limit.ok) {
    const message =
      limit.scope === "global"
        ? "I've taken enough questions for today — check back tomorrow!"
        : "You've hit the message limit — please try again in about an hour.";
    return NextResponse.json({ error: message }, { status: 429 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const messages: ChatMessage[] = body.messages ?? [];

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a trailing user message" }, { status: 400 });
  }

  const cappedHistory = messages.slice(-MAX_HISTORY_MESSAGES);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: getChatbotSystemBlocks(),
    messages: cappedHistory,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("[chat] usage:", response.usage);
  }

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return NextResponse.json({ reply });
}

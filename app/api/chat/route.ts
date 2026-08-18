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

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: getChatbotSystemBlocks(),
    messages: cappedHistory,
  });

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        if (process.env.NODE_ENV !== "production") {
          const final = await stream.finalMessage();
          console.log("[chat] usage:", final.usage);
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(responseStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

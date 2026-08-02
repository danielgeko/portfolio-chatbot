import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Per-visitor and global caps. Tune freely — these are conservative defaults
// for a personal portfolio (few, bursty visitors).
const PER_IP_LIMIT = 40; // messages per IP... (headroom for shared/NAT'd networks)
const PER_IP_WINDOW = "1 h"; // ...per hour
const DAILY_GLOBAL_LIMIT = 300; // total messages across all visitors...
const DAILY_GLOBAL_WINDOW = "1 d"; // ...per day (the "link went viral" backstop)

type Limiters = { perIp: Ratelimit; global: Ratelimit };

// Build the limiters once, only if Upstash is configured. Without the env vars
// (e.g. local dev before Upstash is set up) we skip limiting entirely so the
// app still works — rate limiting is a production guardrail, not a hard dep.
let limiters: Limiters | null = null;
let warned = false;

function getLimiters(): Limiters | null {
  if (limiters) return limiters;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warned) {
      console.warn(
        "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is DISABLED. " +
          "Set them in .env.local (and on Vercel) before going public."
      );
      warned = true;
    }
    return null;
  }

  const redis = Redis.fromEnv();
  limiters = {
    perIp: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PER_IP_LIMIT, PER_IP_WINDOW),
      prefix: "rl:ip",
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(DAILY_GLOBAL_LIMIT, DAILY_GLOBAL_WINDOW),
      prefix: "rl:global",
    }),
  };
  return limiters;
}

export type LimitResult = { ok: true } | { ok: false; scope: "ip" | "global" };

export async function checkLimits(ip: string): Promise<LimitResult> {
  const l = getLimiters();
  if (!l) return { ok: true }; // limiting disabled (not configured)

  // Global daily budget first — cheapest way to shut everything off if abused.
  const global = await l.global.limit("global");
  if (!global.success) return { ok: false, scope: "global" };

  const perIp = await l.perIp.limit(ip);
  if (!perIp.success) return { ok: false, scope: "ip" };

  return { ok: true };
}

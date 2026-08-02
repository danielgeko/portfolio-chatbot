import { NextRequest, NextResponse } from "next/server";

// Only guard the chat endpoint.
export const config = { matcher: "/api/chat" };

// Reject cross-origin calls to /api/chat: if a request carries an Origin header
// whose host doesn't match the site's own host, it's another site's script
// trying to use our endpoint (and our API key/quota). Same-origin POSTs from
// our own frontend pass. Requests with no Origin (e.g. curl) aren't blocked
// here — rate limiting covers those.
export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("host");
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (originHost !== host) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  return NextResponse.next();
}

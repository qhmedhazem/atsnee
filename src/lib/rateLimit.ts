import type { NextRequest } from "next/server";

// ponytail: per-instance in-memory limiter; move to a shared store (KV/Redis) if abuse spans instances.
const hits = new Map<string, number[]>();

// True when `key` already made `limit` requests within `windowMs` (this request is counted either way).
export const tooMany = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  if (hits.size > 10_000) hits.clear();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.set(key, [...recent, now]);
  return recent.length >= limit;
};

export const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";

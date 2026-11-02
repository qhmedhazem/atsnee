import { NextRequest } from "next/server";
import { z } from "zod";
import type { CollectionSlug } from "payload";
import payload from "@/lib/payload";
import { isLocale } from "@/lib/locale";
import { clientIp, tooMany } from "@/lib/rateLimit";

const schema = z.object({
  email: z.email(),
  locale: z.string().optional(),
  website: z.string().optional(), // honeypot: real users never fill it
});

const WINDOW_MS = 60_000;
const LIMIT = 5;

const ok = () => Response.json({ ok: true });

// POST handler for an email-list collection with { email (unique), locale } fields.
export const subscribeHandler =
  (collection: Extract<CollectionSlug, "subscribers" | "admission-subscribers">) => async (req: NextRequest) => {
    if (tooMany(`${collection}:${clientIp(req)}`, LIMIT, WINDOW_MS)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
    if (parsed.data.website) return ok(); // bot: pretend it worked

    const email = parsed.data.email.trim().toLowerCase();
    const locale = isLocale(parsed.data.locale) ? parsed.data.locale : undefined;
    const exists = async () => (await payload.find({ collection, where: { email: { equals: email } }, limit: 1, depth: 0 })).totalDocs > 0;

    // Same response whether new or already subscribed, so the form can't be used to probe emails.
    if (await exists()) return ok();
    try {
      await payload.create({ collection, data: { email, locale } });
    } catch (error) {
      if (!(await exists())) throw error; // a concurrent duplicate is fine; anything else is a real failure
    }
    return ok();
  };

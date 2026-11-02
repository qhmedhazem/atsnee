import { NextRequest } from "next/server";
import { z } from "zod";
import payload from "@/lib/payload";
import { isLocale } from "@/lib/locale";
import { clientIp, tooMany } from "@/lib/rateLimit";

// Same limits as the form (ContactForm.tsx); the server is the one that counts.
const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  phone: z.union([z.literal(""), z.string().trim().regex(/^\+?[\d\s-]{6,20}$/)]).optional(),
  message: z.string().trim().min(10).max(2000),
  locale: z.string().optional(),
  website: z.string().optional(), // honeypot: real users never see or fill it
  captcha: z.string().optional(),
});

const fail = (error: string, status: number, extra?: object) => Response.json({ ok: false, error, ...extra }, { status });

// reCAPTCHA v3: the token must be for this action and score at least MIN_SCORE (0 = bot, 1 = human).
const MIN_SCORE = 0.5;
// Google's test keys only work with v2, so local testing uses an explicit switch that production ignores.
const captchaDisabled = process.env.NODE_ENV !== "production" && process.env.RECAPTCHA_DISABLED === "1";

const verifyCaptcha = async (token: string, ip: string) => {
  if (captchaDisabled) return true;
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return false; // fail closed when not configured
  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" ? { remoteip: ip } : {}) }),
  }).catch(() => null);
  const v = r?.ok ? await r.json().catch(() => null) : null;
  if (!v?.success) {
    payload.logger.warn(`contact: reCAPTCHA failed (${(v?.["error-codes"] ?? ["no response"]).join(", ")})`);
    return false;
  }
  const ok = v.action === "contact" && typeof v.score === "number" && v.score >= MIN_SCORE;
  if (!ok) payload.logger.warn(`contact: reCAPTCHA rejected (score ${v.score}, action ${v.action}, host ${v.hostname})`);
  return ok;
};

export async function POST(req: NextRequest) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return fail("invalid", 400, { fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] });
  }
  const { website, captcha, locale, phone, ...data } = parsed.data;
  if (website) return Response.json({ ok: true }); // bot: pretend it worked

  const ip = clientIp(req);
  if (tooMany(`contact:${ip}`, 5, 10 * 60_000)) return fail("rate_limited", 429);
  if (!(captchaDisabled || (captcha && (await verifyCaptcha(captcha, ip))))) return fail("captcha", 400);

  try {
    await payload.create({
      collection: "contact-messages",
      data: { ...data, phone: phone || undefined, locale: isLocale(locale) ? locale : undefined, status: "new" },
    });
  } catch (e) {
    payload.logger.error({ err: e }, "contact: could not save message");
    return fail("server", 500);
  }

  // Notify the school inbox; a failed email never fails the request (the message is saved).
  const inbox = process.env.CONTACT_INBOX;
  if (inbox) {
    await payload
      .sendEmail({
        to: inbox,
        replyTo: data.email,
        subject: `Contact form: ${data.name}`,
        text: `${data.name} <${data.email}>${phone ? `\nPhone: ${phone}` : ""}\n\n${data.message}`,
      })
      .catch((e: unknown) => payload.logger.error({ err: e }, "contact: notification email failed"));
  }
  return Response.json({ ok: true });
}

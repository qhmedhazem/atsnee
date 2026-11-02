"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { CheckCircle2, Clock } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const MAX = 2000;
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, o: { action: string }) => Promise<string> };
  }
}

// reCAPTCHA v3 is invisible: a token is requested on submit and scored on the server ("" if unavailable).
const captchaToken = () =>
  new Promise<string>((resolve) => {
    const g = window.grecaptcha;
    if (!SITE_KEY || !g) return resolve("");
    g.ready(() => g.execute(SITE_KEY, { action: "contact" }).then(resolve, () => resolve("")));
  });
const t = {
  heading: { en: "Send your inquiry", ar: "أرسل استفسارك" },
  name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  phone: { en: "Phone", ar: "رقم الهاتف" },
  optional: { en: "(optional)", ar: "(اختياري)" },
  message: { en: "Message", ar: "الرسالة" },
  send: { en: "Send message", ar: "إرسال الرسالة" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  privacy: { en: "We only use your details to answer this message.", ar: "نستخدم بياناتك فقط للرد على هذه الرسالة." },
  sent: { en: "Message sent", ar: "تم إرسال رسالتك" },
  thanks: {
    en: (name: string, email: string) => `Thanks, ${name}. We'll reply to ${email} within 2 working days.`,
    ar: (name: string, email: string) => `شكرًا يا ${name}. سنرد على ${email} خلال يومي عمل.`,
  },
  another: { en: "Send another message", ar: "إرسال رسالة أخرى" },
  recaptcha: {
    en: ["This site is protected by reCAPTCHA and the Google", "Privacy Policy", "and", "Terms of Service", "apply."],
    ar: ["هذا الموقع محمي بواسطة reCAPTCHA وتنطبق", "سياسة الخصوصية", "و", "شروط الخدمة", "من Google."],
  },
  errors: {
    name: { en: "Please enter your name (at least 2 letters).", ar: "اكتب اسمك (حرفان على الأقل)." },
    email: { en: "Please enter a valid email address.", ar: "اكتب بريدًا إلكترونيًا صحيحًا." },
    phone: { en: "Use digits, spaces, + and - only.", ar: "استخدم الأرقام والمسافات و + و - فقط." },
    message: { en: "Please write at least 10 characters.", ar: "اكتب 10 أحرف على الأقل." },
    captcha: { en: "We couldn't verify this message. Please try again.", ar: "تعذّر التحقق من الرسالة. حاول مرة أخرى." },
    rate_limited: { en: "Too many messages. Please try again in a few minutes.", ar: "رسائل كثيرة. حاول مرة أخرى بعد دقائق." },
    server: { en: "We couldn't send your message. Please try again.", ar: "تعذّر إرسال رسالتك. حاول مرة أخرى." },
  },
};

type Field = "name" | "email" | "phone" | "message";
type Values = Record<Field, string>;
const EMPTY: Values = { name: "", email: "", phone: "", message: "" };

const focus = (field: Field) => document.getElementById(`contact-${field}`)?.focus();

const validate = (v: Values) => {
  const e: Partial<Record<Field, true>> = {};
  if (v.name.trim().length < 2) e.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = true;
  if (v.phone.trim() && !/^\+?[\d\s-]{6,20}$/.test(v.phone.trim())) e.phone = true;
  if (v.message.trim().length < 10) e.message = true;
  return e;
};

export default function ContactForm({ locale, replyTime }: { locale: Locale; replyTime?: string | null }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, true>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState<"rate_limited" | "server" | "captcha" | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((x) => ({ ...x, [field]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const found = validate(values);
    setErrors(found);
    const first = (["name", "email", "phone", "message"] as Field[]).find((f) => found[f]);
    if (first) return focus(first);

    setStatus("sending");
    const captcha = await captchaToken();
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale, captcha, website: honeypot.current?.value ?? "" }),
    }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;

    if (body?.ok) return setStatus("sent");
    setStatus("idle");
    if (body?.error === "invalid") {
      const bad = Object.fromEntries((body.fields ?? []).map((f: string) => [f, true]));
      setErrors(bad);
      const firstBad = (["name", "email", "phone", "message"] as Field[]).find((f) => bad[f]);
      if (firstBad) focus(firstBad);
    } else setFormError(body?.error === "rate_limited" || body?.error === "captcha" ? body.error : "server");
  };

  const panel = "flex flex-col gap-5 rounded-2xl border border-gray-300 bg-white p-6";

  if (status === "sent") {
    const firstName = values.name.trim().split(/\s+/)[0];
    return (
      <section className={cn(panel, "items-center py-12 text-center")} aria-live="polite">
        <CheckCircle2 className="size-14 text-green-600" aria-hidden />
        <h2 className="text-2xl font-bold text-gray-900">{t.sent[locale]}</h2>
        <p className="max-w-md text-gray-700">
          {t.thanks[locale](firstName, "⁨" + values.email.trim() + "⁩")}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setStatus("idle");
          }}
          className="rounded-[10px] border border-light-blue-800 px-5 py-2.5 text-sm font-semibold text-light-blue-800 hover:bg-light-blue-800 hover:text-white"
        >
          {t.another[locale]}
        </button>
      </section>
    );
  }

  const input = (bad?: boolean) =>
    cn(
      "w-full rounded-[10px] border bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-1",
      bad ? "border-red-400 focus-visible:outline-red-400" : "border-gray-300 focus-visible:outline-light-blue-800",
    );
  const error = (field: Field) =>
    errors[field] && (
      <p id={`${field}-error`} className="text-sm text-red-700">
        {t.errors[field][locale]}
      </p>
    );
  const field = (name: Field, label: React.ReactNode, control: React.ReactNode) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={`contact-${name}`} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      {control}
      {error(name)}
    </div>
  );
  const aria = (name: Field) => ({
    id: `contact-${name}`,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">{t.heading[locale]}</h2>
        {replyTime && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-light-blue-100/60 px-3 py-1 text-xs font-semibold text-light-blue-800">
            <Clock className="size-3.5" aria-hidden />
            {replyTime}
          </span>
        )}
      </div>

      <div className="grid gap-5 min-[640px]:grid-cols-2">
        {field("name", t.name[locale], <input {...aria("name")} name="name" autoComplete="name" value={values.name} onChange={set("name")} className={input(errors.name)} />)}
        {field(
          "email",
          t.email[locale],
          <input {...aria("email")} name="email" type="email" autoComplete="email" dir="ltr" value={values.email} onChange={set("email")} className={cn(input(errors.email), "rtl:text-right")} />,
        )}
      </div>
      {field(
        "phone",
        <>
          {t.phone[locale]} <span className="font-normal text-gray-700">{t.optional[locale]}</span>
        </>,
        <input {...aria("phone")} name="phone" type="tel" autoComplete="tel" dir="ltr" value={values.phone} onChange={set("phone")} className={cn(input(errors.phone), "rtl:text-right")} />,
      )}
      {field(
        "message",
        t.message[locale],
        <>
          <textarea {...aria("message")} name="message" rows={6} maxLength={MAX} value={values.message} onChange={set("message")} className={cn(input(errors.message), "resize-y")} />
          <span className="self-end text-xs text-gray-700" aria-live="polite">
            {values.message.length} / {MAX}
          </span>
        </>,
      )}

      {/* Honeypot: off-screen and hidden from assistive tech; bots that fill it get a fake success. */}
      <div aria-hidden className="absolute -start-[10000px] size-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {formError && (
        <p role="alert" className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
          {t.errors[formError][locale]}
        </p>
      )}

      <div className="flex flex-col gap-3 min-[640px]:flex-row min-[640px]:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-[10px] bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          {status === "sending" ? t.sending[locale] : t.send[locale]}
        </button>
        <p className="text-xs text-gray-700">{t.privacy[locale]}</p>
      </div>
      {SITE_KEY && (
        <>
          <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}&hl=${locale}`} strategy="afterInteractive" />
          {/* Google allows hiding the floating badge when this notice is shown with the form. */}
          <p className="text-[11px] text-gray-500">
            {t.recaptcha[locale][0]}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              {t.recaptcha[locale][1]}
            </a>{" "}
            {t.recaptcha[locale][2]}{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
              {t.recaptcha[locale][3]}
            </a>{" "}
            {t.recaptcha[locale][4]}
          </p>
        </>
      )}
    </form>
  );
}

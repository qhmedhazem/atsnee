"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

const STRINGS = {
  en: {
    placeholder: "Your email address",
    subscribe: "Subscribe",
    success: "You're subscribed. We'll keep you posted.",
    invalid: "Please enter a valid email address.",
    rateLimited: "Too many attempts. Please try again in a minute.",
    error: "Something went wrong. Please try again later.",
  },
  ar: {
    placeholder: "بريدك الإلكتروني",
    subscribe: "اشترك",
    success: "تم الاشتراك. سنوافيك بالمستجدات.",
    invalid: "يرجى إدخال بريد إلكتروني صحيح.",
    rateLimited: "محاولات كثيرة. يرجى المحاولة بعد دقيقة.",
    error: "حدث خطأ ما. يرجى المحاولة لاحقاً.",
  },
};

type Status = "idle" | "loading" | "success" | "invalid" | "rateLimited" | "error";

interface Props {
  endpoint: "/api/newsletter/subscribe" | "/api/admission/subscribe";
  placeholder?: string | null;
  buttonLabel?: string | null;
}

// Email input joined to a navy button; used on dark-blue bands (sitewide newsletter, admission card).
export default function SubscribeForm({ endpoint, placeholder, buttonLabel }: Props) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), website: form.get("website"), locale }),
      });
      setStatus(res.ok ? "success" : res.status === 400 ? "invalid" : res.status === 429 ? "rateLimited" : "error");
    } catch {
      setStatus("error");
    }
  };

  const message = status === "idle" || status === "loading" ? "" : t[status];

  return (
    // noValidate: the server is the single source of truth for the email check.
    <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-[560px]">
      <div className="flex">
        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder || t.placeholder}
          aria-label={placeholder || t.placeholder}
          disabled={status === "success"}
          className="h-11 rounded-e-none border-0 text-black"
        />
        {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <Button type="submit" size="lg" isLoading={status === "loading"} disabled={status === "success"} className="rounded-s-none">
          {buttonLabel || t.subscribe}
        </Button>
      </div>
      <p aria-live="polite" className={cn("mt-3 min-h-6 text-sm", status === "success" ? "text-white" : "text-red-100")}>
        {message}
      </p>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { isOpenNow, type HoursRow } from "@/lib/contact";

const t = { open: { en: "Open now", ar: "مفتوح الآن" }, closed: { en: "Closed now", ar: "مغلق الآن" } };

// Computed in the browser after hydration (and every minute), so a cached page never shows a stale status.
export default function OpenBadge({ hours, locale }: { hours: HoursRow[]; locale: "en" | "ar" }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpenNow(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  if (open === null) return null;
  return (
    <span
      className={
        open
          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"
          : "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
      }
    >
      {open ? t.open[locale] : t.closed[locale]}
    </span>
  );
}

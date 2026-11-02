import type { Locale } from "@/lib/locale";
import { cairoNow, dayName, formatTime, type HoursRow } from "@/lib/contact";
import { cn } from "@/lib/utils";
import OpenBadge from "./OpenBadge";

const t = { title: { en: "Working hours", ar: "مواعيد العمل" }, closed: { en: "Closed", ar: "مغلق" } };

export default function WorkingHours({ hours, note, locale }: { hours: HoursRow[]; note?: string | null; locale: Locale }) {
  const today = cairoNow().day; // pages render per request, so this is current
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">{t.title[locale]}</h3>
        <OpenBadge hours={hours} locale={locale} />
      </div>
      <dl className="flex flex-col divide-y divide-gray-200">
        {hours.map((h) => (
          <div
            key={h.day}
            className={cn("flex items-center justify-between gap-4 py-2 text-sm", h.day === today ? "font-bold text-light-blue-800" : "text-gray-900")}
            aria-current={h.day === today ? "date" : undefined}
          >
            <dt>{dayName(h.day, locale)}</dt>
            <dd className={h.closed ? "text-gray-500" : undefined}>
              {h.closed || !h.open || !h.close ? (
                t.closed[locale]
              ) : (
                <span className="whitespace-nowrap">
                  {formatTime(h.open, locale)} – {formatTime(h.close, locale)}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {note && <p className="text-xs text-gray-700">{note}</p>}
    </section>
  );
}

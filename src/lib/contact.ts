// Contact page logic that depends on the clock, kept pure so it can be checked with a small assertion script.
import type { Locale } from "./locale";

export const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
export type Day = (typeof DAYS)[number];
export type HoursRow = { day: Day; closed?: boolean | null; open?: string | null; close?: string | null };

// Wall-clock date and time at the school.
export const cairoNow = (now = new Date()) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return { day: p.weekday.toLowerCase() as Day, year: +p.year, month: +p.month, minutes: +p.hour * 60 + +p.minute };
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const isOpenNow = (hours: HoursRow[], now = new Date()) => {
  const c = cairoNow(now);
  const row = hours.find((h) => h.day === c.day);
  if (!row || row.closed || !row.open || !row.close) return false;
  return c.minutes >= toMinutes(row.open) && c.minutes < toMinutes(row.close);
};

// A class (graduation year) graduates once Cairo is past July 31 of that year.
export const activeClasses = (years: number[] | null | undefined, now = new Date()) => {
  const c = cairoNow(now);
  return [...new Set(years ?? [])].filter((y) => y > c.year || (y === c.year && c.month <= 7)).sort((a, b) => a - b);
};

// Two letters for an avatar, skipping titles like "Eng." / "م.". ZWNJ keeps Arabic letters from joining.
export const initials = (name?: string | null) =>
  (name ?? "")
    .split(/\s+/)
    .filter((w) => w && !w.endsWith(".") && !w.startsWith("("))
    .slice(0, 2)
    .map((w) => w[0])
    .join("\u200c")
    .toUpperCase();

const tag = (locale: Locale) => (locale === "ar" ? "ar-EG" : "en-US");
export const formatTime = (hhmm: string, locale: Locale) => {
  const [h, m] = hhmm.split(":").map(Number);
  return new Intl.DateTimeFormat(tag(locale), { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(Date.UTC(2024, 0, 7, h, m));
};
// 2024-01-07 was a Sunday.
export const dayName = (day: Day, locale: Locale) =>
  new Intl.DateTimeFormat(tag(locale), { weekday: "long", timeZone: "UTC" }).format(Date.UTC(2024, 0, 7 + DAYS.indexOf(day)));

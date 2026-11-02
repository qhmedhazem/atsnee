// Admission open/closed state, computed on the server from the `admission` global.
// All comparisons are calendar days in the school's timezone.
const TZ = "Africa/Cairo";
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
export const cairoDay = (d: Date | string) => dayFmt.format(new Date(d)); // "YYYY-MM-DD"

export type StepState = "done" | "current" | "upcoming";

export type AdmissionInput = {
  status?: "auto" | "open" | "closed" | null;
  opensAt?: string | null;
  closesAt?: string | null;
};

export function computeAdmission(g: AdmissionInput, now: Date = new Date()) {
  const today = cairoDay(now);
  const opens = g.opensAt ? cairoDay(g.opensAt) : null;
  const closes = g.closesAt ? cairoDay(g.closesAt) : null;

  const open =
    g.status === "open" ||
    (g.status !== "closed" && !!opens && !!closes && opens <= today && today <= closes);

  // Opening day counts as reached; the closing day is still "current" until it ends.
  const opensDone = !!opens && opens <= today;
  const closesDone = !!closes && closes < today;
  const steps: { opens: StepState; closes: StepState } = {
    opens: opensDone ? "done" : "current",
    closes: closesDone ? "done" : opensDone ? "current" : "upcoming",
  };
  const daysLeft = closes && !closesDone ? Math.round((Date.parse(closes) - Date.parse(today)) / 864e5) : null;

  return { open, steps, daysLeft };
}

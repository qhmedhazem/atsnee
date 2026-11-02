import { Check } from "lucide-react";
import type { StepState } from "@/lib/admission";
import { cn } from "@/lib/utils";
import type { Strings } from "./strings";

type Step = { label: string; date?: string; extra?: string; note?: string; state: StepState | "unknown" };

interface Props {
  t: Strings;
  academicYear?: string | null;
  opensAt?: string; // formatted
  closesAt?: string; // formatted
  steps: { opens: StepState; closes: StepState };
  daysLeft: number | null;
  testsNote?: string | null;
  past?: boolean; // admission closed: the dates are the previous round's, for reference
}

// Three steps: horizontal from md up, a vertical list below. Connector i is blue once step i+1 is reached.
export default function KeyDatesTimeline({ t, academicYear, opensAt, closesAt, steps, daysLeft, testsNote, past }: Props) {
  const items: Step[] = [
    { label: t.opens, date: opensAt ?? t.notSet, state: steps.opens },
    {
      label: t.closes,
      date: closesAt ?? t.notSet,
      extra: steps.closes === "current" && daysLeft !== null ? t.daysLeft(daysLeft) : undefined,
      state: steps.closes,
    },
    { label: t.tests, note: testsNote ?? undefined, state: "unknown" },
  ];
  const reached = (i: number) => items[i].state === "done" || items[i].state === "current";

  return (
    <div className="border-t border-gray-100 pt-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{past ? t.keyDatesPast(academicYear) : t.keyDates(academicYear)}</p>
      <ol className="flex flex-col md:grid md:grid-cols-3">
        {items.map((step, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0 md:flex-col md:items-center md:gap-3 md:pb-0 md:text-center">
            {i < items.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute start-[13px] top-7 bottom-0 w-0.5 md:start-1/2 md:top-[13px] md:bottom-auto md:h-0.5 md:w-full",
                  reached(i + 1) ? "bg-light-blue-800" : "bg-gray-200"
                )}
              />
            )}
            <StepNode state={step.state} />
            <div className="flex flex-col gap-1">
              <span className={cn("font-semibold", step.state === "current" ? "text-light-blue-800" : "text-slate-800")}>{step.label}</span>
              {step.date && (
                <span className="text-sm text-slate-500">
                  {step.date}
                  {step.extra && (
                    <>
                      {" · "}
                      <strong className="font-semibold text-light-blue-800">{step.extra}</strong>
                    </>
                  )}
                </span>
              )}
              {step.note && <span className="max-w-64 text-sm text-slate-500">{step.note}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepNode({ state }: { state: Step["state"] }) {
  const base = "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold";
  if (state === "done")
    return (
      <span className={cn(base, "bg-light-blue-800 text-white")}>
        <Check className="size-4" aria-hidden />
      </span>
    );
  if (state === "current")
    return (
      <span className={cn(base, "bg-white ring-2 ring-light-blue-800 shadow-[0_0_0_6px_rgba(2,119,189,0.15)]")}>
        <span className="size-2.5 rounded-full bg-light-blue-800" />
      </span>
    );
  if (state === "upcoming") return <span className={cn(base, "bg-white ring-2 ring-gray-300")} />;
  return <span className={cn(base, "border-2 border-dashed border-gray-300 bg-white text-gray-400")}>?</span>;
}

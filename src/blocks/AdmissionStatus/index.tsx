import { ExternalLink } from "lucide-react";

import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { computeAdmission } from "@/lib/admission";
import { cn } from "@/lib/utils";
import KeyDatesTimeline from "./KeyDatesTimeline";
import SubscribeForm from "@/components/SubscribeForm";
import { STRINGS } from "./strings";

// Overlaps the hero above it; the hero leaves room via [data-hero-overlap] (globals.css).
export default async function AdmissionStatus() {
  const locale = await getLocale();
  const t = STRINGS[locale];
  const g = await payload.findGlobal({ slug: "admission", locale, depth: 0 });
  const { open, steps, daysLeft } = computeAdmission(g);

  const fmt = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "Africa/Cairo" }) : undefined;
  const closesAt = fmt(g.closesAt);
  const canApply = open && !!g.applyUrl;

  const buttonClass = "inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold sm:w-auto";
  const icon = <ExternalLink className="size-4 rtl:-scale-x-100" aria-hidden />;

  return (
    <section
      data-hero-overlap
      className="relative z-10 mx-auto -mt-[60px] w-[calc(100%-2rem)] max-w-[1180px] overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-25px_rgba(15,23,42,0.35)] md:-mt-[90px]"
    >
      <div className="flex flex-col gap-5 p-6 md:p-10">
        <h2 className="text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
          {open ? (closesAt ? t.openHeading(closesAt) : t.openHeadingNoDate) : t.closedHeading}
        </h2>
        <p className="max-w-3xl leading-relaxed text-slate-600">{open ? t.openText : t.closedText}</p>

        {/* Closed: still show the last round's dates for reference. */}
        {(open || (g.opensAt && g.closesAt)) && (
          <KeyDatesTimeline
            past={!open}
            t={t}
            academicYear={g.academicYear}
            opensAt={fmt(g.opensAt)}
            closesAt={closesAt}
            steps={steps}
            daysLeft={daysLeft}
            testsNote={g.testsNote}
          />
        )}

        <div className="flex flex-col gap-2 sm:items-start">
          {canApply ? (
            <a
              href={g.applyUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonClass, "bg-light-blue-800 text-white transition-colors hover:bg-light-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-blue-800 focus-visible:ring-offset-2")}
            >
              {t.apply}
              {icon}
            </a>
          ) : g.applyUrl ? (
            // The Ministry's portal URL doesn't change between rounds, so it stays reachable while closed.
            <a
              href={g.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonClass, "border border-light-blue-800 text-light-blue-800 transition-colors hover:bg-light-blue-800 hover:text-white")}
            >
              {t.applyPortal}
              {icon}
            </a>
          ) : (
            <span role="link" aria-disabled="true" className={cn(buttonClass, "cursor-not-allowed bg-gray-200 text-gray-500")}>
              {t.apply}
              {icon}
            </span>
          )}
          <span className="text-sm text-slate-500">{canApply ? t.applyHint : g.applyUrl ? t.applyPortalHint : t.applyHintClosed}</span>
        </div>
      </div>

      <div className="bg-light-blue-800 px-6 py-10 text-center text-white md:px-10">
        <h2 className="text-2xl font-bold">{open ? t.subscribeOpen : t.subscribeClosed}</h2>
        <p className="mx-auto mt-2 mb-6 max-w-xl text-white/85">{open ? t.subscribeOpenText : t.subscribeClosedText}</p>
        <SubscribeForm endpoint="/api/admission/subscribe" />
      </div>
    </section>
  );
}

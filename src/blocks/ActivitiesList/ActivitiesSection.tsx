"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  GraduationCap,
  Images,
  LucideIcon,
  Search,
  Trophy,
  Users,
  X,
} from "lucide-react";

import Link from "@/components/ui/Link";
import GalleryViewer from "@/components/GalleryViewer";
import { useLocale } from "@/hooks/use-locale";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import type { ActivityItem, ActivityType } from "./index";

const STRINGS = {
  en: {
    tabs: { programs: "Programs", competitions: "Competitions", clubs: "Clubs" },
    type: { programs: "Program", competitions: "Competition", clubs: "Club" },
    tablist: "Activity types",
    search: "Search activities…",
    empty: "No activities found.",
    emptyHint: "Take a look at our other activities:",
    seeAlso: "See also",
    count: (n: number) => `${n} ${n === 1 ? "activity" : "activities"}`,
    details: "Details",
    participants: "Participants",
    teamsTitle: "Teams",
    team: "Team",
    members: (n: number) => `${n} ${n === 1 ? "member" : "members"}`,
    teams: (n: number) => `${n} teams`,
    photos: "photos",
    close: "Close",
  },
  ar: {
    tabs: { programs: "البرامج", competitions: "المسابقات", clubs: "الأندية" },
    type: { programs: "برنامج", competitions: "مسابقة", clubs: "نادي" },
    tablist: "أنواع الأنشطة",
    search: "ابحث في الأنشطة…",
    empty: "لا توجد أنشطة.",
    emptyHint: "اطّلع على أنشطتنا الأخرى:",
    seeAlso: "شاهد أيضاً",
    count: (n: number) => `عدد الأنشطة: ${n}`,
    details: "التفاصيل",
    participants: "المشاركون",
    teamsTitle: "الفرق",
    team: "فريق",
    // Count-first labels sidestep Arabic plural forms.
    members: (n: number) => `الأعضاء: ${n}`,
    teams: (n: number) => `الفرق: ${n}`,
    photos: "صور",
    close: "إغلاق",
  },
};
type Strings = (typeof STRINGS)[Locale];

const TYPE_STYLE: Record<ActivityType, { badge: string; cover: string; Icon: LucideIcon }> = {
  competitions: { badge: "bg-amber-100 text-amber-700", cover: "from-amber-400 to-amber-600", Icon: Trophy },
  programs: { badge: "bg-blue-100 text-blue-700", cover: "from-blue-400 to-blue-700", Icon: GraduationCap },
  clubs: { badge: "bg-emerald-100 text-emerald-700", cover: "from-emerald-400 to-emerald-600", Icon: Users },
};

const AVATAR_COLORS = ["bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-violet-600", "bg-teal-600", "bg-indigo-600"];

// Dates are stored at UTC midnight; formatting in UTC keeps server and browser on the same day.
const formatDate = (iso: string, locale: Locale, month: "short" | "long") =>
  new Date(iso).toLocaleDateString(locale, { year: "numeric", month, day: "numeric", timeZone: "UTC" });

const allMembers = (a: ActivityItem) => a.teams.flatMap((t) => t.members);
const cap = (n: number) => (n > 99 ? "99+" : String(n));

// ---------------------------------------------------------------------------

export default function ActivitiesSection({
  activities,
  types,
  activeType,
}: {
  activities: ActivityItem[];
  types: ActivityType[];
  activeType: ActivityType;
}) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ActivityItem | null>(null);

  const q = query.trim().toLocaleLowerCase();
  const inTab = activities.filter((a) => a.type === activeType);
  const shown = q
    ? inTab.filter((a) =>
        [a.name, a.description, ...allMembers(a)].some((s) => s.toLocaleLowerCase().includes(q))
      )
    : inTab;
  const featured = !q && shown.length > 2;
  const countOf = (type: ActivityType) => activities.filter((a) => a.type === type).length;
  const others = types.filter((type) => type !== activeType);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label={t.tablist} className="flex gap-1 rounded-xl bg-gray-100 p-1 md:inline-flex">
          {types.map((type) => {
            const active = type === activeType;
            const count = countOf(type);
            return (
              <Link
                key={type}
                href={`/activities/${type}`}
                scroll={false}
                role="tab"
                aria-selected={active}
                className={cn(
                  // Width = content + an equal share of the rest, so long labels never overflow; narrow screens stack the count.
                  "flex flex-auto flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[13px] font-medium leading-tight transition-colors sm:flex-row sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span className="whitespace-nowrap">{t.tabs[type]}</span>
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs leading-none tabular-nums",
                    active ? "bg-slate-900 text-white" : "bg-gray-200 text-slate-600"
                  )}
                >
                  {cap(count)}
                </span>
              </Link>
            );
          })}
        </div>
        <label className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pe-3 ps-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,100%),1fr))] gap-6">
        {shown.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center">
            <p className="font-medium text-slate-700">{t.empty}</p>
            {others.length > 0 && (
              <>
                <p className="text-sm text-slate-500">{t.emptyHint}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {others.map((type) => (
                    <OtherTabLink key={type} type={type} count={countOf(type)} t={t} compact />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          shown.map((a, i) => (
            <ActivityCard key={a.id} activity={a} featured={featured && i === 0} t={t} locale={locale} onOpen={() => setOpen(a)} />
          ))
        )}
      </div>

      {shown.length > 0 && others.length > 0 && (
        <nav aria-labelledby="activities-see-also" className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-8">
          <h2 id="activities-see-also" className="text-lg font-semibold text-slate-900">
            {t.seeAlso}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((type) => (
              <OtherTabLink key={type} type={type} count={countOf(type)} t={t} />
            ))}
          </div>
        </nav>
      )}

      {open && <ActivityDialog key={open.id} activity={open} t={t} locale={locale} onClose={() => setOpen(null)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

// Link to another tab: a card under "See also", a pill inside the empty state.
const OtherTabLink: FC<{ type: ActivityType; count: number; t: Strings; compact?: boolean }> = ({ type, count, t, compact }) => {
  const { badge, Icon } = TYPE_STYLE[type];
  if (compact)
    return (
      <Link
        href={`/activities/${type}`}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <span className={cn("inline-flex size-6 items-center justify-center rounded-full", badge)}>
          <Icon className="size-3.5" aria-hidden />
        </span>
        {t.tabs[type]}
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs leading-none tabular-nums text-slate-600">
          {cap(count)}
        </span>
      </Link>
    );
  return (
    <Link
      href={`/activities/${type}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-safe:hover:-translate-y-0.5"
    >
      <span className={cn("inline-flex size-12 shrink-0 items-center justify-center rounded-full", badge)}>
        <Icon className="size-6" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-semibold text-slate-900">{t.tabs[type]}</span>
        <span className="text-sm text-slate-500">{t.count(count)}</span>
      </span>
      <ArrowRight className="ms-auto size-5 shrink-0 text-blue-700 transition-transform rtl:-scale-x-100 motion-safe:group-hover:translate-x-0.5 motion-safe:rtl:group-hover:-translate-x-0.5" aria-hidden />
    </Link>
  );
};

const TypeBadge: FC<{ type: ActivityType; t: Strings; className?: string }> = ({ type, t, className }) => (
  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", TYPE_STYLE[type].badge, className)}>{t.type[type]}</span>
);

const TypeCover: FC<{ type: ActivityType; className?: string }> = ({ type, className }) => {
  const { cover, Icon } = TYPE_STYLE[type];
  return (
    <span className={cn("flex size-full items-center justify-center bg-linear-to-br", cover, className)}>
      <Icon className="size-14 text-white" strokeWidth={1.5} aria-hidden />
    </span>
  );
};

const Avatar: FC<{ name: string; size?: "sm" | "md"; className?: string }> = ({ name, size = "md", className }) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)!) | 0;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => [...w][0]).join("");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        size === "md" ? "size-7 text-[11px] ring-2 ring-white" : "size-6 text-[10px]",
        AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length],
        className
      )}
    >
      {initials}
    </span>
  );
};

const MembersSummary: FC<{ activity: ActivityItem; t: Strings }> = ({ activity, t }) => {
  const members = allMembers(activity);
  if (members.length === 0) return <span />;
  const teams = activity.teams.filter((team) => team.members.length > 0).length;
  const label = members.length === 1 ? members[0] : teams > 1 ? `${t.teams(teams)} · ${t.members(members.length)}` : t.members(members.length);
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex shrink-0">
        {members.slice(0, 3).map((m, i) => (
          <Avatar key={i} name={m} className={i ? "-ms-2" : ""} />
        ))}
        {members.length > 3 && (
          <span className="-ms-2 inline-flex size-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold leading-none tabular-nums text-slate-700 ring-2 ring-white">
            {members.length - 3 > 99 ? "99+" : `+${members.length - 3}`}
          </span>
        )}
      </span>
      <span className="truncate text-xs text-slate-500">{label}</span>
    </span>
  );
};

const ActivityCard: FC<{ activity: ActivityItem; featured: boolean; t: Strings; locale: Locale; onOpen: () => void }> = ({
  activity: a,
  featured,
  t,
  locale,
  onOpen,
}) => {
  const cover = a.images[0];
  return (
    // Spans only inside: the whole card is one <button>.
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-start transition duration-300",
        "hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1",
        featured && "min-[1024px]:col-span-2 min-[1024px]:flex-row"
      )}
    >
      <span className={cn("relative block aspect-16/10 w-full shrink-0 overflow-hidden", featured && "min-[1024px]:aspect-auto min-[1024px]:w-[52%]")}>
        {cover ? (
          <>
            <Image
              src={cover.cover}
              alt={cover.alt}
              fill
              sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition duration-500 motion-safe:group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
          </>
        ) : (
          <TypeCover type={a.type} />
        )}
        <TypeBadge type={a.type} t={t} className="absolute start-3 top-3" />
        {a.images.length > 1 && (
          <span className="absolute bottom-3 end-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs leading-5 tabular-nums text-white">
            <Images className="size-3.5" aria-hidden />
            {a.images.length}
            <span className="sr-only">{t.photos}</span>
          </span>
        )}
      </span>

      <span className={cn("flex flex-1 flex-col p-[18px]", featured && "min-[1024px]:p-7")}>
        <time dateTime={a.date} className="text-xs text-slate-500">
          {formatDate(a.date, locale, "short")}
        </time>
        <span className={cn("mt-1 line-clamp-2 text-[17px] font-bold leading-snug text-slate-900", featured && "min-[1024px]:text-2xl")}>
          {a.name}
        </span>
        {a.description && (
          <span className={cn("mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-slate-500", featured && "min-[1024px]:line-clamp-6")}>
            {a.description}
          </span>
        )}
        <span className="mt-auto block pt-4">
          <span className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <MembersSummary activity={a} t={t} />
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-700">
              {t.details}
              <ArrowRight className="size-4 transition-transform rtl:-scale-x-100 motion-safe:group-hover:translate-x-0.5 motion-safe:rtl:group-hover:-translate-x-0.5" aria-hidden />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
};

// ---------------------------------------------------------------------------

const ActivityDialog: FC<{ activity: ActivityItem; t: Strings; locale: Locale; onClose: () => void }> = ({
  activity: a,
  t,
  locale,
  onClose,
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, []);

  const teams = a.teams.filter((team) => team.members.length > 0);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()} // backdrop
      aria-labelledby="activity-dialog-title"
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-[1080px] min-[1280px]:max-w-[min(90vw,1440px)] overflow-hidden rounded-[20px] bg-white p-0 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm max-[767px]:h-dvh max-[767px]:max-h-none max-[767px]:w-full max-[767px]:max-w-none max-[767px]:overflow-y-auto max-[767px]:rounded-none"
    >
      <div className="relative grid min-[768px]:h-[90vh] min-[768px]:max-h-[760px] min-[1280px]:max-h-[880px] min-[768px]:grid-cols-[1.25fr_1fr]">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={t.close}
          className="absolute end-6 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="size-5" />
        </button>

        {/* Gallery: remounted per activity (dialog key), so it starts at the first image */}
        <GalleryViewer
          images={a.images}
          fallback={<TypeCover type={a.type} />}
          mainClassName="h-[45vh] min-[768px]:h-auto min-[768px]:flex-1"
          sizes="(min-width: 1280px) 800px, (min-width: 768px) 600px, 100vw"
        />

        {/* Info */}
        <div className="flex min-h-0 flex-col gap-4 p-6 [scrollbar-width:thin] min-[768px]:overflow-y-auto min-[768px]:p-8 min-[768px]:pe-14">
          <TypeBadge type={a.type} t={t} className="self-start" />
          <div>
            <h2 id="activity-dialog-title" className="text-2xl font-bold leading-snug text-slate-900">
              {a.name}
            </h2>
            <time dateTime={a.date} className="mt-1 block text-sm text-slate-500">
              {formatDate(a.date, locale, "long")}
            </time>
          </div>
          {a.description && <p className="whitespace-pre-line leading-relaxed text-slate-700">{a.description}</p>}
          {teams.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {teams.length === 1 ? t.participants : t.teamsTitle}
              </h3>
              {teams.map((team, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    {/* A lone team needs no name; several get a fallback so the boxes stay distinguishable. */}
                    <span className="font-semibold text-slate-900">{team.name.trim() || (teams.length > 1 ? `${t.team} ${i + 1}` : "")}</span>
                    <span className="text-xs text-slate-500">{t.members(team.members.length)}</span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {team.members.map((m, j) => (
                      <li key={j} className="flex items-center gap-2 rounded-full bg-gray-100 py-1 pe-3 ps-1 text-sm text-slate-700">
                        <Avatar name={m} size="sm" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
};

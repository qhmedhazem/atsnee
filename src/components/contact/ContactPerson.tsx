import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import type { Media } from "@/payload-types";
import type { Locale } from "@/lib/locale";
import { initials } from "@/lib/contact";
import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";

const t = {
  classesOf: { en: "Classes of", ar: "الدفعات" },
  copyPhone: { en: "Copy phone number", ar: "نسخ رقم الهاتف" },
  copyEmail: { en: "Copy email", ar: "نسخ البريد الإلكتروني" },
};

export type Person = {
  name?: string | null;
  title?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  photo?: string | Media | null;
};

const Avatar = ({ person, size, tone }: { person: Person; size: number; tone: string }) => {
  const photo = typeof person.photo === "object" ? person.photo : null;
  return photo?.url ? (
    <Image src={photo.url} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-full font-bold text-white", tone)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(person.name)}
    </span>
  );
};

// One tel:/mailto: line with its icon and a copy button. LTR inside RTL text; long values truncate.
const Line = ({ kind, value, locale }: { kind: "phone" | "email"; value: string; locale: Locale }) => {
  const Icon = kind === "phone" ? Phone : Mail;
  const href = kind === "phone" ? `tel:${value.replace(/[\s-]/g, "")}` : `mailto:${value}`;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light-blue-100/60 text-light-blue-800">
        <Icon className="size-4" aria-hidden />
      </span>
      <a href={href} dir="ltr" className="min-w-0 truncate font-medium text-gray-900 hover:text-light-blue-800 hover:underline">
        {value}
      </a>
      <CopyButton value={value} label={kind === "phone" ? t.copyPhone[locale] : t.copyEmail[locale]} />
    </div>
  );
};

const Lines = ({ person, locale }: { person: Person; locale: Locale }) => (
  <>
    {person.phone && <Line kind="phone" value={person.phone} locale={locale} />}
    {person.email && <Line kind="email" value={person.email} locale={locale} />}
  </>
);

const panel = "rounded-2xl border border-gray-300 bg-white";

// featured: the principal (full width, large). Default: a counselor card with the classes they follow.
export default function ContactPerson({
  person,
  locale,
  featured,
  classes = [],
}: {
  person: Person;
  locale: Locale;
  featured?: boolean;
  classes?: number[];
}) {
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { useGrouping: false });
  const role = person.title && <p className="text-xs font-semibold uppercase tracking-wide text-light-blue-800">{person.title}</p>;

  if (featured) {
    return (
      <article className={cn(panel, "flex flex-col gap-5 p-6 md:flex-row md:items-center")}>
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Avatar person={person} size={72} tone="bg-light-blue-800" />
          <div className="flex min-w-0 flex-col gap-1">
            {role}
            <h3 className="text-[22px] font-bold text-gray-900">{person.name}</h3>
            {person.description && <p className="text-sm text-gray-700">{person.description}</p>}
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 md:max-w-[45%]">
          <Lines person={person} locale={locale} />
        </div>
      </article>
    );
  }

  return (
    <article className={cn(panel, "flex min-w-0 flex-col gap-4 p-5")}>
      <div className="flex items-center gap-3">
        <Avatar person={person} size={48} tone="bg-navy" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-lg font-bold text-gray-900">{person.name}</h3>
          {role}
        </div>
      </div>
      {classes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">{t.classesOf[locale]}</span>
          {classes.map((year) => (
            <span key={year} className="rounded-full bg-light-blue-100/60 px-2.5 py-0.5 text-xs font-semibold text-light-blue-800">
              {num.format(year)}
            </span>
          ))}
        </div>
      )}
      <hr className="border-gray-200" />
      <div className="flex min-w-0 flex-col gap-2">
        <Lines person={person} locale={locale} />
      </div>
    </article>
  );
}

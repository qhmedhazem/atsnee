"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/use-locale";

const TARGET = {
  en: { locale: "ar", label: "ع", name: "العربية" },
  ar: { locale: "en", label: "EN", name: "English" },
} as const;

export default function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const target = TARGET[locale];
  const rest = pathname.split("/").slice(2).join("/");

  // Full page load on purpose: <html lang/dir>, fonts and CMS data all switch together.
  // The proxy stores the new language in a cookie when the page is requested.
  return (
    <a
      href={`/${target.locale}${rest ? `/${rest}` : ""}`}
      hrefLang={target.locale}
      lang={target.locale}
      aria-label={target.name}
      title={target.name}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <Languages className="h-4 w-4" aria-hidden />
      {target.label}
    </a>
  );
}

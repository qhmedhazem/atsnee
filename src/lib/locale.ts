export type Locale = "en" | "ar";
export const SUPPORTED_LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_HEADER = "x-locale";

export const isLocale = (value?: string | null): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);

const serverHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SERVER_URL || "").hostname;
  } catch {
    return "";
  }
})();
const SITE_HOSTS = new Set(["atsnee.org", serverHost.replace(/^www\./, "")]);

// Internal links always follow the visitor's language:
// "/about" and "https://atsnee.org/ar/about" -> "/en/about" when browsing in English.
// External, hash, and mailto/tel links are untouched.
export function localizeHref(href: string, locale: Locale) {
  let path = href;
  const abs = href.match(/^https?:\/\/(?:www\.)?([^/?#]+)(.*)$/);
  if (abs) {
    if (!SITE_HOSTS.has(abs[1])) return href;
    path = abs[2] || "/";
  }
  if (!path.startsWith("/") || path.startsWith("//")) return href;
  const [, first, rest = ""] = path.match(/^\/([^/?#]*)(.*)$/) || [];
  const tail = isLocale(first) ? rest : path === "/" ? "" : path;
  return `/${locale}${tail}`;
}

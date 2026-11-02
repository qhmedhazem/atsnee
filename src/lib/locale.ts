export type Locale = "en" | "ar";
export const SUPPORTED_LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_HEADER = "x-locale";

export const isLocale = (value?: string | null): value is Locale =>
  SUPPORTED_LOCALES.includes(value as Locale);

// "/about" -> "/ar/about"; external, hash, and already-prefixed links are untouched.
export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (isLocale(href.split(/[/?#]/)[1])) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

import { headers } from "next/headers";

export type Locale = "en" | "ar";
export const SUPPORTED_LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";

export async function getLocale() {
  const heads = await headers();
  const pathname =
    heads.get("x-invoke-path") || heads.get("referer") || heads.get("next-url");

  const firstSegment = (pathname?.split("/")[1] ||
    heads.get("x-invoke-locale") ||
    "") as Locale;

  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

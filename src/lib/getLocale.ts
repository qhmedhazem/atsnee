import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from "./locale";

// Set on the request by src/proxy.ts from the URL's first path segment.
export async function getLocale() {
  const locale = (await headers()).get(LOCALE_HEADER);
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

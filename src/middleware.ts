import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, Locale } from "./lib/locale";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");

  let languages = new Negotiator({
    headers: {
      "accept-language": header?.toString() || "en-US,en;q=0.5",
    },
  }).languages();

  return match(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname

  let locale = DEFAULT_LOCALE;
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    locale = (
      pathnameHasLocale ? pathname.split("/")[1] : DEFAULT_LOCALE
    ) as Locale;
  } else {
    locale = getLocale(request) as Locale;
  }

  const headers = {
    "x-invoke-path": pathname,
    "x-invoke-locale": locale,
  };

  if (pathnameHasLocale) {
    return NextResponse.next({
      headers,
    });
  }

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and API routes (api)
    "/((?!_next|api|admin|lib|.well-known|favicon.ico|sitemap.xml|pages-sitemap.xml|posts-sitemap.xml|banner.jpg|robots*.txt).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};

import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  isLocale,
} from "./lib/locale";

// Remembered choice first, then the browser's Accept-Language.
function getPreferredLocale(request: NextRequest) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const languages = new Negotiator({
    headers: {
      "accept-language":
        request.headers.get("accept-language") || "en-US,en;q=0.5",
    },
  }).languages();

  return match(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (!isLocale(segment)) {
    request.nextUrl.pathname = `/${getPreferredLocale(request)}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // The URL is the source of truth: expose it to server components and remember it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, segment);
  // Blocks don't receive searchParams; the announcement list reads ?page= from here.
  requestHeaders.set("x-search", request.nextUrl.search);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (request.cookies.get(LOCALE_COOKIE)?.value !== segment) {
    response.cookies.set(LOCALE_COOKIE, segment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Skip internal paths, API, admin, and static files served from /public.
    "/((?!_next|api|admin|lib|.well-known|favicon.ico|sitemap.xml|pages-sitemap.xml|posts-sitemap.xml|banner.jpg|announcement-default.webp|robots*.txt).*)",
  ],
};

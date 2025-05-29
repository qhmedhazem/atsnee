import "next/router";

declare module "next/router" {
  interface NextRouter {
    locale: "ar" | "en"!;
    defaultLocale: "ar" | "en"!;
    locales: ("ar" | "en")[]!;
  }
}

declare module "next-i18next" {
  interface I18n {
    t: (key: string, options?: { [key: string]: any }) => string;
  }
}

declare module "next/navigation" {
  interface Router {
    locale: "ar" | "en";
    defaultLocale: "ar" | "en";
  }
}

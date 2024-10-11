import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/Toast/Toaster";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ModalWrapper from "@/components/Modal/ModalWrapper";

import { Alexandria } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const alex = Alexandria({ subsets: ["arabic"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale == "ar" ? "rtl" : "ltr"}>
      <body className={alex.className}>
        <ReactQueryProvider>
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader color="var(--brand)" />
            <ModalWrapper />
            <Toaster />
            <div id="__next" className="min-h-screen">
              {children}
            </div>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

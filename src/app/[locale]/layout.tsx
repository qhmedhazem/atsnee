import "../globals.css";

import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import LocaleProvider from "@/providers/LocaleProvider";

import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Footer/Footer";
import ModalWrapper from "@/components/Modal/ModalWrapper";

import { getLocale } from "@/lib/getLocale";
import { getServerSideURL } from "@/lib/getURL";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";

const alex = Alexandria({ subsets: ["arabic"] });

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@qhmedhazem",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      className={alex.className}
      lang={locale}
      dir={locale == "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GID as string} />
      <body>
        <LocaleProvider locale={locale}>
          <ReactQueryProvider>
            <NextTopLoader color="var(--brand)" />
            <ModalWrapper />
            <div id="__next" className="min-h-screen">
              <Navbar />
              {children}
              <Footer />
            </div>
          </ReactQueryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

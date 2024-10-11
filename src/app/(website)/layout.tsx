import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Footer/Footer";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Applied Technology School for Nuclear Energy",
    template: "Applied Technology School for Nuclear Energy | %s",
  },
  description:
    "El-Dabaa Nuclear School is a premier institution dedicated to educating and training the next generation of nuclear engineers and scientists.",
  openGraph: {
    type: "website",
    url: "https://atsnee.vercel.app/",
    siteName: "Applied Technology School for Nuclear Energy",
    description:
      "El-Dabaa Nuclear School is a premier institution dedicated to educating and training the next generation of nuclear engineers and scientists.",
    images: [
      {
        url: "/atsnee_banner.jpg",
        width: 1200,
        height: 630,
        alt: "Applied Technology School for Nuclear Energy Banner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

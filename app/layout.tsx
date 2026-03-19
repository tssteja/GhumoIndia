import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TempleMap — Explore Famous Temples Across India",
  description:
    "Discover famous temples across India on an interactive map. Watch top-rated YouTube travel videos, get directions, and plan your spiritual journey.",
  keywords: [
    "Indian temples",
    "temple map",
    "India travel",
    "temple darshan",
    "temple guide",
    "spiritual travel",
    "temple timings",
    "hotels near temples",
  ],
  openGraph: {
    title: "TempleMap — Explore Famous Temples Across India",
    description:
      "Discover famous temples across India on an interactive map with travel videos and directions.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Google AdSense — only loaded when configured */}
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body
        className={`${notoSerif.variable} ${plusJakartaSans.variable} antialiased bg-surface text-on-surface pb-24 md:pb-0`}
      >
        <Navbar />
        {children}
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

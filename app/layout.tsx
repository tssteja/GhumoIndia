import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en">
      <head>
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

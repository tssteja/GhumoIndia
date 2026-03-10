import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  ],
  openGraph: {
    title: "TempleMap — Explore Famous Temples Across India",
    description:
      "Discover famous temples across India on an interactive map with travel videos and directions.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

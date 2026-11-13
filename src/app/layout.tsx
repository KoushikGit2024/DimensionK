import React from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { generateMetadata } from "./metadata";
import { PageAtmosphere } from "@/components/visual/PageAtmosphere";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { CommandPalette } from "@/components/layout/CommandPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export { generateMetadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-text relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-surface-raised focus:border focus:border-accent focus:text-accent focus:font-mono focus:text-xs focus:rounded-sm"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <PageAtmosphere />
        <ChapterRail />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}

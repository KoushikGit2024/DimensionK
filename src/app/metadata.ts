import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();

  return {
    metadataBase: new URL("https://koushikkar.dev"),
    title: {
      default: `${profile.displayName} — ${profile.headline}`,
      template: `%s | ${profile.displayName}`,
    },
    description: profile.summary,
    authors: [{ name: profile.displayName, url: "https://github.com/koushikkar712" }],
    creator: profile.displayName,
    keywords: [
      "Koushik Kar",
      "Software Engineer",
      "Developer Tools",
      "Distributed Systems",
      "NIT Agartala",
      "TypeScript",
      "AST Parser",
      "Real-Time Engines",
    ],
    openGraph: {
      title: `${profile.displayName} — ${profile.headline}`,
      description: profile.summary,
      url: "https://koushikkar.dev",
      siteName: `${profile.displayName} Observatory`,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.displayName} — ${profile.headline}`,
      description: profile.summary,
      creator: "@koushikkar",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

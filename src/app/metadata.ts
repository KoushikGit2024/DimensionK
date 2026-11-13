import type { Metadata } from "next";
import { getProfile } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();

  return {
    title: `${profile.displayName} — ${profile.headline}`,
    description: profile.summary,
    authors: [{ name: profile.displayName }],
    keywords: [
      "Koushik Kar",
      "Software Engineer",
      "Systems Developer",
      "NIT Agartala",
      "CodeLens",
      "Ludo Neo",
      "Observatory Portfolio",
    ],
    openGraph: {
      title: `${profile.displayName} — ${profile.headline}`,
      description: profile.summary,
      type: "website",
      locale: "en_US",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


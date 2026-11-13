import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buttonStyles } from "@/components/ui/Button";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { getProfile } from "@/lib/content";

export const metadata = {
  title: "404 - Coordinate Void // Dimension-K",
  description: "The requested astronomical coordinates or route do not exist within this sector.",
};

export default function NotFound() {
  const profile = getProfile();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-void text-text relative selection:bg-accent/20 selection:text-accent">
      <SiteHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
        <Container size="narrow" className="w-full">
          <div className="relative rounded-2xl border border-white/[0.08] bg-surface/70 backdrop-blur-xl p-8 sm:p-12 overflow-hidden shadow-2xl">
            {/* Atmospheric subtle radial glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-warm/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6 text-center sm:text-left">
              {/* Telemetry Header */}
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-warm animate-pulse" />
                  <span className="font-mono text-xs tracking-wider text-warm uppercase">
                    Coordinate Signal Lost
                  </span>
                </div>
                <TelemetryStamp label="STATUS" value="ERR_404_VOID" variant="warm" />
              </div>

              {/* Large Display Title */}
              <div className="space-y-2">
                <p className="font-mono text-xs tracking-widest text-text-dim uppercase">
                  Sector Uncharted // 404
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight">
                  Lost in the <em className="italic text-accent">Cosmic Void</em>
                </h1>
              </div>

              {/* Editorial Description */}
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl">
                The astronomical coordinates or resource you are looking for have slipped beyond the event horizon or never existed in this sector of the observatory.
              </p>

              {/* System Diagnostics Box */}
              <div className="p-4 rounded-lg bg-surface-raised/60 border border-white/[0.06] font-mono text-xs text-text-muted space-y-1.5">
                <div className="flex items-center justify-between text-text-dim">
                  <span>SUBSYSTEM</span>
                  <span>SPECTRAL_ROUTER</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>TARGET_VECTOR</span>
                  <span className="text-accent-subtle">UNDEFINED_SECTOR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ACTION</span>
                  <span className="text-warm">REORIENT_TO_ORIGIN</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <Link
                  href="/"
                  className={buttonStyles("primary", "md", "gap-2 border-accent/40 hover:border-accent")}
                >
                  <Home className="w-4 h-4 text-accent" />
                  <span>Return to Horizon</span>
                </Link>
                <Link
                  href="/#work"
                  className={buttonStyles("secondary", "md", "gap-2 border-white/[0.12] hover:border-white/30")}
                >
                  <ArrowLeft className="w-4 h-4 text-text-muted" />
                  <span>Inspect Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter
        displayName={profile.displayName}
        coordinates={profile.coordinates}
        links={profile.links}
      />
    </div>
  );
}

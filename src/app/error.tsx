"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buttonStyles } from "@/components/ui/Button";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import profileData from "@/content/profile.json";
import { ExternalLink } from "@/schemas/content";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime telemetry to console for debugging
    console.error("Observatory Subsystem Fault:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-void text-text relative selection:bg-accent/20 selection:text-accent">
      <SiteHeader />

      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4 relative z-10">
        <Container size="narrow" className="w-full">
          <div className="relative rounded-2xl border border-red-500/20 bg-surface/70 backdrop-blur-xl p-8 sm:p-12 overflow-hidden shadow-2xl">
            {/* Warning anomaly flare glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-warm/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6 text-center sm:text-left">
              {/* Telemetry Anomaly Header */}
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="font-mono text-xs tracking-wider text-red-400 uppercase">
                    Subsystem Anomaly Detected
                  </span>
                </div>
                <TelemetryStamp
                  label="STATUS"
                  value={error.digest ? `DIGEST_${error.digest.slice(0, 8)}` : "ERR_UNHANDLED"}
                  variant="warm"
                />
              </div>

              {/* Large Display Title */}
              <div className="space-y-2">
                <p className="font-mono text-xs tracking-widest text-text-dim uppercase">
                  Telemetry Disrupted // Anomaly
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text font-normal tracking-tight">
                  Instrumentation <em className="italic text-warm">Fault</em>
                </h1>
              </div>

              {/* Editorial Description */}
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl">
                An unexpected calculation or rendering fault occurred while processing astronomical data. The observatory core has isolated the anomaly.
              </p>

              {/* Error Message Diagnostics Box */}
              <div className="p-4 rounded-lg bg-surface-raised/60 border border-white/[0.06] font-mono text-xs text-text-muted space-y-2">
                <div className="flex items-center justify-between text-text-dim">
                  <span>SUBSYSTEM</span>
                  <span>RUNTIME_EXCEPTION</span>
                </div>
                {error.digest && (
                  <div className="flex items-center justify-between text-text-dim">
                    <span>DIGEST_HASH</span>
                    <span className="text-accent-subtle">{error.digest}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/[0.04] text-text-dim break-all">
                  <span className="text-red-400/90 font-mono text-[11px]">
                    {error.message || "An unexpected error disrupted runtime execution."}
                  </span>
                </div>
              </div>

              {/* Recovery Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className={buttonStyles("primary", "md", "gap-2 border-accent/40 hover:border-accent cursor-pointer")}
                >
                  <RefreshCw className="w-4 h-4 text-accent" />
                  <span>Re-calibrate Optics (Retry)</span>
                </button>
                <Link
                  href="/"
                  className={buttonStyles("secondary", "md", "gap-2 border-white/[0.12] hover:border-white/30")}
                >
                  <Home className="w-4 h-4 text-text-muted" />
                  <span>Return to Horizon</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter
        displayName={profileData.displayName}
        coordinates={profileData.coordinates}
        links={profileData.links as ExternalLink[]}
      />
    </div>
  );
}

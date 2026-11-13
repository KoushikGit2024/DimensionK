"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { Profile } from "@/schemas/content";
import {
  ObservatoryVisualEngine,
  type InstrumentSceneMode,
} from "@/visual-engine/ObservatoryVisualEngine";
import { ObservatoryGridOverlay } from "@/components/visual/ObservatoryGridOverlay";
import { buttonStyles } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { ArrowDown, Send, Compass, Orbit, Eye } from "lucide-react";

interface HeroSectionProps {
  profile: Profile;
}

const SCENE_MODES: {
  id: InstrumentSceneMode;
  label: string;
  shortLabel: string;
}[] = [
  { id: "core", label: "Accretion Core", shortLabel: "Core" },
  { id: "astrolabe", label: "Celestial Sphere", shortLabel: "Sphere" },
  { id: "schematic", label: "Optical Schematic", shortLabel: "Optical" },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [sceneMode, setSceneMode] = useState<InstrumentSceneMode>("core");
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const [first, ...rest] = profile.displayName.split(" ");

  return (
    <section
      ref={heroRef}
      id="about"
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden border-b border-white/[0.08] cosmic-radial-depth"
    >
      {/* Calibrated Architectural Meridian Overlay */}
      <ObservatoryGridOverlay />

      {/* Adaptive 3D Deep-Space & Astrometric Instrument Engine with scroll parallax */}
      <motion.div className="absolute inset-0" style={{ y: sceneY, opacity: sceneOpacity }}>
        <ObservatoryVisualEngine mode={sceneMode} />
      </motion.div>

      <Container size="wide" className="relative z-10 w-full my-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <TelemetryStamp label="STATION" value={profile.coordinates} />
              <TelemetryStamp label="LOC" value={profile.location} />
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                Systems &amp; software engineering
              </p>
              <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] tracking-tight text-text">
                {first} <em className="italic text-warm">{rest.join(" ")}</em>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-accent-subtle tracking-tight">
                {profile.headline}
              </p>
            </div>

            <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed">
              {profile.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Magnetic>
                <a
                  href="#work"
                  className={buttonStyles("primary", "lg", "border-accent/40 hover:border-accent")}
                >
                  <span>Inspect Constellation Works</span>
                  <ArrowDown className="w-4 h-4 text-accent" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className={buttonStyles("secondary", "lg", "border-white/[0.12] hover:border-white/30")}
                >
                  <span>Open Transmission</span>
                  <Send className="w-4 h-4 text-text-muted" />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right Spatial Instrument Control Column */}
          <div className="lg:col-span-5 flex flex-col justify-end lg:min-h-[420px]">
            <div className="mt-auto lg:ml-auto w-full max-w-sm">
              <div className="p-4 rounded-md border border-white/[0.09] bg-surface/80 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-muted border-b border-white/[0.06] pb-2">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-accent" />
                    <span>Instrument Optics</span>
                  </span>
                  <span className="text-accent uppercase">{sceneMode}</span>
                </div>

                <div
                  role="group"
                  aria-label="Select observatory visual instrument mode"
                  className="grid grid-cols-3 gap-1.5"
                >
                  {SCENE_MODES.map((m) => {
                    const active = sceneMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSceneMode(m.id)}
                        aria-pressed={active}
                        className={`px-2.5 py-1.5 rounded-xs font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer border ${
                          active
                            ? "bg-accent/15 border-accent text-accent font-medium"
                            : "bg-white/[0.02] border-white/[0.07] text-text-muted hover:text-white hover:border-white/20"
                        }`}
                      >
                        <span className="hidden sm:inline">{m.label.split(" ")[0]}</span>
                        <span className="sm:hidden">{m.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="font-mono text-[11px] text-text-dim leading-relaxed">
                  {sceneMode === "core" &&
                    "Relativistic 3-arm logarithmic accretion disk with thermal spectral gradient."}
                  {sceneMode === "astrolabe" &&
                    "Geodesic meridian sphere with 3 inclined satellite ephemeris tracks."}
                  {sceneMode === "schematic" &&
                    "Zero-GPU static optical astrolabe calibration schematic."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Quantitative Telemetry Baseline Bar */}
      <Container size="wide" className="relative z-10 w-full pt-6 border-t border-white/[0.07]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-widest text-text-dim flex items-center gap-1.5">
              <Orbit className="w-3 h-3 text-accent" />
              <span>Engineered Systems</span>
            </div>
            <div className="text-lg sm:text-xl text-white font-medium">
              04{" "}
              <span className="text-xs text-text-muted font-normal">
                Projects on GitHub
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-widest text-text-dim flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-accent" />
              <span>AST Graph Scale</span>
            </div>
            <div className="text-lg sm:text-xl text-accent font-medium">
              1,468{" "}
              <span className="text-xs text-text-muted font-normal">
                Nodes / 2,760 Edges
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-widest text-text-dim">
              Primary Domains
            </div>
            <div className="text-sm sm:text-base text-text font-normal truncate">
              AST • Real-Time Socket.IO • DSA
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] uppercase tracking-widest text-text-dim">
              Academic Foundation
            </div>
            <div className="text-sm sm:text-base text-text font-normal">
              NIT Agartala{" "}
              <span className="text-accent font-medium">// 8.55 CGPA</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

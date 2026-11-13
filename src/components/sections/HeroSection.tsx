"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { Profile } from "@/schemas/content";
import { ObservatoryVisualEngine } from "@/visual-engine/ObservatoryVisualEngine";
import { ObservatoryGridOverlay } from "@/components/visual/ObservatoryGridOverlay";
import { buttonStyles } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { TelemetryStamp } from "@/components/ui/TelemetryStamp";
import { ArrowDown, Send, Orbit, Eye } from "lucide-react";

interface HeroSectionProps {
  profile: Profile;
  projectCount?: number;
  codelensMetrics?: { nodes?: string | number; edges?: string | number };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  projectCount = 4,
  codelensMetrics,
}) => {
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
      className="relative min-h-[85vh] flex flex-col justify-between py-12 sm:py-16 overflow-hidden border-b border-white/[0.08] cosmic-radial-depth"
    >
      {/* Calibrated Architectural Meridian Overlay */}
      <ObservatoryGridOverlay />

      {/* Adaptive 3D Deep-Space & Astrometric Instrument Engine with scroll parallax */}
      <motion.div className="absolute inset-0" style={{ y: sceneY, opacity: sceneOpacity }}>
        <ObservatoryVisualEngine />
      </motion.div>

      <Container size="wide" className="relative z-10 w-full my-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
            </div>

            <div className="space-y-3">
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
                  <span>Inspect Works</span>
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

          {/* Right Spatial Depth Anchor (3D Galaxy sits here) */}
          <div className="hidden lg:block lg:col-span-4 h-[420px] pointer-events-none" />
        </div>
      </Container>
    </section>
  );
};

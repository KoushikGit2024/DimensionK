"use client";

import React from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const STARS_NEAR =
  "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,.65), transparent)," +
  "radial-gradient(1px 1px at 90px 120px, rgba(56,242,230,.6), transparent)," +
  "radial-gradient(1.5px 1.5px at 160px 70px, rgba(240,163,94,.55), transparent)," +
  "radial-gradient(1px 1px at 230px 180px, rgba(168,85,247,.45), transparent)";

const STARS_FAR =
  "radial-gradient(1px 1px at 40px 60px, rgba(255,255,255,.4), transparent)," +
  "radial-gradient(1px 1px at 100px 20px, rgba(125,211,252,.35), transparent)," +
  "radial-gradient(1.5px 1.5px at 200px 140px, rgba(240,163,94,.3), transparent)";

export const PageAtmosphere: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Primary luminous wash: Shifts from ionized teal/cyan -> interstellar nebula indigo -> solar dusk ember
  const primaryGlow = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [
      "rgba(20, 184, 166, 0.18)",   // Top: Ionized teal
      "rgba(56, 189, 248, 0.16)",   // Upper-mid: Celestial sky cyan
      "rgba(147, 51, 234, 0.14)",   // Lower-mid: Deep cosmic violet
      "rgba(240, 163, 94, 0.22)",   // Bottom: Warm solar ember
    ]
  );

  // Secondary ambient counter-glow for chromatic depth & richness
  const secondaryGlow = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [
      "rgba(14, 165, 233, 0.12)",   // Top counter: Deep sky blue
      "rgba(99, 102, 241, 0.13)",   // Mid counter: Royal indigo nebula
      "rgba(244, 63, 94, 0.12)",    // Bottom counter: Rose dusk tint
    ]
  );

  const washPrimary = useMotionTemplate`radial-gradient(65% 55% at 75% 20%, ${primaryGlow}, transparent 70%)`;
  const washSecondary = useMotionTemplate`radial-gradient(60% 50% at 20% 75%, ${secondaryGlow}, transparent 65%)`;

  // Two star layers drift at different speeds (bounded)
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const farY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Primary Cosmic Nebula Glow */}
      <motion.div className="absolute inset-0" style={{ backgroundImage: washPrimary }} />

      {/* Secondary Counter-Nebula for Multi-Tone Chromatic Depth */}
      <motion.div className="absolute inset-0" style={{ backgroundImage: washSecondary }} />

      {/* Far Drifting Star Layer */}
      <motion.div
        className="absolute inset-x-0"
        style={{
          top: "-40%",
          bottom: "-40%",
          y: reduce ? 0 : farY,
          backgroundImage: STARS_FAR,
          backgroundSize: "130px 130px",
        }}
      />

      {/* Near Drifting Star Layer */}
      <motion.div
        className="absolute inset-x-0 opacity-90"
        style={{
          top: "-40%",
          bottom: "-40%",
          y: reduce ? 0 : nearY,
          backgroundImage: STARS_NEAR,
          backgroundSize: "220px 220px",
        }}
      />

      {/* Film Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
};

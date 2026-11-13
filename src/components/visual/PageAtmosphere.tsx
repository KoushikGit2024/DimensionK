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
  "radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,.55), transparent)," +
  "radial-gradient(1px 1px at 90px 120px, rgba(125,211,252,.5), transparent)," +
  "radial-gradient(1.5px 1.5px at 160px 70px, rgba(240,163,94,.45), transparent)";
const STARS_FAR =
  "radial-gradient(1px 1px at 40px 60px, rgba(255,255,255,.3), transparent)," +
  "radial-gradient(1px 1px at 100px 20px, rgba(255,255,255,.25), transparent)";

export const PageAtmosphere: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Light temperature: cold systems at the top, warm person at the bottom.
  const glow = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    ["rgba(56,242,230,0.075)", "rgba(125,211,252,0.05)", "rgba(240,163,94,0.10)"]
  );
  const wash = useMotionTemplate`radial-gradient(70% 55% at 78% 18%, ${glow}, transparent 70%)`;

  // Two star layers drift at different speeds (bounded, so no tiling seams).
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const farY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ backgroundImage: wash }} />
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
      <motion.div
        className="absolute inset-x-0 opacity-80"
        style={{
          top: "-40%",
          bottom: "-40%",
          y: reduce ? 0 : nearY,
          backgroundImage: STARS_NEAR,
          backgroundSize: "200px 200px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
};


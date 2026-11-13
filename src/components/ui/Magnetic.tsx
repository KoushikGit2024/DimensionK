"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

export const Magnetic: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.25, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const cfg = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(0, cfg);
  const y = useSpring(0, cfg);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};


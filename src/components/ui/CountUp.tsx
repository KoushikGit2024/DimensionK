"use client";

import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

export const CountUp: React.FC<{ value: number; active?: boolean }> = ({
  value,
  active = true,
}) => {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    if (!active) { mv.set(0); return; }
    const controls = animate(mv, value, { duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [active, value, reduce, mv]);

  return <motion.span>{text}</motion.span>;
};


"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export const ObservatoryCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 380, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) {
      setEnabled(false);
      return;
    }

    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    if (!pointerFine) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, input, textarea, select, summary, [role='button'], [data-interactive='true']"
        );
        setIsPointer(Boolean(interactive));
        setLabel(target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (!enabled || !isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[999] overflow-hidden select-none hidden lg:block"
    >
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-1.5 h-1.5 rounded-full bg-accent"
      />

      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.55 : 1,
          borderColor: isPointer
            ? "rgba(56, 242, 230, 0.75)"
            : "rgba(148, 163, 184, 0.3)",
        }}
        transition={{ duration: 0.14 }}
        className="relative w-7 h-7 rounded-full border flex items-center justify-center"
      >
        {isPointer && (
          <>
            <div className="absolute -top-1 w-[1px] h-1.5 bg-accent" />
            <div className="absolute -bottom-1 w-[1px] h-1.5 bg-accent" />
            <div className="absolute -left-1 h-[1px] w-1.5 bg-accent" />
            <div className="absolute -right-1 h-[1px] w-1.5 bg-accent" />
          </>
        )}
      </motion.div>

      <motion.div style={{ x: smoothX, y: smoothY }} className="absolute left-0 top-0">
        {label && (
          <span className="ml-5 mt-5 block whitespace-nowrap rounded-xs border border-accent/40 bg-void/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
};

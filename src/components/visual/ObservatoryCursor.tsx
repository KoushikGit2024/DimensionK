"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const ObservatoryCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("a, button, input, textarea, [role='button']");
        setIsPointer(!!interactive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden select-none">
      {/* Central Aiming Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-1.5 h-1.5 rounded-full bg-accent"
      />

      {/* Trailing Astronomical Reticle Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.6 : 1,
          borderColor: isPointer ? "rgba(184, 201, 216, 0.8)" : "rgba(142, 169, 196, 0.35)",
        }}
        transition={{ duration: 0.15 }}
        className="relative w-8 h-8 rounded-full border border-accent/40 flex items-center justify-center"
      >
        {/* Subtle crosshair ticks when hovering interactive controls */}
        {isPointer && (
          <>
            <div className="absolute -top-1 w-[1px] h-1.5 bg-accent" />
            <div className="absolute -bottom-1 w-[1px] h-1.5 bg-accent" />
            <div className="absolute -left-1 h-[1px] w-1.5 bg-accent" />
            <div className="absolute -right-1 h-[1px] w-1.5 bg-accent" />
          </>
        )}
      </motion.div>
    </div>
  );
};


"use client";

import React, { useRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  spotlight = true,
  children,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !glowRef.current || !spotlight) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(56, 242, 230, 0.09), transparent 45%)`;
  };

  const handleMouseEnter = () => {
    if (glowRef.current && spotlight) {
      glowRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (glowRef.current && spotlight) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-lg border border-white/[0.08] bg-surface-glass backdrop-blur-md p-6 sm:p-7 transition-colors duration-300 hover:border-white/[0.18] ${className}`}
      {...props}
    >
      {spotlight && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300"
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};

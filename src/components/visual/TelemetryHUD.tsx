"use client";

import React, { useEffect, useRef } from "react";

export const TelemetryHUD: React.FC = () => {
  const clockRef = useRef<HTMLSpanElement>(null);
  const azRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let isPageVisible = !document.hidden;

    const formatUTC = () => {
      if (!clockRef.current || !isPageVisible) return;
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, "0");
      const utcMins = String(now.getUTCMinutes()).padStart(2, "0");
      const utcSecs = String(now.getUTCSeconds()).padStart(2, "0");
      const dec = String(Math.floor(now.getUTCMilliseconds() / 100));
      clockRef.current.textContent = `${utcHours}:${utcMins}:${utcSecs}.${dec} UTC`;
    };

    formatUTC();
    const interval = window.setInterval(formatUTC, 100);

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null || !isPageVisible) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId = window.requestAnimationFrame(() => {
        const az = (clientX / Math.max(window.innerWidth, 1)) * 360;
        const alt = (0.5 - clientY / Math.max(window.innerHeight, 1)) * 90;
        if (azRef.current) {
          azRef.current.textContent = `${az.toFixed(1)}°`;
        }
        if (altRef.current) {
          altRef.current.textContent = `${alt >= 0 ? "+" : ""}${alt.toFixed(1)}°`;
        }
        rafId = null;
      });
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) formatUTC();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-3 sm:gap-5 font-mono text-[11px] tracking-wider text-text-muted"
      aria-label="Observatory live telemetry"
    >
      <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1 rounded-xs border border-white/[0.08]">
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
          aria-hidden="true"
        />
        <span ref={clockRef} className="text-text font-medium tabular-nums">
          00:00:00.0 UTC
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-text-dim tabular-nums">
        <span>AZ</span>
        <span ref={azRef} className="text-accent font-medium">
          128.4°
        </span>
        <span className="text-white/20" aria-hidden="true">
          /
        </span>
        <span>ALT</span>
        <span ref={altRef} className="text-accent-subtle font-medium">
          +39.2°
        </span>
      </div>
    </div>
  );
};

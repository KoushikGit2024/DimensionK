"use client";

import React, { useState, useEffect } from "react";

export const TelemetryHUD: React.FC = () => {
  const [timeString, setTimeString] = useState<string>("");
  const [coordinates, setCoordinates] = useState({ az: "128.4°", alt: "+39.2°" });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, "0");
      const utcMins = String(now.getUTCMinutes()).padStart(2, "0");
      const utcSecs = String(now.getUTCSeconds()).padStart(2, "0");
      const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, "0");
      setTimeString(`${utcHours}:${utcMins}:${utcSecs}.${ms} UTC`);
    };

    const interval = setInterval(updateClock, 40);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate real azimuth & elevation based on viewport mouse position
      const az = (e.clientX / window.innerWidth) * 360;
      const alt = (0.5 - e.clientY / window.innerHeight) * 90;
      setCoordinates({
        az: `${az.toFixed(1)}°`,
        alt: `${alt >= 0 ? "+" : ""}${alt.toFixed(1)}°`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 sm:gap-6 font-mono text-[11px] tracking-wider text-text-muted">
      {/* Functional Live UTC Mission Clock */}
      <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-sm border border-white/[0.08]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-text font-medium">{timeString || "SYNCHRONIZING..."}</span>
      </div>

      {/* Real Functional Azimuth / Elevation Tracker */}
      <div className="hidden sm:flex items-center gap-2 text-text-dim">
        <span>AZ:</span>
        <span className="text-accent font-medium">{coordinates.az}</span>
        <span className="text-white/20">•</span>
        <span>ALT:</span>
        <span className="text-accent font-medium">{coordinates.alt}</span>
      </div>
    </div>
  );
};


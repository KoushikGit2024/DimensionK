import React from "react";

export const ObservatoryGridOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Precision 1px grid dividing lines matching mockup */}
      <div className="absolute inset-0 border-t border-b border-border/40" />

      {/* Horizontal guide line */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-border/20" />

      {/* Vertical center divider */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-border/20 hidden lg:block" />

      {/* Coordinate Telemetry Axis Ticks matching mockup */}
      {/* 39° Top Marker */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-text-dim/70 tracking-widest hidden lg:block">
        39°
      </div>

      {/* 128° Left Marker */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-dim/70 tracking-widest">
        128°
      </div>

      {/* 18° Right Marker */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-dim/70 tracking-widest hidden sm:block">
        18°
      </div>

      {/* 0° Bottom Marker */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-text-dim/70 tracking-widest hidden lg:block">
        0°
      </div>

      {/* Crosshair Intersections */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 hidden lg:block">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-accent/30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-accent/30" />
      </div>
    </div>
  );
};


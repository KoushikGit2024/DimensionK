import React from "react";

export const ObservatoryGridOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* Outer frame hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />

      {/* Equatorial reference plane */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.035]" />

      {/* Right-Ascension vertical meridian */}
      <div className="absolute top-0 bottom-0 left-[58%] w-px bg-white/[0.04] hidden lg:block" />

      {/* Calibration degree markers */}
      <div className="absolute top-24 left-[58%] -translate-x-1/2 font-mono text-[10px] text-text-dim tracking-widest hidden lg:block">
        DEC +22.75°
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-dim tracking-widest hidden sm:block">
        RA 05h
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-dim tracking-widest hidden sm:block">
        88.34° E
      </div>
      <div className="absolute bottom-8 left-[58%] -translate-x-1/2 font-mono text-[10px] text-text-dim tracking-widest hidden lg:block">
        EPOCH J2000.0
      </div>

      {/* Precision reticle intersection */}
      <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 hidden lg:block">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-accent/35" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/35" />
      </div>
    </div>
  );
};

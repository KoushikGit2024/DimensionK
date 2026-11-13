"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicCanvas = dynamic(
  () =>
    import("@react-three/fiber").then((mod) => {
      const Canvas = mod.Canvas;
      return function CanvasWrapper({ children }: { children: React.ReactNode }) {
        return (
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 42 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            {children}
          </Canvas>
        );
      };
    }),
  { ssr: false }
);

import { CelestialSphere } from "./CelestialSphere";
import { Starfield } from "./Starfield";

export const ObservatoryVisualEngine: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth < 1024;
      setIsMobile(isTouch || isNarrow);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none opacity-30">
        <div className="absolute right-4 top-1/4 w-60 h-60 rounded-full border border-border border-dashed animate-[spin_120s_linear_infinite]" />
        <div className="absolute right-10 top-1/3 w-48 h-48 rounded-full border border-accent/20" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      <DynamicCanvas>
        <ambientLight intensity={0.6} />
        <Starfield count={280} />
        {/* Aligned directly with the right-hand focal zone of the mockup */}
        <group position={[2.8, 0, 0]}>
          <CelestialSphere />
        </group>
      </DynamicCanvas>
    </div>
  );
};

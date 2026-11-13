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
            camera={{ position: [0, 0, 9.5], fov: 46 }}
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

import { GalacticCore } from "./GalacticCore";
import { Starfield } from "./Starfield";

export const ObservatoryVisualEngine: React.FC = () => {
  const [deviceTier, setDeviceTier] = useState<"desktop" | "mobile" | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const evaluateDevice = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth < 768;
      setDeviceTier(isTouch || isNarrow ? "mobile" : "desktop");
    };

    evaluateDevice();
    window.addEventListener("resize", evaluateDevice, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.8;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", evaluateDevice);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (deviceTier === null) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      <DynamicCanvas>
        <ambientLight intensity={0.4} />
        {/* Living Deep-Space Starfield */}
        <Starfield count={deviceTier === "mobile" ? 600 : 1800} />

        {/* The Luminous Galactic Core */}
        <group
          position={[deviceTier === "mobile" ? 0 : 3.4 + mouseOffset.x * 0.5, -mouseOffset.y * 0.5, 0]}
          scale={deviceTier === "mobile" ? [0.65, 0.65, 0.65] : [1, 1, 1]}
        >
          <GalacticCore />
        </group>
      </DynamicCanvas>
    </div>
  );
};

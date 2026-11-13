"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GalacticCore } from "./GalacticCore";
import { CelestialSphere } from "./CelestialSphere";
import { Starfield } from "./Starfield";

export type InstrumentSceneMode = "core" | "astrolabe" | "schematic";

interface ObservatoryVisualEngineProps {
  mode?: InstrumentSceneMode;
}

interface InteractiveRigProps {
  deviceTier: "desktop" | "tablet" | "mobile";
  mode: "core" | "astrolabe";
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

const InteractiveSceneRig: React.FC<InteractiveRigProps> = ({
  deviceTier,
  mode,
  pointerRef,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const baseOffsetX =
    deviceTier === "desktop" ? 3.2 : deviceTier === "tablet" ? 1.8 : 0;
  const baseScale =
    deviceTier === "desktop" ? 1 : deviceTier === "tablet" ? 0.82 : 0.64;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);
    const targetX = baseOffsetX + pointerRef.current.x * 0.55;
    const targetY = -pointerRef.current.y * 0.45;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      dt * 3.5
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      dt * 3.5
    );
  });

  return (
    <group
      ref={groupRef}
      position={[baseOffsetX, 0, 0]}
      scale={[baseScale, baseScale, baseScale]}
    >
      {mode === "core" ? (
        <GalacticCore
          particleCount={
            deviceTier === "desktop"
              ? 6800
              : deviceTier === "tablet"
              ? 3600
              : 1800
          }
        />
      ) : (
        <CelestialSphere />
      )}
    </group>
  );
};

const DynamicCanvas = dynamic(
  () =>
    import("@react-three/fiber").then((mod) => {
      const Canvas = mod.Canvas;
      return function CanvasWrapper({
        children,
        active,
      }: {
        children: React.ReactNode;
        active: boolean;
      }) {
        return (
          <Canvas
            frameloop={active ? "always" : "demand"}
            camera={{ position: [0, 0, 9.5], fov: 45 }}
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            {children}
          </Canvas>
        );
      };
    }),
  { ssr: false }
);

export const ObservatoryVisualEngine: React.FC<ObservatoryVisualEngineProps> = ({
  mode = "core",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [deviceTier, setDeviceTier] = useState<
    "desktop" | "tablet" | "mobile" | null
  >(null);
  const [inViewport, setInViewport] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const evaluateDevice = () => {
      const width = window.innerWidth;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (width < 640 || (isTouch && width < 768)) {
        setDeviceTier("mobile");
      } else if (width < 1024) {
        setDeviceTier("tablet");
      } else {
        setDeviceTier("desktop");
      }
    };

    evaluateDevice();
    window.addEventListener("resize", evaluateDevice, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.85;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 0.85;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleVisibility = () => {
      setPageVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setInViewport(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", evaluateDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  const showSchematicFallback =
    mode === "schematic" || reducedMotion || deviceTier === null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* Precision Optical Astrolabe SVG Layer (Always provides instant LCP & non-WebGL / reduced-motion fallback) */}
      <div
        className={`absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[8%] transition-opacity duration-700 ${
          showSchematicFallback ? "opacity-90" : "opacity-25"
        }`}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[560px] lg:h-[560px] text-accent"
          fill="none"
        >
          <circle
            cx="300"
            cy="300"
            r="260"
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <circle
            cx="300"
            cy="300"
            r="200"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <circle
            cx="300"
            cy="300"
            r="135"
            stroke="#7dd3fc"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="245"
            ry="88"
            transform="rotate(-24 300 300)"
            stroke="currentColor"
            strokeOpacity="0.32"
            strokeWidth="1.2"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="215"
            ry="74"
            transform="rotate(36 300 300)"
            stroke="#7dd3fc"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="300"
            x2="560"
            y2="300"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <line
            x1="300"
            y1="40"
            x2="300"
            y2="560"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <circle cx="300" cy="300" r="6" fill="currentColor" fillOpacity="0.8" />
          <circle cx="486" cy="218" r="4" fill="#38f2e6" />
          <circle cx="155" cy="364" r="3.5" fill="#f59e0b" />
        </svg>
      </div>

      {/* Adaptive WebGL Scene */}
      {!showSchematicFallback && deviceTier !== null && (
        <DynamicCanvas active={inViewport && pageVisible && !reducedMotion}>
          <ambientLight intensity={0.45} />
          <Starfield
            count={
              deviceTier === "desktop"
                ? 1600
                : deviceTier === "tablet"
                ? 1000
                : 520
            }
          />
          <InteractiveSceneRig
            deviceTier={deviceTier}
            mode={mode === "astrolabe" ? "astrolabe" : "core"}
            pointerRef={pointerRef}
          />
        </DynamicCanvas>
      )}
    </div>
  );
};

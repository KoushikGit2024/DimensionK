"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GalacticCore } from "./GalacticCore";
import { Starfield } from "./Starfield";

interface InteractiveRigProps {
  deviceTier: "desktop" | "tablet" | "mobile";
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

const InteractiveSceneRig: React.FC<InteractiveRigProps> = ({
  deviceTier,
  pointerRef,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const baseOffsetX =
    deviceTier === "desktop" ? 2.85 : deviceTier === "tablet" ? 1.65 : 0;
  const baseOffsetY = deviceTier === "desktop" ? -0.15 : 0;
  const baseScale =
    deviceTier === "desktop" ? 0.94 : deviceTier === "tablet" ? 0.78 : 0.62;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.1);
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    const targetX = baseOffsetX + px * 0.38;
    const targetY = baseOffsetY - py * 0.32;
    const targetRotX = py * 0.1;
    const targetRotY = px * 0.12;

    const dx = targetX - group.position.x;
    const dy = targetY - group.position.y;
    if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
      const factor = 1 - Math.exp(-dt * 4.0);
      group.position.x += dx * factor;
      group.position.y += dy * factor;
      group.rotation.x += (targetRotX - group.rotation.x) * factor;
      group.rotation.y += (targetRotY - group.rotation.y) * factor;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[baseOffsetX, baseOffsetY, 0]}
      scale={[baseScale, baseScale, baseScale]}
    >
      <GalacticCore
        particleCount={
          deviceTier === "desktop"
            ? 6800
            : deviceTier === "tablet"
            ? 3400
            : 1800
        }
      />
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
        deviceTier,
      }: {
        children: React.ReactNode;
        active: boolean;
        deviceTier: "desktop" | "tablet" | "mobile";
      }) {
        return (
          <Canvas
            frameloop={active ? "always" : "demand"}
            camera={{ position: [0, 0, 9.5], fov: 45 }}
            dpr={deviceTier === "desktop" ? [1, 1.65] : [1, 1.25]}
            gl={{
              antialias: deviceTier === "desktop",
              alpha: true,
              stencil: false,
              depth: true,
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

export const ObservatoryVisualEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [deviceTier, setDeviceTier] = useState<
    "desktop" | "tablet" | "mobile" | null
  >(null);
  const [inViewport, setInViewport] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    if ("connection" in navigator) {
      const conn = (
        navigator as unknown as {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (
        conn?.saveData ||
        conn?.effectiveType === "2g" ||
        conn?.effectiveType === "slow-2g"
      ) {
        setIsSlowNetwork(true);
      }
    }

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

    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setInViewport(entry.isIntersecting),
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

  const useSchematicOnly = reducedMotion || isSlowNetwork;
  const isCanvasActive = inViewport && pageVisible && !reducedMotion;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* Precision Optical Astrolabe SVG Layer */}
      <div
        className={`absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[8%] transition-opacity duration-700 ${
          useSchematicOnly ? "opacity-90" : "opacity-25"
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
        </svg>
      </div>

      {/* 3D WebGL Canvas Layer */}
      {!useSchematicOnly && deviceTier !== null && (
        <DynamicCanvas active={isCanvasActive} deviceTier={deviceTier}>
          <Starfield
            count={
              deviceTier === "mobile"
                ? 450
                : deviceTier === "tablet"
                ? 950
                : 1800
            }
          />
          <InteractiveSceneRig
            deviceTier={deviceTier}
            pointerRef={pointerRef}
          />
        </DynamicCanvas>
      )}
    </div>
  );
};
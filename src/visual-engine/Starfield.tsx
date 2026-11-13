"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

export const Starfield: React.FC<StarfieldProps> = ({ count = 1800 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Wide spherical dispersion with depth
      const radius = 10 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      // Star temperature: ice-blue, warm amber, pure white
      const tempChoice = Math.random();
      if (tempChoice > 0.8) {
        color.setHSL(0.55, 0.8, 0.85); // Ice blue
      } else if (tempChoice > 0.7) {
        color.setHSL(0.12, 0.7, 0.75); // Warm amber star
      } else {
        color.setHSL(0.6, 0.2, 0.9); // Brilliant white
      }

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

export const Starfield: React.FC<StarfieldProps> = ({ count = 350 }) => {
  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);

    // Seeded distribution keeping center reading zone uncluttered
    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      op[i] = 0.2 + Math.random() * 0.7;
    }
    return [pos, op];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    return geo;
  }, [positions, opacities]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#8ea9c4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};


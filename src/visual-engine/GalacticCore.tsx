"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GalacticCoreProps {
  particleCount?: number;
}

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  particleCount = 6800,
}) => {
  const diskRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const color = new THREE.Color();
    const arms = 3;

    for (let i = 0; i < particleCount; i++) {
      const progress = Math.pow(Math.random(), 1.55);
      const r = 1.85 + progress * 6.2;
      const armOffset = ((i % arms) / arms) * Math.PI * 2;
      const spiralTwist = r * 0.65;
      const scatter = (Math.random() - 0.5) * (0.45 + progress * 0.85);
      const theta = armOffset + spiralTwist + scatter;

      // Thin relativistic accretion plane with gentle vertical dispersion
      const y = (Math.random() - 0.5) * (0.22 + (r / 9) * 0.42);

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      const heat = 1 - (r - 1.85) / 6.2;
      if (heat > 0.65) {
        color.setHSL(0.49, 0.92, 0.52 + heat * 0.38);
      } else if (heat > 0.32) {
        color.setHSL(0.55, 0.85, 0.36 + heat * 0.36);
      } else {
        color.setHSL(0.64, 0.72, 0.22 + heat * 0.28);
      }

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    if (diskRef.current) {
      diskRef.current.rotation.y += dt * 0.18;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += dt * 0.14;
      coreRef.current.rotation.z += dt * 0.06;
    }
    if (wireCoreRef.current) {
      wireCoreRef.current.rotation.y -= dt * 0.16;
      wireCoreRef.current.rotation.x += dt * 0.08;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += dt * 0.07;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= dt * 0.1;
    }
  });

  return (
    <group rotation={[0.42, 0.2, -0.15]}>
      {/* Central Luminous Singularity */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.82, 2]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* Geodesic Containment Lattice */}
      <mesh ref={wireCoreRef} scale={[1.28, 1.28, 1.28]}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial
          color="#38f2e6"
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* Logarithmic Accretion Disk */}
      <points ref={diskRef}>
        <primitive object={geometry} attach="geometry" />
        <pointsMaterial
          size={0.058}
          vertexColors
          transparent
          opacity={0.84}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Inner Equatorial Telemetry Meridian */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[3.95, 3.965, 96]} />
        <meshBasicMaterial
          color="#38f2e6"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Polar Ephemeris Meridian */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[4.85, 4.865, 96]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

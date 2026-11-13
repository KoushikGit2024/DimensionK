"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GalacticCore: React.FC = () => {
  const diskRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.LineLoop>(null);
  const ring2Ref = useRef<THREE.LineLoop>(null);

  // Generate 8,500 particles for the accretion disk with rich cyan/blue/violet thermal gradient
  const [positions, colors] = useMemo(() => {
    const count = 8500;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Exponential distribution denser near center
      const r = 2.2 + Math.pow(Math.random(), 1.6) * 6.5;
      const theta = Math.random() * Math.PI * 2;

      // Thin accretion disk height with gentle spiral waviness
      const y = (Math.random() - 0.5) * (0.35 + (r / 8) * 0.45);

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      // Color heat: electric cyan near inner core -> luminous sky blue -> deep violet on outer rim
      const heat = 1 - (r - 2.2) / 6.5;
      if (heat > 0.6) {
        color.setHSL(0.5, 1.0, 0.45 + heat * 0.45); // Bright Cyan / Ice White
      } else if (heat > 0.3) {
        color.setHSL(0.55, 0.9, 0.35 + heat * 0.4); // Sky / Electric Blue
      } else {
        color.setHSL(0.68, 0.8, 0.2 + heat * 0.3); // Cosmic Violet / Deep Space
      }

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * 0.22;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.z += delta * 0.08;
    }
    if (wireCoreRef.current) {
      wireCoreRef.current.rotation.y -= delta * 0.18;
      wireCoreRef.current.rotation.x += delta * 0.1;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.09;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <group rotation={[0.42, 0.2, -0.15]}>
      {/* Central Pulsing Energy Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.95, 3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cyber Wireframe Shell around Core */}
      <mesh ref={wireCoreRef} scale={[1.2, 1.2, 1.2]}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial
          color="#00ffee"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* The Swirling Accretion Disk */}
      <points ref={diskRef}>
        <primitive object={geometry} attach="geometry" />
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Primary Tilted Orbital Telemetry Ring */}
      <lineLoop ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[4.2, 4.208, 96]} />
        <meshBasicMaterial
          color="#00ffee"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </lineLoop>

      {/* Secondary Polar Orbital Telemetry Ring */}
      <lineLoop ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[5.0, 5.008, 96]} />
        <meshBasicMaterial
          color="#70eeff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </lineLoop>
    </group>
  );
};


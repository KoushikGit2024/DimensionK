"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const CelestialSphere: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const satellite1Ref = useRef<THREE.Mesh>(null);
  const satellite2Ref = useRef<THREE.Mesh>(null);
  const satellite3Ref = useRef<THREE.Mesh>(null);
  const accumulatedTimeRef = useRef(0);

  // Generate Latitude Rings (Horizontals)
  const latitudeLines = useMemo(() => {
    const lines = [];
    const radius = 2.0;
    const count = 9;
    for (let i = 1; i < count; i++) {
      const phi = (i / count) * Math.PI;
      const r = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);
      lines.push({ r, y });
    }
    return lines;
  }, []);

  // Generate Longitude Meridians (Verticals)
  const longitudeLines = useMemo(() => {
    const lines = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const rot = (i / count) * Math.PI;
      lines.push(rot);
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    accumulatedTimeRef.current += delta;
    const t = accumulatedTimeRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }

    // Animate Satellite 1 along elliptical inclined orbit
    if (satellite1Ref.current) {
      const angle = t * 0.5;
      satellite1Ref.current.position.x = Math.cos(angle) * 3.1;
      satellite1Ref.current.position.y = Math.sin(angle) * 1.5;
      satellite1Ref.current.position.z = Math.sin(angle) * 2.2;
    }

    // Animate Satellite 2 along polar orbit
    if (satellite2Ref.current) {
      const angle = -t * 0.4 + 2.0;
      satellite2Ref.current.position.x = Math.sin(angle) * 1.6;
      satellite2Ref.current.position.y = Math.cos(angle) * 2.9;
      satellite2Ref.current.position.z = Math.sin(angle) * 2.4;
    }

    // Animate Satellite 3 along wide outer orbit
    if (satellite3Ref.current) {
      const angle = t * 0.3 + 4.0;
      satellite3Ref.current.position.x = Math.cos(angle) * 3.6;
      satellite3Ref.current.position.y = Math.sin(angle) * 0.8;
      satellite3Ref.current.position.z = Math.sin(angle) * 2.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Dense Core Mesh */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#1e2736"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Primary Wireframe Sphere Latitude Lines */}
      {latitudeLines.map((line, idx) => (
        <lineLoop key={`lat-${idx}`} position={[0, line.y, 0]}>
          <ringGeometry args={[line.r, line.r + 0.005, 64]} />
          <meshBasicMaterial
            color="#475569"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </lineLoop>
      ))}

      {/* Primary Wireframe Sphere Longitude Lines */}
      {longitudeLines.map((rot, idx) => (
        <lineLoop key={`lon-${idx}`} rotation={[0, rot, 0]}>
          <ringGeometry args={[2.0, 2.005, 64]} />
          <meshBasicMaterial
            color="#475569"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </lineLoop>
      ))}

      {/* Major Tilted Elliptical Orbit Track 1 */}
      <lineLoop rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[3.1, 3.108, 96]} />
        <meshBasicMaterial
          color="#8ea9c4"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </lineLoop>

      {/* Major Tilted Elliptical Orbit Track 2 */}
      <lineLoop rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
        <ringGeometry args={[2.9, 2.908, 96]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </lineLoop>

      {/* Orbiting Satellite Node 1 (Bright white celestial marker) */}
      <mesh ref={satellite1Ref}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Orbiting Satellite Node 2 */}
      <mesh ref={satellite2Ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#cbd5e1" />
      </mesh>

      {/* Orbiting Satellite Node 3 */}
      <mesh ref={satellite3Ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
};

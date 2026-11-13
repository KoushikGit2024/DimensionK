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

  const latitudeLines = useMemo(() => {
    const lines = [];
    const radius = 2.15;
    const count = 8;
    for (let i = 1; i < count; i++) {
      const phi = (i / count) * Math.PI;
      const r = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);
      lines.push({ r, y });
    }
    return lines;
  }, []);

  const longitudeLines = useMemo(() => {
    const lines = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      lines.push((i / count) * Math.PI);
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    accumulatedTimeRef.current += dt;
    const t = accumulatedTimeRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.11;
      groupRef.current.rotation.x = Math.sin(t * 0.16) * 0.09;
    }

    if (satellite1Ref.current) {
      const angle = t * 0.48;
      satellite1Ref.current.position.set(
        Math.cos(angle) * 3.15,
        Math.sin(angle) * 1.45,
        Math.sin(angle) * 2.25
      );
    }

    if (satellite2Ref.current) {
      const angle = -t * 0.38 + 2.1;
      satellite2Ref.current.position.set(
        Math.sin(angle) * 1.65,
        Math.cos(angle) * 2.95,
        Math.sin(angle) * 2.35
      );
    }

    if (satellite3Ref.current) {
      const angle = t * 0.28 + 4.2;
      satellite3Ref.current.position.set(
        Math.cos(angle) * 3.65,
        Math.sin(angle) * 0.85,
        Math.sin(angle) * 2.75
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner Calibration Geodesic Sphere */}
      <mesh>
        <sphereGeometry args={[0.92, 24, 24]} />
        <meshBasicMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Latitude Parallels */}
      {latitudeLines.map((line, idx) => (
        <mesh
          key={`lat-${idx}`}
          position={[0, line.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[line.r, line.r + 0.008, 64]} />
          <meshBasicMaterial
            color="#38f2e6"
            transparent
            opacity={idx === 4 ? 0.42 : 0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Longitude Meridians */}
      {longitudeLines.map((rot, idx) => (
        <mesh key={`lon-${idx}`} rotation={[0, rot, 0]}>
          <ringGeometry args={[2.15, 2.158, 64]} />
          <meshBasicMaterial
            color="#64748b"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Inclined Ecliptic Track */}
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[3.15, 3.164, 96]} />
        <meshBasicMaterial
          color="#38f2e6"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Polar Horizon Track */}
      <mesh rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
        <ringGeometry args={[2.95, 2.962, 96]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ephemeris Satellites */}
      <mesh ref={satellite1Ref}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#38f2e6" />
      </mesh>
      <mesh ref={satellite2Ref}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>
      <mesh ref={satellite3Ref}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

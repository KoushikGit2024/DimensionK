import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Nebula() {
  const pointsRef = useRef();
  const particleCount = 40000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorObj = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Math for a swirling galaxy/nebula shape
      const radius = Math.random() * 180;
      const spinAngle = radius * 0.05;
      const branchAngle = ((i % 5) / 5) * Math.PI * 2; // 5 spiral arms
      
      const angle = branchAngle + spinAngle + (Math.random() - 0.5) * 1.5;
      
      const x = Math.cos(angle) * radius;
      // Thicker in the middle, tapering off at the edges
      const y = (Math.random() - 0.5) * (200 / (radius + 1)); 
      const z = Math.sin(angle) * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // James Webb Color Palette: Deep Magentas, Cyans, and Golds
      const hue = radius < 40 ? 0.85 : radius < 100 ? 0.6 : 0.95; // Pink to Blue to Red
      colorObj.setHSL(hue + (Math.random() * 0.1), 0.9, Math.random() * 0.5 + 0.1);
      
      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.6} 
        vertexColors 
        transparent 
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}
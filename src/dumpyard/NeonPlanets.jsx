import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EnergyPlanet = ({ distance, size, speed, color, hasRings }) => {
  const orbitRef = useRef();
  const planetRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbitRef.current) orbitRef.current.rotation.y = t * speed;
    if (planetRef.current) {
        planetRef.current.rotation.y += 0.01;
        planetRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[distance, 0, 0]}>
        {/* Planet Core */}
        <mesh ref={planetRef}>
          <icosahedronGeometry args={[size, 2]} />
          <meshBasicMaterial color={color} wireframe />
        </mesh>
        
        {/* Glowing Atmosphere/Halo */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.15} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        {/* Energy Rings */}
        {hasRings && (
          <mesh rotation={[Math.PI / 2 + 0.4, 0, 0]}>
            <torusGeometry args={[size * 1.8, 0.02, 16, 100]} />
            <meshBasicMaterial color="#ff00ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
          </mesh>
        )}
      </group>
    </group>
  );
};

export default function NeonPlanets() {
  const planets = [
    { distance: 30, size: 2,   speed: 0.4,  color: '#00ffff' },
    { distance: 50, size: 3.5, speed: 0.25, color: '#ff00ff', hasRings: true },
    { distance: 75, size: 2.8, speed: 0.15, color: '#ffff00' },
    { distance: 105, size: 5,  speed: 0.08, color: '#ff3366', hasRings: true },
  ];

  return (
    <group>
      {planets.map((p, i) => (
        <EnergyPlanet key={i} {...p} />
      ))}
    </group>
  );
}
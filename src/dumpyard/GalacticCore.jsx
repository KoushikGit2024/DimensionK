import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GalacticCore() {
  const diskRef = useRef();
  const coreRef = useRef();

  // Create a dense ring of particles for the accretion disk
  const [diskPos, diskColors] = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // Very thin disk
      pos[i * 3 + 2] = Math.sin(theta) * r;

      // Inner disk is blinding white/blue, outer is deep purple
      const heat = 1 - (r - 8) / 15; 
      c.setHSL(0.65 - (heat * 0.15), 1.0, heat * 0.8 + 0.2);
      
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current) diskRef.current.rotation.y = t * 0.5;
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.02); // Pulsing core
  });

  return (
    <group>
      {/* The Central Energy Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[5, 4]} />
        <meshBasicMaterial color="#ffffff" wireframe={false} />
        <pointLight intensity={2000} distance={400} color="#00ffff" />
      </mesh>

      {/* Wireframe cage for a digital/tech overlay feel */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <icosahedronGeometry args={[5, 2]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* The Accretion Disk */}
      <points ref={diskRef} rotation={[0.2, 0, -0.1]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={15000} array={diskPos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={15000} array={diskColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Trail, Instance, Instances, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- 1. THE CINEMATIC THREE-BODY SYSTEM (Now with boiling plasma) ---
const ChaoticStars = () => {
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const tertiaryRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (primaryRef.current) {
      primaryRef.current.position.x = Math.sin(t * 0.05) * 4;
      primaryRef.current.position.y = Math.cos(t * 0.08) * 3;
      primaryRef.current.position.z = Math.sin(t * 0.03) * 4;
    }

    if (secondaryRef.current) {
      secondaryRef.current.position.x = Math.sin(t * 0.6) * 35 + Math.cos(t * 0.3) * 15;
      secondaryRef.current.position.y = Math.cos(t * 0.5) * 25 + Math.sin(t * 0.2) * 10;
      secondaryRef.current.position.z = Math.sin(t * 0.7) * 30;
    }

    if (tertiaryRef.current) {
      tertiaryRef.current.position.x = Math.cos(t * 0.35) * 65;
      tertiaryRef.current.position.y = Math.sin(t * 0.25) * 45;
      tertiaryRef.current.position.z = Math.cos(t * 0.45) * 55;
    }
  });

  return (
    <>
      {/* Primary Star - Boiling White/Cyan Core */}
      <group ref={primaryRef}>
        <mesh>
          <sphereGeometry args={[7, 64, 64]} />
          {/* MeshDistortMaterial physically warps the surface to look like plasma */}
          <MeshDistortMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} distort={0.2} speed={4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[11, 64, 64]} />
          <MeshDistortMaterial color="#00e5ff" toneMapped={false} distort={0.5} speed={6} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Secondary Body - Dark Silhouette wrapped in violent Cyan Fire */}
      <Trail width={14} length={20} color="#00ffff" attenuation={(t) => t * t * t}>
        <group ref={secondaryRef}>
          <mesh>
            <sphereGeometry args={[3.5, 32, 32]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh>
            <sphereGeometry args={[4.5, 64, 64]} />
            {/* High distortion creates the flickering flare effect */}
            <MeshDistortMaterial color="#00ffff" emissive="#00ffff" toneMapped={false} distort={0.6} speed={8} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </Trail>

      {/* Tertiary Body - Dark Silhouette wrapped in Deep Blue Fire */}
      <Trail width={10} length={30} color="#0066ff" attenuation={(t) => t * t * t}>
        <group ref={tertiaryRef}>
          <mesh>
            <sphereGeometry args={[4.5, 32, 32]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh>
             <sphereGeometry args={[5.5, 64, 64]} />
             <MeshDistortMaterial color="#0088ff" emissive="#0088ff" toneMapped={false} distort={0.5} speed={7} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </Trail>
    </>
  );
};

// --- 2. THE DEBRIS FIELD ---
const ChaoticAsteroidBelt = () => {
  const count = 1500;
  const beltRef = useRef();

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 80 + Math.random() * 90; 
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 35; 
      
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
      const y = height + (Math.random() - 0.5) * 15;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 15;
      
      const scale = Math.random() * 0.8 + 0.2;
      temp.push({ position: [x, y, z], scale });
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    if (beltRef.current) {
      beltRef.current.rotation.y = clock.getElapsedTime() * 0.01;
      beltRef.current.rotation.z = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <Instances ref={beltRef} range={count}>
      <dodecahedronGeometry args={[1, 0]} /> 
      <meshStandardMaterial color="#02050a" roughness={0.7} metalness={0.9} />
      {asteroids.map((data, i) => (
        <Instance key={i} position={data.position} scale={data.scale} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]} />
      ))}
    </Instances>
  );
};

// --- MAIN WRAPPER COMPONENT ---
const ChaoticSystemComponent = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#000000' }}>
      <Canvas camera={{ position: [0, 20, 160], fov: 55 }} gl={{ antialias: false }}>
        
        {/* Base Darkness */}
        <fogExp2 attach="fog" color="#000205" density={0.004} />
        
        {/* THE SMOG: Giant, overlapping, semi-transparent particles acting as cosmic dust */}
        <Sparkles count={150} scale={[250, 100, 250]} size={800} speed={0.2} opacity={0.05} color="#003355" />
        <Sparkles count={100} scale={[200, 80, 200]} size={1200} speed={0.1} opacity={0.03} color="#00e5ff" />
        <Sparkles count={200} scale={[300, 150, 300]} size={600} speed={0.4} opacity={0.08} color="#000000" />
        
        {/* Harsh point light illuminating the dust and debris */}
        <pointLight position={[0, 0, 0]} intensity={1200} distance={400} color="#00ffff" decay={1.5} />

        {/* Faint background stars */}
        <Stars radius={200} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />

        <ChaoticStars />
        <ChaoticAsteroidBelt />

        {/* Cinematic Post-Processing Bloom */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.5} />
        </EffectComposer>

      </Canvas>
    </div>
  );
};

export default ChaoticSystemComponent;
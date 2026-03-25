import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Nebula from './Nebula';
import GalacticCore from './GalacticCore';
import NeonPlanets from './NeonPlanets';
import PostProcessing from './PostProcessing';

export default function Galaxy() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#010105', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 80, 150], fov: 45 }}>
        <color attach="background" args={['#010008']} />
        <fog attach="fog" args={['#010008', 50, 400]} />
        
        {/* Deep background micro-stars */}
        <Stars radius={200} depth={100} count={10000} factor={4} saturation={1} fade speed={0.5} />

        <Suspense fallback={null}>
          <Nebula />
          <GalacticCore />
          <NeonPlanets />
          <PostProcessing />
        </Suspense>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          autoRotate 
          autoRotateSpeed={0.2} 
          maxDistance={300}
        />
      </Canvas>
    </div>
  );
}
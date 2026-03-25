import React from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer disableNormalPass>
      {/* The Bloom is the secret sauce. 
        Low threshold means everything slightly bright glows.
        High intensity makes it neonic.
      */}
      <Bloom 
        intensity={2.5} 
        luminanceThreshold={0.1} 
        luminanceSmoothing={0.9} 
        mipmapBlur 
      />
      
      {/* Adds that slight lens-distortion color splitting seen in space photography */}
      <ChromaticAberration 
        blendFunction={BlendFunction.NORMAL} 
        offset={[0.0005, 0.0005]} 
      />
      
      {/* Film grain to make it look like raw telescope telemetry */}
      <Noise opacity={0.04} />
    </EffectComposer>
  );
}
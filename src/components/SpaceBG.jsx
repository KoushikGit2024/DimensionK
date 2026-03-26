import React from 'react';
import Galaxy from './customComponents/Galaxy';

const SpaceBG = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        background: '#01040a', // Deep space dark background
        pointerEvents: 'none'
      }}
    >
      {/* <Galaxy
        starSpeed={0.4}
        density={2.6}
        hueShift={360}
        speed={1.3}
        glowIntensity={0.3}
        saturation={0.3}
        mouseRepulsion={false}
        repulsionStrength={2}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        transparent={true}
      /> */}
      <video src="/herovideo.mp4" autoPlay loop muted={true}></video>
    </div>
  );
};

export default React.memo(SpaceBG);
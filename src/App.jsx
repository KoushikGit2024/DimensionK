import React from 'react';
import SpaceBG from './components/SpaceBG';
import HeroSection from './components/HeroSection';

const App = () => {
  return (
    <div className="relative w-full min-h-screen text-white">
      
      {/* Layer 0: The Deep Space & WebGL Stars (zIndex: -2) */}
      <SpaceBG />
      
      {/* Layer 1: The Orb & Glassmorphism UI (zIndex: 0 and 10) */}
      <HeroSection />

    </div>
  );
};

export default App;
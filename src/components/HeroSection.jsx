import React from 'react';
import Orb from './customComponents/Orb';
import GlassSurface from './customComponents/GlassSurface';

const HeroSection = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      {...props}
    >
      {/* ORB BACKGROUND */}
      {/* Changed from 'fixed' to 'absolute' to keep it bound to the hero section, and made it scale responsively */}
      {/* <div className="absolute bottom-[-10%] right-[-20%] md:bottom-[-30%] md:right-[-20%] w-full md:w-[60%] lg:w-[50%] aspect-square pointer-events-none z-10 bg-amber-500" onMouseEnter={()=>console.log("hover")}>
        <Orb
          hue={32}
          hoverIntensity={0.9}
          rotateOnHover
          forceHoverState={false}
        />
      </div> */}

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 max-w-[1200px] flex items-center justify-center min-h-[500px] h-[70vh]">
        
        {/* GLASS CONTAINER */}
        <GlassSurface
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={50}
          opacity={0.85}
          mixBlendMode="screen"
          className="w-full md:w-[95%] lg:w-[90%] rounded-[32px] md:rounded-[40px]"
        >
          {/* TEXT CONTENT */}
          <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:pl-[12%] gap-6 w-full h-full">
            
            <div className="space-y-2">
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight leading-tight">
                Hi, I'm <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-blue-500">Koushik Kar.</span>
              </h1>
              <h2 className="text-[#88ddff] text-xl sm:text-2xl md:text-3xl font-medium tracking-wide">
                IT Student & Web Developer
              </h2>
            </div>

            <p className="text-white/70 text-base sm:text-lg md:text-xl leading-relaxed max-w-[500px]">
              Welcome to my portfolio. I specialize in building modern, interactive web experiences.
            </p>
            
            {/* Added a subtle button group for better UX */}
            <div className="flex flex-wrap gap-4 mt-2">
               <button className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition">
                 View Work
               </button>
               <button className="px-6 py-3 rounded-full bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 transition">
                 Contact Me
               </button>
            </div>

          </div>
        </GlassSurface>

      </div>
    </section>
  );
};

export default HeroSection;
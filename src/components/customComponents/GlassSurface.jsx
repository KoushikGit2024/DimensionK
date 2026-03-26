import React, { useEffect, useRef, useState, useId } from 'react';

// Custom hook for dark mode detection
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
};

const GlassSurface = ({
  children,
  width = '100%',     // Defaulted to 100% for better responsive behavior
  height = '100%',    // Defaulted to 100% for better responsive behavior
  minHeight = 200,
  borderRadius = 24,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.85,     // Slightly tweaked for better default visibility
  blur = 12,
  displace = 0.5,     // Added slight default displacement
  backgroundOpacity = 0.05,
  saturation = 1.2,   // Boosted saturation slightly for a richer effect
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {}
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);
  const isDarkMode = useDarkMode();

  const containerRef = useRef(null);
  const feImageRef = useRef(null);
  const redChannelRef = useRef(null);
  const greenChannelRef = useRef(null);
  const blueChannelRef = useRef(null);
  const gaussianBlurRef = useRef(null);

  // Checks browser support for complex SVG + Backdrop filters
  useEffect(() => {
    const supportsSVGFilters = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return false;
      const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      const isFirefox = /Firefox/.test(navigator.userAgent);
      if (isWebkit || isFirefox) return false;
      
      const div = document.createElement('div');
      div.style.backdropFilter = `url(#${filterId})`;
      return div.style.backdropFilter !== '';
    };
    setSvgSupported(supportsSVGFilters());
  }, [filterId]);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute('href', generateDisplacementMap());
  };

  // Setup Resize Observer (Removed the duplicate from the original code)
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateDisplacementMap);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [borderWidth, borderRadius, brightness, opacity, blur, mixBlendMode]);

  // Update filter parameters dynamically
  useEffect(() => {
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset }
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString());
        ref.current.setAttribute('xChannelSelector', xChannel);
        ref.current.setAttribute('yChannelSelector', yChannel);
      }
    });
    gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
  }, [distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, displace]);

  const getContainerStyles = () => {
    const baseStyles = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      minHeight: `${minHeight}px`,
      borderRadius: `${borderRadius}px`,
    };

    // Fallback styling for unsupported browsers or standard backdrop-filter
    const fallbackBoxShadow = isDarkMode 
      ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)`
      : `0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)`;

    if (svgSupported) {
      return {
        ...baseStyles,
        background: isDarkMode ? `hsl(0 0% 0% / ${backgroundOpacity})` : `hsl(0 0% 100% / ${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        boxShadow: isDarkMode
          ? `0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset, 0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset, 0px 8px 24px rgba(0, 0, 0, 0.4)`
          : `0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset, 0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset, 0px 8px 24px rgba(0, 0, 0, 0.1)`
      };
    }

    // Standard CSS Glass Fallback
    return {
      ...baseStyles,
      background: isDarkMode ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.3)',
      backdropFilter: `blur(${blur}px) saturate(${saturation * 100}%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation * 100}%)`,
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: fallbackBoxShadow
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 ${className}`}
      style={getContainerStyles()}
    >
      {/* Hidden SVG Filter Definition */}
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none -z-10" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            
            {/* Red Channel Distortion */}
            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />

            {/* Green Channel Distortion */}
            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

            {/* Blue Channel Distortion */}
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

            {/* Recombine Channels */}
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      {/* Content Container */}
      <div className="relative z-10 flex w-full h-full items-center justify-center p-6 rounded-[inherit]">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
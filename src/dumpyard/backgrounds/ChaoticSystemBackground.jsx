import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Stars, Trail, Instance, Instances, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ── CUSTOM PLASMA SHADER MATERIAL ────────────────────────────────────────────
const PlasmaMaterial = shaderMaterial(
  {
    uTime:            0,
    uBaseColor:       new THREE.Color(0.0, 0.01, 0.22),
    uMidColor:        new THREE.Color(0.0, 1.4,  2.2),
    uHotColor:        new THREE.Color(9.0, 9.0,  9.0),
    uOpacity:         1.0,
    uDistortStrength: 4.5,
    uSpeed:           1.0,
  },
  /* glsl */`
    uniform float uTime;
    uniform float uDistortStrength;
    uniform float uSpeed;

    varying float vRawDisplace;

    vec3 hash3(vec3 p) {
      p = fract(p * vec3(443.8975, 397.2973, 491.1871));
      p += dot(p, p.yzx + 19.19);
      return fract((p.xxy + p.yzz) * p.zyx);
    }

    float gnoise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(dot(hash3(i+vec3(0,0,0))-.5, f-vec3(0,0,0)),
                dot(hash3(i+vec3(1,0,0))-.5, f-vec3(1,0,0)), u.x),
            mix(dot(hash3(i+vec3(0,1,0))-.5, f-vec3(0,1,0)),
                dot(hash3(i+vec3(1,1,0))-.5, f-vec3(1,1,0)), u.x), u.y),
        mix(mix(dot(hash3(i+vec3(0,0,1))-.5, f-vec3(0,0,1)),
                dot(hash3(i+vec3(1,0,1))-.5, f-vec3(1,0,1)), u.x),
            mix(dot(hash3(i+vec3(0,1,1))-.5, f-vec3(0,1,1)),
                dot(hash3(i+vec3(1,1,1))-.5, f-vec3(1,1,1)), u.x), u.y), u.z);
    }

    float fbm(vec3 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * gnoise(p); p = p*2.0+vec3(100.); a*=0.5; }
      return v;
    }

    void main() {
      float t = uTime * uSpeed;
      vec3 q = vec3(
        fbm(position * 0.8 + t * 0.30),
        fbm(position * 0.8 + vec3(1.7, 9.2, 3.4) + t * 0.25),
        fbm(position * 0.8 + vec3(8.3, 2.8, 5.1) + t * 0.20)
      );
      float warp = fbm(position * 0.8 + 2.2 * q + t * 0.18);
      float micro = fbm(position * 3.2 + t * 0.6) * 0.35;

      float raw = clamp(warp + micro, 0.0, 1.0);
      vRawDisplace = raw; 

      vec3 displaced = position + normal * raw * uDistortStrength;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  /* glsl */`
    uniform vec3  uBaseColor;
    uniform vec3  uMidColor;
    uniform vec3  uHotColor;
    uniform float uOpacity;

    varying float vRawDisplace;

    void main() {
      float h = vRawDisplace;
      vec3 color;
      
      if (h < 0.55) {
        color = mix(uBaseColor, uMidColor, pow(max(0.0, h / 0.55), 1.6));
      } else {
        color = mix(uMidColor, uHotColor, pow(max(0.0, (h - 0.55) / 0.45), 2.2));
      }

      gl_FragColor = vec4(color, uOpacity);
    }
  `
);

extend({ PlasmaMaterial });

// ── GLOWING COSMIC DUST SHADER ───────────────────────────────────────────────
const DustMaterial = shaderMaterial(
  {
    uTime:      0,
    uColor:     new THREE.Color(0.0, 1.8, 3.0),
    uBaseSize:  80.0,
  },
  /* glsl */`
    uniform float uTime;
    uniform float uBaseSize;
    varying float vAlpha;

    float hash1(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      float id     = hash1(position.x * 13.7 + position.z * 7.3);
      float breath = 0.7 + 0.3 * sin(uTime * (0.4 + id * 0.6) + id * 6.28);
      vAlpha = breath;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uBaseSize * breath * (300.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 1.0, 80.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */`
    uniform vec3  uColor;
    varying float vAlpha;

    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float brightness = smoothstep(0.5, 0.0, d);
      brightness = brightness * brightness;
      
      // THINNED OUT SMOG: Drastically reduced base alpha so it isn't a solid ball of fog
      float alpha = brightness * vAlpha * 0.05; 
      gl_FragColor = vec4(uColor * brightness, alpha);
    }
  `
);

extend({ DustMaterial });

// ── COSMIC DUST CLOUDS ───────────────────────────────────────────────────────
const CosmicDust = () => {
  const clouds = useMemo(() => {
    // Generate a flattened disc/ring shape instead of a giant cube
    const makeCloud = (count, radius, height, clump = 0) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Polar coordinates for a circular galactic plane
        const angle = Math.random() * Math.PI * 2;
        const r = radius * Math.pow(Math.random(), 0.5); // Distribute evenly outward
        const c = 1.0 - clump * Math.random(); // Slight center gravity

        pos[i*3+0] = Math.cos(angle) * r * c;
        pos[i*3+1] = (Math.random() - 0.5) * height * c; // FLATTENED Y-AXIS
        pos[i*3+2] = Math.sin(angle) * r * c;
      }
      return pos;
    };
    return {
      // Slashed counts and severely flattened the height (the middle number)
      inner: makeCloud(1500, 120, 15, 0.1),
      mid:   makeCloud(1000, 200, 25, 0.05),
      outer: makeCloud(800,  300, 40, 0.02),
    };
  }, []);

  const matInner = useRef();
  const matMid   = useRef();
  const matOuter = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Slowed down the swirling so it feels more massive and ambient
    if (matInner.current)  matInner.current.uTime  = t * 0.4;
    if (matMid.current)    matMid.current.uTime    = t * 0.25 + 33.0;
    if (matOuter.current)  matOuter.current.uTime  = t * 0.15 + 77.0;
  });

  return (
    <>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={clouds.inner} count={clouds.inner.length / 3} itemSize={3} />
        </bufferGeometry>
        {/* Shrank base size and pulled colors below 1.0 to stop Bloom from blowing it out */}
        <dustMaterial ref={matInner} uColor={new THREE.Color(0.0, 0.4, 0.7)} uBaseSize={35} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={clouds.mid} count={clouds.mid.length / 3} itemSize={3} />
        </bufferGeometry>
        <dustMaterial ref={matMid} uColor={new THREE.Color(0.0, 0.15, 0.35)} uBaseSize={50} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={clouds.outer} count={clouds.outer.length / 3} itemSize={3} />
        </bufferGeometry>
        <dustMaterial ref={matOuter} uColor={new THREE.Color(0.0, 0.05, 0.15)} uBaseSize={70} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
};

// ── PRIMARY STAR ─────────────────────────────────────────────────────────────
const PrimaryCorona = ({ meshRef }) => {
  const coreRef   = useRef();
  const coronaRef = useRef();
  const outerRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current)   coreRef.current.uTime   = t;
    if (coronaRef.current) coronaRef.current.uTime = t * 0.65;
    if (outerRef.current)  outerRef.current.uTime  = t * 0.35;
  });

  return (
    <group ref={meshRef}>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[7, 128, 128]} />
        <plasmaMaterial ref={coreRef} uBaseColor={new THREE.Color(0.0, 0.01, 0.22)} uMidColor={new THREE.Color(0.0, 1.4, 2.2)} uHotColor={new THREE.Color(9.0, 9.0, 9.0)} uOpacity={1.0} uDistortStrength={4.5} uSpeed={1.0} toneMapped={false} />
      </mesh>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[10.5, 96, 96]} />
        <plasmaMaterial ref={coronaRef} uBaseColor={new THREE.Color(0.0, 0.0, 0.15)} uMidColor={new THREE.Color(0.0, 1.0, 1.8)} uHotColor={new THREE.Color(5.0, 5.0, 5.0)} uOpacity={0.45} uDistortStrength={5.5} uSpeed={0.7} toneMapped={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[16, 64, 64]} />
        {/* THINNED OUT HALO: uOpacity dropped heavily so it doesn't look like a solid sphere */}
        <plasmaMaterial ref={outerRef} uBaseColor={new THREE.Color(0.0, 0.0, 0.08)} uMidColor={new THREE.Color(0.0, 0.4, 1.2)} uHotColor={new THREE.Color(2.0, 2.0, 2.0)} uOpacity={0.04} uDistortStrength={7.0} uSpeed={0.4} toneMapped={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// ── PLANET WITH CORONA ───────────────────────────────────────────────────────
const PlanetWithCorona = ({ planetRef, radius = 3.5, midColor, hotColor, speed = 1.0 }) => {
  const fireRef  = useRef();
  const outerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireRef.current)  fireRef.current.uTime  = t * speed;
    if (outerRef.current) outerRef.current.uTime = t * speed * 0.5;
  });

  return (
    <group ref={planetRef}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[radius * 1.35, 96, 96]} />
        <plasmaMaterial ref={fireRef} uBaseColor={new THREE.Color(0.0, 0.0, 0.2)} uMidColor={new THREE.Color(...midColor)} uHotColor={new THREE.Color(...hotColor)} uOpacity={0.65} uDistortStrength={radius * 0.75} uSpeed={speed} toneMapped={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh frustumCulled={false}>
        <sphereGeometry args={[radius * 2.1, 64, 64]} />
        {/* THINNED OUT HALO: uOpacity dropped heavily */}
        <plasmaMaterial ref={outerRef} uBaseColor={new THREE.Color(0.0, 0.0, 0.05)} uMidColor={new THREE.Color(...midColor.map(v => v * 0.4))} uHotColor={new THREE.Color(...hotColor.map(v => v * 0.3))} uOpacity={0.06} uDistortStrength={radius * 1.1} uSpeed={speed * 0.45} toneMapped={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

// ── THREE-BODY ORCHESTRATOR ──────────────────────────────────────────────────
const ThreeBodySystem = () => {
  const primaryRef   = useRef();
  const secondaryRef = useRef();
  const tertiaryRef  = useRef();
  const lightRef     = useRef();
  const light2Ref    = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (primaryRef.current) {
      primaryRef.current.position.set(Math.sin(t * 0.05) * 4, Math.cos(t * 0.08) * 3, Math.sin(t * 0.03) * 4);
      if (lightRef.current) lightRef.current.position.copy(primaryRef.current.position);
    }

    if (secondaryRef.current) {
      secondaryRef.current.position.set(
        Math.sin(t * 0.6) * 35 + Math.cos(t * 0.3) * 15,
        Math.cos(t * 0.5) * 25 + Math.sin(t * 0.2) * 10,
        Math.sin(t * 0.7) * 30
      );
      if (light2Ref.current) light2Ref.current.position.copy(secondaryRef.current.position);
    }

    if (tertiaryRef.current) {
      tertiaryRef.current.position.set(Math.cos(t * 0.35) * 65, Math.sin(t * 0.25) * 45, Math.cos(t * 0.45) * 55);
    }
  });

  return (
    <>
      <pointLight ref={lightRef}  intensity={2500} distance={550} color="#70eeff" decay={1.6} />
      <pointLight ref={light2Ref} intensity={600}  distance={200} color="#00ffee" decay={2.0} />
      <ambientLight intensity={0.015} color="#000d1a" />

      <PrimaryCorona meshRef={primaryRef} />

      <Trail width={18} length={22} color={new THREE.Color(0, 3, 3)} attenuation={t => t*t*t}>
        <PlanetWithCorona planetRef={secondaryRef} radius={3.5} midColor={[0.0, 1.6, 2.2]} hotColor={[6.0, 6.0, 6.0]} speed={1.4} />
      </Trail>

      <Trail width={12} length={32} color={new THREE.Color(0, 0.4, 2.0)} attenuation={t => t*t*t}>
        <PlanetWithCorona planetRef={tertiaryRef} radius={4.5} midColor={[0.0, 0.7, 2.8]} hotColor={[5.0, 5.0, 6.0]} speed={1.1} />
      </Trail>
    </>
  );
};

// ── ASTEROID BELT ────────────────────────────────────────────────────────────
const AsteroidBelt = () => {
  const beltRef = useRef();
  const COUNT   = 1200;

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const r = 80 + Math.random() * 90;
      const a = Math.random() * Math.PI * 2;
      temp.push({
        position: [Math.cos(a)*r + (Math.random()-.5)*12, (Math.random()-.5)*30, Math.sin(a)*r + (Math.random()-.5)*12],
        scale:    Math.random() * 0.9 + 0.15,
        rotation: [Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI],
      });
    }
    return temp;
  }, []);

  useFrame(({ clock }) => {
    if (beltRef.current) {
      beltRef.current.rotation.y = clock.getElapsedTime() * 0.009;
      beltRef.current.rotation.z = clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <Instances ref={beltRef} range={COUNT} limit={COUNT}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#010408" roughness={0.85} metalness={0.95} envMapIntensity={0} />
      {asteroids.map((d, i) => (
        <Instance key={i} position={d.position} scale={d.scale} rotation={d.rotation} />
      ))}
    </Instances>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ChaoticSystemComponent = () => {
  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:-1, background:'#000000' }}>
      <Canvas
        camera={{ position:[0, 20, 160], fov:55, near:0.5, far:900 }}
        gl={{
          antialias:       false,
          powerPreference: 'high-performance',
          alpha:           false,
          stencil:         false,
        }}
        dpr={[1, 1.5]}
      >
        {/* THINNED OUT FOG: Lowered density so it doesn't create a dark sphere wall */}
        <fogExp2 attach="fog" color="#000204" density={0.002} />

        <Stars radius={180} depth={40} count={2500} factor={3.5} saturation={0.8} fade speed={0.5} />
        <CosmicDust />
        <ThreeBodySystem />
        <AsteroidBelt />

        <EffectComposer disableNormalPass multisampling={0}>
          {/* ULTRA-TIGHT BLOOM: 
            - luminanceThreshold={1.2}: Ignores everything except the extreme white-hot plasma peaks.
            - intensity={0.25}: Cuts the raw brightness of the glow in half.
            - radius={0.4}: Pulls the light bleed much closer to the surface so it doesn't haze up the screen.
            - luminanceSmoothing={0.1}: Creates a sharper cutoff so mid-tones don't accidentally glow.
          */}
          <Bloom 
            luminanceThreshold={1.2} 
            luminanceSmoothing={0.1} 
            mipmapBlur 
            intensity={0.00025} 
            radius={0.4} 
          />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0014, 0.0009]} />
          <Vignette offset={0.28} darkness={0.78} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ChaoticSystemComponent;
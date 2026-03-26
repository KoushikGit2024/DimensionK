import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor; // Alias for user code compatibility
  
  const positions = useMemo(() => {
     const pos = [];
     for(let i=0; i<count; i++) pos.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
     return pos;
  }, []);

  // Material & Geom
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(() => ({"orbitSpeed":1,"systemScale":60,"starGlow":0.7,"trailSpread":0.5}), []);
  const addControl = (id, l, min, max, val) => {
      return PARAMS[id] !== undefined ? PARAMS[id] : val;
  };
  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speedMult;
    const THREE_LIB = THREE;

    if(material.uniforms && material.uniforms.uTime) {
         material.uniforms.uTime.value = time;
    }

    for (let i = 0; i < count; i++) {
        // USER CODE START
        // === CONTROLS ===
        const orbitSpeed = addControl("orbitSpeed", "Orbit Speed", 0.1, 5.0, 1.0);
        const systemScale = addControl("systemScale", "System Scale", 20, 120, 60);
        const starGlow = addControl("starGlow", "Star Intensity", 0.3, 1.0, 0.7);
        const trailSpread = addControl("trailSpread", "Orbital Dust", 0.0, 2.0, 0.5);
        
        // === PARTICLE BUDGET ALLOCATION ===
        // Sun: 0-3999 (4000), Mercury: 4000-4399 (400), Venus: 4400-5099 (700),
        // Earth: 5100-6099 (1000), Mars: 6100-6699 (600), Jupiter: 6700-9199 (2500),
        // Saturn: 9200-11699 (2500 - includes rings), Uranus: 11700-12899 (1200),
        // Neptune: 12900-13899 (1000), Stars: 13900-19999 (6100)
        
        const sunEnd = 4000;
        const mercEnd = 4400;
        const venEnd = 5100;
        const earEnd = 6100;
        const marEnd = 6700;
        const jupEnd = 9200;
        const satEnd = 11700;
        const uraEnd = 12900;
        const nepEnd = 13900;
        
        // === PLANET RENDERING (branchless via math) ===
        let x = 0;
        let y = 0;
        let z = 0;
        let h = 0;
        let s = 1.0;
        let l = 0.5;
        
        if (i < sunEnd) {
          // SUN - fiery sphere with corona
          const si = i / sunEnd;
          const phi = si * 6.2831853 * 40.0;
          const cosTheta = 1.0 - 2.0 * si;
          const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
          const coreR = 5.0;
          const pulse = 1.0 + 0.08 * Math.sin(time * 2.0 + si * 30.0);
          const corona = si > 0.85 ? (1.0 + 0.6 * Math.sin(time * 3.0 + phi * 2.0)) : 1.0;
          const r = coreR * pulse * corona;
          x = r * sinTheta * Math.cos(phi);
          y = r * sinTheta * Math.sin(phi);
          z = r * cosTheta;
          const flicker = 0.5 + 0.5 * Math.sin(time * 5.0 + si * 50.0);
          h = 0.08 * flicker;
          s = 1.0;
          l = starGlow * (0.5 + 0.5 * flicker);
        } else if (i < mercEnd) {
          // MERCURY
          const li = (i - sunEnd) / (mercEnd - sunEnd);
          const orbitR = systemScale * 0.25;
          const angle = time * orbitSpeed * 4.15 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 15.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 0.8 + trailSpread * 0.3 * Math.sin(time + li * 20.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          h = 0.08;
          s = 0.3;
          l = 0.55;
        } else if (i < venEnd) {
          // VENUS
          const li = (i - mercEnd) / (venEnd - mercEnd);
          const orbitR = systemScale * 0.40;
          const angle = time * orbitSpeed * 1.62 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 18.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 1.5 + trailSpread * 0.3 * Math.sin(time * 1.2 + li * 15.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          h = 0.1;
          s = 0.7;
          l = 0.65;
        } else if (i < earEnd) {
          // EARTH
          const li = (i - venEnd) / (earEnd - venEnd);
          const orbitR = systemScale * 0.55;
          const angle = time * orbitSpeed * 1.0 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 20.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 1.8 + trailSpread * 0.4 * Math.sin(time * 0.8 + li * 18.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          const ocean = 0.58 + 0.04 * Math.sin(phi2 * 3.0);
          h = li > 0.4 && li < 0.7 ? 0.33 : ocean;
          s = 0.8;
          l = 0.45;
        } else if (i < marEnd) {
          // MARS
          const li = (i - earEnd) / (marEnd - earEnd);
          const orbitR = systemScale * 0.72;
          const angle = time * orbitSpeed * 0.53 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 16.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 1.2 + trailSpread * 0.3 * Math.sin(time * 0.6 + li * 12.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          h = 0.03;
          s = 0.85;
          l = 0.4;
        } else if (i < jupEnd) {
          // JUPITER - gas giant bands
          const li = (i - marEnd) / (jupEnd - marEnd);
          const orbitR = systemScale * 1.0;
          const angle = time * orbitSpeed * 0.084 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 25.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 4.0 + trailSpread * 0.5 * Math.sin(time * 0.4 + li * 10.0);
          const cx = Math.cos(angle) * orbitR;
          const cz = Math.sin(angle) * orbitR;
          x = cx + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = cz + pr * st * Math.sin(phi2);
          const band = Math.abs(ct);
          h = 0.08 + 0.04 * Math.sin(band * 12.0);
          s = 0.6 + 0.2 * Math.sin(band * 8.0);
          l = 0.45 + 0.1 * Math.sin(band * 15.0 + time);
        } else if (i < satEnd) {
          // SATURN + RINGS
          const li = (i - jupEnd) / (satEnd - jupEnd);
          const orbitR = systemScale * 1.35;
          const baseAngle = time * orbitSpeed * 0.034;
          const cx = Math.cos(baseAngle) * orbitR;
          const cz = Math.sin(baseAngle) * orbitR;
        
          if (li < 0.5) {
            // Saturn body
            const bi = li * 2.0;
            const phi2 = bi * 6.2831853 * 22.0;
            const ct = 1.0 - 2.0 * bi;
            const st = Math.sqrt(1.0 - ct * ct);
            const pr = 3.5 + trailSpread * 0.4 * Math.sin(time * 0.3 + bi * 8.0);
            x = cx + pr * st * Math.cos(phi2);
            y = pr * ct;
            z = cz + pr * st * Math.sin(phi2);
            h = 0.12;
            s = 0.5;
            l = 0.55;
          } else {
            // Saturn rings
            const ri = (li - 0.5) * 2.0;
            const ringAngle = ri * 6.2831853 * 3.0 + time * orbitSpeed * 0.5;
            const ringR = 5.5 + ri * 4.0;
            const tilt = 0.4;
            x = cx + Math.cos(ringAngle) * ringR;
            y = Math.sin(ringAngle) * ringR * Math.sin(tilt) + (Math.random() - 0.5) * trailSpread * 0.3;
            z = cz + Math.sin(ringAngle) * ringR * Math.cos(tilt);
            h = 0.1 + ri * 0.03;
            s = 0.4;
            l = 0.6 + 0.1 * ri;
          }
        } else if (i < uraEnd) {
          // URANUS
          const li = (i - satEnd) / (uraEnd - satEnd);
          const orbitR = systemScale * 1.7;
          const angle = time * orbitSpeed * 0.012 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 20.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 2.5 + trailSpread * 0.3 * Math.sin(time * 0.2 + li * 8.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          h = 0.52;
          s = 0.6;
          l = 0.6;
        } else if (i < nepEnd) {
          // NEPTUNE
          const li = (i - uraEnd) / (nepEnd - uraEnd);
          const orbitR = systemScale * 2.0;
          const angle = time * orbitSpeed * 0.006 + li * 6.2831853;
          const phi2 = li * 6.2831853 * 18.0;
          const ct = 1.0 - 2.0 * li;
          const st = Math.sqrt(1.0 - ct * ct);
          const pr = 2.2 + trailSpread * 0.3 * Math.sin(time * 0.15 + li * 7.0);
          x = Math.cos(angle) * orbitR + pr * st * Math.cos(phi2);
          y = pr * ct;
          z = Math.sin(angle) * orbitR + pr * st * Math.sin(phi2);
          h = 0.62;
          s = 0.8;
          l = 0.45;
        } else {
          // BACKGROUND STARS - scattered across a large sphere
          const li = (i - nepEnd) / (count - nepEnd);
          const starPhi = li * 6.2831853 * 80.0;
          const starCt = 1.0 - 2.0 * li;
          const starSt = Math.sqrt(1.0 - starCt * starCt);
          const starR = systemScale * 3.5 + li * systemScale * 2.0;
          x = starR * starSt * Math.cos(starPhi);
          y = starR * starCt;
          z = starR * starSt * Math.sin(starPhi);
          const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time * 1.5 + li * 100.0));
          h = 0.6 * li;
          s = 0.15;
          l = twinkle * 0.6;
        }
        
        target.set(x, y, z);
        color.setHSL(h, s, l);
        
        // === HUD & ANNOTATIONS (i === 0 only) ===
        if (i === 0) {
          setInfo("Solar System", "Astrology Cosmos - 8 planets orbiting the Sun with starfield background");
          annotate("sun", new THREE.Vector3(0, 0, 0), "Sun");
          const t1 = time * orbitSpeed;
          annotate("mercury", new THREE.Vector3(Math.cos(t1 * 4.15) * systemScale * 0.25, 0, Math.sin(t1 * 4.15) * systemScale * 0.25), "Mercury");
          annotate("venus", new THREE.Vector3(Math.cos(t1 * 1.62) * systemScale * 0.40, 0, Math.sin(t1 * 1.62) * systemScale * 0.40), "Venus");
          annotate("earth", new THREE.Vector3(Math.cos(t1 * 1.0) * systemScale * 0.55, 0, Math.sin(t1 * 1.0) * systemScale * 0.55), "Earth");
          annotate("mars", new THREE.Vector3(Math.cos(t1 * 0.53) * systemScale * 0.72, 0, Math.sin(t1 * 0.53) * systemScale * 0.72), "Mars");
          annotate("jupiter", new THREE.Vector3(Math.cos(t1 * 0.084) * systemScale * 1.0, 0, Math.sin(t1 * 0.084) * systemScale * 1.0), "Jupiter");
          annotate("saturn", new THREE.Vector3(Math.cos(t1 * 0.034) * systemScale * 1.35, 0, Math.sin(t1 * 0.034) * systemScale * 1.35), "Saturn");
          annotate("uranus", new THREE.Vector3(Math.cos(t1 * 0.012) * systemScale * 1.7, 0, Math.sin(t1 * 0.012) * systemScale * 1.7), "Uranus");
          annotate("neptune", new THREE.Vector3(Math.cos(t1 * 0.006) * systemScale * 2.0, 0, Math.sin(t1 * 0.006) * systemScale * 2.0), "Neptune");
        }
        // USER CODE END

        positions[i].lerp(target, 0.1);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, pColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

export default function SolarSystem() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate={true} />
        <Effects disableGamma>
            <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}
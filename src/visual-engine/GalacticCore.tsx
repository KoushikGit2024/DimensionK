"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GalacticCoreProps {
  particleCount?: number;
}

const DISK_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aRadius;
  attribute float aAngle;
  attribute float aVertical;
  attribute float aScale;
  attribute float aRandom;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Keplerian differential rotation (inner plasma orbits faster)
    float angularSpeed = 1.25 / pow(aRadius, 1.38);
    float currentAngle = aAngle + uTime * angularSpeed;

    // Subtle vertical harmonic wave
    float wave = sin(currentAngle * 2.0 - uTime * 1.2 + aRandom * 6.2831) * 0.02 * aRadius;

    vec3 pos = vec3(
      cos(currentAngle) * aRadius,
      aVertical + wave,
      sin(currentAngle) * aRadius
    );

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Relativistic Doppler beaming: approaching side glows brighter
    vec3 tangent = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
    vec3 worldTangent = normalize(mat3(modelMatrix) * tangent);
    vec3 viewDir = normalize(cameraPosition - modelPosition.xyz);
    float doppler = dot(worldTangent, viewDir);

    float beaming = clamp(1.15 + doppler * 0.35, 0.78, 1.55);
    vColor = aColor * beaming;

    // Radial envelope
    float innerFade = smoothstep(1.05, 1.32, aRadius);
    float outerFade = 1.0 - smoothstep(3.6, 5.1, aRadius);

    // Only dim particles that drift far left into the hero typography column
    float textProtectionMask = smoothstep(-2.6, 0.35, modelPosition.x);

    float shimmer = 0.84 + 0.16 * sin(uTime * 2.1 + aRandom * 15.0);
    vAlpha = innerFade * outerFade * textProtectionMask * shimmer * 0.72;

    // Balanced glowing particle size: luminous presence without giant bokeh blobs
    float rawSize = aScale * uPixelRatio * (54.0 / -viewPosition.z);
    gl_PointSize = clamp(rawSize, 1.8, 7.2);
  }
`;

const DISK_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv) * 2.0;
    if (dist > 1.0) discard;

    // Bright pinpoint core + soft glowing corona
    float core = exp(-dist * dist * 5.2);
    float halo = pow(1.0 - dist, 2.4) * 0.55;
    float profile = core + halo;

    // Soft-knee color boost: keeps core vibrant without harsh #FFFFFF clipping
    vec3 finalColor = vColor * (1.05 + core * 0.45);

    gl_FragColor = vec4(finalColor, profile * vAlpha);
  }
`;

const HORIZON_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const HORIZON_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Luminous grazing Fresnel photon sphere around deep petrol void
    float ndotv = max(0.0, dot(vNormal, vViewDir));
    float rim = pow(1.0 - ndotv, 3.2);
    float innerEdge = smoothstep(0.35, 0.72, 1.0 - ndotv) * 0.65;

    vec3 voidColor = vec3(0.02, 0.05, 0.07);    // Deep observatory void
    vec3 copperRim = vec3(1.0, 0.68, 0.32);     // Luminous Amber-Gold ("Kar" accent)
    vec3 tealRim = vec3(0.22, 0.95, 0.90);      // Bright Observatory Cyan (#38f2e6)

    float mixFactor = 0.5 + 0.5 * sin(vNormal.x * 2.5 + uTime * 0.8);
    vec3 rimColor = mix(copperRim, tealRim, mixFactor) * 1.35;

    vec3 finalColor = mix(voidColor, rimColor, clamp(rim + innerEdge * 0.4, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, 0.98);
  }
`;

export const GalacticCore: React.FC<GalacticCoreProps> = ({
  particleCount = 6800,
}) => {
  const wireCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const photonRingRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const radii = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const verticals = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const arms = 3;
    const innerRadius = 1.1;
    const maxSpan = 3.95;

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      const progress = Math.pow(rand, 1.6);
      const r = innerRadius + progress * maxSpan;

      const armOffset = ((i % arms) / arms) * Math.PI * 2;
      const spiralTwist = 2.65 * Math.log(r / innerRadius + 1.0);
      const scatter = (Math.random() - 0.5) * (0.34 + progress * 0.82);
      const theta = armOffset + spiralTwist + scatter;

      const gaussianY =
        (Math.random() + Math.random() + Math.random() - 1.5) * 0.66;
      const y = gaussianY * (0.045 + Math.pow(progress, 1.35) * 0.24);

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      radii[i] = r;
      angles[i] = theta;
      verticals[i] = y;
      scales[i] = 0.55 + Math.pow(Math.random(), 2.2) * 1.35;
      randoms[i] = Math.random();

      // High-contrast, luminous theme palette:
      // Inner: Radiant Champagne Gold & Warm Copper
      // Mid: Luminous Observatory Cyan-Teal (#38f2e6)
      // Outer: Rich Petrol Cyan with warm amber star-forming knots
      const heat = 1.0 - progress;
      let cr: number, cg: number, cb: number;

      if (heat > 0.7) {
        const t = (heat - 0.7) / 0.3;
        cr = 0.96 + t * 0.04;
        cg = 0.68 + t * 0.24;
        cb = 0.38 + t * 0.42;
      } else if (heat > 0.34) {
        const t = (heat - 0.34) / 0.36;
        cr = 0.22 + t * 0.32;
        cg = 0.78 + t * 0.16;
        cb = 0.86 + t * 0.12;
      } else {
        const t = heat / 0.34;
        const isAmberKnot = randoms[i] > 0.84;
        cr = isAmberKnot ? 0.88 * t + 0.25 : 0.14 + t * 0.18;
        cg = isAmberKnot ? 0.56 * t + 0.18 : 0.48 + t * 0.32;
        cb = isAmberKnot ? 0.28 * t + 0.12 : 0.58 + t * 0.32;
      }

      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geo.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));
    geo.setAttribute("aVertical", new THREE.BufferAttribute(verticals, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    geo.computeBoundingSphere();
    return geo;
  }, [particleCount]);

  const diskMaterial = useMemo(() => {
    const dpr =
      typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.65) : 1;
    return new THREE.ShaderMaterial({
      vertexShader: DISK_VERTEX_SHADER,
      fragmentShader: DISK_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  const horizonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: HORIZON_VERTEX_SHADER,
      fragmentShader: HORIZON_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      diskMaterial.dispose();
      horizonMaterial.dispose();
    };
  }, [geometry, diskMaterial, horizonMaterial]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    diskMaterial.uniforms.uTime.value += dt;
    horizonMaterial.uniforms.uTime.value += dt;

    if (wireCoreRef.current) {
      wireCoreRef.current.rotation.y -= dt * 0.1;
      wireCoreRef.current.rotation.x += dt * 0.05;
    }
    if (photonRingRef.current) {
      photonRingRef.current.rotation.z -= dt * 0.28;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += dt * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= dt * 0.06;
    }
  });

  return (
    <group rotation={[0.46, 0.18, -0.22]}>
      {/* Singularity Core with Luminous Copper-Teal Fresnel Corona */}
      <mesh material={horizonMaterial}>
        <sphereGeometry args={[0.78, 32, 32]} />
      </mesh>

      {/* Geodesic Containment Lattice */}
      <mesh ref={wireCoreRef} scale={[1.16, 1.16, 1.16]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial
          color="#38f2e6"
          wireframe
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner Luminous Amber-Gold Photon Ring */}
      <mesh ref={photonRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1.04, 96]} />
        <meshBasicMaterial
          color="#ffae52"
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* GPU-Driven Keplerian Accretion Disk */}
      <points
        geometry={geometry}
        material={diskMaterial}
        frustumCulled={false}
      />

      {/* Inner Equatorial Telemetry Meridian */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3.8, 0, 0]}>
        <ringGeometry args={[3.25, 3.268, 112]} />
        <meshBasicMaterial
          color="#38f2e6"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Polar Ephemeris Meridian */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3.2, Math.PI / 4, 0]}>
        <ringGeometry args={[4.15, 4.168, 112]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.26}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
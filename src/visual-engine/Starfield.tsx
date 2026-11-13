"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

const STAR_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = sin(uTime * (1.1 + fract(aPhase) * 2.0) + aPhase * 6.2831);
    vTwinkle = 0.68 + 0.32 * twinkle;
    vColor = aColor;

    float ptSize = aSize * uPixelRatio * (125.0 / -mvPosition.z);
    gl_PointSize = clamp(ptSize, 1.2, 3.8);
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv) * 2.0;
    if (dist > 1.0) discard;

    float core = exp(-dist * dist * 5.2);
    float halo = pow(1.0 - dist, 2.6) * 0.4;
    gl_FragColor = vec4(vColor * (1.0 + core * 0.3), (core + halo) * vTwinkle * 0.85);
  }
`;

export const Starfield: React.FC<StarfieldProps> = ({ count = 1600 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = 14 + Math.pow(Math.random(), 0.9) * 54;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      sizes[i] = 0.55 + Math.pow(Math.random(), 3.2) * 1.85;
      phases[i] = Math.random() * 100.0;

      const spectral = Math.random();
      if (spectral > 0.82) {
        color.setHSL(0.51, 0.72, 0.84); // Luminous Ice Teal
      } else if (spectral > 0.68) {
        color.setHSL(0.09, 0.82, 0.78); // Warm Copper-Gold
      } else {
        color.setHSL(0.55, 0.18, 0.92); // Crisp Observatory White
      }

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(cols, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const material = useMemo(() => {
    const dpr =
      typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.65) : 1;
    return new THREE.ShaderMaterial({
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    material.uniforms.uTime.value += dt;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += dt * 0.008;
      pointsRef.current.rotation.x += dt * 0.002;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};
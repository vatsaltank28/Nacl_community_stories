"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const count = isMobile ? 800 : 3500;
  const mesh = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#F7F5F2" transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 bg-primary">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}

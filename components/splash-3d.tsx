'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function SplashElement() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time / 2) * 0.2;
      meshRef.current.rotation.y = Math.cos(time / 3) * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Glow Shield */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[2, 64, 64]} ref={meshRef}>
          <MeshDistortMaterial
            color="#8b5cf6"
            speed={4}
            distort={0.4}
            radius={1}
            emissive="#4c1d95"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.3}
          />
        </Sphere>
      </Float>

      {/* Internal Core */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <MeshWobbleMaterial
            color="#ec4899"
            factor={0.4}
            speed={2}
            emissive="#be185d"
            roughness={0}
          />
        </mesh>
      </Float>

      {/* Orbiting Particles */}
      <Stars radius={100} depth={50} count={1000} factor={12} saturation={0} fade speed={1} />
    </group>
  );
}

export function Splash3D() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SplashElement />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

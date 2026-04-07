'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll, useVelocity } from 'framer-motion';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type ParticleCloudProps = {
  count?: number;
};

function ParticleCloud({ count = 1200 }: ParticleCloudProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);
  const pointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);

  const geometry = useMemo(() => {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color('#B298DC');
    const colorB = new THREE.Color('#444444');
    const mixed = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      positions[stride] = (Math.random() - 0.5) * 24;
      positions[stride + 1] = (Math.random() - 0.5) * 18;
      positions[stride + 2] = (Math.random() - 0.5) * 22;

      mixed.copy(colorA).lerp(colorB, Math.random() * 0.45);
      colors[stride] = mixed.r;
      colors[stride + 1] = mixed.g;
      colors[stride + 2] = mixed.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return particleGeometry;
  }, [count]);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const unsubscribe = scrollVelocity.on('change', (value) => {
      velocityRef.current = THREE.MathUtils.clamp(value * 3.2, -1.4, 1.4);
    });

    window.addEventListener('pointermove', updatePointer);

    return () => {
      unsubscribe();
      window.removeEventListener('pointermove', updatePointer);
    };
  }, [scrollVelocity]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsRef.current) {
      return;
    }

    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0, 0.06);

    const targetRotX = pointer.current.y * 0.12;
    const targetRotY = pointer.current.x * 0.18;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      scrollYProgress.get() * 4.8 + velocityRef.current * 1.25,
      0.045,
    );

    groupRef.current.rotation.z += delta * (0.012 + Math.abs(velocityRef.current) * 0.02);
    pointsRef.current.rotation.y += delta * 0.015;

    const camera = state.camera as THREE.PerspectiveCamera;
    const targetFov = 42 + scrollYProgress.get() * 5.5 + Math.abs(velocityRef.current) * 4;
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 12 - scrollYProgress.get() * 1.8, 0.05);
    camera.updateProjectionMatrix();
  }, -1);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={materialRef}
          size={0.12}
          sizeAttenuation
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </group>
  );
}

function SceneFallback() {
  return null;
}

export function BackgroundField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 12], fov: 42 }}
      >
        <Suspense fallback={<SceneFallback />}>
          <ParticleCloud />
        </Suspense>
      </Canvas>
    </div>
  );
}

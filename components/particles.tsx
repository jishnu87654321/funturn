'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        context.beginPath();
        context.arc(32, 32, 28, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
        context.shadowBlur = 10;
        context.shadowColor = 'white';
    }
    return new THREE.CanvasTexture(canvas);
};

export default function Particles({
  particleColors = ['#ffffff'],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = true,
  alphaParticles = false,
  disableRotation = false,
  pixelRatio = 1,
}: any) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={pixelRatio || 1} camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ParticleField 
          particleColors={particleColors}
          particleCount={particleCount}
          particleSpread={particleSpread}
          speed={speed}
          particleBaseSize={particleBaseSize}
          moveParticlesOnHover={moveParticlesOnHover}
          alphaParticles={alphaParticles}
          disableRotation={disableRotation}
        />
      </Canvas>
    </div>
  );
}

function ParticleField({ particleCount, particleSpread, speed, particleColors, particleBaseSize, disableRotation, moveParticlesOnHover }: any) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => createCircleTexture(), []);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        // Uniform distribution inside a sphere
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * particleSpread;

        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);

        color.set(particleColors[Math.floor(Math.random() * particleColors.length)]);
        col[i * 3] = color.r;
        col[i * 3 + 1] = color.g;
        col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [particleCount, particleSpread, particleColors]);

  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!moveParticlesOnHover) return;
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [moveParticlesOnHover]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    if (!disableRotation) {
      pointsRef.current.rotation.y += speed * delta;
      pointsRef.current.rotation.x += (speed * 0.3) * delta;
    }

    if (moveParticlesOnHover) {
       mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05;
       mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05;
       pointsRef.current.position.x = mouse.current.x * particleSpread * 0.15;
       pointsRef.current.position.y = mouse.current.y * particleSpread * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={particleBaseSize * 0.006} 
        vertexColors 
        transparent 
        alphaTest={0.01} 
        sizeAttenuation 
        map={texture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

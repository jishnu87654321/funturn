'use client';

import { createElement, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

type Vec3 = [number, number, number];

type LanyardProps = {
  position?: Vec3;
  gravity?: Vec3;
  fov?: number;
  transparent?: boolean;
};

type LoadedAssets = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material & { map?: THREE.Texture }>;
  texture: THREE.Texture;
  cardArtwork: THREE.Texture;
};

function Band({
  isMobile,
  nodes,
  materials,
  texture,
  cardArtwork,
  maxSpeed = 50,
  minSpeed = 0,
}: {
  isMobile: boolean;
} & LoadedAssets & {
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const bandRef = useRef<THREE.Mesh | null>(null);
  const fixedRef = useRef<RapierRigidBody | null>(null);
  const j1Ref = useRef<RapierRigidBody | null>(null);
  const j2Ref = useRef<RapierRigidBody | null>(null);
  const j3Ref = useRef<RapierRigidBody | null>(null);
  const cardRef = useRef<RapierRigidBody | null>(null);

  const vecRef = useRef(new THREE.Vector3());
  const angRef = useRef(new THREE.Vector3());
  const rotRef = useRef(new THREE.Vector3());
  const dirRef = useRef(new THREE.Vector3());

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  const segmentProps = useMemo(
    () => ({
      type: 'dynamic' as const,
      canSleep: true,
      colliders: false as const,
      angularDamping: 4,
      linearDamping: 4,
    }),
    [],
  );

  useRopeJoint(fixedRef as RefObject<RapierRigidBody>, j1Ref as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1Ref as RefObject<RapierRigidBody>, j2Ref as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2Ref as RefObject<RapierRigidBody>, j3Ref as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3Ref as RefObject<RapierRigidBody>, cardRef as RefObject<RapierRigidBody>, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    document.body.style.cursor = hovered ? (dragged ? 'grabbing' : 'grab') : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    cardArtwork.wrapS = THREE.ClampToEdgeWrapping;
    cardArtwork.wrapT = THREE.ClampToEdgeWrapping;
    cardArtwork.colorSpace = THREE.SRGBColorSpace;
    cardArtwork.flipY = false;
  }, [texture, cardArtwork]);

  useFrame((state, delta) => {
    const fixed = fixedRef.current;
    const j1 = j1Ref.current;
    const j2 = j2Ref.current;
    const j3 = j3Ref.current;
    const card = cardRef.current;
    const band = bandRef.current;

    if (!fixed || !j1 || !j2 || !j3 || !card || !band) {
      return;
    }

    const vec = vecRef.current;
    const dir = dirRef.current;
    const ang = angRef.current;
    const rot = rotRef.current;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((body) => body.wakeUp());
      card.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    [j1, j2].forEach((body) => {
      const lerpedBody = body as RapierRigidBody & { lerped?: THREE.Vector3 };
      if (!lerpedBody.lerped) {
        lerpedBody.lerped = new THREE.Vector3().copy(body.translation() as THREE.Vector3);
      }
      const clampedDistance = Math.max(
        0.1,
        Math.min(1, lerpedBody.lerped.distanceTo(body.translation() as THREE.Vector3)),
      );
      lerpedBody.lerped.lerp(
        body.translation() as THREE.Vector3,
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
      );
    });

    curve.points[0].copy(j3.translation() as THREE.Vector3);
    curve.points[1].copy((j2 as RapierRigidBody & { lerped?: THREE.Vector3 }).lerped!);
    curve.points[2].copy((j1 as RapierRigidBody & { lerped?: THREE.Vector3 }).lerped!);
    curve.points[3].copy(fixed.translation() as THREE.Vector3);
    curve.curveType = 'chordal';

    const geometry = band.geometry as THREE.BufferGeometry & {
      setPoints?: (points: THREE.Vector3[]) => void;
    };
    geometry.setPoints?.(curve.getPoints(isMobile ? 16 : 32));

    ang.copy(card.angvel() as THREE.Vector3);
    const rotation = card.rotation();
    rot.set(rotation.x, rotation.y, rotation.z);
    card.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixedRef} {...segmentProps} type="fixed" />
        <RigidBody ref={j1Ref} position={[0.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2Ref} position={[1, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3Ref} position={[1.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={cardRef}
          position={[2, 0, 0]}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(event) => {
              event.stopPropagation();
              (event.target as { releasePointerCapture?: (pointerId: number) => void }).releasePointerCapture?.(
                event.pointerId,
              );
              setDragged(false);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              (event.target as { setPointerCapture?: (pointerId: number) => void }).setPointerCapture?.(
                event.pointerId,
              );
              const vec = vecRef.current;
              setDragged(new THREE.Vector3().copy(event.point).sub(vec.copy(cardRef.current!.translation() as THREE.Vector3)));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardArtwork}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.72}
                metalness={0.35}
                envMapIntensity={1.15}
                color="#ffffff"
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={bandRef}>
        {createElement('meshLineGeometry')}
        {createElement('meshLineMaterial', {
          color: 'white',
          depthTest: false,
          resolution: isMobile ? [1000, 2000] : [1000, 1000],
          useMap: true,
          map: texture,
          repeat: [-4, 1],
          lineWidth: 1,
        })}
      </mesh>
    </>
  );
}

function LoadedBand({ isMobile }: { isMobile: boolean }) {
  const { nodes, materials } = useGLTF('/card.glb') as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material & { map?: THREE.Texture }>;
  };
  const texture = useTexture('/lanyard.png');
  const cardArtwork = useTexture('/funtern-cosmic-glow.png');

  return <Band isMobile={isMobile} nodes={nodes} materials={materials} texture={texture} cardArtwork={cardArtwork} />;
}

export function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 5,
  transparent = true,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-full w-full overflow-visible">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        className="h-full w-full"
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        onPointerMissed={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <LoadedBand isMobile={isMobile} />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/card.glb');

export default Lanyard;

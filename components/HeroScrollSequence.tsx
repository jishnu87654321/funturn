'use client';

import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

import { useImageSequence } from '@/hooks/useImageSequence';
import { useRafScrubRenderer } from '@/hooks/useRafScrubRenderer';
import { useStickyScrollProgress } from '@/hooks/useStickyScrollProgress';

const FRAME_COUNT = 28;
const BACKGROUND = '#050505';
const SCRUB_HEIGHT_VH = 360;

function getFrameSrc(index: number) {
  return `/funtern-ren-28-curated/frame_${index.toString().padStart(2, '0')}.jpg`;
}

export function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const progressValue = useMotionValue(0);

  const { cacheRef, frameSources, loadedCount, isReady } = useImageSequence({
    frameCount: FRAME_COUNT,
    getFrameSrc,
    eagerCount: FRAME_COUNT,
  });

  const { targetProgressRef } = useStickyScrollProgress({ sectionRef });

  useRafScrubRenderer({
    canvasRef,
    cacheRef,
    frameCount: FRAME_COUNT,
    targetProgressRef,
    reducedMotion,
    progressValue,
    background: BACKGROUND,
    smoothing: 0.18,
  });

  const titleOpacity = useTransform(progressValue, [0, 0.06, 0.18, 0.24], [0, 1, 1, 0]);
  const titleY = useTransform(progressValue, [0, 0.24], [24, 0]);

  const shiftOpacity = useTransform(progressValue, [0.24, 0.32, 0.48, 0.56], [0, 1, 1, 0]);
  const shiftY = useTransform(progressValue, [0.24, 0.56], [20, 0]);

  const gatewayOpacity = useTransform(progressValue, [0.54, 0.64, 0.8, 0.88], [0, 1, 1, 0]);
  const gatewayY = useTransform(progressValue, [0.54, 0.88], [20, 0]);

  const ctaOpacity = useTransform(progressValue, [0.88, 0.95, 1], [0, 1, 1]);
  const ctaY = useTransform(progressValue, [0.88, 1], [20, 0]);

  const loadingPercentage = Math.round((loadedCount / FRAME_COUNT) * 100);
  const sectionStyle = useMemo(() => ({ height: `${SCRUB_HEIGHT_VH}vh` }), []);

  return (
    <section ref={sectionRef} className="relative bg-[#050505]" style={sectionStyle}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <div className="absolute inset-0">
          <Image
            src={frameSources[0]}
            alt="Funtern hero poster"
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {!reducedMotion ? (
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              isReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(88,129,255,0.16),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.58),rgba(5,5,5,0.1)_24%,rgba(5,5,5,0.2)_72%,rgba(5,5,5,0.64))]" />

        {!isReady && !reducedMotion ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]/72">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border border-white/15 border-t-white/70" />
              <div className="text-center">
                <p className="text-sm tracking-tight text-white/80">Loading hero sequence...</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-white/40">{loadingPercentage}% ready</p>
              </div>
            </div>
          </div>
        ) : null}

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[14vh] z-20 px-6 text-center md:top-[16vh]"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h1 className="mx-auto max-w-5xl text-3xl font-medium tracking-tight text-white/92 sm:text-5xl md:text-6xl lg:text-7xl">
            Boring Work Was Never The Dream.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-tight text-white/65 sm:text-base">
            Data entry. File admin. Repetition. Funtern starts where routine work should end.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-6 top-[18vh] z-20 max-w-xs md:left-12 md:top-[22vh] md:max-w-md"
          style={{ opacity: shiftOpacity, y: shiftY }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-white/92 sm:text-5xl md:text-6xl">
            Then The Signal Hits.
          </h2>
          <p className="mt-3 max-w-sm text-sm tracking-tight text-white/62 sm:text-base">
            A spark of skill-flow pulls learning out of the screen and into motion.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-5 top-[16vh] z-20 max-w-[250px] text-right md:right-10 md:top-[20vh] md:max-w-[360px]"
          style={{ opacity: gatewayOpacity, y: gatewayY }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-white/92 sm:text-5xl md:text-6xl">
            The Gateway Opens.
          </h2>
          <p className="mt-3 ml-auto max-w-sm text-sm tracking-tight text-white/62 sm:text-base">
            Workshops, bootcamps, and campus programs lock into one clear path forward.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[13vh] z-20 px-6 text-center"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <h2 className="text-4xl font-medium tracking-tight text-white/95 sm:text-6xl md:text-7xl">
            Turn Boring Into Fun.
          </h2>
          <p className="mt-3 text-sm tracking-tight text-white/62 sm:text-base">
            Scroll through the full sequence, then the page opens naturally below.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

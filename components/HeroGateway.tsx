'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useImagePreloader } from '@/hooks/useImagePreloader';

const FRAME_COUNT = 40;

export function HeroGateway() {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const frameSrc = useMemo(
    () => (index: number) => `/hero-gateway-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`,
    [],
  );
  const eagerFrames = useMemo(() => [0, FRAME_COUNT - 1], []);

  const { getFrame, isReady, loadedCount, loadedPercentage } = useImagePreloader({
    frameCount: FRAME_COUNT,
    getSrc: frameSrc,
    eagerFrames,
  });

  const { scrollY } = useScroll();
  const rawProgress = useMotionValue(0);

  const smoothProgress = useSpring(rawProgress, {
    stiffness: 34,
    damping: 24,
    mass: 1,
  });

  const heroRevealOpacity = useTransform(smoothProgress, [0, 0.04], [0, 1]);
  const shellGlow = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.03, 1.06]);
  const endPulseOpacity = useTransform(smoothProgress, [0.9, 1], [0, 0.28]);
  const endPulseScale = useTransform(smoothProgress, [0.9, 1], [0.92, 1.06]);

  const beatATitleOpacity = useTransform(smoothProgress, [0, 0.05, 0.12, 0.18], [0, 1, 1, 0]);
  const beatATitleY = useTransform(smoothProgress, [0, 0.18], [24, -16]);
  const beatATitleScale = useTransform(smoothProgress, [0, 0.16], [1.04, 0.94]);

  const beatBOpacity = useTransform(smoothProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const beatBY = useTransform(smoothProgress, [0.2, 0.55], [20, -20]);
  const beatBX = useTransform(smoothProgress, [0.2, 0.55], [-18, 0]);

  const beatCOpacity = useTransform(smoothProgress, [0.56, 0.66, 0.82, 0.88], [0, 1, 1, 0]);
  const beatCY = useTransform(smoothProgress, [0.56, 0.88], [20, -20]);
  const beatCX = useTransform(smoothProgress, [0.56, 0.82], [18, 0]);

  const beatDOpacity = useTransform(smoothProgress, [0.9, 0.96, 1], [0, 1, 1]);
  const beatDY = useTransform(smoothProgress, [0.9, 1], [28, 0]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);

    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const measureProgress = (scrollPosition: number) => {
      const element = containerRef.current;

      if (!element) {
        rawProgress.set(0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const scrollDistance = Math.max(1, element.offsetHeight - window.innerHeight);
      const nextProgress = (scrollPosition - absoluteTop) / scrollDistance;

      rawProgress.set(Math.max(0, Math.min(1, nextProgress)));
    };

    measureProgress(scrollY.get());

    const unsubscribeScroll = scrollY.on('change', (value) => {
      measureProgress(value);
    });

    const handleResize = () => {
      measureProgress(window.scrollY);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribeScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, [rawProgress, scrollY]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (value) => {
      progressRef.current = value;
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d', { alpha: true });

    if (!context) {
      return;
    }

    let rafId = 0;
    let lastFrameIndex = -1;
    let lastWidth = 0;
    let lastHeight = 0;

    const drawFrame = (progressValue: number) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);

      const frameIndex = Math.floor(progressValue * (FRAME_COUNT - 1));
      const frame = getFrame(frameIndex);

      if (!frame) {
        return;
      }

      const drawWidth = frame.naturalWidth || frame.width;
      const drawHeight = frame.naturalHeight || frame.height;
      const coverScale = Math.max(width / drawWidth, height / drawHeight);
      const luxuryScale = isMobile ? 0.96 : 0.86;
      const renderedWidth = drawWidth * coverScale * luxuryScale;
      const renderedHeight = drawHeight * coverScale * luxuryScale;

      const x = (width - renderedWidth) / 2;
      const y = (height - renderedHeight) / 2;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(frame, x, y, renderedWidth, renderedHeight);
    };

    const renderLoop = () => {
      const baseProgress = prefersReducedMotion ? 1 : progressRef.current;
      const progressValue = Math.max(0, Math.min(1, baseProgress));
      const rect = canvas.getBoundingClientRect();
      const nextFrameIndex = Math.floor(progressValue * (FRAME_COUNT - 1));
      const sizeChanged = rect.width !== lastWidth || rect.height !== lastHeight;

      if (nextFrameIndex !== lastFrameIndex || sizeChanged) {
        drawFrame(progressValue);
        lastFrameIndex = nextFrameIndex;
        lastWidth = rect.width;
        lastHeight = rect.height;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => cancelAnimationFrame(rafId);
  }, [getFrame, isMobile, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-[200vh] bg-[#050505]"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(178,130,255,0.14),transparent_32%),radial-gradient(circle_at_18%_18%,rgba(195,143,255,0.08),transparent_20%),radial-gradient(circle_at_82%_32%,rgba(144,101,234,0.1),transparent_22%)]" />
        <motion.div className="absolute inset-0 opacity-70" style={{ scale: shellGlow }}>
          <div className="absolute left-1/2 top-1/2 h-[40vw] w-[40vw] min-h-[300px] min-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(195,143,255,0.18),rgba(5,5,5,0)_68%)] blur-3xl" />
          <div className="absolute left-[12%] top-[18%] h-32 w-32 rounded-full bg-[#9f77ff]/10 blur-3xl" />
          <div className="absolute bottom-[16%] right-[10%] h-44 w-44 rounded-full bg-[#d188ff]/10 blur-3xl" />
        </motion.div>

        <motion.div className="absolute inset-0 z-20" style={{ opacity: heroRevealOpacity }}>
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative flex h-[94vw] w-[94vw] max-h-[920px] max-w-[920px] items-center justify-center md:h-[82vh] md:w-[82vh]">
              <motion.div
                className="absolute inset-[20%] rounded-full bg-[radial-gradient(circle,rgba(231,214,255,0.24),rgba(140,92,255,0.08),transparent_68%)] blur-3xl"
                style={{ opacity: endPulseOpacity, scale: endPulseScale }}
                animate={prefersReducedMotion ? undefined : { opacity: [0.14, 0.32, 0.14] }}
                transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-[8%] rounded-full border border-white/8"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: [0, 4, -3, 0], scale: [1, 1.02, 0.99, 1] }
                }
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-[12%] rounded-[38%] border border-[#ba9aff]/10 bg-[radial-gradient(circle_at_35%_30%,rgba(201,165,255,0.16),transparent_40%)]"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { rotate: [0, -6, 4, 0], y: [0, -10, 6, 0] }
                }
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              />
              <canvas
                ref={canvasRef}
                className="relative z-20 h-full w-full"
                aria-label="FUNTERN gateway assembly sequence"
              />
            </div>
          </div>

          <div className="relative z-30 h-full px-4 pb-8 pt-16 sm:px-8 lg:px-12">
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-[18vh] text-center"
              style={{ opacity: beatATitleOpacity, y: beatATitleY, scale: beatATitleScale }}
            >
              <h1
                className="text-[16vw] font-black uppercase tracking-[-0.08em] text-white md:text-[13vw]"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                FUNTERN
              </h1>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute left-4 top-[18vh] max-w-[28rem] sm:left-8 lg:left-12"
              style={{ opacity: beatBOpacity, y: beatBY, x: beatBX }}
            >
              <h2 className="text-4xl font-semibold uppercase tracking-[0.1em] text-white sm:text-6xl xl:text-7xl">
                TACTILE LEARNING
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
                The playfulness of clay. The power of a system.
              </p>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute right-4 top-[18vh] max-w-[28rem] text-right sm:right-8 lg:right-12"
              style={{ opacity: beatCOpacity, y: beatCY, x: beatCX }}
            >
              <h2 className="text-4xl font-semibold uppercase tracking-[0.1em] text-white sm:text-6xl xl:text-7xl">
                PRECISION ENGINE
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg">
                Internal architecture engineered for skill-flow.
              </p>
            </motion.div>

            <motion.div
              className="pointer-events-auto absolute inset-x-0 bottom-12 flex flex-col items-center justify-center gap-5"
              style={{ opacity: beatDOpacity, y: beatDY }}
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full border border-[#d6c2ff]/20 bg-[#f0e7ff] px-10 text-[14px] font-semibold uppercase tracking-[0.28em] text-black shadow-[0_20px_60px_rgba(219,186,255,0.22)] hover:bg-white"
              >
                <Link href="/apply">
                  UNLOCK THE GATEWAY
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="pointer-events-none absolute bottom-8 left-4 text-[11px] uppercase tracking-[0.34em] text-white/32 sm:left-8 lg:left-12">
              {loadedCount} / {FRAME_COUNT} frames cached
            </div>
          </div>
        </motion.div>

        <div className="sr-only" aria-hidden="true">
          <Image src={frameSrc(0)} alt="" width={1600} height={1600} priority />
          <Image src={frameSrc(FRAME_COUNT - 1)} alt="" width={1600} height={1600} priority />
        </div>

        {!isReady ? (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-[#050505]">
            <div className="flex min-w-[180px] flex-col items-center gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] px-8 py-6 backdrop-blur-xl">
              <div className="text-[11px] uppercase tracking-[0.48em] text-white/45">Loading Gateway</div>
              <div className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                {loadedPercentage}%
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

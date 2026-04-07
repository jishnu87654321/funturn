'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

const FRAME_COUNT = 224;
const BACKGROUND = '#050505';

function getFrameSrc(index: number) {
  return `/funtern-transition-4/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;
}

export function KeyboardScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCacheRef = useRef<(HTMLImageElement | null)[]>(Array.from({ length: FRAME_COUNT }, () => null));
  const progressRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollY } = useScroll();
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const sequenceProgress = useTransform(smoothProgress, (value) => Math.max(0, Math.min(1, value)));

  const titleOpacity = useTransform(smoothProgress, [0, 0.05, 0.14, 0.2], [0, 1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.2], [20, 0]);

  const precisionOpacity = useTransform(smoothProgress, [0.2, 0.28, 0.42, 0.5], [0, 1, 1, 0]);
  const precisionY = useTransform(smoothProgress, [0.2, 0.5], [20, 0]);

  const layersOpacity = useTransform(smoothProgress, [0.5, 0.6, 0.76, 0.84], [0, 1, 1, 0]);
  const layersY = useTransform(smoothProgress, [0.5, 0.82], [20, 0]);

  const ctaOpacity = useTransform(smoothProgress, [0.82, 0.92, 1], [0, 1, 1]);
  const ctaY = useTransform(smoothProgress, [0.82, 1], [20, 0]);

  const frameSrc = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => getFrameSrc(index)),
    [],
  );

  useEffect(() => {
    const updateProgress = (scrollTop: number) => {
      const element = sectionRef.current;

      if (!element) {
        rawProgress.set(0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const scrollableDistance = Math.max(1, element.offsetHeight - window.innerHeight);
      const next = (scrollTop - absoluteTop) / scrollableDistance;

      rawProgress.set(Math.max(0, Math.min(1, next)));
    };

    updateProgress(scrollY.get());

    const unsubscribeScroll = scrollY.on('change', updateProgress);
    const handleResize = () => updateProgress(window.scrollY);

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribeScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, [rawProgress, scrollY]);

  useEffect(() => {
    const unsubscribe = sequenceProgress.on('change', (value) => {
      progressRef.current = value;
    });

    return () => unsubscribe();
  }, [sequenceProgress]);

  useEffect(() => {
    let isMounted = true;

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = 'async';
        image.src = frameSrc[index];

        const markReady = () => {
          if (!isMounted) {
            resolve();
            return;
          }

          frameCacheRef.current[index] = image;
          setLoadedCount((current) => current + 1);
          resolve();
        };

        image.onload = () => {
          void image.decode?.().catch(() => undefined).finally(markReady);
        };
        image.onerror = () => resolve();
      });

    Promise.all(Array.from({ length: FRAME_COUNT }, (_, index) => loadFrame(index)));

    return () => {
      isMounted = false;
    };
  }, [frameSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

      const context = canvas.getContext('2d', { alpha: false, desynchronized: true });

    if (!context) {
      return;
    }

    let rafId = 0;
    let lastFrameIndex = -1;
    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = Math.max(1, Math.floor(rect.width));
      const cssHeight = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
        canvas.width = Math.floor(cssWidth * dpr);
        canvas.height = Math.floor(cssHeight * dpr);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      return { cssWidth, cssHeight };
    };

    const getBestAvailableFrame = (preferredIndex: number) => {
      if (frameCacheRef.current[preferredIndex]) {
        return frameCacheRef.current[preferredIndex];
      }

      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
        const backward = preferredIndex - offset;
        const forward = preferredIndex + offset;

        if (backward >= 0 && frameCacheRef.current[backward]) {
          return frameCacheRef.current[backward];
        }

        if (forward < FRAME_COUNT && frameCacheRef.current[forward]) {
          return frameCacheRef.current[forward];
        }
      }

      return null;
    };

    const drawFrame = (progress: number) => {
      const { cssWidth, cssHeight } = resizeCanvas();
      const frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1))));
      const frame = getBestAvailableFrame(frameIndex);

      if (!frame) {
        return false;
      }

      context.clearRect(0, 0, cssWidth, cssHeight);
      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, cssWidth, cssHeight);

      const imageWidth = frame.naturalWidth || frame.width;
      const imageHeight = frame.naturalHeight || frame.height;
      const coverScale = Math.max(cssWidth / imageWidth, cssHeight / imageHeight);
      const renderScale = window.innerWidth < 768 ? 1.02 : 1.01;
      const drawWidth = imageWidth * coverScale * renderScale;
      const drawHeight = imageHeight * coverScale * renderScale;
      const dx = (cssWidth - drawWidth) / 2;
      const dy = (cssHeight - drawHeight) / 2;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(frame, dx, dy, drawWidth, drawHeight);

      return true;
    };

    const renderLoop = () => {
      const progress = progressRef.current;
      const rect = canvas.getBoundingClientRect();
      const currentFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1))));
      const sizeChanged = rect.width !== lastWidth || rect.height !== lastHeight;

      if (currentFrame !== lastFrameIndex || sizeChanged) {
        const didDraw = drawFrame(progress);

        if (didDraw) {
          lastFrameIndex = currentFrame;
          lastWidth = rect.width;
          lastHeight = rect.height;
        }
      }

      rafId = window.requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const loadingPercentage = Math.round((loadedCount / FRAME_COUNT) * 100);
  const isReady = loadedCount >= FRAME_COUNT;

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <canvas ref={canvasRef} className="absolute inset-0 h-screen w-full" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(112,90,165,0.16),transparent_28%)]" />

        {!isReady ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border border-white/15 border-t-white/70" />
              <div className="text-center">
                <p className="text-sm tracking-tight text-white/80">Loading Funtern sequence...</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-white/40">{loadingPercentage}%</p>
              </div>
            </div>
          </div>
        ) : null}

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[11vh] z-20 px-6 text-center md:top-[13vh]"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h1 className="mx-auto max-w-5xl text-3xl font-medium tracking-tight text-white/90 sm:text-5xl md:text-6xl lg:text-7xl">
            The Learning Gateway.
          </h1>
          <p className="mt-3 text-sm tracking-tight text-white/65 sm:text-base">
            Playful learning begins to power up.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-6 top-[16vh] z-20 max-w-xs md:left-12 md:top-[22vh] md:max-w-md"
          style={{ opacity: precisionOpacity, y: precisionY }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-white/90 sm:text-5xl md:text-6xl">
            Skill-Flow Activates.
          </h2>
          <p className="mt-3 max-w-sm text-sm tracking-tight text-white/60 sm:text-base">
            Programs, rewards, and guidance come alive together.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-4 top-[14vh] z-20 max-w-[220px] text-right md:right-10 md:top-[20vh] md:max-w-[320px] lg:right-14 lg:max-w-[360px]"
          style={{ opacity: layersOpacity, y: layersY }}
        >
          <h2 className="text-3xl font-medium tracking-tight text-white/90 sm:text-5xl md:text-6xl">
            Pathways Connect.
          </h2>
          <p className="mt-3 ml-auto max-w-sm text-sm tracking-tight text-white/60 sm:text-base">
            Competitions, workshops, and bootcamps sync into one system.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[15vh] z-20 px-6 text-center"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <h2 className="text-4xl font-medium tracking-tight text-white/90 sm:text-6xl md:text-7xl">
            Funtern. Deployed.
          </h2>
          <p className="mt-3 text-sm tracking-tight text-white/60 sm:text-base">
            Scroll back to watch the gateway build again.
          </p>
        </motion.div>

        <div className="sr-only" aria-hidden="true">
          <Image src={frameSrc[0]} alt="" width={1920} height={1080} priority />
          <Image src={frameSrc[FRAME_COUNT - 1]} alt="" width={1920} height={1080} priority />
        </div>
      </div>
    </section>
  );
}

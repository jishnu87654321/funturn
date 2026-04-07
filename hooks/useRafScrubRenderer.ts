'use client';

import { MotionValue } from 'framer-motion';
import { MutableRefObject, useEffect } from 'react';

type UseRafScrubRendererOptions = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  cacheRef: MutableRefObject<(HTMLImageElement | null)[]>;
  frameCount: number;
  targetProgressRef: MutableRefObject<number>;
  reducedMotion: boolean | null;
  progressValue: MotionValue<number>;
  background?: string;
  smoothing?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useRafScrubRenderer({
  canvasRef,
  cacheRef,
  frameCount,
  targetProgressRef,
  reducedMotion,
  progressValue,
  background = '#050505',
  smoothing = 0.16,
}: UseRafScrubRendererOptions) {
  useEffect(() => {
    if (reducedMotion) {
      progressValue.set(1);
      return;
    }

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
    let currentProgress = progressValue.get();

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    const getNearestFrame = (preferredIndex: number) => {
      const exact = cacheRef.current[preferredIndex];
      if (exact) {
        return exact;
      }

      for (let offset = 1; offset < frameCount; offset += 1) {
        const backward = preferredIndex - offset;
        const forward = preferredIndex + offset;

        if (backward >= 0 && cacheRef.current[backward]) {
          return cacheRef.current[backward];
        }

        if (forward < frameCount && cacheRef.current[forward]) {
          return cacheRef.current[forward];
        }
      }

      return null;
    };

    const drawFrame = (frameIndex: number) => {
      const frame = getNearestFrame(frameIndex);

      if (!frame) {
        return false;
      }

      const { cssWidth, cssHeight } = resizeCanvas();
      const imageWidth = frame.naturalWidth || frame.width;
      const imageHeight = frame.naturalHeight || frame.height;
      const coverScale = Math.max(cssWidth / imageWidth, cssHeight / imageHeight);
      const drawWidth = imageWidth * coverScale;
      const drawHeight = imageHeight * coverScale;
      const dx = (cssWidth - drawWidth) / 2;
      const dy = (cssHeight - drawHeight) / 2;

      context.clearRect(0, 0, cssWidth, cssHeight);
      context.fillStyle = background;
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(frame, dx, dy, drawWidth, drawHeight);

      return true;
    };

    const render = () => {
      const targetProgress = clamp(targetProgressRef.current, 0, 1);
      const delta = targetProgress - currentProgress;

      if (Math.abs(delta) < 0.0005) {
        currentProgress = targetProgress;
      } else {
        currentProgress += delta * smoothing;
      }

      currentProgress = clamp(currentProgress, 0, 1);
      progressValue.set(currentProgress);

      const nextFrameIndex = Math.min(frameCount - 1, Math.floor(currentProgress * frameCount));
      const rect = canvas.getBoundingClientRect();
      const sizeChanged = rect.width !== lastWidth || rect.height !== lastHeight;

      if (nextFrameIndex !== lastFrameIndex || sizeChanged) {
        const didDraw = drawFrame(nextFrameIndex);

        if (didDraw) {
          lastFrameIndex = nextFrameIndex;
          lastWidth = rect.width;
          lastHeight = rect.height;
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [
    background,
    cacheRef,
    canvasRef,
    frameCount,
    progressValue,
    reducedMotion,
    smoothing,
    targetProgressRef,
  ]);
}

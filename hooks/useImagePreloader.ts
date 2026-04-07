'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type IdleHandle = number;

type UseImagePreloaderOptions = {
  frameCount: number;
  getSrc: (index: number) => string;
  eagerFrames?: number[];
};

type UseImagePreloaderResult = {
  getFrame: (index: number) => HTMLImageElement | null;
  loadedCount: number;
  loadedPercentage: number;
  isReady: boolean;
};

export function useImagePreloader({
  frameCount,
  getSrc,
  eagerFrames = [0, frameCount - 1],
}: UseImagePreloaderOptions): UseImagePreloaderResult {
  const cacheRef = useRef<(HTMLImageElement | null)[]>(Array.from({ length: frameCount }, () => null));
  const [loadedCount, setLoadedCount] = useState(0);
  const eagerKey = eagerFrames.join(',');

  const frameSources = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => getSrc(index)),
    [frameCount, getSrc],
  );

  useEffect(() => {
    let isMounted = true;
    const loaded = new Set<number>();
    const idleHandles: IdleHandle[] = [];
    const requestIdle = 'requestIdleCallback' in window
      ? (callback: IdleRequestCallback) => window.requestIdleCallback(callback)
      : (callback: IdleRequestCallback) =>
          window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 32);
    const cancelIdle = 'cancelIdleCallback' in window
      ? (handle: IdleHandle) => window.cancelIdleCallback(handle)
      : (handle: IdleHandle) => window.clearTimeout(handle);

    const markLoaded = (index: number, image: HTMLImageElement) => {
      cacheRef.current[index] = image;

      if (!loaded.has(index) && isMounted) {
        loaded.add(index);
        setLoadedCount(loaded.size);
      }
    };

    const loadFrame = (index: number) => {
      if (cacheRef.current[index]) {
        if (!loaded.has(index) && isMounted) {
          loaded.add(index);
          setLoadedCount(loaded.size);
        }

        return;
      }

      const image = new Image();
      image.decoding = 'async';
      image.src = frameSources[index];

      const finalize = () => markLoaded(index, image);

      image.onload = finalize;
      image.onerror = () => {
        if (!loaded.has(index) && isMounted) {
          loaded.add(index);
          setLoadedCount(loaded.size);
        }
      };

      void image.decode?.().then(finalize).catch(() => undefined);
    };

    eagerFrames.forEach((index) => {
      if (index >= 0 && index < frameCount) {
        loadFrame(index);
      }
    });

    const queue = Array.from({ length: frameCount }, (_, index) => index).filter(
      (index) => !eagerFrames.includes(index),
    );

    queue.forEach((index, order) => {
      const handle = requestIdle(() => {
        if (isMounted) {
          loadFrame(index);
        }
      });

      idleHandles.push(handle);

      if (order % 24 === 0) {
        idleHandles.push(
          window.setTimeout(() => {
            if (isMounted) {
              loadFrame(index);
            }
          }, 120 + order * 4),
        );
      }
    });

    return () => {
      isMounted = false;
      idleHandles.forEach((handle) => cancelIdle(handle));
    };
  }, [eagerFrames, eagerKey, frameCount, frameSources]);

  const getFrame = (index: number) => {
    const safeIndex = Math.min(frameCount - 1, Math.max(0, index));

    if (cacheRef.current[safeIndex]) {
      return cacheRef.current[safeIndex];
    }

    for (let offset = 1; offset < frameCount; offset += 1) {
      const backward = safeIndex - offset;
      const forward = safeIndex + offset;

      if (backward >= 0 && cacheRef.current[backward]) {
        return cacheRef.current[backward];
      }

      if (forward < frameCount && cacheRef.current[forward]) {
        return cacheRef.current[forward];
      }
    }

    return null;
  };

  return {
    getFrame,
    loadedCount,
    loadedPercentage: Math.round((loadedCount / frameCount) * 100),
    isReady: loadedCount >= frameCount,
  };
}

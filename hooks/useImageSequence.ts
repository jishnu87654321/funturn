'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type UseImageSequenceOptions = {
  frameCount: number;
  getFrameSrc: (index: number) => string;
  eagerCount?: number;
};

export function useImageSequence({
  frameCount,
  getFrameSrc,
  eagerCount = Math.min(24, frameCount),
}: UseImageSequenceOptions) {
  const cacheRef = useRef<(HTMLImageElement | null)[]>(Array.from({ length: frameCount }, () => null));
  const loadedSetRef = useRef<Set<number>>(new Set());
  const [loadedCount, setLoadedCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);

  const frameSources = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => getFrameSrc(index)),
    [frameCount, getFrameSrc],
  );

  useEffect(() => {
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let isMounted = true;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    cacheRef.current = Array.from({ length: frameCount }, () => null);
    loadedSetRef.current = new Set();
    setLoadedCount(0);
    setReadyCount(0);

    const updateCounts = (index: number) => {
      if (loadedSetRef.current.has(index)) {
        return;
      }

      loadedSetRef.current.add(index);
      setLoadedCount(loadedSetRef.current.size);

      let contiguous = 0;
      while (loadedSetRef.current.has(contiguous)) {
        contiguous += 1;
      }
      setReadyCount(contiguous);
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = 'async';
        image.src = frameSources[index];

        const markReady = () => {
          if (!isMounted) {
            resolve();
            return;
          }

          cacheRef.current[index] = image;
          updateCounts(index);
          resolve();
        };

        image.onload = () => {
          void image.decode?.().catch(() => undefined).finally(markReady);
        };
        image.onerror = () => resolve();
      });

    const eagerIndices = Array.from({ length: eagerCount }, (_, index) => index);
    const backgroundIndices = Array.from({ length: frameCount - eagerCount }, (_, offset) => offset + eagerCount);

    void Promise.all(eagerIndices.map(loadFrame)).then(() => {
      const loadBackground = async () => {
        for (const index of backgroundIndices) {
          // Keep memory/decode spikes lower by loading the tail sequentially after first paint.
          // This preserves smooth scrubbing without blocking the hero reveal.
          // eslint-disable-next-line no-await-in-loop
          await loadFrame(index);
        }
      };

      if (browserWindow.requestIdleCallback) {
        idleId = browserWindow.requestIdleCallback(() => {
          void loadBackground();
        }, { timeout: 1500 });
      } else {
        timeoutId = browserWindow.setTimeout(() => {
          void loadBackground();
        }, 300);
      }
    });

    return () => {
      isMounted = false;
      if (idleId !== null && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        browserWindow.clearTimeout(timeoutId);
      }
    };
  }, [eagerCount, frameCount, frameSources]);

  return {
    cacheRef,
    frameSources,
    frameCount,
    loadedCount,
    readyCount,
    isReady: readyCount >= Math.min(eagerCount, frameCount),
  };
}

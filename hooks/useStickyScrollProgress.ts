'use client';

import { MutableRefObject, useEffect, useRef } from 'react';

type UseStickyScrollProgressOptions = {
  sectionRef: MutableRefObject<HTMLElement | null>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useStickyScrollProgress({ sectionRef }: UseStickyScrollProgressOptions) {
  const targetProgressRef = useRef(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = sectionRef.current;

      if (!element) {
        targetProgressRef.current = 0;
        return;
      }

      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const viewportHeight = window.innerHeight || 1;
      const scrubDistance = Math.max(1, element.offsetHeight - viewportHeight);
      const nextProgress = (window.scrollY - absoluteTop) / scrubDistance;

      targetProgressRef.current = clamp(nextProgress, 0, 1);
    };

    updateProgress();

    let resizeFrame = 0;
    const handleScroll = () => updateProgress();
    const handleResize = () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
    };
  }, [sectionRef]);

  return { targetProgressRef };
}

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BackgroundField = dynamic(() => import('@/components/BackgroundField').then((mod) => mod.BackgroundField), {
  ssr: false,
});

function shouldUseStaticBackground() {
  if (typeof window === 'undefined') {
    return false;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const width = window.innerWidth;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const lowMemoryDevice = typeof memory === 'number' ? memory <= 4 : false;
  const lowCoreDevice = typeof cores === 'number' ? cores <= 4 : false;

  return reduced || width < 768 || lowMemoryDevice || lowCoreDevice;
}

export function DeferredBackgroundField() {
  const [mounted, setMounted] = useState(false);
  const [staticOnly, setStaticOnly] = useState(false);

  useEffect(() => {
    const staticBackground = shouldUseStaticBackground();
    setStaticOnly(staticBackground);

    if (staticBackground) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(178,152,220,0.12),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(178,152,220,0.06),transparent_18%),linear-gradient(180deg,#050505_0%,#050505_45%,#0a0812_100%)]" />
      {!staticOnly && mounted ? <BackgroundField /> : null}
    </>
  );
}

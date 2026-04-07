'use client';

import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/lib/animations';

const Lanyard = dynamic(() => import('./lanyard').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-[320px] w-[220px] rounded-[2rem] border border-white/10 bg-[#0b1020]/80 shadow-[0_18px_60px_rgba(0,0,0,0.35)]" />
    </div>
  ),
});

export function AccessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldMountLanyard = useInView(sectionRef, { once: true, margin: '240px' });

  return (
    <section ref={sectionRef} className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#1a2332] shadow-2xl md:flex-row">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[80%] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[120px]" />

        <motion.div
          className="relative z-10 w-full p-8 text-left sm:p-12 md:w-[54%] md:p-16"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Your one pass to{' '}
            <br className="hidden md:block" />
            <span className="text-[#c4aef0]">fun, real learning</span>
          </h2>
          <p className="mb-8 max-w-md text-lg font-light leading-relaxed text-gray-300/90">
            Join bootcamps, workshops, camps, and competitions that are actually fun. Build your skills, earn
            recognition, and grow - all with one free Funtern profile.
          </p>
          <a
            href="#opportunities"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#1a2332] transition-colors hover:bg-gray-100"
          >
            Explore Opportunities
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.div
          className="relative z-10 flex h-[430px] w-full items-end justify-center self-stretch px-6 pb-6 pt-2 sm:h-[500px] sm:px-10 md:h-[620px] md:w-[46%] md:px-8 md:pb-8 md:pt-0"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="pointer-events-none absolute inset-x-[14%] top-0 h-32 rounded-full bg-[radial-gradient(circle,rgba(163,116,255,0.24),rgba(163,116,255,0)_72%)] blur-2xl" />
          <div className="relative h-full w-full max-w-[430px] pointer-events-auto">
            {shouldMountLanyard ? (
              <Lanyard position={[0, 0, 17]} gravity={[0, -40, 0]} fov={18} />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-[320px] w-[220px] rounded-[2rem] border border-white/10 bg-[#0b1020]/80 shadow-[0_18px_60px_rgba(0,0,0,0.35)]" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

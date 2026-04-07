'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Splash3D } from './splash-3d';
import Galaxy from './galaxy';
import { slideInLeft, slideInRight } from '@/lib/animations';

export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 pt-12 pb-16 sm:px-8 md:flex-row md:pt-20 lg:px-16">
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1.2}
        glowIntensity={0.4}
        hueShift={270}
        saturation={30}
        twinkleIntensity={0.4}
        rotationSpeed={0.05}
        repulsionStrength={2.5}
      />

      <motion.div
        className="relative z-10 mb-12 w-full text-left pointer-events-none md:mb-0 md:w-1/2"
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-900/30 px-3 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-sm pointer-events-auto">
          <span className="text-base">🚀</span>
          <span>Internships made fun &amp; interactive</span>
        </div>

        <h1 className="mb-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Learn. Upskill. <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Grow with Fun.
          </span>
        </h1>

        <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300 sm:text-xl">
          Funtern brings together bootcamps, workshops, competitions, summer camps, and real hands-on opportunities
          to help students upskill in a fun and engaging way.
        </p>

        <div className="flex flex-wrap gap-4 pointer-events-auto">
          <a
            href="#opportunities"
            className="transform rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-700/40 transition-all hover:scale-105 hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-500/50"
          >
            Explore Opportunities 🎯
          </a>
          <Link
            href="/apply"
            className="rounded-xl border border-purple-500/50 px-7 py-3.5 text-sm font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-900/30 hover:text-white"
          >
            Apply Now →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
          {[
            { emoji: '👩‍🎓', label: '50k+ Students' },
            { emoji: '🎪', label: '11 Program Types' },
            { emoji: '⚡', label: 'Free to Join' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 flex h-[420px] w-full justify-center overflow-visible pointer-events-none md:h-[700px] md:w-1/2 md:justify-end lg:h-[800px]"
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        <Splash3D />
      </motion.div>
    </section>
  );
}

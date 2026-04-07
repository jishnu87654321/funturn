'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

export function ApplySection() {
  return (
    <section id="apply" className="relative z-10 px-4 py-20 sm:py-28">
      <motion.div
        className="mx-auto max-w-4xl text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={fadeUp} className="mb-5 inline-block text-5xl">
          🎉
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mb-5 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Ready to Make Your{' '}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Learning Fun?
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Join thousands of students who are learning, upskilling, and growing through fun programs on Funtern.
          It is completely free to get started.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col justify-center gap-4 sm:flex-row">
          <motion.a
            href="#opportunities"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-700/40 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-500/50"
          >
            Explore All Programs 🎯
          </motion.a>
          <Link
            href="/apply"
            className="rounded-xl border border-purple-500/50 px-8 py-4 text-base font-bold text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-900/30 hover:text-white"
          >
            Apply Now →
          </Link>
        </motion.div>
        <motion.p variants={fadeUp} className="mt-6 text-sm text-gray-500">
          No fees. No experience needed. Just bring your curiosity. 🌟
        </motion.p>
      </motion.div>
    </section>
  );
}

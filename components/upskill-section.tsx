'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, slideInLeft } from '@/lib/animations';

const benefits = [
  { emoji: '🛠️', label: 'Hands-On Experience' },
  { emoji: '📜', label: 'Certificates' },
  { emoji: '🧠', label: 'Skill Building' },
  { emoji: '🌐', label: 'Industry Exposure' },
  { emoji: '👥', label: 'Network & Community' },
  { emoji: '💰', label: 'Paid Opportunities' },
  { emoji: '🏆', label: 'Recognition & Rewards' },
  { emoji: '📈', label: 'Career Readiness' },
];

export function UpskillSection() {
  return (
    <section id="upskill" className="relative z-10 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-purple-700/30 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 px-6 py-14 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
            <motion.div
              className="w-full lg:w-1/2"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-900/30 px-3 py-1.5 text-xs font-semibold text-purple-300">
                <span>📚</span>
                <span>Why Upskill with Funtern?</span>
              </div>
              <h2 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
                Everything you gain from
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {' '}one Funtern experience
                </span>
              </h2>
              <p className="mb-8 text-base leading-relaxed text-gray-400">
                Funtern programs are packed with real learning moments. Whether you join a bootcamp, competition, or
                workshop, you come out with skills, confidence, and a story worth telling.
              </p>
              <Link
                href="/apply"
                className="inline-flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-purple-700/40 transition-all hover:scale-105 hover:from-violet-500 hover:to-purple-500"
              >
                Start Learning <span>🚀</span>
              </Link>
            </motion.div>

            <motion.div
              className="w-full lg:w-1/2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {benefits.map((benefit) => (
                  <motion.div
                    key={benefit.label}
                    variants={fadeUp}
                    whileHover={{ scale: 1.06 }}
                    className="cursor-default rounded-2xl border border-purple-700/40 bg-purple-900/20 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-purple-500/60 hover:bg-purple-900/40"
                  >
                    <span className="mr-2 text-lg">{benefit.emoji}</span>
                    {benefit.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

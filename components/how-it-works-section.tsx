'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const steps = [
  {
    step: '01',
    icon: '👤',
    title: 'Create Your Profile',
    description:
      'Sign up for free and set up your student profile in minutes. Tell us your interests, skills, and goals.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    step: '02',
    icon: '🔍',
    title: 'Explore Programs',
    description:
      'Browse bootcamps, workshops, competitions, summer camps, and more — all designed to be fun and skill-building.',
    color: 'from-fuchsia-500 to-pink-500',
  },
  {
    step: '03',
    icon: '✋',
    title: 'Apply & Join',
    description:
      'Apply to the programs that interest you. Most are free or student-friendly. Get in, get learning!',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    step: '04',
    icon: '🚀',
    title: 'Learn, Grow & Shine',
    description:
      'Participate, build skills, earn certificates, and emerge as a stronger, more capable version of yourself.',
    color: 'from-emerald-500 to-teal-500',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-900/30 text-purple-300 text-xs font-semibold mb-5">
            <span>📋</span><span>How It Works</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Start Your Journey in{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Getting started with Funtern is quick, easy, and completely
            beginner-friendly.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-emerald-500/30 z-0" />

          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              className="relative z-10 flex flex-col items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                {s.icon}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">
                Step {s.step}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

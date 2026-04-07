'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const reasons = [
  {
    icon: '🎮',
    title: 'Fun-First Learning',
    description:
      'We believe learning should never be boring. Every program is designed to be engaging, interactive, and actually enjoyable.',
  },
  {
    icon: '⚡',
    title: 'Real Skills, Fast',
    description:
      'No fluff. Our bootcamps, workshops, and competitions are built to give you tangible, job-ready skills quickly.',
  },
  {
    icon: '🤝',
    title: 'Community-Driven',
    description:
      'Surround yourself with ambitious students, mentors, and collaborators who push each other to grow.',
  },
  {
    icon: '🌱',
    title: 'Opportunities for Everyone',
    description:
      'Whether you want to lead, learn, teach, or compete — there is a Funtern opportunity that matches exactly where you are.',
  },
  {
    icon: '🏅',
    title: 'Recognition & Growth',
    description:
      'Earn certificates, build your portfolio, and get recognized — all within a platform that values your progress.',
  },
  {
    icon: '🆓',
    title: 'Free to Get Started',
    description:
      'Most programs are free or highly accessible. Funtern is built for students, not corporations.',
  },
];

export function WhyFunternSection() {
  return (
    <section id="why-funtern" className="relative z-10 py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-900/30 text-purple-300 text-xs font-semibold mb-5">
            <span>💡</span><span>Why Funtern?</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Not Your Average{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Internship Portal
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Funtern is built to make learning more engaging, active, and enjoyable. From boot campuses and workshops
            to competitions, talks, tutoring, club building, content creation, and Blossom activities for small kids,
            every experience is designed to help people explore, learn, and grow in a more interactive way.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {reasons.map((r, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="group p-6 rounded-2xl border border-purple-700/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 hover:from-purple-900/40 hover:to-indigo-900/20 transition-all duration-300 backdrop-blur-sm hover:border-purple-600/50"
            >
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-purple-200 transition-colors">
                {r.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'CS Student, IIT Delhi',
    comment:
      'Funtern\'s bootcamp got me my first internship offer in 6 weeks. The learning is actually fun — not the usual boring stuff. 100% recommend!',
    avatarUrl: 'https://i.pravatar.cc/80?u=priya-sharma',
    tag: '🎓 Bootcamp Graduate',
  },
  {
    name: 'Arjun Mehta',
    role: 'Campus Co-ordinator, Mumbai University',
    comment:
      'Being a campus co-ordinator shaped my leadership skills massively. I now manage a team of 30 students and it\'s been incredible for my résumé.',
    avatarUrl: 'https://i.pravatar.cc/80?u=arjun-mehta',
    tag: '🏛️ Campus Lead',
  },
  {
    name: 'Sara Al-Hassan',
    role: 'Product Design Intern',
    comment:
      'The design workshop blew my mind. Real industry feedback, live projects — not just slide decks. I landed a paid internship right after.',
    avatarUrl: 'https://i.pravatar.cc/80?u=sara-alhassan',
    tag: '🛠️ Workshop Alum',
  },
  {
    name: 'Rohan Verma',
    role: 'Hackathon Winner, Funtern Competitions',
    comment:
      'Won my first competition through Funtern and got noticed by three startups. The exposure is unreal for someone just starting out.',
    avatarUrl: 'https://i.pravatar.cc/80?u=rohan-verma',
    tag: '🏆 Competition Winner',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative z-10 py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-900/30 text-purple-300 text-xs font-semibold mb-5">
            <span>❤️</span><span>Student Stories</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Real Students,{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Real Results
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Thousands of students have upskilled, connected, and grown through
            Funtern programs. Here are some of their stories.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative group p-6 sm:p-7 rounded-2xl border border-purple-700/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 hover:border-purple-500/50 hover:from-purple-900/35 transition-all duration-300 backdrop-blur-sm overflow-hidden"
            >
              {/* Large quote mark */}
              <span className="absolute top-4 right-5 text-6xl text-purple-700/20 font-serif leading-none select-none">
                "
              </span>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/40"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-purple-300 text-xs">{t.role}</p>
                </div>
                <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/40 whitespace-nowrap">
                  {t.tag}
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed italic">
                &ldquo;{t.comment}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

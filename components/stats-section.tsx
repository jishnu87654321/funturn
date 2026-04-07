'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  emoji: string;
  sublabel: string;
}

const stats: Stat[] = [
  { emoji: '👩‍🎓', label: 'Active Students', value: 50000, suffix: '+', sublabel: 'and growing every week' },
  { emoji: '🎪', label: 'Program Types', value: 11, suffix: '', sublabel: 'from bootcamps to clubs' },
  { emoji: '🏆', label: 'Success Rate', value: 94, suffix: '%', sublabel: 'of students upskill fast' },
  { emoji: '⚡', label: 'Free Programs', value: 80, suffix: '%', sublabel: 'accessible to all students' },
];

function CountUpNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasStarted = useRef(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          intervalRef.current = setInterval(() => {
            setCount((prev) => {
              const increment = Math.ceil(target / 50);
              const next = Math.min(prev + increment, target);
              if (next >= target) clearInterval(intervalRef.current);
              return next;
            });
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [target]);

  return (
    <div
      ref={nodeRef}
      className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text mb-1"
    >
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative z-10 py-14 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="group p-6 sm:p-8 rounded-2xl border border-purple-700/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/10 hover:from-purple-900/40 hover:to-indigo-900/20 transition-all duration-300 backdrop-blur-sm hover:border-purple-600/50 hover:scale-[1.02]"
            >
              <div className="text-2xl mb-3">{stat.emoji}</div>
              <CountUpNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-gray-500 text-xs">{stat.sublabel}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

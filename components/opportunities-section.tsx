'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ElectricBorder from '@/components/ElectricBorder';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';

type Filter = 'All' | 'Learning' | 'Leadership' | 'Creative' | 'Kids';

type Offering = {
  title: string;
  description: string;
  tag: string;
  filter: Filter;
  electricColor: string;
  accent: string;
  border: string;
  badge: string;
  spotlight: string;
  visual: string;
  imageSrc: string;
  imageFit?: 'contain' | 'cover';
  imagePosition?: string;
};

const filters: Filter[] = ['All', 'Learning', 'Leadership', 'Creative', 'Kids'];

const offerings: Offering[] = [
  {
    title: 'Boot Campus',
    description:
      'Join an intensive learning environment designed to help you explore, practice, and grow faster with guided activities and real exposure.',
    tag: 'SKILL BUILD',
    filter: 'Learning',
    electricColor: '#9b8cff',
    accent: 'from-violet-600/25 via-purple-600/12 to-fuchsia-500/5',
    border: 'border-violet-400/25',
    badge: 'bg-violet-500/15 text-violet-200',
    spotlight: 'rgba(167, 139, 250, 0.24)',
    visual: 'boot-campus',
    imageSrc: '/opportunities/boot-campus.png',
    imageFit: 'cover',
    imagePosition: 'center',
  },
  {
    title: 'Summer Campus',
    description:
      'Spend your summer exploring workshops, team activities, and guided learning experiences that help you grow in a more exciting way.',
    tag: 'SUMMER FUN',
    filter: 'Learning',
    electricColor: '#ffb347',
    accent: 'from-amber-500/22 via-orange-500/10 to-yellow-500/5',
    border: 'border-amber-400/25',
    badge: 'bg-amber-500/15 text-amber-100',
    spotlight: 'rgba(251, 191, 36, 0.22)',
    visual: 'summer-campus',
    imageSrc: '/opportunities/summer-campus.png',
    imageFit: 'cover',
    imagePosition: 'center',
  },
  {
    title: 'Competitions',
    description:
      'Participate in engaging contests and performance-based activities that build confidence, sharpen thinking, and reward effort.',
    tag: 'WIN & GROW',
    filter: 'Learning',
    electricColor: '#ffe066',
    accent: 'from-yellow-400/20 via-amber-500/10 to-orange-500/5',
    border: 'border-yellow-300/22',
    badge: 'bg-yellow-400/15 text-yellow-100',
    spotlight: 'rgba(250, 204, 21, 0.22)',
    visual: 'competitions',
    imageSrc: '/opportunities/competitions.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Workshops',
    description:
      'Explore practical, interactive workshops where you can build skills, ask questions, and gain experience through action.',
    tag: 'HANDS-ON',
    filter: 'Learning',
    electricColor: '#52f7d4',
    accent: 'from-emerald-500/22 via-teal-500/10 to-cyan-500/5',
    border: 'border-emerald-400/22',
    badge: 'bg-emerald-500/15 text-emerald-100',
    spotlight: 'rgba(52, 211, 153, 0.2)',
    visual: 'workshops',
    imageSrc: '/opportunities/workshops.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Talks',
    description:
      'Listen to engaging talks from mentors, speakers, and professionals who can help you think bigger and learn smarter.',
    tag: 'IDEAS & INSIGHT',
    filter: 'Learning',
    electricColor: '#ff7de9',
    accent: 'from-fuchsia-500/22 via-pink-500/10 to-rose-500/5',
    border: 'border-fuchsia-400/22',
    badge: 'bg-fuchsia-500/15 text-fuchsia-100',
    spotlight: 'rgba(232, 121, 249, 0.22)',
    visual: 'talks',
    imageSrc: '/opportunities/talks.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Induction',
    description:
      'Get comfortably introduced to the platform, activities, and growth journey so you know where to begin and how to move forward.',
    tag: 'GET STARTED',
    filter: 'Learning',
    electricColor: '#7df9ff',
    accent: 'from-cyan-500/22 via-sky-500/10 to-blue-500/5',
    border: 'border-cyan-400/22',
    badge: 'bg-cyan-500/15 text-cyan-100',
    spotlight: 'rgba(34, 211, 238, 0.22)',
    visual: 'induction',
    imageSrc: '/opportunities/induction.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Campus Coordinator',
    description:
      'Take on a leadership role where you help organize, promote, and manage activities while building confidence and communication skills.',
    tag: 'LEAD & ORGANIZE',
    filter: 'Leadership',
    electricColor: '#b88cff',
    accent: 'from-purple-500/24 via-violet-500/12 to-indigo-500/5',
    border: 'border-purple-400/24',
    badge: 'bg-purple-500/15 text-purple-100',
    spotlight: 'rgba(168, 85, 247, 0.22)',
    visual: 'campus-coordinator',
    imageSrc: '/opportunities/campus-coordinator.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Tutors',
    description:
      'Become a learning mentor who helps peers grow, shares knowledge, and develops communication, leadership, and teaching skills.',
    tag: 'TEACH & GUIDE',
    filter: 'Leadership',
    electricColor: '#59f1cf',
    accent: 'from-teal-500/22 via-emerald-500/10 to-lime-500/5',
    border: 'border-teal-400/22',
    badge: 'bg-teal-500/15 text-teal-100',
    spotlight: 'rgba(45, 212, 191, 0.22)',
    visual: 'tutors',
    imageSrc: '/opportunities/tutors.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Club Building',
    description:
      'Start or strengthen clubs and group activities that bring people together around learning, creativity, teamwork, and leadership.',
    tag: 'COMMUNITY',
    filter: 'Leadership',
    electricColor: '#8ba1ff',
    accent: 'from-indigo-500/22 via-violet-500/10 to-purple-500/5',
    border: 'border-indigo-400/24',
    badge: 'bg-indigo-500/15 text-indigo-100',
    spotlight: 'rgba(129, 140, 248, 0.22)',
    visual: 'club-building',
    imageSrc: '/opportunities/club-building.png',
    imageFit: 'cover',
    imagePosition: 'center top',
  },
  {
    title: 'Content Creation',
    description:
      'Work on videos, posts, stories, and creative materials that showcase activities, opportunities, and student journeys in a fun way.',
    tag: 'CREATE & SHARE',
    filter: 'Creative',
    electricColor: '#ff8cc7',
    accent: 'from-pink-500/22 via-rose-500/10 to-orange-500/5',
    border: 'border-pink-400/24',
    badge: 'bg-pink-500/15 text-pink-100',
    spotlight: 'rgba(244, 114, 182, 0.22)',
    visual: 'content-creation',
    imageSrc: '/opportunities/content-creation.png',
    imageFit: 'cover',
    imagePosition: 'center',
  },
  {
    title: 'Blossom',
    description:
      'A playful learning space for young children filled with engaging activities, creativity, movement, and joyful skill-building experiences.',
    tag: 'KIDS FUN',
    filter: 'Kids',
    electricColor: '#ffb66b',
    accent: 'from-orange-400/24 via-pink-400/12 to-yellow-300/8',
    border: 'border-orange-300/25',
    badge: 'bg-orange-300/20 text-orange-50',
    spotlight: 'rgba(251, 146, 60, 0.24)',
    visual: 'blossom',
    imageSrc: '/opportunities/blossom.png',
    imageFit: 'cover',
    imagePosition: 'center',
  },
];

function OpportunityVisual({ item }: { item: Offering }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={cn(
          'transition-transform duration-500 group-hover:scale-[1.02]',
          item.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover',
        )}
        style={{ objectPosition: item.imagePosition ?? 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${item.spotlight.replace(/0\.\d+\)/, '0.15)')}, transparent 52%)`,
        }}
      />
    </div>
  );
}

function OpportunityCard({ item }: { item: Offering }) {
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rotateX = (0.5 - py) * 7;
    const rotateY = (px - 0.5) * 8;

    event.currentTarget.style.setProperty('--mx', `${x}px`);
    event.currentTarget.style.setProperty('--my', `${y}px`);
    event.currentTarget.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    event.currentTarget.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
  };

  const resetMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--mx', '50%');
    event.currentTarget.style.setProperty('--my', '50%');
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.32 } }}
      exit={{ opacity: 0, scale: 0.92, y: 14, transition: { duration: 0.18 } }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMove}
      onMouseLeave={resetMove}
      className={cn(
        'group relative h-full min-h-[430px] cursor-pointer rounded-[1.7rem] transition-all duration-300',
      )}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
          '--rx': '0deg',
          '--ry': '0deg',
          transform: 'perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry))',
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(240px circle at var(--mx) var(--my), ${item.spotlight}, transparent 58%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] opacity-0 shadow-[0_28px_80px_rgba(8,15,30,0.45)] transition-opacity duration-300 group-hover:opacity-100" />

      <ElectricBorder
        color={item.electricColor}
        speed={0.9}
        chaos={0.09}
        thickness={2}
        borderRadius={28}
        className={cn(
          'relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[1.7rem] border bg-gradient-to-br p-5 backdrop-blur-sm',
          item.accent,
          item.border,
        )}
      >
        <div className="pointer-events-none absolute inset-[1px] rounded-[1.55rem] border border-white/5" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-5">
            <OpportunityVisual item={item} />
          </div>

          <div className="flex min-h-[10rem] flex-1 flex-col">
            <h3 className="mb-2 text-lg font-bold tracking-tight text-white">{item.title}</h3>
            <p className="max-w-[28ch] text-sm leading-6 text-gray-300/90">{item.description}</p>
          </div>
        </div>
      </ElectricBorder>
    </motion.div>
  );
}

export function OpportunitiesSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filtered = activeFilter === 'All' ? offerings : offerings.filter((item) => item.filter === activeFilter);

  return (
    <section id="opportunities" className="relative z-10 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-10 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-900/30 px-3 py-1.5 text-xs font-semibold text-purple-300"
          >
            <span>What We Offer</span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Opportunities Built for{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Every Kind of Learner
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-base text-gray-400 sm:text-lg">
            Funtern brings learning to life through interactive opportunities like boot campuses, workshops,
            competitions, talks, tutoring, leadership roles, content creation, and fun activities for kids through
            Blossom.
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200',
                activeFilter === filter
                  ? 'border-transparent bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-700/30'
                  : 'border-purple-700/40 bg-transparent text-gray-400 hover:border-purple-500/60 hover:text-white',
              )}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <OpportunityCard key={item.title} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

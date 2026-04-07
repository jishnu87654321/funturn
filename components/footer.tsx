'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

const navLinks = [
  { label: 'Programs', href: '/#opportunities' },
  { label: 'Why Funtern', href: '/#why-funtern' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Apply', href: '/apply' },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-purple-900/20 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 md:items-start">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="/funtern-logo.png"
                  alt="Funtern Logo"
                  className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110"
                />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-fuchsia-400 opacity-0 blur-[2px] transition-opacity group-hover:opacity-100" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Fun<span className="text-purple-400">tern</span>
              </span>
            </Link>
            <p className="max-w-[200px] text-center text-xs leading-relaxed text-gray-500 md:text-left">
              Making internships fun, engaging, and interactive. Not conventional.
            </p>
          </motion.div>

          <motion.nav variants={fadeUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 rounded-full bg-purple-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </motion.nav>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-purple-900/10 pt-6 text-xs text-gray-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Funtern. All rights reserved.</p>
          <p>Made with ♥ for students everywhere 🌍</p>
        </div>
      </div>
    </footer>
  );
}

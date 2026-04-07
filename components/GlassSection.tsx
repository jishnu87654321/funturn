'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type GlassSectionProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
  className?: string;
};

export function GlassSection({
  eyebrow,
  title,
  body,
  align = 'left',
  children,
  className = '',
}: GlassSectionProps) {
  const alignClass =
    align === 'center' ? 'mx-auto text-center items-center' : align === 'right' ? 'ml-auto text-right items-end' : 'mr-auto text-left items-start';

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 110, damping: 18 }}
      className={`flex w-full ${alignClass} ${className}`}
    >
      <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-10 md:p-12">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.32em] text-white/40">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-4xl font-medium tracking-tight text-white/90 sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {body ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            {body}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </motion.section>
  );
}

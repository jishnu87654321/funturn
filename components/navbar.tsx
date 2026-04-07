'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Programs', href: '/#opportunities' },
    { label: 'About', href: '/#why-funtern' },
    { label: 'Apply', href: '/apply' },
  ];

  return (
    <nav className="relative z-40 flex items-center justify-between border-b border-purple-900/20 bg-slate-950/60 px-4 py-4 backdrop-blur-md sm:px-6 md:px-10 md:py-5">
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src="/funtern-logo.png"
          alt="Funtern Logo"
          className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110"
        />
        <span className="text-xl font-extrabold tracking-tight text-white">
          Fun<span className="text-purple-400">tern</span>
        </span>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="group relative text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            {link.label}
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 rounded-full bg-purple-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/apply"
          className="transform rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-700/30 transition hover:scale-105 hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-600/40"
        >
          Get Started
        </Link>
        <button
          className="p-1 text-gray-300 transition hover:text-white md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div className="absolute top-full right-0 left-0 z-50 flex flex-col gap-4 border-b border-purple-900/20 bg-slate-950/95 px-6 py-4 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-medium text-gray-300 transition-colors hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Get Started →
          </Link>
        </div>
      ) : null}
    </nav>
  );
}

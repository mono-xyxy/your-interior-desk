'use client';

import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative z-10 pt-8 pb-4 px-4 text-center max-w-3xl mx-auto">
      {/* Official Brand Logo Emblem */}
      <div className="flex justify-center mb-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#E2E8F0] to-[#C5A059] shadow-2xl shadow-[#1C2A44]/50 hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-[#16233B]">
            <Image
              src="/logo.jpeg"
              alt="Your Interior Desk Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F6F0] tracking-tight leading-snug">
        Your Interior Desk
      </h1>

      <p className="text-xs sm:text-sm text-[#8E9EAF] max-w-lg mx-auto mt-2 font-normal leading-relaxed">
        India&apos;s Premier Interior Design Community & Matchmaking Intake Portal
      </p>

      {/* Slogan Pill */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-5 text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#C5A059] font-medium flex-wrap">
        <span>PROPORTION</span>
        <span className="text-[#D4AF37]/50">•</span>
        <span>LIGHTING</span>
        <span className="text-[#D4AF37]/50">•</span>
        <span>MATERIAL CONSISTENCY</span>
      </div>
    </header>
  );
}

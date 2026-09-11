'use client';

import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative z-10 pt-10 pb-4 px-4 text-center max-w-3xl mx-auto">
      {/* Official Circular Logo Emblem (Cropped) */}
      <div className="flex justify-center mb-5">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#E2E8F0] via-[#94A3B8] to-[#CBD5E1] shadow-2xl shadow-[#0B1422]/80 hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-[#16233B]">
            <Image
              src="/logo_cropped.png"
              alt="Your Interior Desk Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight leading-snug">
        Your Interior Desk
      </h1>
    </header>
  );
}

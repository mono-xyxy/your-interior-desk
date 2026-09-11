'use client';

import React from 'react';
import { Sparkles, Database, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  submissionsCount: number;
}

export default function Header({ onOpenAdmin, submissionsCount }: HeaderProps) {
  return (
    <header className="relative z-10 pt-10 pb-6 px-4 text-center max-w-5xl mx-auto">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-[1px] shadow-lg shadow-[#D4AF37]/20">
            <div className="w-full h-full bg-[#070D18] flex items-center justify-center">
              <span className="font-serif-luxury text-lg font-bold text-[#D4AF37]">YID</span>
            </div>
          </div>
          <div className="text-left">
            <span className="font-serif-luxury text-xl font-bold tracking-wider text-gold-gradient block">
              YOUR INTERIOR DESK
            </span>
            <span className="text-[10px] tracking-widest text-[#8E9EAF] uppercase block">
              India&apos;s Elite Designer Network
            </span>
          </div>
        </div>

        {/* Database Status & Download Button */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1726] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs text-[#F8F6F0] transition-all group"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-medium">Excel Database</span>
          <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded text-[11px] font-bold">
            {submissionsCount}
          </span>
        </button>
      </div>

      {/* Main Quote Title Inspired by Uploaded Images */}
      <div className="space-y-4 my-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C5A059] font-medium">
          A ROOM CAN LOOK
        </p>

        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-normal tracking-wider text-[#F8F6F0] leading-tight">
          EXPENSIVE
        </h1>

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8E9EAF] font-light max-w-xl mx-auto">
          EVEN WHEN THE FURNITURE ISN&apos;T EXPENSIVE
        </p>
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-3 my-6 opacity-70">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      {/* Subtext Pills */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#C5A059] font-medium">
        <span>— PROPORTION —</span>
        <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 hidden sm:inline-block" />
        <span>LIGHTING</span>
        <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 hidden sm:inline-block" />
        <span>MATERIAL CONSISTENCY</span>
      </div>
    </header>
  );
}

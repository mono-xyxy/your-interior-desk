'use client';

import React from 'react';
import Image from 'next/image';

interface HeroProps {
  onSelectRole: (role: 'client' | 'designer') => void;
}

export default function HeroSection({ onSelectRole }: HeroProps) {
  const scrollToInquire = (role: 'client' | 'designer') => {
    onSelectRole(role);
    const element = document.getElementById('inquire');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden text-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101B2E]/90 border border-[#E2E8F0]/20 shadow-lg shadow-black/40 mb-8 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Private Matchmaking Desk &bull; 3% Commission &bull; Hand-Curated Network
          </span>
        </div>

        {/* Hero Logo Emblem Centerpiece */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#F8FAFC] via-[#94A3B8] to-[#CBD5E1] shadow-2xl shadow-[#0B1320] hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-[#101B2E]">
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

        {/* Main Editorial Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F8FAFC] leading-[1.15] mb-6">
          Curated Partnerships Between <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#FFFFFF] via-[#CBD5E1] to-[#94A3B8] bg-clip-text text-transparent">
            Discerning Clients & Elite Designers
          </span>
        </h1>

        {/* Sub-Headline Narrative */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-[#94A3B8] leading-relaxed mb-10 font-normal">
          Skip aggressive contractor cold calls, spam directories, and expensive ad auctions. 
          We personally study your architectural vision, style, and budget to introduce the exact right match. 
          Pay only a flexible commitment token of your choice initially—the 3% commission is settled only after your deal is finalized.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <button
            onClick={() => scrollToInquire('client')}
            className="w-full sm:w-auto btn-silver px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Hire an Interior Designer</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <button
            onClick={() => scrollToInquire('designer')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase text-[#F8FAFC] bg-[#101B2E]/90 hover:bg-[#1E2E48] border border-[#E2E8F0]/25 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Join as an Interior Designer</span>
            <svg className="w-4 h-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/10 text-left">
          <div className="p-4 rounded-xl bg-[#101B2E]/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold font-serif-luxury text-[#F8FAFC] mb-1">3% Flat</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Total Commission</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Payable only upon deal closure</div>
          </div>
          
          <div className="p-4 rounded-xl bg-[#101B2E]/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold font-serif-luxury text-[#F8FAFC] mb-1">Flexible Token</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Initial Commitment</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Fixed amount of your choice</div>
          </div>

          <div className="p-4 rounded-xl bg-[#101B2E]/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold font-serif-luxury text-[#F8FAFC] mb-1">100% Vetted</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Portfolio Review</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">No fake reviews or spam bots</div>
          </div>

          <div className="p-4 rounded-xl bg-[#101B2E]/60 border border-white/5 backdrop-blur-sm">
            <div className="text-2xl font-bold font-serif-luxury text-[#F8FAFC] mb-1">Direct Touch</div>
            <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Personal Outreach</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">We get back with exact matches</div>
          </div>
        </div>

      </div>
    </section>
  );
}

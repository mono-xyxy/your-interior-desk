'use client';

import React from 'react';

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#0B1320]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#94A3B8] font-semibold mb-3">
            Our Purpose & Vision
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-5">
            What We Do
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Your Interior Desk is not an automated lead directory or a spam aggregator. 
            We are a private, high-touch matchmaking desk dedicated to connecting discerning property clients 
            with elite interior design studios who share their taste and standards.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Pillar 1 */}
          <div className="glass-panel p-8 rounded-2xl relative group hover:border-[#CBD5E1]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#1E2E48] border border-[#E2E8F0]/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-3">
              1. Architectural & Aesthetic Alignment
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Every home or commercial project possesses a distinct spatial identity—whether Japandi, Scandinavian, Classical European, or Industrial Minimalist. We analyze your floor plan and stylistic expectations to match you with designers whose core portfolio matches that exact aesthetic.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel p-8 rounded-2xl relative group hover:border-[#CBD5E1]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#1E2E48] border border-[#E2E8F0]/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-3">
              2. Rigorous Vetting & Authenticity
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              We eliminate 3D render fabrications and subcontracting traps. We verify physical execution history, on-site supervision practices, material transparency, and client testimonials before introducing any design firm into our active network.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel p-8 rounded-2xl relative group hover:border-[#CBD5E1]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#1E2E48] border border-[#E2E8F0]/20 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-3">
              3. Transparent 3% Success Model
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              No hidden contractor kickbacks or inflated project bills. We charge a flat 3% commission on the project budget. You begin with a flexible initial commitment of your choice so we dedicate our time and effort; the remaining balance is paid only when the right match is found and the deal is finalized.
            </p>
          </div>

        </div>

        {/* The Problem vs Our Solution Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#101B2E] via-[#0B1320] to-[#1E2E48] border border-white/15 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2 block">
                The Old Marketplace Trap
              </span>
              <h4 className="font-serif-luxury text-2xl font-bold text-[#F8FAFC] mb-4">
                Why Mass Directories & Ad Auctions Fail Everyone
              </h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                Traditional portals treat home interiors like classified ads. Your contact details are sold to dozens of contractors who inundate your phone. Meanwhile, passionate designers burn thousands every month chasing unvetted leads who disappear after one call.
              </p>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 block">
                The Your Interior Desk Standard
              </span>
              <h4 className="font-serif-luxury text-2xl font-bold text-[#F8FAFC] mb-4">
                Curated, Dignified & Direct Curation
              </h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                We operate as your personal concierge desk. We personally review every submission, discuss preferences in detail, and introduce only 1 or 2 hand-selected candidates that represent a near-perfect match in vision, budget, and work ethics.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

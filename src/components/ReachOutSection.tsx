'use client';

import React from 'react';

export default function ReachOutSection() {
  return (
    <section id="reach-out" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#0B1320]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#CBD5E1] font-semibold mb-3 block">
            Official Channels & Social Reach Out
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-5">
            Reach Out Directly
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Whether you want to explore our daily design showcases, share high-res blueprints, or speak directly with our curation team, connect via our official channels.
          </p>
        </div>

        {/* 3 Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Channel 1: Instagram */}
          <a
            href="https://www.instagram.com/theinteriordesk.in/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-8 rounded-3xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                {/* Instagram Gradient Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0B1320] rounded-[14px] flex items-center justify-center">
                    <svg className="w-7 h-7 text-pink-400 group-hover:text-pink-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  @theinteriordesk.in
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                Follow On Instagram
              </h3>
              
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Explore curated architectural walk-throughs, luxury finishes, verified designer portfolios, and transformation spotlights.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-pink-300 group-hover:text-pink-200">
              <span>Visit @theinteriordesk.in</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Channel 2: Email Desk */}
          <a
            href="mailto:yourinteriordesk@gmail.com?subject=Project%20Inquiry%20-%20Your%20Interior%20Desk"
            className="glass-panel p-8 rounded-3xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                {/* Mail Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Principal Desk Email
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                Official Email Desk
              </h3>
              
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Send architectural blueprints, floor plans, studio portfolios, or bespoke inquiries directly to our team at <strong className="text-white">yourinteriordesk@gmail.com</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-300 group-hover:text-blue-200">
              <span className="truncate pr-2">yourinteriordesk@gmail.com</span>
              <svg className="w-4 h-4 shrink-0 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Channel 3: WhatsApp Instant Connect */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent('Hi, I am reaching out from Your Interior Desk. I would like to discuss an interior project / designer partnership.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-8 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                {/* WhatsApp Icon */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </div>

                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Instant Connect
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-white mb-2">
                WhatsApp Assistant
              </h3>
              
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                Prefer an immediate message? Chat with our desk to ask questions about the 3% commission model, initial tokens, or designer vetting.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
              <span>Chat With Our Team</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}

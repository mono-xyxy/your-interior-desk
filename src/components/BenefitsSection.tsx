'use client';

import React, { useState } from 'react';

export default function BenefitsSection() {
  const [activeTab, setActiveTab] = useState<'both' | 'clients' | 'designers'>('both');

  return (
    <section id="benefits" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#070D18]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[#94A3B8] font-semibold mb-3">
            Two-Sided Excellence
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-5">
            How This Helps Both Clients & Designers
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            By curating high-intent matchmaking rather than mass-selling contacts, 
            we create an ecosystem built on trust, design excellence, and transparent financial alignment.
          </p>

          {/* Tab Filter Pill */}
          <div className="inline-flex p-1.5 rounded-full bg-[#101B2E] border border-white/10 mt-8">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'both' ? 'bg-[#E2E8F0] text-[#0B1320] shadow-md' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All Benefits
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'clients' ? 'bg-[#E2E8F0] text-[#0B1320] shadow-md' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              For Clients
            </button>
            <button
              onClick={() => setActiveTab('designers')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'designers' ? 'bg-[#E2E8F0] text-[#0B1320] shadow-md' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              For Designers
            </button>
          </div>
        </div>

        {/* Benefits Two-Column Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card: For Clients */}
          {(activeTab === 'both' || activeTab === 'clients') && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-blue-500/20 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Homeowners & Property Clients</span>
                    <h3 className="font-serif-luxury text-2xl font-bold text-[#F8FAFC]">For Discerning Clients</h3>
                  </div>
                </div>

                <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
                  Building or redesigning a luxury home is an intimate, high-stakes journey. We protect you from trial-and-error risks and unqualified vendor spam.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Hand-Vetted Portfolio & Quality</strong>
                      <span className="text-xs text-[#94A3B8]">Every recommended designer is assessed on physical site executions, craftsmanship, and verified track record.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">100% Privacy & Zero Spam</strong>
                      <span className="text-xs text-[#94A3B8]">Your phone number and email are NEVER broadcast or sold to dozens of hungry telemarketers.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Exact Aesthetic Alignment</strong>
                      <span className="text-xs text-[#94A3B8]">Matched with professionals specialized in your target architectural aesthetic (Contemporary, Classical, Minimalist, Luxury Villa).</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Personal Follow-Up When Match Is Found</strong>
                      <span className="text-xs text-[#94A3B8]">Once we vet designers matching your parameters, our desk personally connects with you to present curated portfolios.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1320] border border-white/10 text-xs text-[#CBD5E1] flex items-center justify-between">
                <span>Fee: 3% on final budget • Flexible initial token</span>
                <span className="text-emerald-400 font-semibold">Protected Deal</span>
              </div>
            </div>
          )}

          {/* Card: For Designers */}
          {(activeTab === 'both' || activeTab === 'designers') && (
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Interior Architects & Design Studios</span>
                    <h3 className="font-serif-luxury text-2xl font-bold text-[#F8FAFC]">For Verified Designers</h3>
                  </div>
                </div>

                <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
                  Focus on spatial creation, materials, and flawless site execution. Stop wasting hours and capital on predatory pay-per-lead platforms.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Pre-Vetted, High-Intent Clients</strong>
                      <span className="text-xs text-[#94A3B8]">Every client who approaches our desk is verified for serious intent, confirmed project possession, and verified budget.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Zero Ad Spend & No Lead Auctions</strong>
                      <span className="text-xs text-[#94A3B8]">No bidding wars against 30 low-budget contractors. Introductions are exclusive and based on your design niche.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Realistic Budgets & Creative Respect</strong>
                      <span className="text-xs text-[#94A3B8]">We filter out unrealistic price expectations before connecting you, preserving your studio's creative integrity.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
                    <div>
                      <strong className="text-white text-sm block">Direct Outreach When Clients Align</strong>
                      <span className="text-xs text-[#94A3B8]">As soon as a relevant client project matching your studio's aesthetic and geography enters our desk, we reach out to you directly.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1320] border border-white/10 text-xs text-[#CBD5E1] flex items-center justify-between">
                <span>Success fee: 3% upon project finalization</span>
                <span className="text-blue-400 font-semibold">Direct Opportunity</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

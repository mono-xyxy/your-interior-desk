'use client';

import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Submit Inquiry & Set Initial Token',
      desc: 'Share your property details, location, and vision. Pay only a flexible commitment amount of your choice (not the full amount) so our desk can dedicate genuine time and architectural analysis.',
      badge: 'Flexible Initial Commitment',
      badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    },
    {
      num: '02',
      title: 'Bespoke Curation & Vetting',
      desc: 'We analyze your layout, design taste (Modern, Classical, Scandinavian, Luxury Minimalist), and budget feasibility. We manually screen studios for craftsmanship, on-site supervision, and schedule availability.',
      badge: 'Curated Review',
      badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    },
    {
      num: '03',
      title: 'We Get Back To You Directly',
      desc: 'When we have matching designers (or clients) that align with your exact specifications, we get back to you directly via Call or WhatsApp with hand-picked portfolios and comprehensive project scopes.',
      badge: 'Direct Outreach',
      badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
    },
    {
      num: '04',
      title: 'Finalize Deal & Settle 3% Commission',
      desc: 'You meet the designer or client, align on the project execution agreement, and finalize the deal. The remaining balance of the 3% commission is completed only upon deal finalization.',
      badge: 'Success-Driven Closure',
      badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#0B1320]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#94A3B8] font-semibold mb-3">
            Clear, Dignified Workflow
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-5">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            From initial requirement to successful deal closure: a smooth, dignified four-step process.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-panel p-7 rounded-2xl border border-white/10 flex flex-col justify-between relative group hover:border-[#CBD5E1]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif-luxury text-3xl font-bold text-[#CBD5E1]/40 group-hover:text-[#CBD5E1] transition-colors">
                    {step.num}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-lg font-bold text-[#F8FAFC] mb-3">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-[#64748B]">
                <span>Stage {step.num} of 04</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

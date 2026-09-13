'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#070D18]/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column / Founder Portrait Card */}
          <div className="lg:col-span-5 text-center">
            <div className="relative inline-block mx-auto">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl p-1.5 bg-gradient-to-tr from-[#E2E8F0] via-[#94A3B8] to-[#CBD5E1] shadow-2xl shadow-black/80">
                <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-[#101B2E] flex items-center justify-center">
                  <Image
                    src="/logo_cropped.png"
                    alt="Your Interior Desk Curator"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Verified Founder Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0B1320] border border-[#CBD5E1]/30 shadow-xl whitespace-nowrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Founder & Principal Curator
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">Your Interior Desk</h3>
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mt-1 font-medium">
                Private Interior & Architectural Curation Desk
              </p>
            </div>
          </div>

          {/* Editorial Column */}
          <div className="lg:col-span-7">
            <div className="text-xs uppercase tracking-[0.25em] text-[#94A3B8] font-semibold mb-3">
              Personal Note & Philosophy
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-6">
              About Me & Why I Built This Desk
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-normal">
              <p>
                Over the past several years observing the interior architecture and construction ecosystem, 
                I saw a frustrating breakdown happening on both sides. 
              </p>
              <p>
                On one side, homeowners and luxury property clients were left completely exhausted. 
                They submit a single inquiry on a website, and within minutes their phone is ringing off the hook 
                with 20 different aggressive sales calls from contractors who have never even looked at their floor plan. 
                There was no curation, no aesthetic understanding, and zero respect for privacy.
              </p>
              <p>
                On the other side, some of the most gifted, meticulous interior designers I knew were 
                burning massive amounts of their creative energy and budgets on ad platforms—competing in 
                chaotic bidding wars against budget contractors who cut corners on materials.
              </p>
              <p className="text-white font-medium bg-[#101B2E] p-4 rounded-xl border border-white/10">
                &ldquo;I created Your Interior Desk with a singular conviction: interior spaces are deeply personal, 
                and great design cannot be mass-automated. It requires human discernment, aesthetic harmony, 
                and uncompromising transparency.&rdquo;
              </p>
              <p>
                When you share your project with our desk, it is reviewed personally. We look at your spatial layout, 
                your material sensibilities, and your timeline. We invest dedicated time and effort to ensure that when we 
                introduce a designer or client, both parties share genuine mutual excitement.
              </p>
            </div>

            {/* Guarantees List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Direct Personal Review on Every Inquiry</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Zero Telemarketing or Third-Party Data Sharing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Honest 3% Commission Structure</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Direct Follow-up Once Matching Profile is Found</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

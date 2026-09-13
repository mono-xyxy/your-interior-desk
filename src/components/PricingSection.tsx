'use client';

import React, { useState } from 'react';

export default function PricingSection() {
  // Budget slider state in INR (Lakhs)
  const [budgetLakhs, setBudgetLakhs] = useState<number>(35);
  // Initial token amount of choice (INR)
  const [tokenAmount, setTokenAmount] = useState<number>(5000);

  const totalBudget = budgetLakhs * 100000;
  const totalCommission = totalBudget * 0.03;
  const remainingBalance = Math.max(0, totalCommission - tokenAmount);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const presetBudgets = [15, 25, 40, 65, 100];

  return (
    <section id="pricing" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#0B1320]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#CBD5E1] font-semibold mb-3">
            Simple & Transparent Economics
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-5">
            The 3% Commission Model
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Transparent, performance-driven pricing with zero surprises. 
            You do not pay the full amount upfront—start with a flexible commitment token of your choice.
          </p>
        </div>

        {/* 3 Steps of Engagement Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Step 1 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-[#F8FAFC] font-bold text-sm flex items-center justify-center mb-5">
              1
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-2">
              Flexible Initial Token
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              <strong className="text-white">Initially, do not pay the full amount.</strong> You pay a fixed initial commitment amount of your choice (e.g. ₹2,000, ₹5,000, or any amount you feel comfortable with).
            </p>
            <div className="text-xs text-amber-300/90 font-medium bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              ⚡ This ensures genuine mutual intent so our curation desk dedicates real time and architectural review to your project.
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-[#F8FAFC] font-bold text-sm flex items-center justify-center mb-5">
              2
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-2">
              We Get Back To You
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              Our team immediately reviews floor plans, design aesthetics, and geographic requirements. <strong className="text-white">When we have matching designers or clients, we get back to you directly.</strong>
            </p>
            <div className="text-xs text-blue-300/90 font-medium bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              🤝 Hand-picked portfolios and verified requirements presented directly via Call/WhatsApp.
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-[#F8FAFC] font-bold text-sm flex items-center justify-center mb-5">
              3
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#F8FAFC] mb-2">
              Full Deal Finalization
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              Once both client and designer connect, review the design vision, agree on scopes, and <strong className="text-white">finalize the deal</strong>, the remaining balance of the 3% commission is settled.
            </p>
            <div className="text-xs text-emerald-300/90 font-medium bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              ✓ Full 3% commission is completed only when the partnership is sealed.
            </div>
          </div>

        </div>

        {/* Interactive 3% Commission & Commitment Calculator */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#E2E8F0]/20 max-w-4xl mx-auto shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 block">
              Interactive Commission Calculator
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
              Estimate Your 3% Commission & Initial Token
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              Adjust your project budget and choose your initial commitment token to see the exact breakdown.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-[#CBD5E1]">
                  Estimated Project Budget:
                </label>
                <span className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-serif-luxury">
                  {formatINR(totalBudget)}
                  <span className="text-xs font-normal text-[#94A3B8] ml-1">({budgetLakhs} Lakhs)</span>
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={budgetLakhs}
                onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                className="w-full h-2 bg-[#1E2E48] rounded-lg appearance-none cursor-pointer accent-[#CBD5E1]"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-[#64748B]">Quick presets:</span>
                {presetBudgets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBudgetLakhs(preset)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      budgetLakhs === preset
                        ? 'bg-[#E2E8F0] text-[#0B1320] font-semibold'
                        : 'bg-[#101B2E] text-[#94A3B8] hover:text-white border border-white/5'
                    }`}
                  >
                    ₹{preset}L
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Commitment Token of Choice */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <label className="text-sm font-semibold text-[#CBD5E1] block">
                    Initial Commitment Token (Amount of Your Choice):
                  </label>
                  <span className="text-xs text-[#94A3B8]">
                    You decide what you want to pay initially to kick off curation.
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#94A3B8]">₹</span>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Math.max(0, Number(e.target.value)))}
                    className="luxury-input w-36 pl-7 pr-3 py-2 rounded-lg text-sm font-semibold text-right"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-[#64748B]">Suggested tokens:</span>
                {[2000, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTokenAmount(amt)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      tokenAmount === amt
                        ? 'bg-blue-400 text-[#0B1320] font-semibold'
                        : 'bg-[#101B2E] text-[#94A3B8] hover:text-white border border-white/5'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Results Card */}
            <div className="p-6 rounded-2xl bg-[#0B1320] border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              
              <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4">
                <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold mb-1">
                  Total 3% Commission
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  {formatINR(totalCommission)}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">3% of total project budget</div>
              </div>

              <div className="border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:px-4">
                <div className="text-xs text-amber-300 uppercase tracking-wider font-semibold mb-1">
                  Initial Token to Pay
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-amber-300">
                  {formatINR(tokenAmount)}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Initial commitment of your choice</div>
              </div>

              <div className="sm:pl-4">
                <div className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-1">
                  Balance on Deal Close
                </div>
                <div className="text-xl sm:text-2xl font-bold font-serif-luxury text-emerald-400">
                  {formatINR(remainingBalance)}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">Payable ONLY once deal is finalized</div>
              </div>

            </div>

            {/* Guarantee Note */}
            <div className="text-center text-xs text-[#94A3B8] pt-2">
              <span className="text-white font-medium">Clear Assurance:</span> If no suitable matching designer or client is identified, you remain in complete control. We work on high-touch curation, not automated lock-ins.
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

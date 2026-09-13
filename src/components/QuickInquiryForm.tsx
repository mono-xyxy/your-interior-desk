'use client';

import React, { useState } from 'react';

interface QuickInquiryFormProps {
  initialRole?: 'client' | 'designer';
}

export default function QuickInquiryForm({ initialRole = 'client' }: QuickInquiryFormProps) {
  const [role, setRole] = useState<'client' | 'designer'>(initialRole);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('₹25,00,000 - ₹50,00,000');
  const [tokenAmount, setTokenAmount] = useState('5000');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Synchronize when initialRole prop updates
  React.useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !location.trim()) {
      setError('Please provide your name, phone number, email, and location.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        budget: budget.trim(),
        tokenAmount: tokenAmount.trim(),
        initialCommitment: tokenAmount.trim(),
        description: description.trim() || `Inquiry from ${role === 'client' ? 'Client' : 'Designer'} seeking curated matchmaking. Initial commitment offer: ₹${tokenAmount}`,
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setLocation('');
    setDescription('');
  };

  return (
    <section id="inquire" className="py-20 md:py-28 relative z-10 border-t border-white/10 bg-[#070D18]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#CBD5E1] font-semibold mb-2 block">
            Start Your Curated Match
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-4">
            Connect With Our Desk
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Submit your requirements below. Pay only a flexible commitment token of your choice initially; 
            when we have matching designers or clients, we will get back to you directly.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#CBD5E1]/20 shadow-2xl">
          
          {/* Quick Direct Reach Out Bar */}
          <div className="mb-8 p-4 rounded-2xl bg-[#0B1320]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs font-semibold text-white block">Prefer direct messaging or emailing blueprints?</span>
              <span className="text-[11px] text-[#94A3B8]">Reach out directly via our official channels:</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://www.instagram.com/theinteriordesk.in/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-semibold text-pink-300 transition-all"
                title="Instagram @theinteriordesk.in"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@theinteriordesk.in</span>
              </a>

              <a
                href="mailto:yourinteriordesk@gmail.com?subject=Project%20Inquiry%20-%20Your%20Interior%20Desk"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all"
                title="Email yourinteriordesk@gmail.com"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email Desk</span>
              </a>
            </div>
          </div>
          
          {successData ? (
            /* Success State */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
                  Inquiry Registered Successfully
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-2">
                  Thank You, {successData.data?.fullName || fullName}
                </h3>
                <p className="text-sm text-[#94A3B8] max-w-lg mx-auto">
                  Your project details and commitment preference have been logged into our curation desk.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0B1320] border border-white/10 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Reference ID:</span>
                  <span className="font-mono font-bold text-white">{successData.data?.id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Registered Role:</span>
                  <span className="capitalize font-semibold text-white">{role === 'client' ? 'Hiring Client' : 'Interior Designer'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Initial Commitment Token:</span>
                  <span className="font-semibold text-amber-300">₹{tokenAmount || '5,000'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#94A3B8]">Total Match Fee:</span>
                  <span className="font-semibold text-emerald-400">3% (Settled at deal close)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 max-w-md mx-auto text-xs text-blue-200">
                🚀 <strong>What happens next?</strong> Our desk will review your submission and reach out to you directly via WhatsApp or Call as soon as we identify vetted matching designers or clients.
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, I just submitted an inquiry on Your Interior Desk (Ref: ${successData.data?.id}). Looking forward to connecting!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto btn-silver px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Direct WhatsApp Connect</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Role Toggle */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#94A3B8] font-semibold block mb-3">
                  I am inquiring as:
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0B1320] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      role === 'client'
                        ? 'bg-[#E2E8F0] text-[#0B1320] shadow-md font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>🏠 Hiring Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('designer')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      role === 'designer'
                        ? 'bg-[#E2E8F0] text-[#0B1320] shadow-md font-bold'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <span>📐 Interior Designer</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="luxury-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    Phone / WhatsApp Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="luxury-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Email & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rohan@example.com"
                    className="luxury-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    City / Project Location <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Bandra West"
                    className="luxury-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Budget & Initial Commitment Token */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                    Estimated Project Budget Range
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="luxury-input w-full px-4 py-3 rounded-xl text-sm"
                  >
                    <option value="₹10,00,000 - ₹25,00,000">₹10 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25,00,000 - ₹50,00,000">₹25 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50,00,000 - ₹1,00,00,000">₹50 Lakhs - ₹1 Crore</option>
                    <option value="₹1,00,00,000 - ₹2,50,00,000">₹1 Crore - ₹2.5 Crores</option>
                    <option value="₹2,50,00,000+">₹2.5 Crores+ (Ultra Luxury / Estate)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#CBD5E1]">
                      Initial Commitment Token (Amount of Your Choice)
                    </label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs text-[#94A3B8]">₹</span>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="luxury-input w-full pl-8 pr-4 py-3 rounded-xl text-sm font-semibold text-amber-300"
                    />
                  </div>
                  <span className="text-[11px] text-[#94A3B8] mt-1 block">
                    * Do not pay full 3% upfront. Enter any commitment amount you choose to kick off curation.
                  </span>
                </div>
              </div>

              {/* Project Details Note */}
              <div>
                <label className="text-xs font-semibold text-[#CBD5E1] block mb-2">
                  Project Scope or Aesthetic Notes <span className="text-[#64748B] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    role === 'client'
                      ? 'e.g. 3BHK high-rise apartment in Worli, possession next month. Looking for clean Scandinavian / contemporary design with premium carpentry.'
                      : 'e.g. Principal designer at Studio Alpha. Specializing in luxury residential and turnkey architectural interiors in South Delhi.'
                  }
                  className="luxury-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                />
              </div>

              {/* Pricing terms highlight box */}
              <div className="p-4 rounded-xl bg-[#0B1320] border border-white/10 text-xs text-[#94A3B8] space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span className="text-emerald-400">✓</span>
                  <span>3% Commission Model & Guaranteed Discretion</span>
                </div>
                <p>
                  You pay a flexible initial commitment token of your choice. Our desk will dedicate time to review floor plans and screen candidates. 
                  When we find matching designers or clients, we get back to you directly. The remaining 3% balance is finalized only when both parties seal the deal.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-silver py-4 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Registering Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Inquiry & Connect With Desk</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}

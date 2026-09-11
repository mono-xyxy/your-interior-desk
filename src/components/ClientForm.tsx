'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, FileText, Check } from 'lucide-react';

interface ClientFormProps {
  onSuccess: () => void;
}

export default function ClientForm({ onSuccess }: ClientFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touchedErrors, setTouchedErrors] = useState<{ [key: string]: boolean }>({});

  const countWords = (str: string) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const currentWordCount = countWords(formData.description);
  const isWordCountValid = currentWordCount >= 80;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (touchedErrors[e.target.name]) {
      setTouchedErrors({ ...touchedErrors, [e.target.name]: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check required fields
    const required = ['fullName', 'email', 'phone', 'location', 'budget', 'description'];
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    for (const key of required) {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = true;
        hasError = true;
      }
    }

    if (!isWordCountValid) {
      newErrors.description = true;
      hasError = true;
      setErrorMsg(`Minimum 80 words constraint required. You currently have ${currentWordCount} words (${80 - currentWordCount} more words needed).`);
    } else if (hasError) {
      setErrorMsg('Please complete all highlighted required fields before submitting your project request.');
    }

    if (hasError) {
      setTouchedErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'client',
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          budget: '',
          description: '',
        });
        setTouchedErrors({});
        onSuccess();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setErrorMsg(data.error || 'Unable to send request. Please check your inputs.');
      }
    } catch (err) {
      setErrorMsg('Network connection issue. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

      {/* Form Title */}
      <div className="mb-8 pb-4 border-b border-[#E2E8F0]/20">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
          Client Project Requirement Form
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Specify your property details, location, interior budget, and room requirements to connect with verified interior designers in India.
        </p>
      </div>

      {/* Success Notification */}
      {submitted && (
        <div className="mb-8 p-5 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3.5 animate-slide-down shadow-lg shadow-emerald-950/30">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#74C69D]">Thank You! Project Inquiry Sent Successfully</h4>
            <p className="text-xs text-[#B7E4C7] mt-1">
              Your project details have been recorded. Designers matching your style and budget will reach out to you.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-[#2A0F13] border border-[#EF4444] text-[#FCA5A5] flex items-center gap-3 animate-slide-down shadow-lg shadow-red-950/50">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Vertical Alignment (Row-by-Row Layout) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Client Full Name */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Client Full Name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. James Smith"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.fullName ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 2: Email Address */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Email Address <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. james@example.com"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.email ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 3: Phone / WhatsApp Number */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Phone / WhatsApp Number <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.phone ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 4: Property Location in India */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Property Location (City / Area in India) <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Whitefield, Bangalore or Bandra West, Mumbai"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.location ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 5: Offered Budget for Interior Design */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Offered Budget for Interior Design (₹) <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. ₹8 Lakhs - ₹12 Lakhs total budget"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.budget ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 6: Detailed Scope & Property Requirements (WITH 80 WORDS MINIMUM CONSTRAINT) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
              Detailed Scope of Work & Property Description <span className="text-[#EF4444]">* (80 Words Minimum)</span>
            </label>

            {/* Live Word Count Counter Badge */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                isWordCountValid
                  ? 'bg-[#0D2818] text-[#52B788] border border-[#2D6A4F]'
                  : 'bg-[#2A170F] text-[#F97316] border border-[#EA580C]/40'
              }`}
            >
              {isWordCountValid ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{currentWordCount} / 80 words min</span>
            </span>
          </div>

          <textarea
            name="description"
            rows={7}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project requirements in detail (minimum 80 words). Include property type (3BHK apartment, villa, commercial space), exact square footage, rooms to design (living room, modular kitchen, master bedroom), preferred style (modern minimalist, traditional Indian, Scandinavian), target completion date, and specific material preferences..."
            className={`w-full px-4 py-3.5 rounded-xl luxury-input text-sm resize-y leading-relaxed font-normal ${
              touchedErrors.description ? 'luxury-input-error' : ''
            }`}
          />

          {!isWordCountValid && (
            <p className="text-[11px] text-[#F97316] flex items-center gap-1.5 mt-1 font-medium">
              <span>⚠ Minimum 80 words constraint required ({80 - currentWordCount} more words needed).</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isWordCountValid}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 ${
            isWordCountValid && !loading
              ? 'btn-silver shadow-lg shadow-[#E2E8F0]/20 hover:scale-[1.01]'
              : 'bg-[#1C2838] text-[#94A3B8] cursor-not-allowed border border-[#94A3B8]/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0B1320]" />
              <span>Sending Your Request...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Request Designer Match</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}


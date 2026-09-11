'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, FileText, Check } from 'lucide-react';

interface DesignerFormProps {
  onSuccess: () => void;
}

export default function DesignerForm({ onSuccess }: DesignerFormProps) {
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

  const countWords = (str: string) => {
    if (!str.trim()) return 0;
    return str.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const currentWordCount = countWords(formData.description);
  const isWordCountValid = currentWordCount >= 80;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isWordCountValid) {
      setErrorMsg(`Please provide at least 80 words describing your design experience (${currentWordCount}/80 words).`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'designer',
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
        onSuccess();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setErrorMsg(data.error || 'Unable to complete registration. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection and try again.');
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
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
          Designer Registration
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Share your professional design practice, location, working fee structure, and portfolio details.
        </p>
      </div>

      {submitted && (
        <div className="mb-8 p-5 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#74C69D]">Thank You! Profile Registered Successfully</h4>
            <p className="text-xs text-[#B7E4C7] mt-1">
              Your details have been received. Our community network will connect with you when matching client inquiries arrive.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-[#2C0B0E] border border-[#780016] text-[#FFCCD5] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF4D6D] flex-shrink-0" />
          <span className="text-xs sm:text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Vertical Alignment (Row-by-Row Layout) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Full Name */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Full Name <span className="text-[#FF4D6D]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Sarah Miller"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 2: Email Address */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Email Address <span className="text-[#FF4D6D]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. sarah@designstudio.in"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 3: Phone / WhatsApp Number */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Phone / WhatsApp Number <span className="text-[#FF4D6D]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 4: Primary Working Location in India */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Primary Working Location & Cities in India <span className="text-[#FF4D6D]">*</span>
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Bangalore, Mumbai, Delhi NCR"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 5: Expected Working Budget & Fee Range */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
            Expected Working Budget & Project Fee Range (₹) <span className="text-[#FF4D6D]">*</span>
          </label>
          <input
            type="text"
            name="budget"
            required
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. ₹5 Lakhs - ₹15 Lakhs for 3BHK turnkey interior"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 6: Detailed Professional Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
              Professional Experience & Portfolio Description <span className="text-[#FF4D6D]">*</span>
            </label>

            {/* Word Counter Badge */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                isWordCountValid
                  ? 'bg-[#0D2818] text-[#52B788] border border-[#2D6A4F]'
                  : 'bg-[#2A170F] text-[#F97316] border border-[#EA580C]/40'
              }`}
            >
              {isWordCountValid ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{currentWordCount} / 80 words minimum</span>
            </span>
          </div>

          <textarea
            name="description"
            required
            rows={7}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your design background in detail (minimum 80 words). Include your total years of experience, design specializations (residential, commercial, luxury villas), past notable projects, portfolio website / Instagram links, preferred materials, and client working terms..."
            className="w-full px-4 py-3.5 rounded-xl luxury-input text-sm resize-y leading-relaxed font-normal"
          />

          {!isWordCountValid && (
            <p className="text-[11px] text-[#F97316] flex items-center gap-1.5 mt-1 font-medium">
              <span>Please write at least 80 words ({80 - currentWordCount} more words needed).</span>
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
              <Loader2 className="w-5 h-5 animate-spin text-[#0B1422]" />
              <span>Sending Profile Details...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Register Designer Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

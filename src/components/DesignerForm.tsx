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
    socialHandles: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touchedErrors, setTouchedErrors] = useState<{ [key: string]: boolean }>({});

  const countWords = (str: string) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).filter((w) => w.length > 0).length;
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

    // Check required basic fields
    const required = ['fullName', 'email', 'phone', 'location', 'budget', 'description'];
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    for (const key of required) {
      if (!formData[key as keyof typeof formData]?.toString().trim()) {
        newErrors[key] = true;
        hasError = true;
      }
    }

    if (!isWordCountValid) {
      newErrors.description = true;
      hasError = true;
      setErrorMsg(`Please provide at least 80 words describing your design overview. (${currentWordCount} words entered)`);
    }

    if (hasError) {
      setTouchedErrors(newErrors);
      if (isWordCountValid) {
        setErrorMsg('Please complete all required fields.');
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'designer',
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          budget: formData.budget,
          socialHandles: formData.socialHandles,
          description: formData.description,
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
          socialHandles: '',
          description: '',
        });
        setTouchedErrors({});
        onSuccess();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setErrorMsg(data.error || 'Unable to register profile. Please check your inputs.');
      }
    } catch {
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
          Designer Registration
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Share your professional design practice, location, working fee structure, and social handles to connect with clients across India.
        </p>
      </div>

      {/* Success Notification Banner */}
      {submitted && (
        <div className="mb-8 p-5 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3.5 animate-slide-down shadow-lg shadow-emerald-950/30">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="font-semibold text-sm text-[#74C69D]">Thank You! Profile Registered Successfully</h4>
            <p className="text-xs text-[#B7E4C7]">
              Your designer profile has been securely recorded. Our team will review your portfolio and verify your registration.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-[#2A0F13] border border-[#EF4444] text-[#FCA5A5] flex items-center gap-3 animate-slide-down shadow-lg shadow-red-950/50">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Full Name */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Full Name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Sarah Miller"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.fullName ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 2: Email Address */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Email Address <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. sarah@designstudio.in"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.email ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 3: Phone / WhatsApp Number */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
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

        {/* Row 4: Primary Working Location in India */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Primary Working Location & Cities in India <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Bangalore, Mumbai, Delhi NCR"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.location ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 5: Expected Working Budget & Fee Range */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Expected Working Budget & Project Fee Range (₹) <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. ₹5 Lakhs - ₹15 Lakhs for 3BHK turnkey interior"
            className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
              touchedErrors.budget ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Row 6: Social Handles / Portfolio Links */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Social Handles & Portfolio Links <span className="text-[#94A3B8] font-normal">(Instagram, LinkedIn, Website)</span>
          </label>
          <input
            type="text"
            name="socialHandles"
            value={formData.socialHandles}
            onChange={handleChange}
            placeholder="e.g. instagram.com/sarah_interiors, linkedin.com/in/sarahdesign"
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm"
          />
        </div>

        {/* Row 7: Professional Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 min-h-[28px]">
            <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
              Professional Overview & Experience <span className="text-[#EF4444]">*</span>
            </label>

            {/* Word Counter Badge */}
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1.5 transition-colors ${
                isWordCountValid
                  ? 'bg-[#0D2818] text-[#52B788] border border-[#2D6A4F]'
                  : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
              }`}
            >
              {isWordCountValid ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />}
              <span>{currentWordCount} / 80 words</span>
            </span>
          </div>

          <textarea
            name="description"
            rows={7}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your design background in detail (minimum 80 words). Include your total years of experience, design specializations (residential, commercial, luxury villas), past notable projects, portfolio website / Instagram links, preferred materials, and client working terms..."
            className={`w-full px-4 py-3.5 rounded-xl luxury-input text-sm resize-y leading-relaxed font-normal ${
              touchedErrors.description ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-3 ${
            !loading
              ? 'btn-silver shadow-lg shadow-[#E2E8F0]/10 hover:scale-[1.005]'
              : 'bg-[#1C2838] text-[#94A3B8] cursor-not-allowed border border-[#94A3B8]/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0B1320]" />
              <span>Registering Profile...</span>
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

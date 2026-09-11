'use client';

import React, { useState } from 'react';
import { Palette, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MapPin, IndianRupee, Briefcase, Link2 } from 'lucide-react';

interface DesignerFormProps {
  onSuccess: () => void;
}

export default function DesignerForm({ onSuccess }: DesignerFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'Bangalore',
    budget: '₹5,00,000 - ₹10,00,000',
    experience: '3 - 5 Years (Established)',
    specializations: 'Residential & Luxury Villas',
    portfolioLink: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

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
        // Automatically clear form data from frontend state so next user/submission is clean
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: 'Bangalore',
          budget: '₹5,00,000 - ₹10,00,000',
          experience: '3 - 5 Years (Established)',
          specializations: 'Residential & Luxury Villas',
          portfolioLink: '',
          additionalNotes: '',
        });
        onSuccess();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to submit designer details.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
        <div className="w-10 h-10 rounded-lg bg-[#162338] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#F8F6F0] tracking-wide">
            Interior Designer Partner Registration
          </h2>
          <p className="text-xs text-[#8E9EAF]">
            Register your profile & budget preferences to connect with active clients across India
          </p>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#74C69D]">Details Saved to Database & Excel!</h4>
            <p className="text-xs text-[#B7E4C7] mt-1">
              Your details have been saved directly to <code className="bg-[#1B4332] px-1.5 py-0.5 rounded text-[11px]">Client_Designer.xlsx</code>. Form has been cleared for the next submission.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-[#2C0B0E] border border-[#780016] text-[#FFCCD5] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#FF4D6D] flex-shrink-0" />
          <span className="text-xs">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Full Name <span className="text-[#FF4D6D]">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ananya Sharma"
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Email Address <span className="text-[#FF4D6D]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ananya@designstudio.in"
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Phone / WhatsApp Number <span className="text-[#FF4D6D]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>

          {/* Working Location in India */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Primary City / Base in India <span className="text-[#FF4D6D]">*</span>
            </label>
            <select
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Goa">Goa</option>
              <option value="All India / Pan India">All India / Pan India</option>
            </select>
          </div>

          {/* Working Budget Range for Clients */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Min. Client Budget You Work With (₹) <span className="text-[#FF4D6D]">*</span>
            </label>
            <select
              name="budget"
              required
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="₹2,00,000 - ₹5,00,000">₹2 Lakhs - ₹5 Lakhs (Standard)</option>
              <option value="₹5,00,000 - ₹10,00,000">₹5 Lakhs - ₹10 Lakhs (Premium)</option>
              <option value="₹10,00,000 - ₹25,00,000">₹10 Lakhs - ₹25 Lakhs (Luxury)</option>
              <option value="₹25,00,000 - ₹50,00,000">₹25 Lakhs - ₹50 Lakhs (High-End)</option>
              <option value="₹50,00,000+">₹50 Lakhs+ (Ultra Luxury / Estate)</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Experience Level
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="1 - 3 Years (Emerging)">1 - 3 Years (Emerging Designer)</option>
              <option value="3 - 5 Years (Established)">3 - 5 Years (Established Studio)</option>
              <option value="5 - 10 Years (Senior)">5 - 10 Years (Senior Architect)</option>
              <option value="10+ Years (Master)">10+ Years (Master Designer)</option>
            </select>
          </div>
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
            Design Specializations
          </label>
          <select
            name="specializations"
            value={formData.specializations}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
          >
            <option value="Residential & Luxury Villas">Residential Apartments & Luxury Villas</option>
            <option value="Commercial & Office Spaces">Commercial, Boutique Offices & Retail</option>
            <option value="Modular Kitchens & Furniture">Modular Kitchens & Custom Wardrobes</option>
            <option value="Turnkey End-to-End Execution">Complete Turnkey Design & Execution</option>
            <option value="Sustainable & Biophilic Design">Sustainable & Modern Minimalist</option>
          </select>
        </div>

        {/* Portfolio Link */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
            Portfolio Website / Instagram URL
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-[#8E9EAF] absolute left-3.5 top-3" />
            <input
              type="url"
              name="portfolioLink"
              value={formData.portfolioLink}
              onChange={handleChange}
              placeholder="https://instagram.com/your_design_studio"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
            Design Philosophy / Client Notes
          </label>
          <textarea
            name="additionalNotes"
            rows={2}
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Briefly describe your design style or specific project types you prefer..."
            className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-lg btn-gold flex items-center justify-center gap-3 text-sm tracking-wider uppercase"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#070D18]" />
              <span>Recording to Spreadsheet...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#070D18]" />
              <span>Submit Designer Profile to Database</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

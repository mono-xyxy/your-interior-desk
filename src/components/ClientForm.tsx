'use client';

import React, { useState } from 'react';
import { UserCheck, Send, CheckCircle2, AlertCircle, Loader2, Home, Compass, Calendar, Wallet } from 'lucide-react';

interface ClientFormProps {
  onSuccess: () => void;
}

export default function ClientForm({ onSuccess }: ClientFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'Bangalore',
    budget: '₹5,00,000 - ₹12,00,000',
    propertyType: '3 BHK Apartment',
    scopeOfWork: 'Full Home Turnkey Interior',
    preferredStyle: 'Modern Contemporary Luxury',
    timeline: 'Immediate (Within 2 Weeks)',
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
          role: 'client',
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        // Automatically clear form data from frontend state so next client/submission is clean
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: 'Bangalore',
          budget: '₹5,00,000 - ₹12,00,000',
          propertyType: '3 BHK Apartment',
          scopeOfWork: 'Full Home Turnkey Interior',
          preferredStyle: 'Modern Contemporary Luxury',
          timeline: 'Immediate (Within 2 Weeks)',
        });
        onSuccess();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to submit client details.');
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
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#F8F6F0] tracking-wide">
            Client Requirement Submission
          </h2>
          <p className="text-xs text-[#8E9EAF]">
            Specify your budget, location & property details to get matched with verified interior designers in India
          </p>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#74C69D]">Client Requirements Saved to Excel!</h4>
            <p className="text-xs text-[#B7E4C7] mt-1">
              Your submission has been recorded in <code className="bg-[#1B4332] px-1.5 py-0.5 rounded text-[11px]">Client_Designer.xlsx</code>. Form data has been cleared automatically.
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
          {/* Client Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Client Full Name <span className="text-[#FF4D6D]">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rohan Veda"
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>

          {/* Email Address */}
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
              placeholder="e.g. rohan@example.com"
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
              placeholder="e.g. +91 90353 33300"
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm"
            />
          </div>

          {/* Property Location in India */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Property Location (City in India) <span className="text-[#FF4D6D]">*</span>
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
              <option value="Delhi NCR">Delhi NCR (Gurgaon / Noida)</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Goa">Goa</option>
              <option value="Other City in India">Other City in India</option>
            </select>
          </div>

          {/* Total Offered Budget */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Offered Budget for Interior Design (₹) <span className="text-[#FF4D6D]">*</span>
            </label>
            <select
              name="budget"
              required
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="Under ₹3,00,000">Under ₹3 Lakhs (Budget Friendly)</option>
              <option value="₹3,00,000 - ₹5,00,000">₹3 Lakhs - ₹5 Lakhs (Moderate)</option>
              <option value="₹5,00,000 - ₹12,00,000">₹5 Lakhs - ₹12 Lakhs (Premium)</option>
              <option value="₹12,00,000 - ₹25,00,000">₹12 Lakhs - ₹25 Lakhs (Luxury)</option>
              <option value="₹25,00,000 - ₹50,00,000">₹25 Lakhs - ₹50 Lakhs (High-End Villa)</option>
              <option value="₹50,00,000+">₹50 Lakhs+ (Ultra Luxury Estate)</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Property Type
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="2 BHK Apartment">2 BHK Apartment</option>
              <option value="3 BHK Apartment">3 BHK Apartment</option>
              <option value="4 BHK / Duplex">4 BHK / Penthouse / Duplex</option>
              <option value="Independent Villa / House">Independent Villa / House</option>
              <option value="Commercial / Office Space">Commercial / Office Space</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scope of Work */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Scope of Work
            </label>
            <select
              name="scopeOfWork"
              value={formData.scopeOfWork}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="Full Home Turnkey Interior">Full Home Turnkey Interior</option>
              <option value="Modular Kitchen & Wardrobes">Modular Kitchen & Wardrobes Only</option>
              <option value="Living Room & Dining Space">Living Room & Dining Focus</option>
              <option value="Home Renovation & Modernization">Full Home Renovation</option>
            </select>
          </div>

          {/* Preferred Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Preferred Design Style
            </label>
            <select
              name="preferredStyle"
              value={formData.preferredStyle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="Modern Contemporary Luxury">Modern Contemporary Luxury</option>
              <option value="Minimalist Scandinavian">Minimalist Scandinavian</option>
              <option value="Indian Ethnic Heritage">Indian Ethnic Heritage</option>
              <option value="Neoclassical European">Neoclassical European</option>
              <option value="Industrial & Rustic">Industrial & Urban Modern</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
              Target Start Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg luxury-input text-sm bg-[#080F1B]"
            >
              <option value="Immediate (Within 2 Weeks)">Immediate (Within 2 Weeks)</option>
              <option value="Within 1 Month">Within 1 Month</option>
              <option value="1 - 3 Months">1 - 3 Months</option>
              <option value="3+ Months (Planning Stage)">3+ Months (Planning Stage)</option>
            </select>
          </div>
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
              <span>Saving to Excel Spreadsheet...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#070D18]" />
              <span>Submit Client Requirements to Database</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

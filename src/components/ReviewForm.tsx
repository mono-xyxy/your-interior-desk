'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { EMOJI_SENTIMENT_MAP, analyzeReviewSentiment } from '@/lib/sentiment';

interface ReviewFormProps {
  onSuccess: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    role: 'Client',
    reviewText: '',
  });

  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_SENTIMENT_MAP[3]); // Default: Good 😊
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time sentiment & keyword matcher
  const sentiment = analyzeReviewSentiment(formData.reviewText);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-update emoji if keywords are matched
    if (name === 'reviewText' && value.trim().length > 3) {
      const detected = analyzeReviewSentiment(value);
      const matchedCat = EMOJI_SENTIMENT_MAP.find(c => c.keyword === detected.ratingKeyword);
      if (matchedCat) {
        setSelectedEmoji(matchedCat);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.reviewText.trim()) {
      setErrorMsg('Please enter your review description before submitting.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anonymous',
          email: 'N/A',
          role: formData.role,
          reviewText: formData.reviewText,
          ratingScore: selectedEmoji.score,
          ratingKeyword: selectedEmoji.keyword,
          emoji: selectedEmoji.emoji,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          role: 'Client',
          reviewText: '',
        });
        setSelectedEmoji(EMOJI_SENTIMENT_MAP[3]);
        onSuccess();
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setErrorMsg(data.error || 'Unable to submit review. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

      {/* Title */}
      <div className="mb-8 pb-4 border-b border-[#E2E8F0]/20">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
          Submit Feedback & Review
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Select your role and provide your experience description. Emojis and sentiment keywords are automatically matched and stored in the database.
        </p>
      </div>

      {/* Success Notification */}
      {submitted && (
        <div className="mb-8 p-5 rounded-xl bg-[#0D2818] border border-[#2D6A4F] text-[#D8F3DC] flex items-start gap-3.5 animate-slide-down shadow-lg shadow-emerald-950/30">
          <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-[#74C69D]">Thank You! Review Recorded Successfully</h4>
            <p className="text-xs text-[#B7E4C7] mt-1">
              Your feedback with matched emoji rating has been saved to the database and sync workbook.
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Your Role <span className="text-[#EF4444]">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl luxury-input text-sm bg-[#0F1827] text-[#F8FAFC]"
          >
            <option value="Client">Hiring Client</option>
            <option value="Designer">Interior Designer</option>
          </select>
        </div>

        {/* Emoji Rating Selector */}
        <div className="space-y-3">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Select Rating & Sentiment Emoji
          </label>
          
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {EMOJI_SENTIMENT_MAP.map((item) => (
              <button
                key={item.keyword}
                type="button"
                onClick={() => setSelectedEmoji(item)}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                  selectedEmoji.keyword === item.keyword
                    ? 'bg-[#1E293B] border-2 border-[#E2E8F0] shadow-lg scale-105'
                    : 'bg-[#111C2E]/60 border border-[#E2E8F0]/10 hover:bg-[#18263D]'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-semibold text-[#CBD5E1] mt-1">{item.keyword}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sentiment Auto-Detector Badge */}
        {sentiment.matchedKeywords.length > 0 && (
          <div className="p-3 rounded-xl bg-[#18263D] border border-[#E2E8F0]/20 flex items-center justify-between text-xs text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#52B788]" />
              <span>Matched Sentiment Keyword: <strong className="text-[#F8FAFC]">{sentiment.ratingKeyword} {sentiment.emoji}</strong></span>
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">
              Matches: {sentiment.matchedKeywords.join(', ')}
            </span>
          </div>
        )}

        {/* Review Feedback Textarea */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Detailed Review & Experience Description <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            name="reviewText"
            rows={5}
            value={formData.reviewText}
            onChange={handleChange}
            placeholder="Share your detailed experience feedback (e.g. Excellent luxury design quality, amazing project management, best experience...)"
            className="w-full px-4 py-3.5 rounded-xl luxury-input text-sm resize-y leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl btn-silver font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0B1320]" />
              <span>Submitting Review...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Review & Store in DB</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}


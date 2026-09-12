'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, FileText, Check } from 'lucide-react';
import SignatureAndTerms from './SignatureAndTerms';

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
    signatureFullName: '',
    signatureFileName: '',
    signatureData: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedPdfName, setSavedPdfName] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
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

  const handleSignatureFullNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, signatureFullName: name }));
    if (touchedErrors.signatureFullName) {
      setTouchedErrors((prev) => ({ ...prev, signatureFullName: false }));
    }
  };

  const handleSignatureChange = (dataUrl: string, fileName: string) => {
    setFormData((prev) => ({ ...prev, signatureData: dataUrl, signatureFileName: fileName }));
    if (touchedErrors.signatureFile) {
      setTouchedErrors((prev) => ({ ...prev, signatureFile: false }));
    }
  };

  const handleTermsChange = (accepted: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: accepted }));
    if (touchedErrors.termsAccepted) {
      setTouchedErrors((prev) => ({ ...prev, termsAccepted: false }));
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
      setErrorMsg(`Please provide at least 80 words describing your project scope. (${currentWordCount} words entered)`);
    }

    // Validate Signature and Terms
    if (!formData.signatureFullName.trim()) {
      newErrors.signatureFullName = true;
      hasError = true;
    }

    if (!formData.signatureData) {
      newErrors.signatureFile = true;
      hasError = true;
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = true;
      hasError = true;
    }

    if (hasError) {
      setTouchedErrors(newErrors);
      if (isWordCountValid) {
        setErrorMsg('Please complete all required fields, provide your signature, and accept the terms.');
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'client',
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          budget: formData.budget,
          description: formData.description,
          signatureFullName: formData.signatureFullName,
          signatureFileName: formData.signatureFileName,
          signatureData: formData.signatureData,
          termsAccepted: formData.termsAccepted,
        }),
      });

      const data = await res.json();

      if (data.success) {
        let generatedPdfName = data.pdfFileName || 'Submission.pdf';
        setSavedPdfName(generatedPdfName);

        if (data.pdfBase64) {
          try {
            const byteCharacters = atob(data.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            setPdfBlobUrl(blobUrl);

            // Auto-trigger browser download
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = generatedPdfName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          } catch (dlErr) {
            console.warn('Auto download error:', dlErr);
          }
        }

        setSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          budget: '',
          description: '',
          signatureFullName: '',
          signatureFileName: '',
          signatureData: '',
          termsAccepted: false,
        });
        setTouchedErrors({});
        onSuccess();
        setTimeout(() => setSubmitted(false), 12000);
      } else {
        setErrorMsg(data.error || 'Unable to send request. Please check your inputs.');
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
          <div className="space-y-1.5 flex-1">
            <h4 className="font-semibold text-sm text-[#74C69D]">Thank You! Project Inquiry Recorded & Signed</h4>
            <p className="text-xs text-[#B7E4C7]">
              Your inquiry and signature were successfully recorded. A certified copy has been saved as a PDF: <strong className="text-white underline">{savedPdfName || 'Your_Form.pdf'}</strong>
            </p>
            <p className="text-[11px] text-[#95D5B2]">
              Saved to folder: <code className="bg-[#081C10] px-1.5 py-0.5 rounded border border-[#2D6A4F]/60 text-[#D8F3DC]">C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\{savedPdfName || '[Name]_[Date].pdf'}</code>
            </p>
            {pdfBlobUrl && (
              <div className="pt-1">
                <a
                  href={pdfBlobUrl}
                  download={savedPdfName || 'Signed_Form.pdf'}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
                >
                  Download Signed PDF ({savedPdfName})
                </a>
              </div>
            )}
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

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Client Full Name */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
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
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
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

        {/* Row 4: Property Location in India */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
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
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
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

        {/* Row 6: Detailed Scope & Property Requirements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 min-h-[28px]">
            <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
              Detailed Scope of Work & Property Description <span className="text-[#EF4444]">*</span>
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
            placeholder="Describe your project requirements in detail (minimum 80 words). Include property type (3BHK apartment, villa, commercial space), exact square footage, rooms to design (living room, modular kitchen, master bedroom), preferred style (modern minimalist, traditional Indian, Scandinavian), target completion date, and specific material preferences..."
            className={`w-full px-4 py-3.5 rounded-xl luxury-input text-sm resize-y leading-relaxed font-normal ${
              touchedErrors.description ? 'luxury-input-error' : ''
            }`}
          />
        </div>

        {/* Signature & Terms Component */}
        <SignatureAndTerms
          signatureFullName={formData.signatureFullName}
          signatureFileName={formData.signatureFileName}
          signatureData={formData.signatureData}
          termsAccepted={formData.termsAccepted}
          errors={{
            signatureFullName: touchedErrors.signatureFullName,
            signatureFile: touchedErrors.signatureFile,
            termsAccepted: touchedErrors.termsAccepted,
          }}
          onFullNameChange={handleSignatureFullNameChange}
          onSignatureChange={handleSignatureChange}
          onTermsChange={handleTermsChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isWordCountValid}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-3 ${
            isWordCountValid && !loading
              ? 'btn-silver shadow-lg shadow-[#E2E8F0]/10 hover:scale-[1.005]'
              : 'bg-[#1C2838] text-[#94A3B8] cursor-not-allowed border border-[#94A3B8]/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0B1320]" />
              <span>Recording & Signing Submission...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit & Sign Client Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

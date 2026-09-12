'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FileSignature, UploadCloud, PenTool, RotateCcw, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';

export const TERMS_TEXT =
  'YourInteriorDesk helps clients and interior designers find each other. Once the client and the designer match is accepted from both the parties and payment is done to YourInteriorDesk, our role is complete. YourInteriorDesk does not take any responsibility for future communication, negotiations, project delivery, payments, disputes, or future interactions between the client and designer. The platform’s role is strictly to help clients and designers discover and connect with each other.';

export interface SignatureAndTermsProps {
  signatureFullName: string;
  signatureFileName: string;
  signatureData: string;
  termsAccepted: boolean;
  errors?: {
    signatureFullName?: boolean;
    signatureFile?: boolean;
    termsAccepted?: boolean;
  };
  onFullNameChange: (name: string) => void;
  onSignatureChange: (dataUrl: string, fileName: string) => void;
  onTermsChange: (accepted: boolean) => void;
}

export default function SignatureAndTerms({
  signatureFullName,
  signatureFileName,
  signatureData,
  termsAccepted,
  errors = {},
  onFullNameChange,
  onSignatureChange,
  onTermsChange,
}: SignatureAndTermsProps) {
  const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('upload');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas when switching to 'draw' mode
  useEffect(() => {
    if (signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signatureMode]);

  // Handle file drop or selection
  const processFile = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2 MB limit. Please select a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onSignatureChange(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl, 'digital_signature.png');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (signatureFileName === 'digital_signature.png') {
      onSignatureChange('', '');
    }
  };

  const removeSignature = () => {
    onSignatureChange('', '');
    clearCanvas();
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#E2E8F0]/20">
      {/* Terms and Conditions Section */}
      <div className="rounded-xl p-4 bg-[#0A111C]/80 border border-[#E2E8F0]/15 space-y-3 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
          <FileSignature className="w-4 h-4 text-[#E2E8F0]" />
          <span>Terms & Conditions and Intermediary Scope</span>
        </div>
        <div className="text-xs leading-relaxed text-[#94A3B8] space-y-2 max-h-32 overflow-y-auto pr-2">
          <p className="text-[#CBD5E1]">{TERMS_TEXT}</p>
          <p className="text-[11px] text-[#64748B]">
            By submitting this form, both client and designer agree that YourInteriorDesk acts solely as a matching platform. Direct engagement, contracts, project deliverables, and monetary transactions beyond platform fees remain strictly between the respective parties.
          </p>
        </div>

        {/* Checkbox */}
        <label
          className={`flex items-start gap-3 pt-2 text-xs leading-relaxed cursor-pointer select-none ${
            errors.termsAccepted ? 'text-[#FCA5A5]' : 'text-[#CBD5E1]'
          }`}
        >
          <input
            type="checkbox"
            name="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-[#E2E8F0] cursor-pointer"
          />
          <span>
            I have read, understood, and accept the Terms & Conditions. I acknowledge YourInteriorDesk’s role as an intermediary matching platform. <span className="text-[#EF4444]">*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-[11px] text-[#EF4444] font-medium">
            You must accept the terms and conditions to proceed.
          </p>
        )}
      </div>

      {/* Type Signature Full Name */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
          Type your Full Legal Name as your Signature <span className="text-[#EF4444]">*</span>
        </label>
        <input
          type="text"
          name="signatureFullName"
          value={signatureFullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="e.g. Sarah Miller or James Smith"
          className={`w-full px-4 py-3 rounded-xl luxury-input text-sm ${
            errors.signatureFullName ? 'luxury-input-error' : ''
          }`}
        />
        {errors.signatureFullName && (
          <p className="text-[11px] text-[#EF4444] font-medium">Please type your full legal name as your signature.</p>
        )}
      </div>

      {/* Add Your Signature (Upload / Drop or Draw) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="block text-xs sm:text-sm font-medium text-[#CBD5E1]">
            Add Your Signature (Upload or Draw) <span className="text-[#EF4444]">*</span>
          </label>

          {/* Mode switch tabs */}
          <div className="inline-flex rounded-lg bg-[#0F172A] p-0.5 border border-[#334155]/60 text-xs">
            <button
              type="button"
              onClick={() => setSignatureMode('upload')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                signatureMode === 'upload'
                  ? 'bg-[#E2E8F0] text-[#0B1320] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload / Drop</span>
            </button>
            <button
              type="button"
              onClick={() => setSignatureMode('draw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                signatureMode === 'draw'
                  ? 'bg-[#E2E8F0] text-[#0B1320] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw Signature</span>
            </button>
          </div>
        </div>

        {/* Upload Mode */}
        {signatureMode === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragOver
                  ? 'border-[#E2E8F0] bg-[#1E293B]/70'
                  : errors.signatureFile && !signatureData
                  ? 'border-[#EF4444] bg-[#2A0F13]/40'
                  : 'border-[#334155] hover:border-[#64748B] bg-[#0A111C]/60'
              }`}
            >
              <input
                type="file"
                id="signature-file-input"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label
                htmlFor="signature-file-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#E2E8F0]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#F8FAFC]">
                  <span className="text-[#E2E8F0] underline underline-offset-2">Click to upload</span> or drag and drop signature image
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  PNG, JPG, WEBP or SVG (Max 2 MB). A clear photo or scan of your signature.
                </p>
              </label>
            </div>
          </div>
        )}

        {/* Draw Mode */}
        {signatureMode === 'draw' && (
          <div className="space-y-2">
            <div
              className={`relative rounded-xl overflow-hidden border bg-[#060D17] ${
                errors.signatureFile && !signatureData ? 'border-[#EF4444]' : 'border-[#334155]'
              }`}
            >
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="text-[11px] text-[#64748B] absolute top-2 left-3 pointer-events-none select-none">
                Sign inside this box
              </div>
              <canvas
                ref={canvasRef}
                width={500}
                height={140}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair touch-none block"
              />
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Use your mouse, trackpad, or finger to draw your signature inside the box.
            </p>
          </div>
        )}

        {/* Signature Preview Card (Visible whenever a signature is loaded or drawn) */}
        {signatureData && (
          <div className="p-3.5 rounded-xl bg-[#0D1E30] border border-[#1E3A5F] flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-10 rounded bg-[#060D17] border border-[#334155] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={signatureData}
                  alt="Signature preview"
                  className="max-h-full max-w-full object-contain filter invert-0"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#D8F3DC] truncate">
                    {signatureFileName || 'Signature Captured'}
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] truncate">
                  Ready to submit with timestamp and signed status
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeSignature}
              className="p-1.5 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#2A0F13] transition-colors flex-shrink-0"
              title="Remove signature"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errors.signatureFile && !signatureData && (
          <p className="text-[11px] text-[#EF4444] font-medium">
            Please provide your signature by either uploading an image or drawing it in the box.
          </p>
        )}
      </div>
    </div>
  );
}
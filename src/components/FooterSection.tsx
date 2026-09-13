'use client';

import React from 'react';
import Image from 'next/image';

export default function FooterSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05080F] text-[#94A3B8] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#E2E8F0] via-[#94A3B8] to-[#CBD5E1]">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-[#16233B]">
                  <Image
                    src="/logo_cropped.png"
                    alt="Your Interior Desk Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="font-serif-luxury text-xl font-bold text-white">
                Your Interior Desk
              </span>
            </div>

            <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed">
              Bespoke interior and architectural matchmaking desk. We connect discerning property clients with hand-curated interior design studios under a transparent 3% commission model.
            </p>

            <div className="text-xs text-[#64748B]">
              Private Curation &bull; Zero Spam &bull; Verified Craftsmanship
            </div>

            {/* Social / Direct Reach Out Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/theinteriordesk.in/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-semibold text-pink-300 transition-all"
                title="Follow on Instagram @theinteriordesk.in"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@theinteriordesk.in</span>
              </a>

              <a
                href="mailto:yourinteriordesk@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all"
                title="Email yourinteriordesk@gmail.com"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>yourinteriordesk@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => scrollToSection('what-we-do')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  What We Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('benefits')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  For Clients & Designers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3% Pricing Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Me / Founder Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Model & Privacy Assurance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Pricing Transparency
            </h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>&bull; 3% Total Project Commission</li>
              <li>&bull; Flexible Initial Commitment Token of Your Choice</li>
              <li>&bull; Direct Personal Follow-up via Desk</li>
              <li>&bull; Balance Settled Only When Deal Finalizes</li>
            </ul>

            <div className="mt-6">
              <button
                onClick={() => scrollToSection('inquire')}
                className="btn-silver text-xs px-4 py-2 rounded-lg font-semibold uppercase tracking-wider"
              >
                Inquire Now
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Your Interior Desk. All rights reserved.</p>
          <p>Discreet, bespoke interior design curation & matchmaking.</p>
        </div>

      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0B1320]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#E2E8F0] via-[#94A3B8] to-[#CBD5E1] shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#16233B]">
                <Image
                  src="/logo_cropped.png"
                  alt="Your Interior Desk"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div>
              <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC] group-hover:text-white transition-colors">
                Your Interior Desk
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-medium">
                Curated Matchmaking
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#CBD5E1]">
            <button 
              onClick={() => scrollToSection('what-we-do')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              What We Do
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Clients & Designers
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              3% Pricing Model
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About Me
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('reach-out')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Reach Out
            </button>
          </div>

          {/* Right Action CTA & Social Icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/theinteriordesk.in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 flex items-center justify-center text-[#CBD5E1] hover:text-pink-300 transition-all cursor-pointer group"
              title="Instagram: @theinteriordesk.in"
              aria-label="Instagram @theinteriordesk.in"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Email Mail Icon */}
            <a
              href="mailto:yourinteriordesk@gmail.com?subject=Project%20Inquiry%20-%20Your%20Interior%20Desk"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-[#CBD5E1] hover:text-blue-300 transition-all cursor-pointer group"
              title="Mail: yourinteriordesk@gmail.com"
              aria-label="Email yourinteriordesk@gmail.com"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>

            <button
              onClick={() => scrollToSection('inquire')}
              className="btn-silver px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase cursor-pointer ml-1"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#CBD5E1] hover:text-white p-2 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B1320] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('what-we-do')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            What We Do
          </button>
          <button
            onClick={() => scrollToSection('benefits')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            Clients & Designers
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            3% Pricing Model
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            About Me
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('reach-out')}
            className="block w-full text-left py-2 text-sm text-[#CBD5E1] hover:text-white"
          >
            Reach Out
          </button>

          {/* Social Links on Mobile */}
          <div className="flex items-center gap-3 py-2 border-t border-white/10 mt-2">
            <a
              href="https://www.instagram.com/theinteriordesk.in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-pink-300 py-1.5 px-3 rounded-lg bg-pink-500/10 border border-pink-500/20"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@theinteriordesk.in</span>
            </a>

            <a
              href="mailto:yourinteriordesk@gmail.com"
              className="flex items-center gap-2 text-xs text-blue-300 py-1.5 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Mail Desk</span>
            </a>
          </div>
          <button
            onClick={() => scrollToSection('inquire')}
            className="w-full btn-silver py-2.5 rounded-xl text-center text-xs font-semibold uppercase tracking-wider mt-2"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

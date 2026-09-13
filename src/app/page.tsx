'use client';

import React, { useState } from 'react';
import ArchitecturalBackground from '@/components/ArchitecturalBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatWeDo from '@/components/WhatWeDo';
import BenefitsSection from '@/components/BenefitsSection';
import PricingSection from '@/components/PricingSection';
import AboutSection from '@/components/AboutSection';
import HowItWorks from '@/components/HowItWorks';
import ReachOutSection from '@/components/ReachOutSection';
import QuickInquiryForm from '@/components/QuickInquiryForm';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'designer'>('client');

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#CBD5E1] selection:text-[#0B1320] bg-[#0B1320] text-[#F8FAFC]">
      {/* Background Architectural Wireframe Grids */}
      <ArchitecturalBackground />

      {/* Sticky Executive Navigation */}
      <Navbar />

      <main className="relative z-10 flex-1">
        {/* Hero Section with Value Badges & Dual CTAs */}
        <HeroSection onSelectRole={(role) => setSelectedRole(role)} />

        {/* What We Do: The Curation Desk Philosophy */}
        <WhatWeDo />

        {/* How This Helps Both Clients and Designers */}
        <BenefitsSection />

        {/* Pricing & The 3% Commission Model + Interactive Calculator */}
        <PricingSection />

        {/* About Me & Founder Curation Story */}
        <AboutSection />

        {/* How It Works: 4-Step Process Flow */}
        <HowItWorks />

        {/* Official Channels & Reach Out Section */}
        <ReachOutSection />

        {/* Streamlined Quick Inquiry Form */}
        <QuickInquiryForm initialRole={selectedRole} />
      </main>

      {/* Luxury Footer */}
      <FooterSection />
    </div>
  );
}

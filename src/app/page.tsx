'use client';

import React, { useState } from 'react';
import ArchitecturalBackground from '@/components/ArchitecturalBackground';
import Header from '@/components/Header';
import RoleSelector from '@/components/RoleSelector';
import DesignerForm from '@/components/DesignerForm';
import ClientForm from '@/components/ClientForm';

export default function Home() {
  const [activeRole, setActiveRole] = useState<'designer' | 'client'>('designer');

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#070D18]">
      {/* Background visual art */}
      <ArchitecturalBackground />

      <main className="relative z-10 pb-16">
        {/* Minimal Studio Intake Header */}
        <Header />

        {/* Role Switcher Tabs */}
        <RoleSelector
          activeRole={activeRole}
          onChangeRole={(role) => setActiveRole(role)}
        />

        {/* Dynamic Vertical Row-by-Row Form Area */}
        <section className="max-w-2xl mx-auto px-4 my-4">
          {activeRole === 'designer' ? (
            <DesignerForm onSuccess={() => {}} />
          ) : (
            <ClientForm onSuccess={() => {}} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-[#D4AF37]/20 text-center text-xs text-[#8E9EAF] bg-[#070D18]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} YourInteriorDesk. All rights reserved.</p>
          <p className="font-serif-luxury text-sm text-[#C5A059] tracking-wider">
            PROPORTION • LIGHTING • MATERIAL CONSISTENCY
          </p>
        </div>
      </footer>
    </div>
  );
}

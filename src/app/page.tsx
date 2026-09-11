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
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#E2E8F0] selection:text-[#0B1422]">
      {/* Background visual art */}
      <ArchitecturalBackground />

      <main className="relative z-10 pb-16">
        {/* Minimal Emblem Header */}
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
      <footer className="relative z-10 py-6 border-t border-[#E2E8F0]/15 text-center text-xs text-[#94A3B8] bg-[#0B1422]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
          <p>© {new Date().getFullYear()} Your Interior Desk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

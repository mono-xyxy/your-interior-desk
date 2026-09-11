'use client';

import React, { useState, useEffect } from 'react';
import ArchitecturalBackground from '@/components/ArchitecturalBackground';
import Header from '@/components/Header';
import RoleSelector from '@/components/RoleSelector';
import DesignerForm from '@/components/DesignerForm';
import ClientForm from '@/components/ClientForm';
import AdminModal from '@/components/AdminModal';
import { Database, FileSpreadsheet, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [activeRole, setActiveRole] = useState<'designer' | 'client'>('designer');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [submissionsCount, setSubmissionsCount] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissionsCount(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#070D18]">
      {/* Background visual art */}
      <ArchitecturalBackground />

      <main className="relative z-10 pb-16">
        {/* Main Brand Header */}
        <Header
          onOpenAdmin={() => setIsAdminOpen(true)}
          submissionsCount={submissionsCount}
        />

        {/* Role Switcher Tabs */}
        <RoleSelector
          activeRole={activeRole}
          onChangeRole={(role) => setActiveRole(role)}
        />

        {/* Dynamic Form Area */}
        <section className="max-w-3xl mx-auto px-4 my-6">
          {activeRole === 'designer' ? (
            <DesignerForm onSuccess={fetchStats} />
          ) : (
            <ClientForm onSuccess={fetchStats} />
          )}
        </section>

        {/* Database & Vercel Auto-Sync Info Banner */}
        <section className="max-w-3xl mx-auto px-4 mt-8">
          <div className="p-4 rounded-xl bg-[#0E1726]/80 border border-[#D4AF37]/20 text-xs text-[#8E9EAF] flex items-center justify-between flex-wrap gap-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>
                Auto-saves to <code className="text-[#D4AF37] font-mono bg-[#070D18] px-1.5 py-0.5 rounded">C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx</code>
              </span>
            </div>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>View & Download Excel DB</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-[#D4AF37]/20 text-center text-xs text-[#8E9EAF] bg-[#070D18]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} YourInteriorDesk. All rights reserved.</p>
          <p className="font-serif-luxury text-sm text-[#C5A059] tracking-wider">
            PROPORTION • LIGHTING • MATERIAL CONSISTENCY
          </p>
        </div>
      </footer>

      {/* Admin Database Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { Palette, UserCheck, Star } from 'lucide-react';

export type TabType = 'designer' | 'client' | 'review';

interface RoleSelectorProps {
  activeRole: TabType;
  onChangeRole: (role: TabType) => void;
}

export default function RoleSelector({ activeRole, onChangeRole }: RoleSelectorProps) {
  return (
    <div className="relative z-10 max-w-2xl mx-auto my-6 px-4">
      <div className="p-1.5 rounded-xl bg-[#111C2E]/90 border border-[#E2E8F0]/20 backdrop-blur-md shadow-2xl flex flex-wrap sm:flex-nowrap gap-2">
        {/* Designer Button */}
        <button
          type="button"
          onClick={() => onChangeRole('designer')}
          className={`flex-1 py-3 px-3.5 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
            activeRole === 'designer'
              ? 'bg-gradient-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] text-[#0B1422] shadow-lg shadow-[#E2E8F0]/20 scale-[1.01]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#18263D]'
          }`}
        >
          <Palette className={`w-4 h-4 ${activeRole === 'designer' ? 'text-[#0B1422]' : 'text-[#E2E8F0]'}`} />
          <span>Interior Designer</span>
        </button>

        {/* Client Button */}
        <button
          type="button"
          onClick={() => onChangeRole('client')}
          className={`flex-1 py-3 px-3.5 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
            activeRole === 'client'
              ? 'bg-gradient-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] text-[#0B1422] shadow-lg shadow-[#E2E8F0]/20 scale-[1.01]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#18263D]'
          }`}
        >
          <UserCheck className={`w-4 h-4 ${activeRole === 'client' ? 'text-[#0B1422]' : 'text-[#E2E8F0]'}`} />
          <span>Hiring Client</span>
        </button>

        {/* Review Button */}
        <button
          type="button"
          onClick={() => onChangeRole('review')}
          className={`flex-1 py-3 px-3.5 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
            activeRole === 'review'
              ? 'bg-gradient-to-r from-[#F8FAFC] via-[#E2E8F0] to-[#CBD5E1] text-[#0B1422] shadow-lg shadow-[#E2E8F0]/20 scale-[1.01]'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#18263D]'
          }`}
        >
          <Star className={`w-4 h-4 ${activeRole === 'review' ? 'text-[#0B1422]' : 'text-[#E2E8F0]'}`} />
          <span>Reviews & Feedback</span>
        </button>
      </div>
    </div>
  );
}


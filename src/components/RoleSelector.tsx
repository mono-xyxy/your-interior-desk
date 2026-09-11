'use client';

import React from 'react';
import { Palette, UserCheck } from 'lucide-react';

interface RoleSelectorProps {
  activeRole: 'designer' | 'client';
  onChangeRole: (role: 'designer' | 'client') => void;
}

export default function RoleSelector({ activeRole, onChangeRole }: RoleSelectorProps) {
  return (
    <div className="relative z-10 max-w-xl mx-auto my-8 px-4">
      <div className="p-1.5 rounded-xl bg-[#0E1726]/90 border border-[#D4AF37]/30 backdrop-blur-md shadow-2xl flex gap-2">
        {/* Designer Button */}
        <button
          type="button"
          onClick={() => onChangeRole('designer')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
            activeRole === 'designer'
              ? 'bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#9B7829] text-[#070D18] shadow-lg shadow-[#D4AF37]/25 scale-[1.02]'
              : 'text-[#8E9EAF] hover:text-[#F8F6F0] hover:bg-[#162338]'
          }`}
        >
          <Palette className={`w-4 h-4 ${activeRole === 'designer' ? 'text-[#070D18]' : 'text-[#C5A059]'}`} />
          <span>INTERIOR DESIGNER</span>
        </button>

        {/* Client Button */}
        <button
          type="button"
          onClick={() => onChangeRole('client')}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ${
            activeRole === 'client'
              ? 'bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#9B7829] text-[#070D18] shadow-lg shadow-[#D4AF37]/25 scale-[1.02]'
              : 'text-[#8E9EAF] hover:text-[#F8F6F0] hover:bg-[#162338]'
          }`}
        >
          <UserCheck className={`w-4 h-4 ${activeRole === 'client' ? 'text-[#070D18]' : 'text-[#C5A059]'}`} />
          <span>HIRING CLIENT</span>
        </button>
      </div>

      {/* Role Sub-description */}
      <p className="text-center text-xs text-[#8E9EAF] mt-3 font-light">
        {activeRole === 'designer'
          ? '✦ Register your portfolio & minimum project budget to receive client leads across India.'
          : '✦ Submit your interior requirements & budget to connect with top interior designers in India.'}
      </p>
    </div>
  );
}

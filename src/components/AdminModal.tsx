'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Database, FileSpreadsheet, RefreshCw, User, Palette } from 'lucide-react';
import { SubmissionData } from '@/lib/excel';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'designer' | 'client'>('all');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = submissions.filter((s) => (activeTab === 'all' ? true : s.role === activeTab));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#D4AF37]/20 bg-[#0A121F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#F8F6F0]">
                Client & Designer Database Intake
              </h3>
              <p className="text-xs text-[#8E9EAF]">
                Local Excel Path: <code className="text-[#D4AF37] font-mono">C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162338] text-[#8E9EAF] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar & Stats */}
        <div className="p-4 bg-[#0E1726] border-b border-[#D4AF37]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'all' ? 'bg-[#D4AF37] text-[#070D18]' : 'bg-[#162338] text-[#8E9EAF] hover:text-white'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'designer' ? 'bg-[#D4AF37] text-[#070D18]' : 'bg-[#162338] text-[#8E9EAF] hover:text-white'
              }`}
            >
              Designers ({submissions.filter((s) => s.role === 'designer').length})
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'client' ? 'bg-[#D4AF37] text-[#070D18]' : 'bg-[#162338] text-[#8E9EAF] hover:text-white'
              }`}
            >
              Clients ({submissions.filter((s) => s.role === 'client').length})
            </button>
          </div>

          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-[#D4AF37] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8E9EAF] space-y-3">
              <Database className="w-12 h-12 text-[#D4AF37]/30 mx-auto" />
              <p className="text-sm">No submissions recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37]/30 bg-[#080F1B] text-[#C5A059] font-semibold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Budget (₹)</th>
                    <th className="p-3">Words</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 text-[#F8F6F0]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#162338]/50 transition-colors">
                      <td className="p-3 font-mono text-[#D4AF37]">{item.id}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.role === 'designer'
                              ? 'bg-[#2A2312] text-[#D4AF37] border border-[#D4AF37]/40'
                              : 'bg-[#102438] text-[#60A5FA] border border-[#60A5FA]/40'
                          }`}
                        >
                          {item.role === 'designer' ? <Palette className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {item.role}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{item.fullName}</td>
                      <td className="p-3 text-[#CBD5E1]">
                        <div>{item.email}</div>
                        <div className="text-[11px] text-[#8E9EAF]">{item.phone}</div>
                      </td>
                      <td className="p-3 text-[#CBD5E1]">{item.location}</td>
                      <td className="p-3 text-[#D4AF37] font-semibold">{item.budget}</td>
                      <td className="p-3 font-mono text-[#52B788]">{item.wordCount || 0}</td>
                      <td className="p-3 text-[#CBD5E1] max-w-xs truncate">{item.description}</td>
                      <td className="p-3 text-[11px] text-[#8E9EAF] whitespace-nowrap">{item.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

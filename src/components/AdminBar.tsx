import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Database, Target, RotateCcw, LogOut, CheckCircle, RefreshCw } from 'lucide-react';

interface AdminBarProps {
  onOpenGoalModal: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onOpenGoalModal }) => {
  const { isAdmin, logoutAdmin, setIsSupabaseModalOpen, supabaseConfig, syncWithSupabase, resetToDefaults } = useApp();

  if (!isAdmin) return null;

  return (
    <div className="sticky top-0 z-40 bg-[#3D2619] text-[#FFFBF5] px-4 py-2.5 text-xs shadow-md border-b border-[#5C3A21]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Admin Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E07A5F] text-white">
            <ShieldAlert className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold tracking-wide text-amber-200">Admin Mode Active</span>
          <span className="hidden sm:inline text-[#E8D7C8]/70">|</span>
          <span className="hidden md:inline text-[#E8D7C8]/90">
            Inline edit buttons are visible across Cats, Menu, Timeline & Wishlist.
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Supabase status pill */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#5C3A21] hover:bg-[#734A2B] text-white transition cursor-pointer"
            title="Configure Supabase Connection"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase:</span>
            <span className={supabaseConfig.isConnected ? 'text-emerald-300 font-medium' : 'text-amber-300 font-medium'}>
              {supabaseConfig.isConnected ? 'Connected' : 'Local Cache'}
            </span>
          </button>

          {/* Sync Now */}
          {supabaseConfig.isConnected && (
            <button
              onClick={() => syncWithSupabase()}
              className="p-1 rounded bg-[#5C3A21] hover:bg-[#734A2B] text-white transition"
              title="Sync now with Supabase"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit Goal */}
          <button
            onClick={onOpenGoalModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E07A5F] hover:bg-[#C85A32] text-white font-medium transition cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Edit RM Goal</span>
          </button>

          {/* Reset Defaults */}
          <button
            onClick={() => {
              if (window.confirm('Reset all cats, menu items, updates, and goals to initial default data?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#5C3A21]/60 hover:bg-[#5C3A21] text-[#E8D7C8] transition cursor-pointer"
            title="Reset data to factory defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>

          {/* Logout */}
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

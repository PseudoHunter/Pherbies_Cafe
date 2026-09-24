import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(username, password);
    if (success) {
      setIsLoginModalOpen(false);
      setUsername('');
      setPassword('');
    } else {
      setError('Access verification failed. Incorrect security credentials.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={() => setIsLoginModalOpen(false)}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8D7C8] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-[#3D2619] transition cursor-pointer"
          aria-label="Dismiss security modal"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Obfuscated Security Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-11 h-11 rounded-2xl bg-[#3D2619] text-amber-200 flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif-cozy text-xl font-bold text-[#3D2619] tracking-tight">
            Security Access Control
          </h3>
          <p className="text-xs text-[#5C3A21]/75 leading-relaxed">
            Enter authorized access credentials to establish an elevated operational session.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#3D2619] mb-1">
              Account Identifier
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Identifier"
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#3D2619] bg-[#FFFBF5] text-[#3D2619]"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2619] mb-1">
              Security Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#3D2619] bg-[#FFFBF5] text-[#3D2619]"
                required
              />
              <div className="absolute right-3 top-2.5 text-zinc-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#3D2619] hover:bg-[#5C3A21] text-[#FFFBF5] font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Verify &amp; Proceed</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
          </button>
        </form>

        <div className="text-center pt-1 border-t border-[#F5EAD9]">
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
            System ID: PHERBIES-OS-2026
          </span>
        </div>
      </div>
    </div>
  );
};

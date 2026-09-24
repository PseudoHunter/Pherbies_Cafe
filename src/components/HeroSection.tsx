import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Coffee, ShieldCheck, Sparkles, ChevronRight, Stethoscope, Utensils, Sparkle, Edit3 } from 'lucide-react';
import { smoothScrollTo } from '../utils/scroll';

interface HeroSectionProps {
  onOpenGoalModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenGoalModal }) => {
  const { donationGoal, isAdmin } = useApp();

  const percentage = Math.min(
    Math.round((donationGoal.raised_amount / Math.max(donationGoal.target_amount, 1)) * 100),
    100
  );

  const remaining = Math.max(donationGoal.target_amount - donationGoal.raised_amount, 0);

  return (
    <section id="goal" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Subtle Warm Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FCEADE]/60 blur-3xl" />
        <div className="absolute top-32 right-10 w-96 h-96 rounded-full bg-[#E0EFE6]/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission Narrative & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Mission Pill */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF6EC] border border-[#F0DDC8] text-[#C85A32] text-xs font-bold tracking-wide shadow-xs max-w-full">
              <span className="text-sm">✨</span>
              <span className="break-words">Home Cafe &amp; TNR Cat Rescue</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] hidden xs:inline-block" />
              <span className="text-[#5C3A21]/80 font-semibold break-words">Subang Jaya, MY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-cozy text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3D2619] tracking-tight leading-[1.18] break-words hyphens-auto">
              Sip Coffee, <br />
              <span className="text-[#D97746] relative inline-block">
                Save Stray Lives
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#E07A5F]/40"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              🐾
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-[#5C3A21]/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal break-words hyphens-auto">
              Welcome to <strong className="text-[#3D2619] font-bold">Pherbies Cafe</strong> — a cozy home cafe where 
              every handcrafted coffee, artisanal sourdough, and warm pastry directly funds medical vet bills, 
              nutritious food (&ldquo;makanan&rdquo;), tofu litter, and monthly Trap-Neuter-Return (TNR) drives for our 
              8 resident cat rescues and local street strays.
            </p>

            {/* Action Buttons with Smooth Scrolling */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('menu', 80);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Coffee className="w-5 h-5" />
                <span>Explore Cafe Menu &amp; Order</span>
              </a>

              <a
                href="#cats"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('cats', 80);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FDF6EC] hover:bg-[#F7EEDB] text-[#3D2619] font-semibold text-base border border-[#E8D7C8] shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <span>Meet Our 8 Resident Cats</span>
                <ChevronRight className="w-4 h-4 text-[#D97746]" />
              </a>

              <a
                href="#support"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo('support', 80);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#E0EFE6] hover:bg-[#D0E6D8] text-[#1B4332] font-semibold text-base border border-[#C2DEC9] shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Direct Donation</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#5C3A21]/80 border-t border-[#F0DDC8]/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Proceeds to Cat Welfare</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">✂️</span>
                <span>Monthly Neighborhood TNR Spay Drives</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">🐱</span>
                <span>8 Rescued Furbabies Sheltered</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dynamic Donation Goal Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xl border border-[#F0DDC8] relative overflow-hidden">
              {/* Decorative Cat Watermark in card background */}
              <div className="absolute -bottom-8 -right-8 text-8xl opacity-10 select-none pointer-events-none">
                🐱
              </div>

              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-bold text-[#D97746]">
                      Live Monthly Rescue Fund
                    </span>
                  </div>
                  <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619] mt-0.5">
                    {donationGoal.month_label} Goal
                  </h3>
                </div>

                {isAdmin && (
                  <button
                    onClick={onOpenGoalModal}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FDF6EC] hover:bg-[#F7EEDB] text-[#C85A32] border border-[#E8D7C8] transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Goal</span>
                  </button>
                )}
              </div>

              {/* Financial Big Numbers */}
              <div className="flex items-baseline justify-between gap-2 mb-3 min-w-0">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#5C3A21]/70 block truncate">Current Total Raised</span>
                  <div className="flex items-baseline gap-1 min-w-0">
                    <span className="font-serif-cozy text-3xl sm:text-4xl md:text-5xl font-black text-[#3D2619] truncate">
                      RM {donationGoal.raised_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#5C3A21]/70 block">Monthly Target</span>
                  <span className="text-base sm:text-lg font-bold text-[#5C3A21]">
                    RM {donationGoal.target_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2 mb-6">
                <div className="relative w-full h-5 rounded-full bg-[#F5EAD9] p-1 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E07A5F] via-[#D97746] to-[#C85A32] transition-all duration-1000 relative"
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Animated shine line */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-[#5C3A21] flex-wrap gap-1">
                  <span className="text-[#C85A32] font-bold">{percentage}% Achieved</span>
                  {remaining > 0 ? (
                    <span className="text-[11px] sm:text-xs">RM {remaining.toLocaleString()} left to reach goal</span>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] sm:text-xs">🎉 Goal fully met this month!</span>
                  )}
                </div>
              </div>

              {/* Monthly Allocation Breakdown */}
              <div className="pt-4 border-t border-[#F5EAD9] space-y-2.5">
                <span className="text-xs font-bold tracking-wider uppercase text-[#5C3A21]/75 block break-words">
                  Where Your Support Goes Every Month:
                </span>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
                  {/* Vet Bills */}
                  <div className="p-2.5 rounded-xl bg-[#FDF6EC] border border-[#F0DDC8]/60 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#5C3A21]/80 block text-[11px] leading-tight">Vet &amp; Spay/Neuter</span>
                      <span className="font-bold text-[#3D2619]">RM {donationGoal.vet_bills_target || 1500}</span>
                    </div>
                  </div>

                  {/* Food / Makanan */}
                  <div className="p-2.5 rounded-xl bg-[#FDF6EC] border border-[#F0DDC8]/60 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#5C3A21]/80 block text-[11px] leading-tight">Makanan &amp; Kibbles</span>
                      <span className="font-bold text-[#3D2619]">RM {donationGoal.food_target || 1000}</span>
                    </div>
                  </div>

                  {/* Tofu Litter */}
                  <div className="p-2.5 rounded-xl bg-[#FDF6EC] border border-[#F0DDC8]/60 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <span className="text-xs">🌱</span>
                    </div>
                    <div>
                      <span className="text-[#5C3A21]/80 block text-[11px] leading-tight">Tofu Cat Litter</span>
                      <span className="font-bold text-[#3D2619]">RM {donationGoal.litter_target || 600}</span>
                    </div>
                  </div>

                  {/* Vitamins & Meds */}
                  <div className="p-2.5 rounded-xl bg-[#FDF6EC] border border-[#F0DDC8]/60 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#5C3A21]/80 block text-[11px] leading-tight">Vitamins &amp; Flea Meds</span>
                      <span className="font-bold text-[#3D2619]">RM {donationGoal.vitamins_target || 400}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Sponsor Action */}
              <div className="mt-5 pt-4 border-t border-[#F5EAD9]">
                <a
                  href="#support"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#3D2619] hover:bg-[#5C3A21] text-[#FFFBF5] text-xs font-bold transition shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Sponsor a Cat Meal or Tofu Litter Bag</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

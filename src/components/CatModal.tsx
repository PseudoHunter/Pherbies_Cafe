import React from 'react';
import { Cat } from '../types';
import { X, Heart, ShieldCheck, Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface CatModalProps {
  cat: Cat | null;
  onClose: () => void;
  onSponsor: (cat: Cat) => void;
}

export const CatModal: React.FC<CatModalProps> = ({ cat, onClose, onSponsor }) => {
  if (!cat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#F0DDC8] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto">
          {/* Hero Cat Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#FDF6EC]">
            {cat.photo_url && cat.photo_url.trim() !== '' ? (
              <img
                src={cat.photo_url.trim()}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDF6EC] text-[#D97746]">
                <span className="text-6xl mb-2">🐾</span>
                <span className="text-sm font-bold text-[#5C3A21]/70">{cat.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {cat.gender && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
                    {cat.gender === 'Boy' ? '♂️ Boy' : '♀️ Girl'}
                  </span>
                )}
                {cat.age && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
                    {cat.age}
                  </span>
                )}
                {cat.is_favorite && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E07A5F] text-white">
                    ⭐ Resident Star
                  </span>
                )}
              </div>
              <h3 className="font-serif-cozy text-3xl font-extrabold">{cat.name}</h3>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {cat.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF6EC] text-[#C85A32] border border-[#F0DDC8]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Rescue Story */}
            <div className="space-y-2">
              <h4 className="font-serif-cozy text-lg font-bold text-[#3D2619] flex items-center gap-2">
                <span>Rescue Story</span>
                <span className="text-[#D97746]">🐾</span>
              </h4>
              <p className="text-sm sm:text-base text-[#5C3A21]/90 leading-relaxed bg-[#FFFBF5] p-4 rounded-2xl border border-[#F7EEDB]">
                {cat.rescue_story}
              </p>
            </div>

            {/* Health & Medical Status */}
            <div className="p-4 rounded-2xl bg-[#E0EFE6]/50 border border-[#C2DEC9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Health &amp; Medical Care Status</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1B4332] font-medium leading-relaxed">
                {cat.health_status}
              </p>
            </div>

            {/* Rescue Intake Date */}
            {cat.intake_date && (
              <div className="flex items-center gap-2 text-xs text-[#5C3A21]/70">
                <Calendar className="w-3.5 h-3.5" />
                <span>Rescued into Pherbies care: <strong>{cat.intake_date}</strong></span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onSponsor(cat);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Sponsor {cat.name}&apos;s Makanan &amp; Care</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-[#FDF6EC] hover:bg-[#F7EEDB] text-[#5C3A21] font-semibold text-sm border border-[#E8D7C8] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

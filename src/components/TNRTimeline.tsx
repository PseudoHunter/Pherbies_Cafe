import React from 'react';
import { useApp } from '../context/AppContext';
import { TNRUpdate } from '../types';
import { Calendar, MapPin, Receipt, PlusCircle, Edit3, Trash2, HeartHandshake, ShieldCheck } from 'lucide-react';

interface TNRTimelineProps {
  onOpenAddTNRModal: () => void;
  onOpenEditTNRModal: (update: TNRUpdate) => void;
}

export const TNRTimeline: React.FC<TNRTimelineProps> = ({
  onOpenAddTNRModal,
  onOpenEditTNRModal,
}) => {
  const { tnrUpdates, isAdmin, deleteTNRUpdate } = useApp();

  const totalTreated = tnrUpdates.reduce((sum, u) => sum + (u.cats_treated_count || 1), 0);

  return (
    <section id="tnr" className="py-16 md:py-24 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0EFE6] border border-[#C2DEC9] text-[#1B4332] text-xs font-bold mb-2">
              <span>✂️</span>
              <span>Trap-Neuter-Return (TNR) &amp; Medical Outreach</span>
            </div>
            <h2 className="font-serif-cozy text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2619] tracking-tight break-words hyphens-auto">
              Neighborhood Rescue Timeline
            </h2>
            <p className="text-sm sm:text-base text-[#5C3A21]/80 mt-2 max-w-2xl leading-relaxed break-words hyphens-auto">
              TNR is the humane, scientifically proven way to control stray cat populations and stop feline suffering. 
              Here is how your cafe patronage and contributions directly save lives in local communities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Quick Stat Pill */}
            <div className="px-3.5 py-2 rounded-2xl bg-[#FDF6EC] border border-[#F0DDC8] text-center min-w-0">
              <span className="text-[11px] font-bold text-[#5C3A21]/70 block truncate">Total Treated</span>
              <span className="font-serif-cozy text-xl sm:text-2xl font-black text-[#D97746]">
                {totalTreated}+ Cats
              </span>
            </div>

            {/* Admin Add TNR Button */}
            {isAdmin && (
              <button
                onClick={onOpenAddTNRModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Update</span>
              </button>
            )}
          </div>
        </div>

        {/* Timeline / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tnrUpdates.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#F0DDC8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-w-0"
            >
              <div className="min-w-0">
                {/* Photo */}
                <div className="relative h-56 w-full overflow-hidden bg-[#FDF6EC]">
                  {item.photo_url && item.photo_url.trim() !== '' ? (
                    <img
                      src={item.photo_url.trim()}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDF6EC] text-[#D97746]">
                      <span className="text-4xl mb-1">✂️</span>
                      <span className="text-xs font-bold text-[#5C3A21]/70 truncate max-w-[80%]">{item.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Cats Treated Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E07A5F] text-white shadow-sm">
                      <span>🐾</span>
                      <span>{item.cats_treated_count} {item.cats_treated_count === 1 ? 'Cat' : 'Cats'} Treated</span>
                    </span>
                  </div>

                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl z-20">
                      <button
                        onClick={() => onOpenEditTNRModal(item)}
                        className="p-1.5 rounded bg-white/20 hover:bg-white text-white hover:text-[#3D2619] transition cursor-pointer"
                        title="Edit Update"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${item.title}"?`)) {
                            deleteTNRUpdate(item.id);
                          }
                        }}
                        className="p-1.5 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition cursor-pointer"
                        title="Delete Update"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Date overlay */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-200" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 min-w-0">
                  <h3 className="font-serif-cozy text-lg sm:text-xl font-bold text-[#3D2619] group-hover:text-[#D97746] transition-colors leading-snug break-words hyphens-auto min-w-0">
                    {item.title}
                  </h3>

                  {item.location && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#5C3A21]/70 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#E07A5F] shrink-0" />
                      <span className="truncate min-w-0">{item.location}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#5C3A21]/85 leading-relaxed line-clamp-3 break-words hyphens-auto">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Receipt & Transparent Cost Box */}
              {(item.cost_rm || item.receipt_summary) && (
                <div className="p-5 pt-0 min-w-0">
                  <div className="p-3.5 rounded-2xl bg-[#FDF6EC] border border-[#F0DDC8]/80 text-xs space-y-1 min-w-0">
                    <div className="flex items-center justify-between text-[#3D2619] font-bold gap-2">
                      <div className="flex items-center gap-1.5 text-[#5C3A21] min-w-0">
                        <Receipt className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                        <span className="truncate">Vet Expenses:</span>
                      </div>
                      {item.cost_rm && (
                        <span className="font-serif-cozy font-black text-[#D97746] shrink-0">
                          RM {item.cost_rm}
                        </span>
                      )}
                    </div>
                    {item.receipt_summary && (
                      <p className="text-[11px] text-[#5C3A21]/70 italic break-words hyphens-auto">
                        {item.receipt_summary}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

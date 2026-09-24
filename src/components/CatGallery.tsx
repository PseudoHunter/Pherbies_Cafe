import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Cat } from '../types';
import { CatModal } from './CatModal';
import { Heart, PlusCircle, Edit3, Trash2, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface CatGalleryProps {
  onOpenAddCatModal: () => void;
  onOpenEditCatModal: (cat: Cat) => void;
}

export const CatGallery: React.FC<CatGalleryProps> = ({
  onOpenAddCatModal,
  onOpenEditCatModal,
}) => {
  const { cats, isAdmin, deleteCat, showToast } = useApp();
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Extract unique tags for filtering
  const filterOptions = useMemo(() => {
    const set = new Set<string>();
    cats.forEach((c) => {
      c.tags.forEach((t) => set.add(t));
    });
    return ['All', 'TNR Success', 'Friendly', ...Array.from(set).filter((t) => t !== 'TNR Success' && t !== 'Friendly').slice(0, 3)];
  }, [cats]);

  const filteredCats = useMemo(() => {
    if (activeFilter === 'All') return cats;
    return cats.filter((cat) => cat.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase()));
  }, [cats, activeFilter]);

  const handleSponsorCat = (cat: Cat) => {
    const text = encodeURIComponent(
      `Hello Pherbies Cafe! 🐾 I would love to sponsor meals and medical care for rescued resident cat *${cat.name}*! Please guide me on how I can transfer or donate supplies for ${cat.name}. Thank you!`
    );
    window.open(`https://wa.me/60123456789?text=${text}`, '_blank');
    showToast(`Opening WhatsApp to sponsor ${cat.name}! 🐾`, 'success');
  };

  return (
    <section id="cats" className="py-16 md:py-24 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF6EC] border border-[#F0DDC8] text-[#D97746] text-xs font-bold mb-2">
              <span>🐱</span>
              <span>Our Permanent Residents &amp; Fosters</span>
            </div>
            <h2 className="font-serif-cozy text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2619] tracking-tight break-words hyphens-auto">
              Meet Our Rescued Cats
            </h2>
            <p className="text-sm sm:text-base text-[#5C3A21]/80 mt-2 max-w-2xl leading-relaxed break-words hyphens-auto">
              Each resident at Pherbies was saved from roadside danger, starvation, or injuries. 
              Your cafe visits and donations directly keep their food bowls full and health checks up to date.
            </p>
          </div>

          {/* Admin Add New Cat CTA */}
          {isAdmin && (
            <button
              onClick={onOpenAddCatModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-sm shadow-md transition cursor-pointer self-start md:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Rescued Cat</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C3A21]/70 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#3D2619] text-[#FFFBF5] shadow-xs'
                  : 'bg-[#FDF6EC] text-[#5C3A21] hover:bg-[#F7EEDB] border border-[#F0DDC8]'
              }`}
            >
              {filter} {filter === 'All' ? `(${cats.length})` : ''}
            </button>
          ))}
        </div>

        {/* Cats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCats.map((cat) => (
            <div
              key={cat.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#F0DDC8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 min-w-0"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-[#FDF6EC]">
                {cat.photo_url && cat.photo_url.trim() !== '' ? (
                  <img
                    src={cat.photo_url.trim()}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDF6EC] text-[#D97746]">
                    <span className="text-4xl mb-1">🐾</span>
                    <span className="text-xs font-bold text-[#5C3A21]/70">{cat.name}</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 max-w-[70%]">
                  {cat.tags.slice(0, 1).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3D2619]/80 backdrop-blur-md text-[#FFFBF5] shadow-xs truncate"
                    >
                      {tag}
                    </span>
                  ))}
                  {cat.is_favorite && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E07A5F] text-white shadow-xs">
                      Favorite ❤️
                    </span>
                  )}
                </div>

                {/* Admin Quick Action Controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-xl z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditCatModal(cat);
                      }}
                      className="p-1 rounded-md bg-white/20 hover:bg-white text-white hover:text-[#3D2619] transition cursor-pointer"
                      title="Edit Cat Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to remove ${cat.name}?`)) {
                          deleteCat(cat.id);
                        }
                      }}
                      className="p-1 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white transition cursor-pointer"
                      title="Delete Cat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1 min-w-0">
                    <h3 className="font-serif-cozy text-lg sm:text-xl font-bold text-[#3D2619] group-hover:text-[#D97746] transition-colors truncate min-w-0">
                      {cat.name}
                    </h3>
                    {cat.age && (
                      <span className="text-xs font-semibold text-[#5C3A21]/70 shrink-0">{cat.age}</span>
                    )}
                  </div>

                  <p className="text-xs text-[#5C3A21]/80 line-clamp-2 leading-relaxed break-words hyphens-auto">
                    {cat.rescue_story}
                  </p>
                </div>

                {/* Health Status Pill */}
                <div className="pt-2 border-t border-[#F5EAD9] min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1B4332] font-medium bg-[#E0EFE6]/60 px-2.5 py-1.5 rounded-xl border border-[#C2DEC9] min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate min-w-0">{cat.health_status}</span>
                  </div>
                </div>

                {/* Actions: View Details / Sponsor */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedCat(cat)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FDF6EC] hover:bg-[#F7EEDB] text-[#3D2619] text-xs font-bold border border-[#E8D7C8] transition text-center cursor-pointer"
                  >
                    View Story
                  </button>

                  <button
                    onClick={() => handleSponsorCat(cat)}
                    className="w-full py-2 px-3 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Heart className="w-3 h-3 fill-white" />
                    <span>Sponsor</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cat Detail Modal */}
      <CatModal
        cat={selectedCat}
        onClose={() => setSelectedCat(null)}
        onSponsor={handleSponsorCat}
      />
    </section>
  );
};

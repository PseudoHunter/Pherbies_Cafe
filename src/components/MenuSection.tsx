import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Search, Sparkles, PlusCircle } from 'lucide-react';

interface MenuSectionProps {
  onOpenAddMenuModal: () => void;
  onOpenEditMenuModal: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onOpenAddMenuModal,
  onOpenEditMenuModal,
}) => {
  const { menuItems, isAdmin, addToCart, toggleMenuAvailability, deleteMenuItem, setIsCartOpen } = useApp();
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const categories = ['All', 'Coffee & Drinks', 'Main Meals', 'Pastries'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAvail = onlyAvailable ? item.is_available : true;
      return matchCat && matchSearch && matchAvail;
    });
  }, [menuItems, activeCategory, searchQuery, onlyAvailable]);

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FDF6EC]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F0DDC8] text-[#C85A32] text-xs font-bold mb-2">
              <span>☕</span>
              <span>Home Kitchen &amp; Artisan Brews</span>
            </div>
            <h2 className="font-serif-cozy text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2619] tracking-tight break-words hyphens-auto">
              Cafe Menu &amp; Order
            </h2>
            <p className="text-sm sm:text-base text-[#5C3A21]/80 mt-2 max-w-2xl leading-relaxed break-words hyphens-auto">
              Freshly prepared with love. Pick your comfort food &amp; drinks, add to your order cart, 
              and send your order directly to our barista via WhatsApp!
            </p>
          </div>

          {/* Admin Add Menu Item */}
          {isAdmin && (
            <button
              onClick={onOpenAddMenuModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-sm shadow-md transition cursor-pointer self-start md:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          )}
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#3D2619] text-[#FFFBF5] shadow-xs'
                    : 'bg-white text-[#5C3A21] hover:bg-[#F7EEDB] border border-[#E8D7C8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & In Stock Filter */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-[#5C3A21]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E07A5F] text-[#3D2619]"
              />
            </div>

            <label className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5C3A21] cursor-pointer shrink-0 bg-white px-3 py-2 rounded-xl border border-[#E8D7C8]">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-[#E07A5F] focus:ring-[#E07A5F]"
              />
              <span>In Stock</span>
            </label>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F0DDC8] p-8">
            <p className="text-sm font-bold text-[#5C3A21]">No items matched your filter or search.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setOnlyAvailable(false);
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#E07A5F] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group bg-white rounded-3xl overflow-hidden border border-[#F0DDC8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-w-0 ${
                  !item.is_available ? 'opacity-75' : ''
                }`}
              >
                <div className="min-w-0">
                  {/* Item Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#FDF6EC]">
                    {item.image_url && item.image_url.trim() !== '' ? (
                      <img
                        src={item.image_url.trim()}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDF6EC] text-[#D97746]">
                        <span className="text-4xl mb-1">☕</span>
                        <span className="text-xs font-bold text-[#5C3A21]/70">{item.name}</span>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[65%]">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3D2619]/80 backdrop-blur-md text-[#FFFBF5] truncate">
                        {item.category}
                      </span>
                      {item.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E07A5F] text-white truncate"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Stock pill */}
                    <div className="absolute top-3 right-3">
                      {item.is_available ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-800/90 text-zinc-200 backdrop-blur-xs">
                          <XCircle className="w-3 h-3" />
                          <span>Sold Out</span>
                        </span>
                      )}
                    </div>

                    {/* Admin Action Overlay */}
                    {isAdmin && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl z-20">
                        <button
                          onClick={() => toggleMenuAvailability(item.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold text-white transition cursor-pointer ${
                            item.is_available ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                          title="Quick toggle stock status"
                        >
                          {item.is_available ? 'Mark Sold Out' : 'Mark In Stock'}
                        </button>
                        <button
                          onClick={() => onOpenEditMenuModal(item)}
                          className="p-1.5 rounded bg-white/20 hover:bg-white text-white hover:text-[#3D2619] transition cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${item.name}" from the menu?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="p-5 space-y-2 min-w-0">
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <h3 className="font-serif-cozy text-base sm:text-lg font-bold text-[#3D2619] group-hover:text-[#D97746] transition-colors leading-snug break-words hyphens-auto min-w-0 flex-1">
                        {item.name}
                      </h3>
                      <span className="font-serif-cozy text-base sm:text-lg font-black text-[#D97746] shrink-0 whitespace-nowrap">
                        RM {item.price_rm.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#5C3A21]/80 leading-relaxed line-clamp-2 break-words hyphens-auto">
                      {item.description}
                    </p>

                    {item.preparation_note && (
                      <p className="text-[11px] text-[#C85A32] italic break-words hyphens-auto">
                        * {item.preparation_note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Add-to-Cart Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      if (item.is_available) {
                        addToCart(item);
                        setIsCartOpen(true);
                      }
                    }}
                    disabled={!item.is_available}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      item.is_available
                        ? 'bg-[#3D2619] hover:bg-[#5C3A21] text-[#FFFBF5] shadow-xs transform hover:-translate-y-0.5'
                        : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="truncate">{item.is_available ? 'Add to Cafe Order' : 'Currently Unavailable'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

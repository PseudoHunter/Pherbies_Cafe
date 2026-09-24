import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, Menu as MenuIcon, X, ExternalLink } from 'lucide-react';
import { smoothScrollTo } from '../utils/scroll';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen, donationGoal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('goal');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const percentage = Math.min(
    Math.round((donationGoal.raised_amount / Math.max(donationGoal.target_amount, 1)) * 100),
    100
  );

  const navLinks = [
    { id: 'goal', label: 'Rescue Goal', href: '#goal' },
    { id: 'cats', label: '8 Resident Cats', href: '#cats' },
    { id: 'menu', label: 'Home Cafe Menu', href: '#menu' },
    { id: 'tnr', label: 'TNR Mission', href: '#tnr' },
    { id: 'support', label: 'Bank & Wishlist', href: '#support' },
  ];

  // ScrollSpy to highlight active nav link dynamically with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Navbar offset

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(link.id);
            return;
          }
        }
      }
      setActiveSection('goal');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);
    smoothScrollTo(id, 80);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    smoothScrollTo('top', 0);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#F7EEDB] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Smooth Scroll to Top */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform duration-200"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
              <span className="text-2xl select-none">🐾</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-cozy text-2xl font-bold tracking-tight text-[#3D2619] group-hover:text-[#D97746] transition-colors">
                  Pherbies Cafe
                </span>
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-[#E0EFE6] text-emerald-800">
                  Rescue
                </span>
              </div>
              <p className="text-xs text-[#5C3A21]/75 hidden sm:block">
                Home Cafe &amp; Community Stray Rescue
              </p>
            </div>
          </a>

          {/* Desktop Nav Links with Smooth Transition */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[#5C3A21] bg-[#FDF6EC]/60 p-1.5 rounded-2xl border border-[#F0DDC8]/60">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-300 text-xs font-bold cursor-pointer relative ${
                    isActive
                      ? 'bg-white text-[#D97746] shadow-sm scale-102 font-extrabold'
                      : 'text-[#5C3A21]/80 hover:text-[#D97746] hover:bg-white/50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D97746] rounded-full transition-all duration-300" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Live Monthly Rescue Fund Indicator with Smooth Scroll */}
            <a
              href="#goal"
              onClick={(e) => handleNavClick(e, 'goal')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDF6EC] border border-[#F0DDC8] hover:border-[#E07A5F] hover:shadow-xs active:scale-95 text-xs transition-all duration-200 cursor-pointer"
              title="Click to view rescue goal breakdown"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-[#3D2619]">RM {donationGoal.raised_amount.toLocaleString()}</span>
              <span className="text-[#5C3A21]/70">({percentage}% goal)</span>
            </a>

            {/* Threads link */}
            <a
              href="https://www.threads.net/@pherbiescafe"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#3D2619] bg-[#F7EEDB] hover:bg-[#E8D7C8] hover:shadow-xs active:scale-95 transition-all duration-200"
              title="Follow @pherbiescafe on Threads"
            >
              <span>@pherbiescafe</span>
              <ExternalLink className="w-3 h-3 text-[#5C3A21]" />
            </a>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#E07A5F] hover:bg-[#C85A32] text-white text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="View Order Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Order Cart</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-white text-[#C85A32] rounded-full shadow-inner animate-pulse-gently">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3D2619] hover:bg-[#FDF6EC] active:scale-90 transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Smooth Transition */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100 py-4 border-t border-[#F7EEDB]' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#E07A5F] text-white shadow-xs font-bold'
                      : 'text-[#3D2619] hover:bg-[#FDF6EC]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span>🐾</span>}
                </a>
              );
            })}
            <div className="pt-2 mt-2 border-t border-[#F7EEDB] flex flex-col gap-2">
              <a
                href="https://www.threads.net/@pherbiescafe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-[#5C3A21] bg-[#FDF6EC] rounded-xl hover:bg-[#F7EEDB] transition"
              >
                <span>Follow on Threads: @pherbiescafe</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5C3A21]" />
              </a>
              <a
                href="#support"
                onClick={(e) => handleNavClick(e, 'support')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-xs shadow-xs active:scale-98 transition cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Donate to Stray Cats (Maybank / TNG)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


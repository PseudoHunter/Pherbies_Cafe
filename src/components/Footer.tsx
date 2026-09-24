import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ExternalLink, MapPin, Clock } from 'lucide-react';
import { BANK_DETAILS } from '../data/defaultData';
import { smoothScrollTo } from '../utils/scroll';

export const Footer: React.FC = () => {
  const { setIsLoginModalOpen } = useApp();

  const handleFooterNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    smoothScrollTo(id, 80);
  };

  // Stealth Access Mechanism 2: Secret Element Click Counter (5 clicks within 3 seconds)
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setIsLoginModalOpen(true);
    } else {
      resetTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#3D2619] text-[#FFFBF5] pt-14 pb-12 border-t border-[#5C3A21] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-[#5C3A21]">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-1 min-w-0">
            <div className="flex items-center gap-3">
              {/* Secret trigger on paw icon */}
              <button
                type="button"
                onClick={handleSecretClick}
                aria-label="Pherbies emblem"
                className="w-10 h-10 rounded-2xl bg-[#E07A5F] flex items-center justify-center text-white text-xl select-none cursor-default active:scale-95 transition-transform shrink-0"
              >
                🐾
              </button>
              <span className="font-serif-cozy text-2xl font-bold tracking-tight text-amber-200 truncate min-w-0">
                Pherbies Cafe
              </span>
            </div>
            <p className="text-xs text-[#E8D7C8]/80 leading-relaxed break-words hyphens-auto">
              A cozy home cafe and compassionate street rescue initiative. 100% of proceeds fund
              veterinary care, spay/neuter operations, premium nutrition, and cozy shelter for 8 resident cats.
            </p>
          </div>

          {/* Social & Threads */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Community &amp; Social
            </h4>
            <p className="text-xs text-[#E8D7C8]/75 break-words hyphens-auto">
              Follow daily rescue stories, kitten updates, and kitchen baking logs:
            </p>
            <a
              href={BANK_DETAILS.threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5C3A21] hover:bg-[#734A2B] text-white text-xs font-bold transition border border-[#734A2B] max-w-full truncate"
            >
              <span className="truncate">@pherbiescafe on Threads</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Visit &amp; Reservations
            </h4>
            <div className="space-y-2 text-xs text-[#E8D7C8]/80">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
                <span className="break-words hyphens-auto min-w-0">{BANK_DETAILS.location}</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <Clock className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
                <span className="break-words hyphens-auto min-w-0">{BANK_DETAILS.hours}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#E8D7C8]/80">
              <li>
                <a
                  href="#goal"
                  onClick={(e) => handleFooterNav(e, 'goal')}
                  className="hover:text-amber-200 transition cursor-pointer"
                >
                  Monthly Rescue Fund
                </a>
              </li>
              <li>
                <a
                  href="#cats"
                  onClick={(e) => handleFooterNav(e, 'cats')}
                  className="hover:text-amber-200 transition cursor-pointer"
                >
                  8 Rescued Cats
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => handleFooterNav(e, 'menu')}
                  className="hover:text-amber-200 transition cursor-pointer"
                >
                  Cafe Menu &amp; Ordering
                </a>
              </li>
              <li>
                <a
                  href="#tnr"
                  onClick={(e) => handleFooterNav(e, 'tnr')}
                  className="hover:text-amber-200 transition cursor-pointer"
                >
                  TNR Mission Timeline
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  onClick={(e) => handleFooterNav(e, 'support')}
                  className="hover:text-amber-200 transition cursor-pointer"
                >
                  Bank Transfer &amp; Wishlist
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8D7C8]/60 text-center sm:text-left">
          {/* Secret trigger on copyright mark */}
          <p className="break-words hyphens-auto">
            <span
              onClick={handleSecretClick}
              className="cursor-default select-none inline-block"
              title=""
            >
              &copy;
            </span>{' '}
            {new Date().getFullYear()} Pherbies Cafe &amp; Rescue. Made with love for Malaysian stray cats.
          </p>
          <p className="flex items-center justify-center gap-1.5 shrink-0">
            <span>Every cup of coffee saves a life</span>
            <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
          </p>
        </div>
      </div>
    </footer>
  );
};


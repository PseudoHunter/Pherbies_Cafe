import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminBar } from './components/AdminBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatGallery } from './components/CatGallery';
import { MenuSection } from './components/MenuSection';
import { TNRTimeline } from './components/TNRTimeline';
import { DonationWishlist } from './components/DonationWishlist';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { AdminLoginModal } from './components/AdminLoginModal';
import {
  GoalModal,
  CatFormModal,
  MenuFormModal,
  TNRFormModal,
  WishlistFormModal,
  SupabaseModal,
} from './components/AdminModals';
import { Cat, MenuItem, TNRUpdate, WishlistItem } from './types';

const MainAppContent: React.FC = () => {
  const { setIsLoginModalOpen } = useApp();

  // Modal states for Admin actions
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Cat modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);

  // Menu modal state
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // TNR modal state
  const [isTnrModalOpen, setIsTnrModalOpen] = useState(false);
  const [editingTnr, setEditingTnr] = useState<TNRUpdate | null>(null);

  // Wishlist modal state
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<WishlistItem | null>(null);

  // Stealth Access Mechanism 1: Keyboard combo Ctrl+Shift+A / Cmd+Shift+A
  // Stealth Access Mechanism 3: URL Hash trigger (#pherbies-admin or #admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#pherbies-admin' || hash === '#admin') {
        setIsLoginModalOpen(true);
        // Clear hash from URL to keep stealthy
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    // Check hash on mount
    handleHash();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [setIsLoginModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#3D2619]">
      {/* 1. Admin Top Banner (only visible if logged in) */}
      <AdminBar onOpenGoalModal={() => setIsGoalModalOpen(true)} />

      {/* 2. Main Navigation Bar */}
      <Navbar />

      {/* 3. Main Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Supabase Rescue Goal Progress Bar */}
        <HeroSection onOpenGoalModal={() => setIsGoalModalOpen(true)} />

        {/* Rescued Cats Gallery (8 resident cats, filters, stories, medical records) */}
        <CatGallery
          onOpenAddCatModal={() => {
            setEditingCat(null);
            setIsCatModalOpen(true);
          }}
          onOpenEditCatModal={(cat) => {
            setEditingCat(cat);
            setIsCatModalOpen(true);
          }}
        />

        {/* Home Cafe Menu & Interactive Order Builder */}
        <MenuSection
          onOpenAddMenuModal={() => {
            setEditingMenuItem(null);
            setIsMenuModalOpen(true);
          }}
          onOpenEditMenuModal={(item) => {
            setEditingMenuItem(item);
            setIsMenuModalOpen(true);
          }}
        />

        {/* TNR & Mission Timeline with transparent vet receipts */}
        <TNRTimeline
          onOpenAddTNRModal={() => {
            setEditingTnr(null);
            setIsTnrModalOpen(true);
          }}
          onOpenEditTNRModal={(update) => {
            setEditingTnr(update);
            setIsTnrModalOpen(true);
          }}
        />

        {/* Direct Bank Donation (Maybank / TNG) & Needed Supplies Wishlist */}
        <DonationWishlist
          onOpenAddWishlistModal={() => {
            setEditingWishlist(null);
            setIsWishlistModalOpen(true);
          }}
          onOpenEditWishlistModal={(item) => {
            setEditingWishlist(item);
            setIsWishlistModalOpen(true);
          }}
        />
      </main>

      {/* 4. Footer with Threads link, hours, location, & Admin login trigger */}
      <Footer />

      {/* 5. Drawers, Toasts & Modals */}
      <CartDrawer />
      <Toast />
      <AdminLoginModal />
      <SupabaseModal />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <CatFormModal
        isOpen={isCatModalOpen}
        initialCat={editingCat}
        onClose={() => {
          setIsCatModalOpen(false);
          setEditingCat(null);
        }}
      />

      <MenuFormModal
        isOpen={isMenuModalOpen}
        initialItem={editingMenuItem}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenuItem(null);
        }}
      />

      <TNRFormModal
        isOpen={isTnrModalOpen}
        initialUpdate={editingTnr}
        onClose={() => {
          setIsTnrModalOpen(false);
          setEditingTnr(null);
        }}
      />

      <WishlistFormModal
        isOpen={isWishlistModalOpen}
        initialItem={editingWishlist}
        onClose={() => {
          setIsWishlistModalOpen(false);
          setEditingWishlist(null);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

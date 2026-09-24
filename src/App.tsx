import React, { useState, useEffect, useCallback } from 'react';
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
  fetchDonationGoal, updateDonationGoal, 
  fetchCats, saveCat, deleteCat,
  fetchMenu, saveMenuItem, deleteMenuItem,
  fetchTNRUpdates, saveTNRUpdate,
  fetchWishlist, saveWishlistItem 
} from './services/dataService';

  useEffect(() => {
    loadAllData();
  }, []);

  // Handler example when Admin edits Goal
  const handleGoalUpdate = async (newAmount: number) => {
    if (!goal) return;
    const updated = { ...goal, raised_amount: newAmount };
    setGoal(updated); // Update UI instantly
    await updateDonationGoal(updated); // Save to Supabase
  };

  // Handler example when Admin adds or edits a Cat
  const handleSaveCat = async (catData: Cat) => {
    await saveCat(catData);
    await loadAllData(); // Refresh UI
  };

  // Handler example when Admin edits a Menu item
  const handleSaveMenuItem = async (itemData: MenuItem) => {
    await saveMenuItem(itemData);
    await loadAllData();
  };

  // ... Rest of your UI rendering components
}
import {
  GoalModal,
  CatFormModal,
  MenuFormModal,
  TNRFormModal,
  WishlistFormModal,
  SupabaseModal,
} from './components/AdminModals';
import { Cat, MenuItem, TNRUpdate, WishlistItem, DonationGoal } from './types';
import {
  loadAllData,
  saveDonationGoal,
  saveCat,
  deleteCat as removeCat,
  saveMenuItem,
  deleteMenuItem as removeMenuItem,
  toggleMenuAvailability as toggleItemAvailability,
  saveTNRUpdate,
  deleteTNRUpdate as removeTNRUpdate,
  saveWishlistItem,
  deleteWishlistItem as removeWishlistItem,
  subscribeToRealtime,
} from './services/dataService';

const MainAppContent: React.FC = () => {
  const { setIsLoginModalOpen, setAllData, showToast } = useApp();

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

  // 1. Data Fetching & State Refresh Function
  const refreshAllAppData = useCallback(async () => {
    try {
      const data = await loadAllData();
      setAllData(data);
    } catch (err) {
      console.warn('Error loading latest data from Supabase:', err);
    }
  }, [setAllData]);

  // 2. Load all latest data on mount & subscribe to Realtime updates
  useEffect(() => {
    // Initial fetch on mount
    refreshAllAppData();

    // Supabase Realtime channel subscription across public tables
    const unsubscribe = subscribeToRealtime(() => {
      refreshAllAppData();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshAllAppData]);

  // 3. Stealth Access: Ctrl+Shift+A / Cmd+Shift+A & URL Hash (#pherbies-admin)
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

  // 4. Admin Save & Delete Handlers
  const handleSaveGoal = async (newGoal: DonationGoal) => {
    await saveDonationGoal(newGoal);
    await refreshAllAppData();
    showToast('Monthly rescue goal updated and synced! 🎯', 'success');
    setIsGoalModalOpen(false);
  };

  const handleSaveCat = async (catData: Cat | Omit<Cat, 'id'>) => {
    await saveCat(catData);
    await refreshAllAppData();
    showToast(
      'id' in catData && catData.id
        ? `Updated ${catData.name}'s profile!`
        : `Added ${catData.name} to resident rescues! 🐾`,
      'success'
    );
    setIsCatModalOpen(false);
    setEditingCat(null);
  };

  const handleDeleteCat = async (id: string) => {
    await removeCat(id);
    await refreshAllAppData();
    showToast('Cat profile removed.', 'info');
  };

  const handleSaveMenuItem = async (itemData: MenuItem | Omit<MenuItem, 'id'>) => {
    await saveMenuItem(itemData);
    await refreshAllAppData();
    showToast(`Menu item "${itemData.name}" saved! ☕`, 'success');
    setIsMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = async (id: string) => {
    await removeMenuItem(id);
    await refreshAllAppData();
    showToast('Menu item removed.', 'info');
  };

  const handleToggleMenuAvailability = async (id: string) => {
    await toggleItemAvailability(id);
    await refreshAllAppData();
  };

  const handleSaveTNRUpdate = async (tnrData: TNRUpdate | Omit<TNRUpdate, 'id'>) => {
    await saveTNRUpdate(tnrData);
    await refreshAllAppData();
    showToast(`TNR Mission "${tnrData.title}" saved! ✂️`, 'success');
    setIsTnrModalOpen(false);
    setEditingTnr(null);
  };

  const handleDeleteTNRUpdate = async (id: string) => {
    await removeTNRUpdate(id);
    await refreshAllAppData();
    showToast('TNR record removed.', 'info');
  };

  const handleSaveWishlistItem = async (itemData: WishlistItem | Omit<WishlistItem, 'id'>) => {
    await saveWishlistItem(itemData);
    await refreshAllAppData();
    showToast(`Wishlist item "${itemData.item_name}" saved! 📦`, 'success');
    setIsWishlistModalOpen(false);
    setEditingWishlist(null);
  };

  const handleDeleteWishlistItem = async (id: string) => {
    await removeWishlistItem(id);
    await refreshAllAppData();
    showToast('Wishlist item removed.', 'info');
  };

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
        onSave={handleSaveGoal}
      />

      <CatFormModal
        isOpen={isCatModalOpen}
        initialCat={editingCat}
        onClose={() => {
          setIsCatModalOpen(false);
          setEditingCat(null);
        }}
        onSave={handleSaveCat}
      />

      <MenuFormModal
        isOpen={isMenuModalOpen}
        initialItem={editingMenuItem}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenuItem(null);
        }}
        onSave={handleSaveMenuItem}
      />

      <TNRFormModal
        isOpen={isTnrModalOpen}
        initialUpdate={editingTnr}
        onClose={() => {
          setIsTnrModalOpen(false);
          setEditingTnr(null);
        }}
        onSave={handleSaveTNRUpdate}
      />

      <WishlistFormModal
        isOpen={isWishlistModalOpen}
        initialItem={editingWishlist}
        onClose={() => {
          setIsWishlistModalOpen(false);
          setEditingWishlist(null);
        }}
        onSave={handleSaveWishlistItem}
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
  export default function App() {
  // ... your existing state variables (e.g. const [cats, setCats] = useState(...)) ...

  // Function to fetch fresh data from Supabase
  const loadAllData = async () => {
    const [fetchedGoal, fetchedCats, fetchedMenu, fetchedTnr, fetchedWishlist] = await Promise.all([
      fetchDonationGoal(),
      fetchCats(),
      fetchMenu(),
      fetchTNRUpdates(),
      fetchWishlist()
    ]);

    if (fetchedGoal && setGoal) setGoal(fetchedGoal);
    if (fetchedCats && setCats) setCats(fetchedCats);
    if (fetchedMenu && setMenu) setMenu(fetchedMenu);
    if (fetchedTnr && setTnr) setTnr(fetchedTnr);
    if (fetchedWishlist && setWishlist) setWishlist(fetchedWishlist);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ... rest of your existing component logic & JSX layout ...
}
}

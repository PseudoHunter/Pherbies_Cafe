import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DonationGoal, Cat, MenuItem, TNRUpdate, WishlistItem, CartItem, SupabaseConfig } from '../types';
import {
  DEFAULT_DONATION_GOAL,
  DEFAULT_CATS,
  DEFAULT_MENU,
  DEFAULT_TNR_UPDATES,
  DEFAULT_WISHLIST,
} from '../data/defaultData';
import {
  loadLocalData,
  saveLocalGoal,
  saveLocalCats,
  saveLocalMenu,
  saveLocalTNR,
  saveLocalWishlist,
  getSupabaseConfig,
  initializeSupabase,
  getActiveSupabaseClient,
  resetAllToDefault,
} from '../services/supabaseClient';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  isAdmin: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;
  
  // Data
  donationGoal: DonationGoal;
  updateDonationGoal: (goal: DonationGoal) => Promise<void>;
  
  cats: Cat[];
  addCat: (cat: Omit<Cat, 'id'>) => Promise<void>;
  updateCat: (cat: Cat) => Promise<void>;
  deleteCat: (id: string) => Promise<void>;
  
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleMenuAvailability: (id: string) => Promise<void>;
  
  tnrUpdates: TNRUpdate[];
  addTNRUpdate: (update: Omit<TNRUpdate, 'id'>) => Promise<void>;
  updateTNRUpdate: (update: TNRUpdate) => Promise<void>;
  deleteTNRUpdate: (id: string) => Promise<void>;
  
  wishlist: WishlistItem[];
  addWishlistItem: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  updateWishlistItem: (item: WishlistItem) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  
  // Cart & Order
  cart: CartItem[];
  addToCart: (item: MenuItem, notes?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTip: number;
  setCartTip: (amount: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // UI & Modals
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  supabaseConfig: SupabaseConfig;
  updateSupabaseCredentials: (url: string, key: string) => Promise<boolean>;
  syncWithSupabase: () => Promise<void>;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin State (persisted in localStorage)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('pherbies_admin_auth') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Data States
  const initial = loadLocalData();
  const [donationGoal, setDonationGoal] = useState<DonationGoal>(initial.goal);
  const [cats, setCats] = useState<Cat[]>(initial.cats);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initial.menu);
  const [tnrUpdates, setTnrUpdates] = useState<TNRUpdate[]>(initial.tnr);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initial.wishlist);

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTip, setCartTip] = useState<number>(5); // default RM 5 tip for cats
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Supabase State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getSupabaseConfig);

  // Auth functions
  const loginAdmin = (user: string, pass: string): boolean => {
    if (user.trim() === 'pherbiescute' && pass.trim() === 'pherbiescafecutie') {
      setIsAdmin(true);
      localStorage.setItem('pherbies_admin_auth', 'true');
      showToast('Welcome back, Pherbies Admin! Admin editing mode is active 🐾', 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('pherbies_admin_auth');
    showToast('Logged out of Admin mode.', 'info');
  };

  // Sync from Supabase on mount or credential change
  const syncWithSupabase = useCallback(async () => {
    const client = getActiveSupabaseClient();
    if (!client) return;

    try {
      // 1. Goal
      const { data: goalData, error: goalErr } = await client.from('donation_goal').select('*').limit(1).maybeSingle();
      if (!goalErr && goalData) {
        const mappedGoal: DonationGoal = {
          raised_amount: Number(goalData.raised_amount),
          target_amount: Number(goalData.target_amount),
          month_label: goalData.month_label || 'October 2026',
          total_donors: goalData.total_donors || 46,
          vet_bills_target: Number(goalData.vet_bills_target) || 1500,
          food_target: Number(goalData.food_target) || 1000,
          litter_target: Number(goalData.litter_target) || 600,
          vitamins_target: Number(goalData.vitamins_target) || 400,
        };
        setDonationGoal(mappedGoal);
        saveLocalGoal(mappedGoal);
      }

      // 2. Cats
      const { data: catsData, error: catsErr } = await client.from('cats').select('*').order('created_at', { ascending: false });
      if (!catsErr && catsData && catsData.length > 0) {
        setCats(catsData as Cat[]);
        saveLocalCats(catsData as Cat[]);
      }

      // 3. Menu
      const { data: menuData, error: menuErr } = await client.from('menu_items').select('*').order('created_at', { ascending: true });
      if (!menuErr && menuData && menuData.length > 0) {
        setMenuItems(menuData as MenuItem[]);
        saveLocalMenu(menuData as MenuItem[]);
      }

      // 4. TNR
      const { data: tnrData, error: tnrErr } = await client.from('tnr_updates').select('*').order('date', { ascending: false });
      if (!tnrErr && tnrData && tnrData.length > 0) {
        setTnrUpdates(tnrData as TNRUpdate[]);
        saveLocalTNR(tnrData as TNRUpdate[]);
      }

      // 5. Wishlist
      const { data: wishData, error: wishErr } = await client.from('wishlist_items').select('*');
      if (!wishErr && wishData && wishData.length > 0) {
        setWishlist(wishData as WishlistItem[]);
        saveLocalWishlist(wishData as WishlistItem[]);
      }

      setSupabaseConfig((prev) => ({
        ...prev,
        isConnected: true,
        lastSynced: new Date().toLocaleTimeString(),
      }));
    } catch (err) {
      console.warn('Supabase sync skipped/failed:', err);
    }
  }, []);

  // Update Supabase credentials from settings modal
  const updateSupabaseCredentials = async (url: string, key: string): Promise<boolean> => {
    const client = initializeSupabase(url, key);
    if (!client) {
      setSupabaseConfig(getSupabaseConfig());
      return false;
    }
    setSupabaseConfig(getSupabaseConfig());
    await syncWithSupabase();
    showToast('Supabase credentials saved and synced!', 'success');
    return true;
  };

  // Realtime subscription setup
  useEffect(() => {
    const client = getActiveSupabaseClient();
    if (!client) return;

    syncWithSupabase();

    const channel = client
      .channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        syncWithSupabase();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [syncWithSupabase]);

  // CRUD: Donation Goal
  const updateDonationGoal = async (newGoal: DonationGoal) => {
    setDonationGoal(newGoal);
    saveLocalGoal(newGoal);
    showToast('Monthly donation goal updated!', 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('donation_goal').upsert({
          id: 'current_month',
          raised_amount: newGoal.raised_amount,
          target_amount: newGoal.target_amount,
          month_label: newGoal.month_label,
          total_donors: newGoal.total_donors,
          vet_bills_target: newGoal.vet_bills_target,
          food_target: newGoal.food_target,
          litter_target: newGoal.litter_target,
          vitamins_target: newGoal.vitamins_target,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Supabase goal update failed:', e);
      }
    }
  };

  // CRUD: Cats
  const addCat = async (catData: Omit<Cat, 'id'>) => {
    const newCat: Cat = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    const updated = [newCat, ...cats];
    setCats(updated);
    saveLocalCats(updated);
    showToast(`Added ${newCat.name} to the resident gallery! 🐱`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('cats').insert([newCat]);
      } catch (e) {
        console.error('Supabase cat insert failed:', e);
      }
    }
  };

  const updateCat = async (cat: Cat) => {
    const updated = cats.map((c) => (c.id === cat.id ? cat : c));
    setCats(updated);
    saveLocalCats(updated);
    showToast(`Updated details for ${cat.name}`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('cats').update(cat).eq('id', cat.id);
      } catch (e) {
        console.error('Supabase cat update failed:', e);
      }
    }
  };

  const deleteCat = async (id: string) => {
    const target = cats.find((c) => c.id === id);
    const updated = cats.filter((c) => c.id !== id);
    setCats(updated);
    saveLocalCats(updated);
    showToast(`Removed ${target?.name || 'cat'} from gallery`, 'info');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('cats').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase cat delete failed:', e);
      }
    }
  };

  // CRUD: Menu
  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`,
    };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    saveLocalMenu(updated);
    showToast(`Added "${newItem.name}" to cafe menu! ☕`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('menu_items').insert([newItem]);
      } catch (e) {
        console.error('Supabase menu insert failed:', e);
      }
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    const updated = menuItems.map((m) => (m.id === item.id ? item : m));
    setMenuItems(updated);
    saveLocalMenu(updated);
    showToast(`Updated menu item "${item.name}"`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('menu_items').update(item).eq('id', item.id);
      } catch (e) {
        console.error('Supabase menu update failed:', e);
      }
    }
  };

  const deleteMenuItem = async (id: string) => {
    const target = menuItems.find((m) => m.id === id);
    const updated = menuItems.filter((m) => m.id !== id);
    setMenuItems(updated);
    saveLocalMenu(updated);
    showToast(`Removed "${target?.name || 'item'}" from menu`, 'info');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('menu_items').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase menu delete failed:', e);
      }
    }
  };

  const toggleMenuAvailability = async (id: string) => {
    const target = menuItems.find((m) => m.id === id);
    if (!target) return;
    const newStatus = !target.is_available;
    const updated = menuItems.map((m) => (m.id === id ? { ...m, is_available: newStatus } : m));
    setMenuItems(updated);
    saveLocalMenu(updated);
    showToast(`"${target.name}" marked as ${newStatus ? 'Available' : 'Sold Out'}`, 'info');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('menu_items').update({ is_available: newStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase availability update failed:', e);
      }
    }
  };

  // CRUD: TNR
  const addTNRUpdate = async (data: Omit<TNRUpdate, 'id'>) => {
    const newUpdate: TNRUpdate = {
      ...data,
      id: `tnr-${Date.now()}`,
    };
    const updated = [newUpdate, ...tnrUpdates];
    setTnrUpdates(updated);
    saveLocalTNR(updated);
    showToast('Added new TNR mission update! 🐾', 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('tnr_updates').insert([newUpdate]);
      } catch (e) {
        console.error('Supabase TNR insert failed:', e);
      }
    }
  };

  const updateTNRUpdate = async (update: TNRUpdate) => {
    const updated = tnrUpdates.map((t) => (t.id === update.id ? update : t));
    setTnrUpdates(updated);
    saveLocalTNR(updated);
    showToast('TNR update saved', 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('tnr_updates').update(update).eq('id', update.id);
      } catch (e) {
        console.error('Supabase TNR update failed:', e);
      }
    }
  };

  const deleteTNRUpdate = async (id: string) => {
    const updated = tnrUpdates.filter((t) => t.id !== id);
    setTnrUpdates(updated);
    saveLocalTNR(updated);
    showToast('TNR update removed', 'info');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('tnr_updates').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase TNR delete failed:', e);
      }
    }
  };

  // CRUD: Wishlist
  const addWishlistItem = async (data: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...data,
      id: `wish-${Date.now()}`,
    };
    const updated = [...wishlist, newItem];
    setWishlist(updated);
    saveLocalWishlist(updated);
    showToast(`Added "${newItem.item_name}" to supply wishlist!`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('wishlist_items').insert([newItem]);
      } catch (e) {
        console.error('Supabase wishlist insert failed:', e);
      }
    }
  };

  const updateWishlistItem = async (item: WishlistItem) => {
    const updated = wishlist.map((w) => (w.id === item.id ? item : w));
    setWishlist(updated);
    saveLocalWishlist(updated);
    showToast(`Wishlist item "${item.item_name}" updated`, 'success');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('wishlist_items').update(item).eq('id', item.id);
      } catch (e) {
        console.error('Supabase wishlist update failed:', e);
      }
    }
  };

  const deleteWishlistItem = async (id: string) => {
    const updated = wishlist.filter((w) => w.id !== id);
    setWishlist(updated);
    saveLocalWishlist(updated);
    showToast('Wishlist item removed', 'info');

    const client = getActiveSupabaseClient();
    if (client) {
      try {
        await client.from('wishlist_items').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase wishlist delete failed:', e);
      }
    }
  };

  // Cart operations
  const addToCart = (item: MenuItem, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id && c.notes === notes);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id && c.notes === notes ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1, notes }];
    });
    showToast(`Added ${item.name} to order! ☕`, 'success');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItem.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetToDefaults = () => {
    resetAllToDefault();
    setDonationGoal(DEFAULT_DONATION_GOAL);
    setCats(DEFAULT_CATS);
    setMenuItems(DEFAULT_MENU);
    setTnrUpdates(DEFAULT_TNR_UPDATES);
    setWishlist(DEFAULT_WISHLIST);
    showToast('Reset all data to default cafe & rescue records!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        donationGoal,
        updateDonationGoal,
        cats,
        addCat,
        updateCat,
        deleteCat,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuAvailability,
        tnrUpdates,
        addTNRUpdate,
        updateTNRUpdate,
        deleteTNRUpdate,
        wishlist,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTip,
        setCartTip,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        supabaseConfig,
        updateSupabaseCredentials,
        syncWithSupabase,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

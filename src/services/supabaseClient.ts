import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DonationGoal, Cat, MenuItem, TNRUpdate, WishlistItem, SupabaseConfig } from '../types';
import {
  DEFAULT_DONATION_GOAL,
  DEFAULT_CATS,
  DEFAULT_MENU,
  DEFAULT_TNR_UPDATES,
  DEFAULT_WISHLIST,
} from '../data/defaultData';

const STORAGE_KEYS = {
  SUPABASE_URL: 'pherbies_supabase_url',
  SUPABASE_KEY: 'pherbies_supabase_key',
  LOCAL_GOAL: 'pherbies_data_goal',
  LOCAL_CATS: 'pherbies_data_cats',
  LOCAL_MENU: 'pherbies_data_menu',
  LOCAL_TNR: 'pherbies_data_tnr',
  LOCAL_WISHLIST: 'pherbies_data_wishlist',
  ADMIN_AUTH: 'pherbies_admin_auth',
};

// Check if environment variables or local storage have Supabase credentials
const ENV_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const ENV_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

let client: SupabaseClient | null = null;

export function getSupabaseConfig(): SupabaseConfig {
  const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || ENV_URL;
  const anonKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || ENV_KEY;
  return {
    url,
    anonKey,
    isConnected: !!(client && url && anonKey),
  };
}

export function initializeSupabase(url: string, anonKey: string): SupabaseClient | null {
  if (!url || !anonKey) {
    client = null;
    return null;
  }
  try {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url);
    localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, anonKey);
    return client;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    client = null;
    return null;
  }
}

// Auto-initialize if credentials exist
const initialConfig = getSupabaseConfig();
if (initialConfig.url && initialConfig.anonKey) {
  initializeSupabase(initialConfig.url, initialConfig.anonKey);
}

export function getActiveSupabaseClient(): SupabaseClient | null {
  return client;
}

export async function testConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, anonKey);
    // Attempt a lightweight probe
    const { error } = await testClient.from('donation_goal').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's still reachable
      if (error.message.includes('relation "public.donation_goal" does not exist') || error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project! (Tables not yet created; you can run the SQL schema script provided).',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected and verified with Supabase!' };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
    return { success: false, message: errorMessage };
  }
}

// Local Storage Fallback Handlers
export function loadLocalData() {
  try {
    const goalStr = localStorage.getItem(STORAGE_KEYS.LOCAL_GOAL);
    const catsStr = localStorage.getItem(STORAGE_KEYS.LOCAL_CATS);
    const menuStr = localStorage.getItem(STORAGE_KEYS.LOCAL_MENU);
    const tnrStr = localStorage.getItem(STORAGE_KEYS.LOCAL_TNR);
    const wishStr = localStorage.getItem(STORAGE_KEYS.LOCAL_WISHLIST);

    const parsedCats = catsStr ? (JSON.parse(catsStr) as Cat[]) : DEFAULT_CATS;
    const sanitizedCats = parsedCats.map((c) => ({
      ...c,
      photo_url: c.photo_url && c.photo_url.trim() !== '' ? c.photo_url : DEFAULT_CATS[0].photo_url,
    }));

    const parsedMenu = menuStr ? (JSON.parse(menuStr) as MenuItem[]) : DEFAULT_MENU;
    const sanitizedMenu = parsedMenu.map((m) => ({
      ...m,
      image_url: m.image_url && m.image_url.trim() !== '' ? m.image_url : DEFAULT_MENU[0].image_url,
    }));

    const parsedTnr = tnrStr ? (JSON.parse(tnrStr) as TNRUpdate[]) : DEFAULT_TNR_UPDATES;
    const sanitizedTnr = parsedTnr.map((t) => ({
      ...t,
      photo_url: t.photo_url && t.photo_url.trim() !== '' ? t.photo_url : DEFAULT_TNR_UPDATES[0].photo_url,
    }));

    return {
      goal: goalStr ? (JSON.parse(goalStr) as DonationGoal) : DEFAULT_DONATION_GOAL,
      cats: sanitizedCats,
      menu: sanitizedMenu,
      tnr: sanitizedTnr,
      wishlist: wishStr ? (JSON.parse(wishStr) as WishlistItem[]) : DEFAULT_WISHLIST,
    };
  } catch (e) {
    console.error('Error reading localStorage, using defaults', e);
    return {
      goal: DEFAULT_DONATION_GOAL,
      cats: DEFAULT_CATS,
      menu: DEFAULT_MENU,
      tnr: DEFAULT_TNR_UPDATES,
      wishlist: DEFAULT_WISHLIST,
    };
  }
}

export function saveLocalGoal(goal: DonationGoal) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_GOAL, JSON.stringify(goal));
}
export function saveLocalCats(cats: Cat[]) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_CATS, JSON.stringify(cats));
}
export function saveLocalMenu(menu: MenuItem[]) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_MENU, JSON.stringify(menu));
}
export function saveLocalTNR(tnr: TNRUpdate[]) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_TNR, JSON.stringify(tnr));
}
export function saveLocalWishlist(wishlist: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEYS.LOCAL_WISHLIST, JSON.stringify(wishlist));
}

export function resetAllToDefault() {
  localStorage.removeItem(STORAGE_KEYS.LOCAL_GOAL);
  localStorage.removeItem(STORAGE_KEYS.LOCAL_CATS);
  localStorage.removeItem(STORAGE_KEYS.LOCAL_MENU);
  localStorage.removeItem(STORAGE_KEYS.LOCAL_TNR);
  localStorage.removeItem(STORAGE_KEYS.LOCAL_WISHLIST);
}

// SQL Schema generator for one-click setup in Supabase SQL Editor
export function getSupabaseSqlSchema(): string {
  return `-- ==========================================
-- PHERBIES CAFE SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Donation Goal Table
CREATE TABLE IF NOT EXISTS public.donation_goal (
  id text PRIMARY KEY DEFAULT 'current_month',
  raised_amount numeric NOT NULL DEFAULT 2240,
  target_amount numeric NOT NULL DEFAULT 3500,
  month_label text NOT NULL DEFAULT 'October 2026',
  total_donors integer DEFAULT 46,
  vet_bills_target numeric DEFAULT 1500,
  food_target numeric DEFAULT 1000,
  litter_target numeric DEFAULT 600,
  vitamins_target numeric DEFAULT 400,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Rescued Cats Table
CREATE TABLE IF NOT EXISTS public.cats (
  id text PRIMARY KEY,
  name text NOT NULL,
  photo_url text NOT NULL,
  rescue_story text NOT NULL,
  tags text[] DEFAULT '{}',
  health_status text NOT NULL,
  age text,
  gender text,
  is_favorite boolean DEFAULT false,
  intake_date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Menu Offerings Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price_rm numeric NOT NULL,
  description text NOT NULL,
  is_available boolean DEFAULT true,
  image_url text NOT NULL,
  tags text[] DEFAULT '{}',
  preparation_note text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TNR & Mission Updates Table
CREATE TABLE IF NOT EXISTS public.tnr_updates (
  id text PRIMARY KEY,
  title text NOT NULL,
  date text NOT NULL,
  cats_treated_count integer NOT NULL DEFAULT 1,
  description text NOT NULL,
  photo_url text NOT NULL,
  cost_rm numeric,
  location text,
  receipt_summary text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Wishlist & Supplies Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id text PRIMARY KEY,
  item_name text NOT NULL,
  urgency text NOT NULL,
  quantity_needed text NOT NULL,
  fulfilled_count text,
  category text NOT NULL,
  brand_preference text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Allow Public Read and Anon Write
ALTER TABLE public.donation_goal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tnr_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Goal" ON public.donation_goal FOR SELECT USING (true);
CREATE POLICY "Public Read Cats" ON public.cats FOR SELECT USING (true);
CREATE POLICY "Public Read Menu" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read TNR" ON public.tnr_updates FOR SELECT USING (true);
CREATE POLICY "Public Read Wishlist" ON public.wishlist_items FOR SELECT USING (true);

-- Public/Anon Insert/Update/Delete (for demo & app control)
CREATE POLICY "Anon Full Access Goal" ON public.donation_goal FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Cats" ON public.cats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Menu" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access TNR" ON public.tnr_updates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Wishlist" ON public.wishlist_items FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.donation_goal, public.cats, public.menu_items, public.tnr_updates, public.wishlist_items;
`;
}

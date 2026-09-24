import { getActiveSupabaseClient, loadLocalData, saveLocalGoal, saveLocalCats, saveLocalMenu, saveLocalTNR, saveLocalWishlist } from './supabaseClient';
import { DonationGoal, Cat, MenuItem, TNRUpdate, WishlistItem } from '../types';

// ==========================================
// 1. DONATION GOAL
// ==========================================
export async function fetchDonationGoal(): Promise<DonationGoal> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from('donation_goal')
      .select('*')
      .eq('id', 'current_month')
      .single();

    if (!error && data) {
      saveLocalGoal(data); // Sync local fallback
      return data as DonationGoal;
    }
  }
  return loadLocalData().goal;
}

export async function updateDonationGoal(goal: Partial<DonationGoal>): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client
      .from('donation_goal')
      .update({ ...goal, updated_at: new Date().toISOString() })
      .eq('id', 'current_month');

    if (!error) return true;
    console.error('Failed to save donation goal to Supabase:', error);
  }
  return false;
}

// ==========================================
// 2. RESCUED CATS
// ==========================================
export async function fetchCats(): Promise<Cat[]> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { data, error } = await client.from('cats').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      saveLocalCats(data);
      return data as Cat[];
    }
  }
  return loadLocalData().cats;
}

export async function saveCat(cat: Cat): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('cats').upsert(cat);
    if (!error) return true;
    console.error('Failed to save cat to Supabase:', error);
  }
  return false;
}

export async function deleteCat(catId: string): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('cats').delete().eq('id', catId);
    if (!error) return true;
  }
  return false;
}

// ==========================================
// 3. MENU ITEMS
// ==========================================
export async function fetchMenu(): Promise<MenuItem[]> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { data, error } = await client.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      saveLocalMenu(data);
      return data as MenuItem[];
    }
  }
  return loadLocalData().menu;
}

export async function saveMenuItem(item: MenuItem): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('menu_items').upsert(item);
    if (!error) return true;
    console.error('Failed to save menu item to Supabase:', error);
  }
  return false;
}

export async function deleteMenuItem(itemId: string): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('menu_items').delete().eq('id', itemId);
    if (!error) return true;
  }
  return false;
}

// ==========================================
// 4. TNR & MISSIONS
// ==========================================
export async function fetchTNRUpdates(): Promise<TNRUpdate[]> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { data, error } = await client.from('tnr_updates').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      saveLocalTNR(data);
      return data as TNRUpdate[];
    }
  }
  return loadLocalData().tnr;
}

export async function saveTNRUpdate(update: TNRUpdate): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('tnr_updates').upsert(update);
    if (!error) return true;
  }
  return false;
}

// ==========================================
// 5. WISHLIST ITEMS
// ==========================================
export async function fetchWishlist(): Promise<WishlistItem[]> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { data, error } = await client.from('wishlist_items').select('*');
    if (!error && data && data.length > 0) {
      saveLocalWishlist(data);
      return data as WishlistItem[];
    }
  }
  return loadLocalData().wishlist;
}

export async function saveWishlistItem(item: WishlistItem): Promise<boolean> {
  const client = getActiveSupabaseClient();
  if (client) {
    const { error } = await client.from('wishlist_items').upsert(item);
    if (!error) return true;
  }
  return false;
}

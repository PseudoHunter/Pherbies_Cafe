import { DonationGoal, Cat, MenuItem, TNRUpdate, WishlistItem } from '../types';
import {
  getActiveSupabaseClient,
  loadLocalData,
  saveLocalGoal,
  saveLocalCats,
  saveLocalMenu,
  saveLocalTNR,
  saveLocalWishlist,
} from './supabaseClient';

// Helper to safely map donation goal record
function mapGoalRow(data: any): DonationGoal {
  return {
    raised_amount: Number(data.raised_amount) || 0,
    target_amount: Number(data.target_amount) || 3500,
    month_label: data.month_label || 'October 2026',
    total_donors: data.total_donors ? Number(data.total_donors) : 46,
    vet_bills_target: Number(data.vet_bills_target) || 1500,
    food_target: Number(data.food_target) || 1000,
    litter_target: Number(data.litter_target) || 600,
    vitamins_target: Number(data.vitamins_target) || 400,
  };
}

// ==========================================
// 1. Donation Goal CRUD (id = 'current_month')
// ==========================================
export async function fetchDonationGoal(): Promise<DonationGoal> {
  const localGoal = loadLocalData().goal;
  const client = getActiveSupabaseClient();
  if (!client) return localGoal;

  try {
    const { data, error } = await client
      .from('donation_goal')
      .select('*')
      .eq('id', 'current_month')
      .maybeSingle();

    if (error || !data) {
      // Fallback: try fetching the first available record
      const { data: firstRow, error: firstErr } = await client
        .from('donation_goal')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (firstErr || !firstRow) return localGoal;
      const mapped = mapGoalRow(firstRow);
      saveLocalGoal(mapped);
      return mapped;
    }

    const mapped = mapGoalRow(data);
    saveLocalGoal(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchDonationGoal failed, using local storage:', err);
    return localGoal;
  }
}

export async function saveDonationGoal(goal: DonationGoal): Promise<void> {
  saveLocalGoal(goal);
  const client = getActiveSupabaseClient();
  if (!client) return;

  try {
    await client.from('donation_goal').upsert({
      id: 'current_month',
      raised_amount: Number(goal.raised_amount),
      target_amount: Number(goal.target_amount),
      month_label: goal.month_label || 'October 2026',
      total_donors: goal.total_donors || 46,
      vet_bills_target: Number(goal.vet_bills_target) || 1500,
      food_target: Number(goal.food_target) || 1000,
      litter_target: Number(goal.litter_target) || 600,
      vitamins_target: Number(goal.vitamins_target) || 400,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Supabase saveDonationGoal error:', err);
  }
}

// ==========================================
// 2. Rescued Cats CRUD
// ==========================================
export async function fetchCats(): Promise<Cat[]> {
  const localCats = loadLocalData().cats;
  const client = getActiveSupabaseClient();
  if (!client) return localCats;

  try {
    const { data, error } = await client
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localCats;
    }

    const mapped: Cat[] = data.map((c: any) => ({
      id: c.id,
      name: c.name,
      photo_url: c.photo_url || '',
      rescue_story: c.rescue_story || '',
      tags: Array.isArray(c.tags) ? c.tags : [],
      health_status: c.health_status || 'Healthy',
      age: c.age || '',
      gender: c.gender || 'Boy',
      is_favorite: !!c.is_favorite,
      intake_date: c.intake_date || '',
    }));

    saveLocalCats(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchCats failed, using local storage:', err);
    return localCats;
  }
}

export async function saveCat(catData: Cat | Omit<Cat, 'id'>): Promise<Cat> {
  const id = 'id' in catData && catData.id ? catData.id : `cat-${Date.now()}`;
  const fullCat: Cat = { ...catData, id };

  // Update local
  const localCats = loadLocalData().cats;
  const index = localCats.findIndex((c) => c.id === id);
  const updatedCats = index >= 0
    ? localCats.map((c) => (c.id === id ? fullCat : c))
    : [fullCat, ...localCats];
  saveLocalCats(updatedCats);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('cats').upsert({
        id: fullCat.id,
        name: fullCat.name,
        photo_url: fullCat.photo_url,
        rescue_story: fullCat.rescue_story,
        tags: fullCat.tags,
        health_status: fullCat.health_status,
        age: fullCat.age,
        gender: fullCat.gender,
        is_favorite: fullCat.is_favorite,
        intake_date: fullCat.intake_date,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase saveCat error:', err);
    }
  }
  return fullCat;
}

export async function deleteCat(id: string): Promise<void> {
  const localCats = loadLocalData().cats.filter((c) => c.id !== id);
  saveLocalCats(localCats);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('cats').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteCat error:', err);
    }
  }
}

// ==========================================
// 3. Menu Offerings CRUD
// ==========================================
export async function fetchMenu(): Promise<MenuItem[]> {
  const localMenu = loadLocalData().menu;
  const client = getActiveSupabaseClient();
  if (!client) return localMenu;

  try {
    const { data, error } = await client
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return localMenu;
    }

    const mapped: MenuItem[] = data.map((m: any) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      price_rm: Number(m.price_rm),
      description: m.description || '',
      is_available: m.is_available !== false,
      image_url: m.image_url || '',
      tags: Array.isArray(m.tags) ? m.tags : [],
      preparation_note: m.preparation_note || '',
    }));

    saveLocalMenu(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchMenu failed, using local storage:', err);
    return localMenu;
  }
}

export async function saveMenuItem(itemData: MenuItem | Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const id = 'id' in itemData && itemData.id ? itemData.id : `menu-${Date.now()}`;
  const fullItem: MenuItem = { ...itemData, id };

  const localMenu = loadLocalData().menu;
  const index = localMenu.findIndex((m) => m.id === id);
  const updatedMenu = index >= 0
    ? localMenu.map((m) => (m.id === id ? fullItem : m))
    : [...localMenu, fullItem];
  saveLocalMenu(updatedMenu);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('menu_items').upsert({
        id: fullItem.id,
        name: fullItem.name,
        category: fullItem.category,
        price_rm: Number(fullItem.price_rm),
        description: fullItem.description,
        is_available: fullItem.is_available,
        image_url: fullItem.image_url,
        tags: fullItem.tags,
        preparation_note: fullItem.preparation_note,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase saveMenuItem error:', err);
    }
  }
  return fullItem;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const localMenu = loadLocalData().menu.filter((m) => m.id !== id);
  saveLocalMenu(localMenu);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('menu_items').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteMenuItem error:', err);
    }
  }
}

export async function toggleMenuAvailability(id: string): Promise<void> {
  const localMenu = loadLocalData().menu;
  const target = localMenu.find((m) => m.id === id);
  if (!target) return;

  const newStatus = !target.is_available;
  const updatedMenu = localMenu.map((m) => (m.id === id ? { ...m, is_available: newStatus } : m));
  saveLocalMenu(updatedMenu);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('menu_items').update({ is_available: newStatus }).eq('id', id);
    } catch (err) {
      console.error('Supabase toggleMenuAvailability error:', err);
    }
  }
}

// ==========================================
// 4. TNR Updates CRUD
// ==========================================
export async function fetchTNRUpdates(): Promise<TNRUpdate[]> {
  const localTnr = loadLocalData().tnr;
  const client = getActiveSupabaseClient();
  if (!client) return localTnr;

  try {
    const { data, error } = await client
      .from('tnr_updates')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      return localTnr;
    }

    const mapped: TNRUpdate[] = data.map((t: any) => ({
      id: t.id,
      title: t.title,
      date: t.date,
      cats_treated_count: Number(t.cats_treated_count) || 1,
      description: t.description || '',
      photo_url: t.photo_url || '',
      cost_rm: t.cost_rm ? Number(t.cost_rm) : undefined,
      location: t.location || '',
      receipt_summary: t.receipt_summary || '',
    }));

    saveLocalTNR(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchTNRUpdates failed, using local storage:', err);
    return localTnr;
  }
}

export async function saveTNRUpdate(tnrData: TNRUpdate | Omit<TNRUpdate, 'id'>): Promise<TNRUpdate> {
  const id = 'id' in tnrData && tnrData.id ? tnrData.id : `tnr-${Date.now()}`;
  const fullTnr: TNRUpdate = { ...tnrData, id };

  const localTnr = loadLocalData().tnr;
  const index = localTnr.findIndex((t) => t.id === id);
  const updatedTnr = index >= 0
    ? localTnr.map((t) => (t.id === id ? fullTnr : t))
    : [fullTnr, ...localTnr];
  saveLocalTNR(updatedTnr);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('tnr_updates').upsert({
        id: fullTnr.id,
        title: fullTnr.title,
        date: fullTnr.date,
        cats_treated_count: fullTnr.cats_treated_count,
        description: fullTnr.description,
        photo_url: fullTnr.photo_url,
        cost_rm: fullTnr.cost_rm,
        location: fullTnr.location,
        receipt_summary: fullTnr.receipt_summary,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase saveTNRUpdate error:', err);
    }
  }
  return fullTnr;
}

export async function deleteTNRUpdate(id: string): Promise<void> {
  const localTnr = loadLocalData().tnr.filter((t) => t.id !== id);
  saveLocalTNR(localTnr);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('tnr_updates').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteTNRUpdate error:', err);
    }
  }
}

// ==========================================
// 5. Wishlist Items CRUD
// ==========================================
export async function fetchWishlist(): Promise<WishlistItem[]> {
  const localWishlist = loadLocalData().wishlist;
  const client = getActiveSupabaseClient();
  if (!client) return localWishlist;

  try {
    const { data, error } = await client.from('wishlist_items').select('*');

    if (error || !data || data.length === 0) {
      return localWishlist;
    }

    const mapped: WishlistItem[] = data.map((w: any) => ({
      id: w.id,
      item_name: w.item_name,
      urgency: w.urgency || 'Medium',
      quantity_needed: w.quantity_needed || '1 pack',
      fulfilled_count: w.fulfilled_count,
      category: w.category || 'Food',
      brand_preference: w.brand_preference,
    }));

    saveLocalWishlist(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchWishlist failed, using local storage:', err);
    return localWishlist;
  }
}

export async function saveWishlistItem(itemData: WishlistItem | Omit<WishlistItem, 'id'>): Promise<WishlistItem> {
  const id = 'id' in itemData && itemData.id ? itemData.id : `wish-${Date.now()}`;
  const fullItem: WishlistItem = { ...itemData, id };

  const localWish = loadLocalData().wishlist;
  const index = localWish.findIndex((w) => w.id === id);
  const updatedWish = index >= 0
    ? localWish.map((w) => (w.id === id ? fullItem : w))
    : [...localWish, fullItem];
  saveLocalWishlist(updatedWish);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('wishlist_items').upsert({
        id: fullItem.id,
        item_name: fullItem.item_name,
        urgency: fullItem.urgency,
        quantity_needed: fullItem.quantity_needed,
        fulfilled_count: fullItem.fulfilled_count,
        category: fullItem.category,
        brand_preference: fullItem.brand_preference,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase saveWishlistItem error:', err);
    }
  }
  return fullItem;
}

export async function deleteWishlistItem(id: string): Promise<void> {
  const localWish = loadLocalData().wishlist.filter((w) => w.id !== id);
  saveLocalWishlist(localWish);

  const client = getActiveSupabaseClient();
  if (client) {
    try {
      await client.from('wishlist_items').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteWishlistItem error:', err);
    }
  }
}

// ==========================================
// 6. Aggregate Loader & Realtime Subscription
// ==========================================
export async function loadAllData(): Promise<{
  goal: DonationGoal;
  cats: Cat[];
  menu: MenuItem[];
  tnr: TNRUpdate[];
  wishlist: WishlistItem[];
}> {
  const [goal, cats, menu, tnr, wishlist] = await Promise.all([
    fetchDonationGoal(),
    fetchCats(),
    fetchMenu(),
    fetchTNRUpdates(),
    fetchWishlist(),
  ]);

  return { goal, cats, menu, tnr, wishlist };
}

export function subscribeToRealtime(onUpdate: () => void): () => void {
  const client = getActiveSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('pherbies-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        onUpdate();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}

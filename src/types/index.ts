export interface DonationGoal {
  raised_amount: number;
  target_amount: number;
  month_label: string;
  total_donors?: number;
  vet_bills_target?: number;
  food_target?: number;
  litter_target?: number;
  vitamins_target?: number;
}

export interface Cat {
  id: string;
  name: string;
  photo_url: string;
  rescue_story: string;
  tags: string[];
  health_status: string;
  age?: string;
  gender?: 'Boy' | 'Girl';
  is_favorite?: boolean;
  intake_date?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Coffee & Drinks' | 'Main Meals' | 'Pastries';
  price_rm: number;
  description: string;
  is_available: boolean;
  image_url: string;
  tags?: string[];
  preparation_note?: string;
}

export interface TNRUpdate {
  id: string;
  title: string;
  date: string;
  cats_treated_count: number;
  description: string;
  photo_url: string;
  cost_rm?: number;
  location?: string;
  receipt_summary?: string;
}

export interface WishlistItem {
  id: string;
  item_name: string;
  urgency: 'High' | 'Medium';
  quantity_needed: string;
  fulfilled_count?: string;
  category: 'Food & Nutrition' | 'Hygiene & Litter' | 'Medical & Supplements';
  brand_preference?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSynced?: string;
}

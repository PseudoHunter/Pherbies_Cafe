import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DonationGoal, Cat, MenuItem, TNRUpdate, WishlistItem } from '../types';
import { testConnection, getSupabaseSqlSchema } from '../services/supabaseClient';
import { X, Check, Copy, Database, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

// ==========================================
// 1. Goal Edit Modal
// ==========================================
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (goal: DonationGoal) => Promise<void> | void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave }) => {
  const { donationGoal, updateDonationGoal } = useApp();
  const [formData, setFormData] = useState<DonationGoal>(donationGoal);

  useEffect(() => {
    setFormData(donationGoal);
  }, [donationGoal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      await onSave(formData);
    } else {
      updateDonationGoal(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F0DDC8] shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
            Edit Monthly Rescue Goal
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3D2619] mb-1">
                Month Label
              </label>
              <input
                type="text"
                value={formData.month_label}
                onChange={(e) => setFormData({ ...formData, month_label: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3D2619] mb-1">
                Total Target (RM)
              </label>
              <input
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs font-bold text-[#3D2619]"
                required
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2619] mb-1">
              Current Raised Amount (RM)
            </label>
            <input
              type="number"
              value={formData.raised_amount}
              onChange={(e) => setFormData({ ...formData, raised_amount: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-sm font-black text-[#D97746]"
              required
              min={0}
            />
          </div>

          <div className="pt-2 border-t border-[#F5EAD9]">
            <span className="text-xs font-bold text-[#5C3A21] block mb-2">
              Expense Allocation Sub-Targets (RM)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-[#5C3A21]/80 mb-0.5">Vet &amp; Spay/Neuter</label>
                <input
                  type="number"
                  value={formData.vet_bills_target || 1500}
                  onChange={(e) => setFormData({ ...formData, vet_bills_target: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8D7C8] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5C3A21]/80 mb-0.5">Cat Food (&ldquo;Makanan&rdquo;)</label>
                <input
                  type="number"
                  value={formData.food_target || 1000}
                  onChange={(e) => setFormData({ ...formData, food_target: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8D7C8] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5C3A21]/80 mb-0.5">Tofu Cat Litter</label>
                <input
                  type="number"
                  value={formData.litter_target || 600}
                  onChange={(e) => setFormData({ ...formData, litter_target: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8D7C8] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5C3A21]/80 mb-0.5">Vitamins &amp; Flea Meds</label>
                <input
                  type="number"
                  value={formData.vitamins_target || 400}
                  onChange={(e) => setFormData({ ...formData, vitamins_target: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8D7C8] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8D7C8] text-xs font-bold text-[#5C3A21]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white text-xs font-bold"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. Add / Edit Cat Modal Form
// ==========================================
interface CatFormModalProps {
  isOpen: boolean;
  initialCat?: Cat | null;
  onClose: () => void;
  onSave?: (cat: Cat | Omit<Cat, 'id'>) => Promise<void> | void;
}

export const CatFormModal: React.FC<CatFormModalProps> = ({ isOpen, initialCat, onClose, onSave }) => {
  const { addCat, updateCat } = useApp();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [rescueStory, setRescueStory] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Boy' | 'Girl'>('Boy');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (initialCat) {
      setName(initialCat.name);
      setPhotoUrl(initialCat.photo_url);
      setRescueStory(initialCat.rescue_story);
      setTagsStr(initialCat.tags.join(', '));
      setHealthStatus(initialCat.health_status);
      setAge(initialCat.age || '');
      setGender(initialCat.gender || 'Boy');
      setIsFavorite(!!initialCat.is_favorite);
    } else {
      setName('');
      setPhotoUrl('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80');
      setRescueStory('');
      setTagsStr('Friendly, TNR Success');
      setHealthStatus('Neutered, fully vaccinated, clear bloodwork.');
      setAge('1 year old');
      setGender('Boy');
      setIsFavorite(false);
    }
  }, [initialCat, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const safePhotoUrl = photoUrl && photoUrl.trim() !== ''
      ? photoUrl.trim()
      : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';

    if (onSave) {
      if (initialCat) {
        await onSave({
          ...initialCat,
          name,
          photo_url: safePhotoUrl,
          rescue_story: rescueStory,
          tags,
          health_status: healthStatus,
          age,
          gender,
          is_favorite: isFavorite,
        });
      } else {
        await onSave({
          name,
          photo_url: safePhotoUrl,
          rescue_story: rescueStory,
          tags,
          health_status: healthStatus,
          age,
          gender,
          is_favorite: isFavorite,
        });
      }
    } else {
      if (initialCat) {
        updateCat({
          ...initialCat,
          name,
          photo_url: safePhotoUrl,
          rescue_story: rescueStory,
          tags,
          health_status: healthStatus,
          age,
          gender,
          is_favorite: isFavorite,
        });
      } else {
        addCat({
          name,
          photo_url: safePhotoUrl,
          rescue_story: rescueStory,
          tags,
          health_status: healthStatus,
          age,
          gender,
          is_favorite: isFavorite,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F0DDC8] shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
            {initialCat ? `Edit ${initialCat.name}` : 'Add Rescued Cat'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Cat Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Age Estimate</label>
              <input
                type="text"
                placeholder="e.g. 2 years old"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Boy' | 'Girl')}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] bg-white"
              >
                <option value="Boy">Boy ♂️</option>
                <option value="Girl">Girl ♀️</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 font-bold text-[#3D2619] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded text-[#E07A5F]"
                />
                <span>Resident Star / Favorite</span>
              </label>
            </div>
          </div>

          <ImageUploader
            value={photoUrl}
            onChange={setPhotoUrl}
            label="Rescued Cat Photo"
            recommendedDimensions="Click to upload cat photo or drag & drop (JPG, PNG, WEBP)"
          />

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Friendly, TNR Success, Lap Warmer"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Rescue Story *</label>
            <textarea
              rows={3}
              value={rescueStory}
              onChange={(e) => setRescueStory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Health &amp; Vet Status *</label>
            <input
              type="text"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8D7C8] font-bold text-[#5C3A21]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold"
            >
              {initialCat ? 'Save Changes' : 'Add Cat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. Add / Edit Menu Item Modal Form
// ==========================================
interface MenuFormModalProps {
  isOpen: boolean;
  initialItem?: MenuItem | null;
  onClose: () => void;
  onSave?: (item: MenuItem | Omit<MenuItem, 'id'>) => Promise<void> | void;
}

export const MenuFormModal: React.FC<MenuFormModalProps> = ({ isOpen, initialItem, onClose, onSave }) => {
  const { addMenuItem, updateMenuItem } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Coffee & Drinks' | 'Main Meals' | 'Pastries'>('Coffee & Drinks');
  const [priceRm, setPriceRm] = useState(14.00);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [tagsStr, setTagsStr] = useState('');
  const [preparationNote, setPreparationNote] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setPriceRm(initialItem.price_rm);
      setDescription(initialItem.description);
      setImageUrl(initialItem.image_url);
      setIsAvailable(initialItem.is_available);
      setTagsStr(initialItem.tags ? initialItem.tags.join(', ') : '');
      setPreparationNote(initialItem.preparation_note || '');
    } else {
      setName('');
      setCategory('Coffee & Drinks');
      setPriceRm(14.00);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80');
      setIsAvailable(true);
      setTagsStr('Signature');
      setPreparationNote('');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const safeImageUrl = imageUrl && imageUrl.trim() !== ''
      ? imageUrl.trim()
      : 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80';

    if (onSave) {
      if (initialItem) {
        await onSave({
          ...initialItem,
          name,
          category,
          price_rm: Number(priceRm),
          description,
          image_url: safeImageUrl,
          is_available: isAvailable,
          tags,
          preparation_note: preparationNote,
        });
      } else {
        await onSave({
          name,
          category,
          price_rm: Number(priceRm),
          description,
          image_url: safeImageUrl,
          is_available: isAvailable,
          tags,
          preparation_note: preparationNote,
        });
      }
    } else {
      if (initialItem) {
        updateMenuItem({
          ...initialItem,
          name,
          category,
          price_rm: Number(priceRm),
          description,
          image_url: safeImageUrl,
          is_available: isAvailable,
          tags,
          preparation_note: preparationNote,
        });
      } else {
        addMenuItem({
          name,
          category,
          price_rm: Number(priceRm),
          description,
          image_url: safeImageUrl,
          is_available: isAvailable,
          tags,
          preparation_note: preparationNote,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F0DDC8] shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
            {initialItem ? `Edit ${initialItem.name}` : 'Add Menu Item'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Item Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] bg-white font-semibold"
              >
                <option value="Coffee & Drinks">Coffee &amp; Drinks</option>
                <option value="Main Meals">Main Meals</option>
                <option value="Pastries">Pastries</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Price (RM) *</label>
              <input
                type="number"
                step="0.5"
                value={priceRm}
                onChange={(e) => setPriceRm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] font-bold text-[#D97746]"
                required
                min={0}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 font-bold text-[#3D2619] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-[#E07A5F]"
                />
                <span>Currently Available (In Stock)</span>
              </label>
            </div>
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label="Dish / Drink Photo"
            recommendedDimensions="Click to upload dish photo or drag & drop (JPG, PNG, WEBP)"
          />

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Description *</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Tags</label>
              <input
                type="text"
                placeholder="e.g. Signature, Bestseller"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Preparation Note</label>
              <input
                type="text"
                placeholder="e.g. Choice of Oat Milk (+RM 2)"
                value={preparationNote}
                onChange={(e) => setPreparationNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8D7C8] font-bold text-[#5C3A21]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold"
            >
              {initialItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. Add / Edit TNR Update Modal Form
// ==========================================
interface TNRFormModalProps {
  isOpen: boolean;
  initialUpdate?: TNRUpdate | null;
  onClose: () => void;
  onSave?: (update: TNRUpdate | Omit<TNRUpdate, 'id'>) => Promise<void> | void;
}

export const TNRFormModal: React.FC<TNRFormModalProps> = ({ isOpen, initialUpdate, onClose, onSave }) => {
  const { addTNRUpdate, updateTNRUpdate } = useApp();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [catsTreatedCount, setCatsTreatedCount] = useState(1);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [costRm, setCostRm] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [receiptSummary, setReceiptSummary] = useState('');

  useEffect(() => {
    if (initialUpdate) {
      setTitle(initialUpdate.title);
      setDate(initialUpdate.date);
      setCatsTreatedCount(initialUpdate.cats_treated_count);
      setDescription(initialUpdate.description);
      setPhotoUrl(initialUpdate.photo_url);
      setCostRm(initialUpdate.cost_rm);
      setLocation(initialUpdate.location || '');
      setReceiptSummary(initialUpdate.receipt_summary || '');
    } else {
      setTitle('');
      setDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
      setCatsTreatedCount(3);
      setDescription('');
      setPhotoUrl('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80');
      setCostRm(450);
      setLocation('Subang Jaya');
      setReceiptSummary('Vet spay/neuter + post-surgery antibiotics');
    }
  }, [initialUpdate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safePhotoUrl = photoUrl && photoUrl.trim() !== ''
      ? photoUrl.trim()
      : 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80';

    if (onSave) {
      if (initialUpdate) {
        await onSave({
          ...initialUpdate,
          title,
          date,
          cats_treated_count: Number(catsTreatedCount),
          description,
          photo_url: safePhotoUrl,
          cost_rm: costRm ? Number(costRm) : undefined,
          location,
          receipt_summary: receiptSummary,
        });
      } else {
        await onSave({
          title,
          date,
          cats_treated_count: Number(catsTreatedCount),
          description,
          photo_url: safePhotoUrl,
          cost_rm: costRm ? Number(costRm) : undefined,
          location,
          receipt_summary: receiptSummary,
        });
      }
    } else {
      if (initialUpdate) {
        updateTNRUpdate({
          ...initialUpdate,
          title,
          date,
          cats_treated_count: Number(catsTreatedCount),
          description,
          photo_url: safePhotoUrl,
          cost_rm: costRm ? Number(costRm) : undefined,
          location,
          receipt_summary: receiptSummary,
        });
      } else {
        addTNRUpdate({
          title,
          date,
          cats_treated_count: Number(catsTreatedCount),
          description,
          photo_url: safePhotoUrl,
          cost_rm: costRm ? Number(costRm) : undefined,
          location,
          receipt_summary: receiptSummary,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F0DDC8] shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
            {initialUpdate ? 'Edit TNR Mission Update' : 'Add TNR Mission Update'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Update Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Cats Treated Count</label>
              <input
                type="number"
                value={catsTreatedCount}
                onChange={(e) => setCatsTreatedCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
                required
                min={1}
              />
            </div>
          </div>

          <ImageUploader
            value={photoUrl}
            onChange={setPhotoUrl}
            label="Rescue & Treatment Photo"
            recommendedDimensions="Click to upload rescue or clinic photo or drag & drop (JPG, PNG, WEBP)"
          />

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Total Vet Cost (RM)</label>
              <input
                type="number"
                value={costRm || ''}
                onChange={(e) => setCostRm(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Location / Neighborhood</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Receipt / Invoice Note</label>
            <input
              type="text"
              placeholder="e.g. Vet Clinic Invoice #9418 - 5x Spay/Neuter"
              value={receiptSummary}
              onChange={(e) => setReceiptSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8D7C8] font-bold text-[#5C3A21]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold"
            >
              {initialUpdate ? 'Save Changes' : 'Add Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. Add / Edit Wishlist Item Modal Form
// ==========================================
interface WishlistFormModalProps {
  isOpen: boolean;
  initialItem?: WishlistItem | null;
  onClose: () => void;
  onSave?: (item: WishlistItem | Omit<WishlistItem, 'id'>) => Promise<void> | void;
}

export const WishlistFormModal: React.FC<WishlistFormModalProps> = ({ isOpen, initialItem, onClose, onSave }) => {
  const { addWishlistItem, updateWishlistItem } = useApp();
  const [itemName, setItemName] = useState('');
  const [urgency, setUrgency] = useState<'High' | 'Medium'>('High');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [fulfilledCount, setFulfilledCount] = useState('');
  const [category, setCategory] = useState<'Food & Nutrition' | 'Hygiene & Litter' | 'Medical & Supplements'>('Food & Nutrition');
  const [brandPreference, setBrandPreference] = useState('');

  useEffect(() => {
    if (initialItem) {
      setItemName(initialItem.item_name);
      setUrgency(initialItem.urgency);
      setQuantityNeeded(initialItem.quantity_needed);
      setFulfilledCount(initialItem.fulfilled_count || '');
      setCategory(initialItem.category);
      setBrandPreference(initialItem.brand_preference || '');
    } else {
      setItemName('');
      setUrgency('High');
      setQuantityNeeded('10 bags');
      setFulfilledCount('2 bags fulfilled');
      setCategory('Food & Nutrition');
      setBrandPreference('Royal Canin or Hill\'s');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      if (initialItem) {
        await onSave({
          ...initialItem,
          item_name: itemName,
          urgency,
          quantity_needed: quantityNeeded,
          fulfilled_count: fulfilledCount,
          category,
          brand_preference: brandPreference,
        });
      } else {
        await onSave({
          item_name: itemName,
          urgency,
          quantity_needed: quantityNeeded,
          fulfilled_count: fulfilledCount,
          category,
          brand_preference: brandPreference,
        });
      }
    } else {
      if (initialItem) {
        updateWishlistItem({
          ...initialItem,
          item_name: itemName,
          urgency,
          quantity_needed: quantityNeeded,
          fulfilled_count: fulfilledCount,
          category,
          brand_preference: brandPreference,
        });
      } else {
        addWishlistItem({
          item_name: itemName,
          urgency,
          quantity_needed: quantityNeeded,
          fulfilled_count: fulfilledCount,
          category,
          brand_preference: brandPreference,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F0DDC8] shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
            {initialItem ? 'Edit Wishlist Supply' : 'Add Wishlist Supply'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Item Name *</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'High' | 'Medium')}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] bg-white font-bold"
              >
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] bg-white"
              >
                <option value="Food & Nutrition">Food &amp; Nutrition</option>
                <option value="Hygiene & Litter">Hygiene &amp; Litter</option>
                <option value="Medical & Supplements">Medical &amp; Supplements</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Quantity Needed</label>
              <input
                type="text"
                placeholder="e.g. 12 bags (6L each)"
                value={quantityNeeded}
                onChange={(e) => setQuantityNeeded(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2619] mb-1">Fulfilled So Far</label>
              <input
                type="text"
                placeholder="e.g. 4 bags fulfilled"
                value={fulfilledCount}
                onChange={(e) => setFulfilledCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">Brand Preference</label>
            <input
              type="text"
              placeholder="e.g. Cature / N1 Tofu Litter"
              value={brandPreference}
              onChange={(e) => setBrandPreference(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E8D7C8] font-bold text-[#5C3A21]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold"
            >
              {initialItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 6. Supabase Settings & SQL Schema Modal
// ==========================================
export const SupabaseModal: React.FC = () => {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, supabaseConfig, updateSupabaseCredentials, showToast } = useApp();
  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  useEffect(() => {
    setUrl(supabaseConfig.url || '');
    setAnonKey(supabaseConfig.anonKey || '');
  }, [supabaseConfig]);

  if (!isSupabaseModalOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testConnection(url.trim(), anonKey.trim());
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSupabaseCredentials(url.trim(), anonKey.trim());
    setIsSupabaseModalOpen(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSqlSchema());
    setCopiedSchema(true);
    showToast('SQL Schema script copied! Paste into Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={() => setIsSupabaseModalOpen(false)}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#F0DDC8] shadow-2xl space-y-5 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
                Supabase Real-Time Persistence
              </h3>
              <p className="text-xs text-[#5C3A21]/75">
                Shared live cloud database for Pherbies Cafe
              </p>
            </div>
          </div>
          <button onClick={() => setIsSupabaseModalOpen(false)} className="p-1 rounded-full hover:bg-zinc-100">
            <X className="w-5 h-5 text-[#5C3A21]" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="p-3.5 rounded-2xl bg-[#FDF6EC] border border-[#F0DDC8] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#3D2619] block">Current Status:</span>
            <span className={supabaseConfig.isConnected ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {supabaseConfig.isConnected ? 'Connected & Live Sync Active' : 'Offline / LocalStorage Fallback Active'}
            </span>
          </div>
          {supabaseConfig.lastSynced && (
            <span className="text-[11px] text-[#5C3A21]/70">
              Synced at {supabaseConfig.lastSynced}
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#3D2619] mb-1">
              Supabase Project URL (e.g. https://xyz.supabase.co)
            </label>
            <input
              type="text"
              placeholder="https://YOUR_PROJECT_ID.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D7C8] font-mono text-xs bg-[#FFFBF5]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3D2619] mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D7C8] font-mono text-xs bg-[#FFFBF5]"
            />
          </div>

          {/* Test connection output */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={!url || !anonKey || testing}
              className="px-4 py-2 rounded-xl bg-[#5C3A21] hover:bg-[#3D2619] text-white font-bold transition disabled:opacity-50 cursor-pointer"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold transition cursor-pointer"
            >
              Save &amp; Connect
            </button>
          </div>
        </form>

        {/* SQL Schema helper */}
        <div className="pt-4 border-t border-[#F5EAD9] space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#3D2619] block">
                Setting up a new Supabase Project?
              </span>
              <span className="text-[11px] text-[#5C3A21]/70">
                Run our pre-built SQL schema in your Supabase SQL Editor.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSchema(!showSchema)}
                className="text-xs text-[#D97746] hover:underline font-bold"
              >
                {showSchema ? 'Hide SQL' : 'View SQL'}
              </button>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FDF6EC] hover:bg-[#F7EEDB] border border-[#E8D7C8] text-xs font-bold text-[#3D2619] transition cursor-pointer"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL'}</span>
              </button>
            </div>
          </div>

          {showSchema && (
            <div className="max-h-48 overflow-y-auto bg-zinc-900 text-zinc-200 p-3 rounded-xl font-mono text-[10px] leading-relaxed">
              <pre>{getSupabaseSqlSchema()}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

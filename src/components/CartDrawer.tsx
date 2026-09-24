import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Heart, Send, ShoppingBag, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { BANK_DETAILS } from '../data/defaultData';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTip,
    setCartTip,
    isCartOpen,
    setIsCartOpen,
    showToast,
  } = useApp();

  const [orderType, setOrderType] = useState<'dine-in' | 'pickup'>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [tableOrTime, setTableOrTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isCartOpen) return null;

  const itemsSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price_rm * item.quantity, 0);
  const grandTotal = itemsSubtotal + cartTip;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your order cart is empty! Pick your favorite drinks or meals.', 'error');
      return;
    }

    if (!customerName.trim()) {
      showToast('Please enter your name so we can label your order!', 'error');
      return;
    }

    // Format neat WhatsApp order receipt message
    let message = `🐾 *PHERBIES CAFE — HOME ORDER & RESCUE FUND* 🐾\n`;
    message += `──────────────────────\n`;
    message += `👤 *Customer Name:* ${customerName.trim()}\n`;
    message += `📍 *Order Type:* ${orderType === 'dine-in' ? 'Cozy Dine-In (Table / Reservation)' : 'Self-Pickup'}\n`;
    if (tableOrTime.trim()) {
      message += `⏰ *Table / Pickup Time:* ${tableOrTime.trim()}\n`;
    }
    message += `──────────────────────\n`;
    message += `🍽️ *ORDERED ITEMS:*\n`;

    cart.forEach((item, index) => {
      const lineTotal = (item.menuItem.price_rm * item.quantity).toFixed(2);
      message += `${index + 1}. *${item.menuItem.name}* (x${item.quantity}) — RM ${lineTotal}\n`;
      if (item.notes) {
        message += `   ↳ _Note: ${item.notes}_\n`;
      }
    });

    message += `──────────────────────\n`;
    message += `Subtotal Items: RM ${itemsSubtotal.toFixed(2)}\n`;
    if (cartTip > 0) {
      message += `❤️ *Cat Rescue & Vet Tip:* RM ${cartTip.toFixed(2)}\n`;
    }
    message += `💰 *GRAND TOTAL:* RM ${grandTotal.toFixed(2)}\n`;
    message += `──────────────────────\n`;

    if (specialInstructions.trim()) {
      message += `📝 *Special Notes:* ${specialInstructions.trim()}\n`;
    }

    message += `\nThank you for supporting Pherbies Cafe and our 8 resident rescue cats! May I know the payment & order confirmation details? 🐱`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${BANK_DETAILS.whatsappNumber}?text=${encoded}`;

    window.open(waUrl, '_blank');
    showToast('Redirecting to WhatsApp to send your order! ☕', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#F0DDC8]">
          {/* Drawer Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#FDF6EC] border-b border-[#F0DDC8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E07A5F] flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-cozy text-xl font-bold text-[#3D2619]">
                  Your Cafe Order
                </h3>
                <p className="text-xs text-[#5C3A21]/75">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in order
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Clear Cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-zinc-100 flex items-center justify-center text-[#3D2619] border border-[#E8D7C8] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#FDF6EC] flex items-center justify-center mx-auto text-4xl">
                  ☕
                </div>
                <h4 className="font-serif-cozy text-xl font-bold text-[#3D2619]">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#5C3A21]/80 max-w-xs mx-auto">
                  Pick a signature Gula Melaka Latte, Sambal Strawberry Nasi Lemak, or cat-paw cookies to get started!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow hover:bg-[#C85A32] transition cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3.5">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F0DDC8] flex items-start gap-3"
                    >
                      {item.menuItem.image_url && item.menuItem.image_url.trim() !== '' ? (
                        <img
                          src={item.menuItem.image_url.trim()}
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#F0DDC8]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#FDF6EC] border border-[#F0DDC8] flex items-center justify-center shrink-0 text-xl">
                          ☕
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-[#3D2619] truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-xs font-black text-[#D97746] whitespace-nowrap">
                            RM {(item.menuItem.price_rm * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#5C3A21]/70 mt-0.5">
                          RM {item.menuItem.price_rm.toFixed(2)} each
                        </p>

                        {item.notes && (
                          <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1">
                            Note: {item.notes}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E8D7C8] px-1 py-0.5">
                            <button
                              onClick={() => updateCartQuantity(item.menuItem.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#5C3A21] hover:bg-zinc-100 transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-[#3D2619] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.menuItem.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#5C3A21] hover:bg-zinc-100 transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cat Tip & Donation Selector */}
                <div className="p-4 rounded-2xl bg-[#FDF6EC] border border-[#F0DDC8] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D2619]">
                      <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
                      <span>Optional Cat Rescue Tip</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#D97746]">
                      +RM {cartTip.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C3A21]/80 leading-relaxed">
                    100% of this tip directly buys fresh wet food and tofu litter for our 8 resident cats!
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {[0, 2, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setCartTip(amount)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          cartTip === amount
                            ? 'bg-[#E07A5F] text-white shadow-xs'
                            : 'bg-white text-[#5C3A21] hover:bg-[#F7EEDB] border border-[#E8D7C8]'
                        }`}
                      >
                        {amount === 0 ? 'No Tip' : `+RM ${amount}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Details Form */}
                <div className="space-y-3.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C3A21]/80">
                    Order &amp; Pickup Details
                  </h4>

                  {/* Dine-In or Pickup Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in')}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        orderType === 'dine-in'
                          ? 'bg-[#3D2619] text-[#FFFBF5] border-[#3D2619]'
                          : 'bg-[#FFFBF5] text-[#5C3A21] border-[#E8D7C8]'
                      }`}
                    >
                      ☕ Dine-In Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('pickup')}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-[#3D2619] text-[#FFFBF5] border-[#3D2619]'
                          : 'bg-[#FFFBF5] text-[#5C3A21] border-[#E8D7C8]'
                      }`}
                    >
                      🥡 Self-Pickup
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2619] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Tan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E07A5F] bg-[#FFFBF5]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2619] mb-1">
                      {orderType === 'dine-in' ? 'Table Number / Reservation Time' : 'Estimated Pickup Time'}
                    </label>
                    <input
                      type="text"
                      placeholder={orderType === 'dine-in' ? 'e.g. Table 2 or 2:30 PM' : 'e.g. 15 minutes / 3:00 PM'}
                      value={tableOrTime}
                      onChange={(e) => setTableOrTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E07A5F] bg-[#FFFBF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#3D2619] mb-1">
                      Dietary / Preparation Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oat milk, less sweet, no chili"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs focus:outline-none focus:ring-2 focus:ring-[#E07A5F] bg-[#FFFBF5]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Grand Total & WhatsApp Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FDF6EC] border-t border-[#F0DDC8] space-y-3.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#5C3A21]">
                  <span>Items Subtotal</span>
                  <span>RM {itemsSubtotal.toFixed(2)}</span>
                </div>
                {cartTip > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Cat Rescue Tip</span>
                    <span>+RM {cartTip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[#3D2619] pt-2 border-t border-[#E8D7C8]">
                  <span>Grand Total</span>
                  <span className="font-serif-cozy text-xl text-[#D97746]">
                    RM {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Send Order via WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-[#5C3A21]/70">
                Opens WhatsApp with pre-filled order receipt to message Pherbies Cafe staff directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

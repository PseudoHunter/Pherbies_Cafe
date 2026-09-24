import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WishlistItem } from '../types';
import { BANK_DETAILS } from '../data/defaultData';
import {
  Copy,
  Check,
  Heart,
  QrCode,
  Package,
  PlusCircle,
  Edit3,
  Trash2,
  AlertCircle,
  ExternalLink,
  Send,
  Building,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface DonationWishlistProps {
  onOpenAddWishlistModal: () => void;
  onOpenEditWishlistModal: (item: WishlistItem) => void;
}

export const DonationWishlist: React.FC<DonationWishlistProps> = ({
  onOpenAddWishlistModal,
  onOpenEditWishlistModal,
}) => {
  const { wishlist, isAdmin, deleteWishlistItem, showToast } = useApp();
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedTng, setCopiedTng] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyMaybank = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber.replace(/\s+/g, ''));
    setCopiedBank(true);
    showToast('Maybank account number copied to clipboard!', 'success');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleCopyTng = () => {
    navigator.clipboard.writeText(BANK_DETAILS.tngEwalletPhone);
    setCopiedTng(true);
    showToast('Touch \'n Go / DuitNow phone number copied!', 'success');
    setTimeout(() => setCopiedTng(false), 2500);
  };

  const handlePledgeItem = (item: WishlistItem) => {
    const text = encodeURIComponent(
      `Hello Pherbies Cafe! 🐾 I would like to sponsor / donate supply item: *${item.item_name}* (${item.quantity_needed}) from your wishlist! Could you provide your parcel shipping address or delivery instructions?`
    );
    window.open(`https://wa.me/${BANK_DETAILS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="support" className="py-16 md:py-24 bg-[#FDF6EC]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F0DDC8] text-[#C85A32] text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
            <span>Support &amp; Direct Rescue Sponsorship</span>
          </div>
          <h2 className="font-serif-cozy text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2619] tracking-tight break-words hyphens-auto">
            Direct Donations &amp; Wishlist
          </h2>
          <p className="text-sm sm:text-base text-[#5C3A21]/80 leading-relaxed max-w-2xl mx-auto break-words hyphens-auto">
            Prefer direct bank transfer or gifting physical supplies? Every ringgit goes 100% 
            towards cat nutrition, veterinary sterilization, and high-absorbency tofu litter.
          </p>
        </div>

        {/* Top: 2 Primary Donation Cards (Maybank + TNG / DuitNow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {/* Maybank Card */}
          <div className="relative bg-white rounded-3xl p-5 sm:p-8 border border-[#F0DDC8] shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-800 font-black text-lg sm:text-xl shrink-0">
                  MBB
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#D97746] block truncate">
                    Direct Bank Transfer
                  </span>
                  <h3 className="font-serif-cozy text-lg sm:text-xl font-bold text-[#3D2619] truncate">
                    {BANK_DETAILS.bankName}
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                Maybank
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFBF5] border border-[#F0DDC8] flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-[#5C3A21]/70 block truncate">Account Number</span>
                  <span className="font-mono text-lg sm:text-2xl font-black text-[#3D2619] tracking-wider break-all">
                    {BANK_DETAILS.accountNumber}
                  </span>
                </div>

                <button
                  onClick={handleCopyMaybank}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  {copiedBank ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBank ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs text-[#5C3A21]/80 space-y-1 break-words hyphens-auto">
                <p>
                  <strong>Account Name:</strong> {BANK_DETAILS.accountHolder}
                </p>
                <p className="text-[11px] text-[#5C3A21]/70">
                  Recipient reference: <code className="bg-[#FDF6EC] px-1.5 py-0.5 rounded text-[#C85A32] font-semibold">RESCUE KUCING</code>
                </p>
              </div>
            </div>
          </div>

          {/* Touch 'n Go & DuitNow QR Card */}
          <div className="relative bg-white rounded-3xl p-5 sm:p-8 border border-[#F0DDC8] shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-700 font-black text-lg sm:text-xl shrink-0">
                  TNG
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#D97746] block truncate">
                    Instant eWallet / DuitNow
                  </span>
                  <h3 className="font-serif-cozy text-lg sm:text-xl font-bold text-[#3D2619] truncate">
                    Touch &apos;n Go eWallet
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
                DuitNow
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFBF5] border border-[#F0DDC8] flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-[#5C3A21]/70 block truncate">Mobile Transfer Number</span>
                  <span className="font-mono text-lg sm:text-2xl font-black text-[#3D2619] tracking-wider break-all">
                    {BANK_DETAILS.tngEwalletPhone}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyTng}
                    className="flex-1 xs:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {copiedTng ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedTng ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="p-2 rounded-xl bg-[#FDF6EC] hover:bg-[#F7EEDB] border border-[#E8D7C8] text-[#3D2619] transition cursor-pointer shrink-0"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#5C3A21]/80 space-y-1 break-words hyphens-auto">
                <p>
                  <strong>Recipient:</strong> Pherbies Cafe Caretaker
                </p>
                <p className="text-[11px] text-[#5C3A21]/70">
                  Send payment receipt to <a href="https://www.threads.net/@pherbiescafe" target="_blank" rel="noreferrer" className="underline font-bold text-[#D97746]">@pherbiescafe on Threads</a> or WhatsApp!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Supplies Wishlist Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0DDC8] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#F0DDC8]">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#E07A5F]" />
                <h3 className="font-serif-cozy text-2xl font-bold text-[#3D2619]">
                  Physical Supplies Wishlist
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5C3A21]/80 mt-1">
                You can directly order these items via Shopee / Lazada or pet stores and have them shipped to our home cafe!
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenAddWishlistModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-xs shadow transition cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Wishlist Item</span>
              </button>
            )}
          </div>

          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#FFFBF5] border border-[#F0DDC8] hover:border-[#E07A5F] transition-all flex flex-col justify-between space-y-4 min-w-0"
              >
                <div className="space-y-2.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                        item.urgency === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.urgency} Urgency
                    </span>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onOpenEditWishlistModal(item)}
                          className="p-1 rounded text-[#5C3A21] hover:text-[#C85A32] hover:bg-white transition cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${item.item_name}"?`)) {
                              deleteWishlistItem(item.id);
                            }
                          }}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-white transition cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h4 className="font-serif-cozy text-base font-bold text-[#3D2619] leading-snug break-words hyphens-auto min-w-0">
                    {item.item_name}
                  </h4>

                  <div className="space-y-1 text-xs text-[#5C3A21]/80">
                    <div className="flex justify-between">
                      <span className="font-medium">Needed:</span>
                      <span className="font-bold text-[#3D2619]">{item.quantity_needed}</span>
                    </div>
                    {item.fulfilled_count && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Current:</span>
                        <span className="font-semibold">{item.fulfilled_count}</span>
                      </div>
                    )}
                    {item.brand_preference && (
                      <p className="text-[11px] text-[#5C3A21]/70 italic pt-1">
                        Preferred: {item.brand_preference}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handlePledgeItem(item)}
                  className="w-full py-2 px-3 rounded-xl bg-[#3D2619] hover:bg-[#5C3A21] text-[#FFFBF5] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-[#E07A5F]" />
                  <span>I Want to Send This Item</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border border-[#F0DDC8]"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif-cozy text-xl font-bold text-[#3D2619]">
              Touch &apos;n Go / DuitNow QR
            </h4>
            <div className="p-4 bg-[#FDF6EC] rounded-2xl border border-[#F0DDC8] inline-block">
              {/* Clean decorative QR illustration / code */}
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-zinc-200 mx-auto flex flex-col items-center justify-center relative">
                <QrCode className="w-32 h-32 text-[#3D2619]" />
                <span className="text-[10px] font-bold text-[#C85A32] mt-1">Pherbies Cafe DuitNow</span>
              </div>
            </div>
            <p className="text-xs text-[#5C3A21]/80">
              Scan with any Malaysian banking app or Touch &apos;n Go eWallet.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#E07A5F] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

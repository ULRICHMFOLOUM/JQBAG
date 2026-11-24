"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    total,
    savings,
    sendWhatsAppOrder,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-screen max-w-md bg-gradient-to-b from-obsidian-850 to-obsidian-900 border-l border-gold-500/20 flex flex-col shadow-2xl text-white"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-lg font-bold">
                Mon Panier <span className="text-gold-400 text-sm font-sans">({totalCount})</span>
              </h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-white mb-1">
                  Votre panier est vide
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Laissez-vous séduire par nos créations d'exception en perles confectionnées à la
                  main.
                </p>
                <Link
                  href="/produits"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs transition-colors shadow-lg shadow-gold-500/20"
                >
                  Découvrir les collections
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const currentPrice = item.promoPrice ?? item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl bg-obsidian-850/80 border border-gold-500/15 relative group"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-obsidian-950 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-bold text-gold-400 font-serif">
                            {formatPrice(currentPrice)}
                          </span>
                          {item.promoPrice && (
                            <span className="text-[10px] text-zinc-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Adjuster */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-white/10 rounded-lg bg-obsidian-950 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-zinc-400 hover:text-white"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-zinc-400 ml-auto">
                          Sous-total : {formatPrice(currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals & CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gold-500/10 bg-obsidian-900/90 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-400">
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Économies réalisées</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-sm text-white pt-1">
                  <span className="font-semibold">Total TTC</span>
                  <span className="font-serif text-xl font-bold text-gold-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paiement Sécurisé Fapshi</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <button
                  onClick={() => {
                    sendWhatsAppOrder();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-900/40 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <Link
                  href="/panier"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-gold-400 underline"
                >
                  Voir page panier &amp; ticket
                </Link>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vider</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


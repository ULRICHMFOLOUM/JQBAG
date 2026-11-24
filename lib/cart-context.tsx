"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  promoPrice?: number | null;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  savings: number;
  total: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  sendWhatsAppOrder: (customerInfo?: { name?: string; phone?: string; address?: string }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "jq_bags_luxury_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Charger depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erreur lecture panier:", e);
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder dans le localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erreur sauvegarde panier:", e);
    }
  }, [items, isLoaded]);

  const addItem = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.promoPrice ?? item.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const savings = items.reduce((acc, item) => {
    if (item.promoPrice && item.promoPrice < item.price) {
      return acc + (item.price - item.promoPrice) * item.quantity;
    }
    return acc;
  }, 0);

  const total = subtotal;

  const sendWhatsAppOrder = (customerInfo?: { name?: string; phone?: string; address?: string }) => {
    if (items.length === 0) return;

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828";
    let message = `Bonjour JQ BAGS ! ✨\nJe souhaite passer une commande :\n\n`;

    if (customerInfo?.name) {
      message += `👤 *Client :* ${customerInfo.name}\n`;
    }
    if (customerInfo?.phone) {
      message += `📱 *Téléphone :* ${customerInfo.phone}\n`;
    }
    if (customerInfo?.address) {
      message += `📍 *Adresse de livraison :* ${customerInfo.address}\n`;
    }

    message += `\n🛍️ *Articles sélectionnés :*\n`;
    items.forEach((item, index) => {
      const p = item.promoPrice ?? item.price;
      message += `${index + 1}. *${item.name}* (x${item.quantity}) — ${formatPrice(p * item.quantity)}\n`;
    });

    message += `\n💰 *TOTAL DE LA COMMANDE :* ${formatPrice(total)}\n\n`;
    message += `Merci de me confirmer la disponibilité et le délai de livraison !`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        savings,
        total,
        isDrawerOpen,
        setIsDrawerOpen,
        sendWhatsAppOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé au sein de CartProvider");
  }
  return context;
}


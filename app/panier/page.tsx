"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  MessageCircle,
  Download,
  ArrowRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { OrderTicketModal } from "@/components/ticket/OrderTicketModal";
import { toast } from "sonner";

export default function PanierPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    total,
    savings,
    sendWhatsAppOrder,
  } = useCart();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketOrderData, setTicketOrderData] = useState<any>(null);

  const handleDownloadTicket = () => {
    if (items.length === 0) {
      toast.error("Votre panier est vide !");
      return;
    }

    if (!session?.user) {
      toast.info("Veuillez vous connecter pour générer et télécharger votre ticket.");
      setAuthModalOpen(true);
      return;
    }

    const orderData = {
      orderNumber: `TICKET-${Date.now().toString().slice(-6)}`,
      customerName: session.user.name || "Client Privilège",
      customerEmail: session.user.email || "",
      customerPhone: (session.user as any)?.phone || "",
      totalAmount: total,
      paymentMethod: "FAPSHI",
      paymentStatus: "PENDING",
      createdAt: new Date(),
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.promoPrice ?? i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
      })),
    };

    setTicketOrderData(orderData);
    setTicketModalOpen(true);
  };

  const handleClearCart = () => {
    if (confirm("Voulez-vous vraiment vider l'ensemble de votre panier ?")) {
      clearCart();
      toast.success("Panier vidé.");
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
          Récapitulatif de Commande
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Mon <span className="gold-gradient-text italic font-serif">Panier</span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="max-w-md mx-auto py-16 px-6 rounded-3xl bg-obsidian-850 border border-gold-500/15 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4 text-gold-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">
            Votre panier est vide
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Explorez notre catalogue et trouvez la création perlée qui sublimera vos moments d'exception.
          </p>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/20"
          >
            <span>Découvrir nos créations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>{totalCount} article(s) dans votre sélection</span>
              <button
                onClick={handleClearCart}
                className="text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider tout le panier</span>
              </button>
            </div>

            {items.map((item) => {
              const currentPrice = item.promoPrice ?? item.price;
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-obsidian-850 border border-gold-500/12 items-center justify-between hover:border-gold-500/30 transition-all shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-obsidian-950 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-gold-400 font-serif">
                          {formatPrice(currentPrice)}
                        </span>
                        {item.promoPrice && (
                          <span className="text-xs text-zinc-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-white/10 rounded-xl bg-obsidian-850 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-zinc-400 hover:text-white"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-zinc-400 hover:text-white"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-serif font-bold text-base text-white">
                      {formatPrice(currentPrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary & Order Actions */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-800 to-obsidian-850 border border-gold-500/20 shadow-2xl space-y-5">
              <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-white/10">
                Total de la Commande
              </h3>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-serif">{formatPrice(total + savings)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Remise promotionnelle</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Livraison estimée</span>
                  <span className="text-gold-400 font-medium">Calculée à l'étape suivante</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Total</span>
                  <span className="font-serif text-2xl font-bold text-gold-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/30 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Commander en Ligne (Fapshi)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleDownloadTicket}
                  className="w-full py-3 rounded-xl border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le ticket officiel</span>
                </button>

                <button
                  onClick={() => sendWhatsAppOrder()}
                  className="w-full py-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-800 border border-gold-500/10 text-[11px] text-zinc-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  Le ticket téléchargeable contient la référence officielle et la liste de vos créations.
                  La connexion à votre compte est requise pour y inscrire vos informations client.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal if triggered */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          handleDownloadTicket();
        }}
      />

      {/* Ticket Modal */}
      {ticketOrderData && (
        <OrderTicketModal
          order={ticketOrderData}
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
}


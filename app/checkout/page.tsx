"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  MessageCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, total, totalCount, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Douala");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"FAPSHI" | "CASH" | "WHATSAPP">("FAPSHI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setCustomerName(session.user.name);
      if (session.user.email) setCustomerEmail(session.user.email);
      if ((session.user as any).phone) setCustomerPhone((session.user as any).phone);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      router.push("/produits");
      return;
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      toast.error("Veuillez renseigner toutes les informations de livraison obligatoires.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "FAPSHI") {
        // Appeler notre API checkout Fapshi
        const res = await fetch("/api/checkout/fapshi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            notes,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Échec de l'initialisation Fapshi");
        }

        // Vider le panier
        clearCart();

        toast.success("Redirection vers la passerelle sécurisée Fapshi...");

        // Redirection vers le lien de paiement Fapshi (ou simulateur)
        if (data.paymentLink) {
          window.location.href = data.paymentLink;
        } else {
          router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
        }
      } else {
        // Mode WhatsApp ou Paiement à la livraison
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            notes,
            paymentMethod,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Impossible d'enregistrer la commande");
        }

        clearCart();

        if (paymentMethod === "WHATSAPP") {
          const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828";
          const msg = `Bonjour JQ BAGS ! ✨\nJe viens de finaliser la commande : *${data.order.orderNumber}*\nMontant : ${formatPrice(data.order.totalAmount)}\nNom : ${customerName}\nTéléphone : ${customerPhone}\nAdresse : ${shippingAddress}, ${city}\n\nMerci de me confirmer la prise en charge !`;
          window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
        }

        router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian-950 pt-32 pb-20 px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-white mb-4">
          Votre panier est vide
        </h1>
        <Link
          href="/produits"
          className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs"
        >
          Découvrir les créations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
          Paiement Sécurisé
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Finaliser ma <span className="gold-gradient-text italic font-serif">Commande</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Form: Delivery & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info Box */}
            <div className="p-6 rounded-3xl bg-obsidian-900 border border-gold-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-gold-400">
                <Truck className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Coordonnées de Livraison
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nom &amp; Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex : Clarisse Nguemo"
                      className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Adresse Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Numéro de Téléphone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex : +237 6 72 36 28 28"
                      className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Ville de destination *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                  >
                    <option value="Douala">Douala (Livraison Express 24h)</option>
                    <option value="Yaoundé">Yaoundé (Livraison 24h - 48h)</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Autre">Autre région / International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Adresse de livraison précise (Quartier, Repère) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Ex : Akwa, Rue King Akwa en face de l'agence..."
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Instructions particulières (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex : Emballage cadeau souhaité, livraison après 16h..."
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-obsidian-900 border border-gold-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-gold-400">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Mode de Règlement
                </h3>
              </div>

              <div className="space-y-3">
                {/* Fapshi Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "FAPSHI"
                      ? "border-gold-400 bg-gold-500/10 shadow-lg shadow-gold-500/10"
                      : "border-white/10 bg-obsidian-850 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "FAPSHI"}
                    onChange={() => setPaymentMethod("FAPSHI")}
                    className="mt-1 accent-gold-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <span>Paiement Sécurisé Fapshi</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500 text-obsidian-950 font-bold">
                          Recommandé
                        </span>
                      </span>
                      <div className="flex gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 font-mono">
                          MTN MoMo
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-orange-400 font-mono">
                          Orange Money
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Paiement instantané et sécurisé via votre compte MTN Mobile Money, Orange Money ou Carte Bancaire Visa/Mastercard au Cameroun.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "CASH"
                      ? "border-gold-400 bg-gold-500/10"
                      : "border-white/10 bg-obsidian-850 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "CASH"}
                    onChange={() => setPaymentMethod("CASH")}
                    className="mt-1 accent-gold-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-white block">
                      Paiement à la Livraison
                    </span>
                    <p className="text-xs text-zinc-400 mt-1">
                      Réglez en espèces ou Mobile Money directement lors de la remise de votre colis (Disponible à Douala &amp; Yaoundé).
                    </p>
                  </div>
                </label>

                {/* WhatsApp Direct Option */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "WHATSAPP"
                      ? "border-emerald-400 bg-emerald-950/30"
                      : "border-white/10 bg-obsidian-850 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "WHATSAPP"}
                    onChange={() => setPaymentMethod("WHATSAPP")}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>Validation &amp; Règlement via WhatsApp</span>
                    </span>
                    <p className="text-xs text-zinc-400 mt-1">
                      Validez vos articles en direct avec un artisan de l'atelier sur WhatsApp.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-gold-500/30 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-white/10">
                Vos Créations ({totalCount})
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-obsidian-850 shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.name}</p>
                      <span className="text-zinc-400 text-[11px]">Qté : {item.quantity}</span>
                    </div>
                    <span className="font-serif font-bold text-gold-400">
                      {formatPrice((item.promoPrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-serif">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Frais de livraison</span>
                  <span>Offerts</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Total à régler</span>
                  <span className="font-serif text-2xl font-bold text-gold-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gold-500/30 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading
                    ? "Connexion à la passerelle Fapshi..."
                    : paymentMethod === "FAPSHI"
                    ? "Procéder au Paiement Fapshi"
                    : "Confirmer ma Commande"}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>Transaction chiffrée &amp; sécurisée SSL</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

